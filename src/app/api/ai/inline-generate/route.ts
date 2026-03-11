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

export async function POST(request: Request) {
  const startedAt = Date.now();
  const session = await auth();
  const userId = session?.user?.id;

  try {
    if (!process.env.GROQ_API_KEY) {
      return errorResponse({
        code: "INTERNAL_ERROR",
        message:
          "AI assist is not configured on the server. Add GROQ_API_KEY, then restart locally or redeploy on Vercel.",
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
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return errorResponse({
      code: "INTERNAL_ERROR",
      message: "Unable to generate content right now. Please try again shortly.",
      status: 500,
    });
  }
}
