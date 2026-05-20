/**
 * Serverless-compatible IP-based rate limiter using Upstash Redis.
 * Ensures rate limits are accurately shared across all serverless function instances.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 1. Initialize Upstash Redis client using the environment variables you added
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 2. Configure a sliding window limiter: Max 5 requests / 5 minutes per IP
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "5 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/jap-main",
});

export async function checkRateLimit(ip: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
}> {
  try {
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);
    return {
      allowed: success,
      remaining,
      resetAt: reset,
    };
  } catch (err) {
    console.error("Upstash Redis connection failed, falling back to permissive mode:", err);
    // Safe fallback: allow requests if Redis is down
    return { allowed: true, remaining: 1, resetAt: Date.now() + 5000 };
  }
}
