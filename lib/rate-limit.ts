/**
 * Small in-memory fixed-window rate limiter.
 *
 * Good for a single server / VPS / Docker container. On serverless platforms
 * (Vercel, etc.) each instance has its own memory, so swap this for a shared
 * store such as Upstash Redis if you deploy there.
 */
type Bucket = { count: number; resetAt: number };

const globalStore = globalThis as unknown as { __rateLimit?: Map<string, Bucket> };
const store = (globalStore.__rateLimit ??= new Map<string, Bucket>());

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();

  if (store.size > 5000) {
    for (const [k, b] of store) if (b.resetAt <= now) store.delete(k);
  }

  const bucket = store.get(key);
  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSec: 0 };
  }
  bucket.count += 1;
  const ok = bucket.count <= limit;
  return {
    ok,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSec: ok ? 0 : Math.ceil((bucket.resetAt - now) / 1000),
  };
}

export function rateLimitReset(key: string) {
  store.delete(key);
}

/** Best-effort client IP. Only trust x-forwarded-for when running behind your own reverse proxy. */
export function getClientIp(h: Headers): string {
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}
