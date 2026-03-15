import { auth } from "@/lib/auth";
import { errorResponse, rateLimitedError, successResponse, validationError } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { generateInlineAiSuggestion, InlineAiRequestError } from "@/modules/ai/inline-generator";
import {
  authenticatedAiAssistRateLimit,
  getIpFromRequest,
  guestAiAssistRateLimit,
} from "@/modules/rate-limit";
import { inlineAiRequestSchema } from "@/modules/validation";

export const runtime = "nodejs";

function mapInlineAiError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";

  if (
    message.includes("UPSTASH_REDIS_REST_URL") ||
    message.includes("UPSTASH_REDIS_REST_TOKEN") ||
    message.includes("url property is missing") ||
    message.includes("token property is missing")
  ) {
    return {
      code: "INTERNAL_ERROR" as const,
      message:
        "AI assist rate limiting is not configured on the server. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN, then redeploy.",
      status: 503,
    };
  }

  if (message.startsWith("Groq request failed:")) {
    if (message.includes("401") || message.includes("403")) {
      return {
        code: "INTERNAL_ERROR" as const,
        message:
          "AI assist provider authentication failed. Check GROQ_API_KEY in your deployment environment, then redeploy.",
        status: 503,
      };
    }

    if (message.includes("404")) {
      return {
        code: "INTERNAL_ERROR" as const,
        message:
          "AI assist provider rejected the configured model. Check GROQ_MODEL in your deployment environment, then redeploy.",
        status: 503,
      };
    }

    if (message.includes("429")) {
      return {
        code: "RATE_LIMITED" as const,
        message: "The AI provider is rate limiting requests right now. Please try again in a moment.",
        status: 429,
      };
    }

    if (
      message.includes("500") ||
      message.includes("502") ||
      message.includes("503") ||
      message.includes("504")
    ) {
      return {
        code: "INTERNAL_ERROR" as const,
        message: "The AI provider is temporarily unavailable. Please try again shortly.",
        status: 503,
      };
    }

    return {
      code: "INTERNAL_ERROR" as const,
      message:
        "The AI provider rejected the request. Check GROQ_MODEL and provider settings, then try again.",
      status: 502,
    };
  }

  if (
    message.includes("Groq response did not include structured content") ||
    message.includes("Groq response was not valid JSON") ||
    message.includes("AI returned an empty text draft") ||
    message.includes("AI returned an empty list draft")
  ) {
    return {
      code: "INTERNAL_ERROR" as const,
      message: "The AI provider returned an invalid response. Please try again shortly.",
      status: 502,
    };
  }

  if (message.includes("fetch failed")) {
    return {
      code: "INTERNAL_ERROR" as const,
      message: "The server could not reach the AI provider. Please try again shortly.",
      status: 503,
    };
  }

  return {
    code: "INTERNAL_ERROR" as const,
    message: "Unable to generate content right now. Please try again shortly.",
    status: 500,
  };
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  let userId: string | undefined;

  try {
    const session = await auth();
    userId = session?.user?.id;

    if (!process.env.GROQ_API_KEY) {
      return errorResponse({
        code: "INTERNAL_ERROR",
        message:
          "AI assist is not configured on the server. Add GROQ_API_KEY, then restart locally or redeploy on Vercel.",
        status: 503,
      });
    }

    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return errorResponse({
        code: "INTERNAL_ERROR",
        message:
          "AI assist rate limiting is not configured on the server. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN, then redeploy.",
        status: 503,
      });
    }

    let rawBody: unknown;

    try {
      rawBody = await request.json();
    } catch {
      return errorResponse({
        code: "VALIDATION_ERROR",
        message: "Invalid JSON payload.",
        status: 400,
      });
    }

    const parsed = inlineAiRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const rateLimit = userId ? authenticatedAiAssistRateLimit : guestAiAssistRateLimit;
    const identifier = userId ? `user:${userId}` : `ip:${getIpFromRequest(request)}`;
    const { success } = await rateLimit.limit(identifier);

    if (!success) {
      return rateLimitedError();
    }

    const result = await generateInlineAiSuggestion(parsed.data);

    logger.info("Inline AI generation completed", {
      route: "/api/ai/inline-generate",
      userId,
      duration: Date.now() - startedAt,
      result: result.status,
      target: parsed.data.target,
    });

    return successResponse({ data: result });
  } catch (error) {
    if (error instanceof InlineAiRequestError) {
      return errorResponse({
        code: "VALIDATION_ERROR",
        message: error.message,
        status: 400,
      });
    }

    logger.error("Inline AI generation failed", {
      route: "/api/ai/inline-generate",
      userId,
      duration: Date.now() - startedAt,
      aiModel: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      errorName: error instanceof Error ? error.name : "UnknownError",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return errorResponse(mapInlineAiError(error));
  }
}
