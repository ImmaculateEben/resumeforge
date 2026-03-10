import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

export const authRateLimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  prefix: "ratelimit:auth",
});

export const guestExportRateLimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  prefix: "ratelimit:guest-export",
});

export const authenticatedRateLimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(30, "1 h"),
  prefix: "ratelimit:authenticated",
});

export const guestAiAssistRateLimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(12, "10 m"),
  prefix: "ratelimit:guest-ai-assist",
});

export const authenticatedAiAssistRateLimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(40, "10 m"),
  prefix: "ratelimit:authenticated-ai-assist",
});

export function getIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}
