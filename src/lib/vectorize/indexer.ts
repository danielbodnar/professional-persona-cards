/**
 * Batch Vectorize upsert for repo embeddings.
 *
 * After R2 repo objects are written, this indexes each repo into
 * Vectorize with metadata for filtered semantic search.
 */

import type { GitHubRepo } from "../github/types";
import { buildRepoText, generateEmbedding } from "./embeddings";

const BATCH_SIZE = 100;

/** Metadata stored alongside each vector in the Vectorize index. */
interface RepoVectorMetadata {
  full_name: string;
  owner: string;
  language: string;
  description: string;
  starred_by: string;
}

/**
 * Index a list of repos into Vectorize.
 * Generates embeddings via Workers AI and upserts in batches.
 * Non-fatal: logs warnings on failure but does not throw.
 */
export async function indexRepos(
  ai: Ai,
  vectorize: VectorizeIndex,
  repos: GitHubRepo[],
  username: string,
  readmeMap?: Map<string, string>,
): Promise<void> {
  const vectors: VectorizeVector[] = [];

  for (const repo of repos) {
    try {
      const readme = readmeMap?.get(repo.full_name) ?? readmeMap?.get(repo.name) ?? null;
      const text = buildRepoText(repo, readme);
      const values = await generateEmbedding(ai, text);

      vectors.push({
        id: repo.full_name,
        values,
        metadata: {
          full_name: repo.full_name,
          owner: repo.owner.login,
          language: repo.language ?? "",
          description: (repo.description ?? "").slice(0, 200),
          starred_by: username,
        } satisfies RepoVectorMetadata,
      });
    } catch (err) {
      console.warn(`[vectorize/indexer] Failed to embed ${repo.full_name}:`, err);
    }
  }

  // Upsert in batches
  for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
    const batch = vectors.slice(i, i + BATCH_SIZE);
    try {
      await vectorize.upsert(batch);
    } catch (err) {
      console.warn(`[vectorize/indexer] Batch upsert failed (offset ${i}):`, err);
    }
  }

  console.log(`[vectorize/indexer] Indexed ${vectors.length}/${repos.length} repos for ${username}`);
}
