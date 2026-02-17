/**
 * KV-based rate limiter: 1 refresh per window per username.
 *
 * Uses KV with expiration TTL instead of Durable Objects for
 * compatibility with the Astro Cloudflare adapter.
 *
 * Window is configurable via `windowSeconds` (default 3600 = 1 hour).
 */

const DEFAULT_WINDOW_SECONDS = 3600;

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}

/**
 * Check if a refresh is allowed for the given username.
 */
export async function checkRateLimit(
  kv: KVNamespace,
  username: string,
  windowSeconds = DEFAULT_WINDOW_SECONDS,
): Promise<RateLimitResult> {
  const key = `ratelimit:${username}`;
  const existing = await kv.get(key);

  if (existing) {
    const lastRefresh = parseInt(existing, 10);
    const elapsedSeconds = Math.floor((Date.now() - lastRefresh) / 1000);

    if (elapsedSeconds < windowSeconds) {
      return { allowed: false, retryAfter: windowSeconds - elapsedSeconds };
    }
  }

  return { allowed: true };
}

/**
 * Consume a rate limit token for the given username.
 * Sets a KV key with an expiration TTL matching the window.
 */
export async function consumeRateLimit(
  kv: KVNamespace,
  username: string,
  windowSeconds = DEFAULT_WINDOW_SECONDS,
): Promise<void> {
  const key = `ratelimit:${username}`;
  await kv.put(key, String(Date.now()), { expirationTtl: windowSeconds });
}
