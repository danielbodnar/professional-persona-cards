/**
 * Safe accessors for Cloudflare bindings.
 *
 * Returns `null` (or false for writes) when a binding is unavailable,
 * allowing GitHub-only mode without D1/KV/R2.
 */

/**
 * Run a D1 operation safely. Returns `null` if `db` is undefined or the query fails.
 */
export async function safeD1<T>(
  db: D1Database | undefined,
  fn: (db: D1Database) => Promise<T>,
): Promise<T | null> {
  if (!db) return null;
  try {
    return await fn(db);
  } catch (err) {
    console.warn("[bindings] D1 operation failed:", err);
    return null;
  }
}

/**
 * Read a JSON value from KV safely. Returns `null` if KV is unavailable or the key is missing.
 */
export async function safeKV<T>(
  kv: KVNamespace | undefined,
  key: string,
): Promise<T | null> {
  if (!kv) return null;
  try {
    return await kv.get(key, "json") as T | null;
  } catch (err) {
    console.warn(`[bindings] KV get failed for key "${key}":`, err);
    return null;
  }
}

/**
 * Write an object to R2 safely. Returns `true` on success, `false` if R2 is unavailable or write fails.
 */
export async function safeR2Put(
  r2: R2Bucket | undefined,
  key: string,
  body: ReadableStream | ArrayBuffer | string,
): Promise<boolean> {
  if (!r2) return false;
  try {
    await r2.put(key, body);
    return true;
  } catch (err) {
    console.warn(`[bindings] R2 put failed for key "${key}":`, err);
    return false;
  }
}
