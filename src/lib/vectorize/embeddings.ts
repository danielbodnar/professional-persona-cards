/**
 * Workers AI embedding generation for Vectorize.
 *
 * Uses @cf/baai/bge-base-en-v1.5 (768 dimensions, CLS pooling)
 * to generate embeddings from repo metadata + README content.
 */

import type { GitHubRepo } from "../github/types";

const MODEL = "@cf/baai/bge-base-en-v1.5" as const;
const MAX_INPUT_CHARS = 8000;

/** Build a text representation of a repo for embedding. */
export function buildRepoText(
  repo: GitHubRepo,
  readme?: string | null,
): string {
  const parts = [
    `${repo.full_name}: ${repo.description ?? ""}`,
    repo.language ? `Language: ${repo.language}` : null,
    repo.topics?.length ? `Topics: ${repo.topics.join(", ")}` : null,
  ].filter(Boolean);

  let text = parts.join("\n");

  if (readme) {
    const remaining = MAX_INPUT_CHARS - text.length - 2;
    if (remaining > 100) {
      text += "\n\n" + readme.slice(0, remaining);
    }
  }

  return text.slice(0, MAX_INPUT_CHARS);
}

/** Generate an embedding vector for a text string using Workers AI. */
export async function generateEmbedding(
  ai: Ai,
  text: string,
): Promise<number[]> {
  const result = await ai.run(MODEL, {
    text: [text],
  });

  // Workers AI returns { shape: [1, 768], data: [[...]] }
  const data = (result as { data: number[][] }).data;
  if (!data?.[0]) throw new Error("Empty embedding result from Workers AI");
  return data[0];
}
