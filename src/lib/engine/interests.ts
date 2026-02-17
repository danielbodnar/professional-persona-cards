import type { Category } from "./category-seeds";
import { CATEGORY_SEEDS } from "./category-seeds";
import type { RepoData } from "./scoring";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StarInterestCluster {
  label: string;
  count: string;
  examples: string;
  matchCount: number;
}

// ---------------------------------------------------------------------------
// Category-driven interest clustering
// ---------------------------------------------------------------------------

/**
 * Score a repo against a category for interest matching.
 * Returns true if the repo has enough signal (score >= 2).
 */
function repoMatchesCategory(repo: RepoData, cat: Category): boolean {
  const lang = (repo.language || "").toLowerCase();
  const topics = (repo.topics || []).map((t) => t.toLowerCase());
  const desc = (repo.description || "").toLowerCase();

  let score = 0;
  if (cat.languages.some((l) => l.toLowerCase() === lang)) score += 2;
  score += topics.filter((t) =>
    cat.topics.some((st) => t.includes(st) || st.includes(t)),
  ).length * 3;
  score += cat.keywords.filter((kw) => desc.includes(kw)).length * 1.5;

  return score >= 2;
}

/**
 * Cluster starred repos into interest groups using category definitions.
 *
 * For each category, filter stars matching its signals.
 * Only include categories with 2+ matching repos.
 * Sort by match count descending, cap at 12 clusters.
 */
export function clusterStarInterests(
  stars: RepoData[],
  categories: Category[] = CATEGORY_SEEDS,
): StarInterestCluster[] {
  const results: StarInterestCluster[] = [];

  for (const cat of categories) {
    const matching = stars.filter((repo) => repoMatchesCategory(repo, cat));
    if (matching.length < 2) continue;

    const countStr =
      matching.length >= 15
        ? "15+ repos"
        : matching.length >= 10
          ? "10+ repos"
          : matching.length >= 5
            ? "5+ repos"
            : matching.length + " repos";

    const examples = matching
      .slice(0, 5)
      .map((r) => r.full_name.split("/")[1])
      .join(", ");

    results.push({
      label: cat.title,
      count: countStr,
      examples,
      matchCount: matching.length,
    });
  }

  // Sort by match count descending, cap at 12
  results.sort((a, b) => b.matchCount - a.matchCount);
  return results.slice(0, 12);
}

// ---------------------------------------------------------------------------
// Legacy hardcoded clusters — kept for reference but no longer used
// ---------------------------------------------------------------------------

/** @deprecated Use clusterStarInterests with categories instead. */
export const INTEREST_CLUSTERS = {};
