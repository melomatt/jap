/**
 * Simple in-memory IP-based rate limiter.
 * Limits a given IP to `maxRequests` within a rolling `windowMs` window.
 * Note: On Vercel/serverless, memory is not shared between instances, so this is
 * a best-effort defense. For production, replace with an Upstash Redis rate limiter.
 */

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitRecord>();

export function rateLimit(
  ip: string,
  options: { maxRequests?: number; windowMs?: number } = {}
): { allowed: boolean; remaining: number; resetAt: number } {
  const { maxRequests = 5, windowMs = 5 * 60 * 1000 } = options; // 5 requests / 5 minutes
  const now = Date.now();

  const record = store.get(ip);

  if (!record || now > record.resetAt) {
    // New window — reset
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  store.set(ip, record);
  return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}
