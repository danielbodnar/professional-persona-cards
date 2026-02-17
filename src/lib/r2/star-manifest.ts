/**
 * Per-user star manifest stored in R2.
 *
 * Tracks which repos a user has starred and the timestamp of their most
 * recent star. Used by the incremental fetch pipeline to avoid re-fetching
 * all star pages on every refresh.
 *
 * R2 key: github.com/{username}/_stars.json
 */

/** Shape of the star manifest stored in R2. */
export interface StarManifest {
  username: string;
  last_starred_at: string | null;
  total: number;
  fetched_at: string;
  refs: string[];
}

function manifestKey(username: string): string {
  return `github.com/${username}/_stars.json`;
}

/** Read the star manifest for a user. Returns null if not found. */
export async function getStarManifest(
  r2: R2Bucket,
  username: string,
): Promise<StarManifest | null> {
  const obj = await r2.get(manifestKey(username));
  if (!obj) return null;

  try {
    return (await obj.json()) as StarManifest;
  } catch {
    return null;
  }
}

/** Write the star manifest for a user. */
export async function putStarManifest(
  r2: R2Bucket,
  username: string,
  manifest: StarManifest,
): Promise<void> {
  await r2.put(manifestKey(username), JSON.stringify(manifest), {
    httpMetadata: { contentType: "application/json" },
  });
}
