import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { ZodError } from "zod";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "ACCOUNT_SUSPENDED"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "PDF_RENDER_FAILED"
  | "CONFLICT"
  | "INTERNAL_ERROR";

interface SuccessResponseOptions<T> {
  data: T;
  status?: number;
}

interface ErrorResponseOptions {
  code: ApiErrorCode;
  message: string;
  details?: unknown[];
  status: number;
}

function makeRequestId(): string {
  return `req_${uuidv4().replace(/-/g, "").slice(0, 12)}`;
}

export function successResponse<T>({
  data,
  status = 200,
}: SuccessResponseOptions<T>) {
  const requestId = makeRequestId();
  return NextResponse.json(
    { data, meta: { requestId } },
    {
      status,
      headers: { "x-request-id": requestId },
    }
  );
}

export function errorResponse({
  code,
  message,
  details = [],
  status,
}: ErrorResponseOptions) {
  const requestId = makeRequestId();
  return NextResponse.json(
    {
      error: { code, message, details },
      meta: { requestId },
    },
    {
      status,
      headers: { "x-request-id": requestId },
    }
  );
}

export function validationError(error: ZodError) {
  return errorResponse({
    code: "VALIDATION_ERROR",
    message: "Payload validation failed.",
    details: error.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    })),
    status: 400,
  });
}

export function unauthorizedError(message = "Authentication required.") {
  return errorResponse({
    code: "UNAUTHENTICATED",
    message,
    status: 401,
  });
}

export function forbiddenError(message = "Access denied.") {
  return errorResponse({
    code: "FORBIDDEN",
    message,
    status: 403,
  });
}

export function notFoundError(message = "Resource not found.") {
  return errorResponse({
    code: "NOT_FOUND",
    message,
    status: 404,
  });
}

export function rateLimitedError() {
  return errorResponse({
    code: "RATE_LIMITED",
    message: "Too many requests. Please try again later.",
    status: 429,
  });
}
