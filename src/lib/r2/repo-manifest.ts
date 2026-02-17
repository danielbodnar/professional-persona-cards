/**
 * Per-user repo manifest stored in R2.
 *
 * Tracks which repos a user owns. Used alongside the star manifest
 * to maintain a complete picture of a user's GitHub activity in R2.
 *
 * R2 key: github.com/{username}/_repos.json
 */

/** Shape of the repo manifest stored in R2. */
export interface RepoManifest {
  username: string;
  total: number;
  fetched_at: string;
  refs: string[];
}

function manifestKey(username: string): string {
  return `github.com/${username}/_repos.json`;
}

/** Read the repo manifest for a user. Returns null if not found. */
export async function getRepoManifest(
  r2: R2Bucket,
  username: string,
): Promise<RepoManifest | null> {
  const obj = await r2.get(manifestKey(username));
  if (!obj) return null;

  try {
    return (await obj.json()) as RepoManifest;
  } catch {
    return null;
  }
}

/** Write the repo manifest for a user. */
export async function putRepoManifest(
  r2: R2Bucket,
  username: string,
  manifest: RepoManifest,
): Promise<void> {
  await r2.put(manifestKey(username), JSON.stringify(manifest), {
    httpMetadata: { contentType: "application/json" },
  });
}
