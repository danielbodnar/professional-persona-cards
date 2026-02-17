/**
 * Semantic search over the Vectorize repo-embeddings index.
 *
 * Generates an embedding for the query text, then queries Vectorize
 * with optional filtering by username (starred_by metadata).
 */

import { generateEmbedding } from "./embeddings";

/** A single search result with similarity score. */
export interface SearchResult {
  full_name: string;
  owner: string;
  language: string;
  description: string;
  score: number;
}

/**
 * Search repos by semantic similarity to a query string.
 * Filters results to repos starred/owned by the given username.
 */
export async function searchRepos(
  ai: Ai,
  vectorize: VectorizeIndex,
  query: string,
  username: string,
  topK = 20,
): Promise<SearchResult[]> {
  const queryVector = await generateEmbedding(ai, query);

  const results = await vectorize.query(queryVector, {
    topK,
    filter: { starred_by: username },
    returnMetadata: "all",
  });

  return results.matches.map((match) => ({
    full_name: String(match.metadata?.full_name ?? ""),
    owner: String(match.metadata?.owner ?? ""),
    language: String(match.metadata?.language ?? ""),
    description: String(match.metadata?.description ?? ""),
    score: match.score,
  }));
}
