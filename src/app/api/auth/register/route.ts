import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { errorResponse, rateLimitedError, successResponse, validationError } from "@/lib/api-response";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { authRateLimit, getIpFromRequest } from "@/modules/rate-limit";
import { registerSchema } from "@/modules/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const startedAt = Date.now();
  const ipAddress = getIpFromRequest(request);

  try {
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

    const parsed = registerSchema.safeParse(rawBody);
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const normalizedEmail = parsed.data.email.toLowerCase();
    const { success } = await authRateLimit.limit(`register:${ipAddress}:${normalizedEmail}`);
    if (!success) {
      return rateLimitedError();
    }

    const passwordHash = await hash(parsed.data.password, 12);
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        fullName: parsed.data.fullName.trim(),
        passwordHash,
      },
      select: {
        id: true,
      },
    });

    logger.info("User registered", {
      route: "/api/auth/register",
      userId: user.id,
      duration: Date.now() - startedAt,
      result: "created",
    });

    return successResponse({
      data: {
        id: user.id,
      },
      status: 201,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return errorResponse({
        code: "CONFLICT",
        message: "An account with that email already exists.",
        status: 409,
      });
    }

    logger.error("User registration failed", {
      route: "/api/auth/register",
      duration: Date.now() - startedAt,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return errorResponse({
      code: "INTERNAL_ERROR",
      message: "Unable to create the account right now. Please try again shortly.",
      status: 500,
    });
  }
}
