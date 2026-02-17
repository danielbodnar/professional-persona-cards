/**
 * KV cache helpers for GitHub API responses.
 *
 * KV key patterns (from spec lines 52-57):
 *   github:profile:{username}       -> GitHub user profile JSON
 *   github:repos:{username}         -> Array of owned repos
 *   github:stars:{username}:{page}  -> Paginated star pages
 *   github:stars:{username}:meta    -> { totalPages, fetchedAt, complete }
 *
 * Default TTL: 24 hours (86400 seconds).
 */

const DEFAULT_TTL = 86400; // 24 hours in seconds

/**
 * Retrieve a JSON value from KV by key.
 * Returns `null` if KV is unavailable, the key does not exist, or has expired.
 */
export async function getCached<T>(kv: KVNamespace | undefined, key: string): Promise<T | null> {
  if (!kv) return null;
  try {
    const raw = await kv.get(key, "json");
    return raw as T | null;
  } catch (err) {
    console.warn(`[cache] KV get failed for "${key}":`, err);
    return null;
  }
}

/**
 * Store a JSON value in KV with a TTL (default 24 hours).
 * No-op if KV is unavailable.
 */
export async function putCached<T>(
  kv: KVNamespace | undefined,
  key: string,
  data: T,
  ttl: number = DEFAULT_TTL,
): Promise<void> {
  if (!kv) return;
  try {
    await kv.put(key, JSON.stringify(data), { expirationTtl: ttl });
  } catch (err) {
    console.warn(`[cache] KV put failed for "${key}":`, err);
  }
}
