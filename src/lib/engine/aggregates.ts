/**
 * Compute top-10 aggregations from fetched repos + stars.
 * Used for Languages, Frameworks, Topics, and Tooling charts.
 */

import { getCategoriesByGroup } from "./category-seeds";
import type { RepoData } from "./scoring";

export interface Aggregate {
  type: "language" | "framework" | "topic" | "tooling";
  item: string;
  count: number;
  fromOwned: number;
  fromStarred: number;
}

/** Topics to exclude from the top topics chart (too generic). */
const EXCLUDED_TOPICS = new Set([
  "hacktoberfest", "awesome-list", "awesome", "list", "collection",
  "curated-list", "resource", "resources", "learning", "tutorial",
  "example", "examples", "sample", "demo", "template", "boilerplate",
]);

/**
 * Compute top-10 aggregations across 4 dimensions.
 *
 * - Languages: count primary language across all repos
 * - Frameworks: match topics against framework category names
 * - Topics: count all topics (excluding generic ones)
 * - Tooling: match topics against platform/cli/editor/observability categories
 */
export function computeAggregates(
  ownedRepos: RepoData[],
  stars: RepoData[],
): Aggregate[] {
  const results: Aggregate[] = [];

  // Languages
  const langCounts = new Map<string, { total: number; owned: number; starred: number }>();
  for (const repo of ownedRepos) {
    if (!repo.language) continue;
    const entry = langCounts.get(repo.language) || { total: 0, owned: 0, starred: 0 };
    entry.total++;
    entry.owned++;
    langCounts.set(repo.language, entry);
  }
  for (const repo of stars) {
    if (!repo.language) continue;
    const entry = langCounts.get(repo.language) || { total: 0, owned: 0, starred: 0 };
    entry.total++;
    entry.starred++;
    langCounts.set(repo.language, entry);
  }
  const topLangs = [...langCounts.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);
  for (const [item, counts] of topLangs) {
    results.push({
      type: "language",
      item,
      count: counts.total,
      fromOwned: counts.owned,
      fromStarred: counts.starred,
    });
  }

  // Frameworks — match topics against known framework category IDs
  const frameworkCats = getCategoriesByGroup("framework");
  const frameworkTopics = new Map<string, Set<string>>();
  for (const cat of frameworkCats) {
    for (const t of cat.topics) {
      frameworkTopics.set(t, (frameworkTopics.get(t) || new Set()).add(cat.title));
    }
  }
  const fwCounts = countTopicMatches(ownedRepos, stars, frameworkTopics);
  const topFrameworks = [...fwCounts.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);
  for (const [item, counts] of topFrameworks) {
    results.push({
      type: "framework",
      item,
      count: counts.total,
      fromOwned: counts.owned,
      fromStarred: counts.starred,
    });
  }

  // Topics — count all topics, excluding generic ones
  const topicCounts = new Map<string, { total: number; owned: number; starred: number }>();
  for (const repo of ownedRepos) {
    for (const t of repo.topics || []) {
      if (EXCLUDED_TOPICS.has(t.toLowerCase())) continue;
      const entry = topicCounts.get(t) || { total: 0, owned: 0, starred: 0 };
      entry.total++;
      entry.owned++;
      topicCounts.set(t, entry);
    }
  }
  for (const repo of stars) {
    for (const t of repo.topics || []) {
      if (EXCLUDED_TOPICS.has(t.toLowerCase())) continue;
      const entry = topicCounts.get(t) || { total: 0, owned: 0, starred: 0 };
      entry.total++;
      entry.starred++;
      topicCounts.set(t, entry);
    }
  }
  const topTopics = [...topicCounts.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);
  for (const [item, counts] of topTopics) {
    results.push({
      type: "topic",
      item,
      count: counts.total,
      fromOwned: counts.owned,
      fromStarred: counts.starred,
    });
  }

  // Tooling — match topics against platform/cli/editor/observability categories
  const toolingGroups = ["platform", "cli", "editor", "observability"];
  const toolingCats = toolingGroups.flatMap((g) => getCategoriesByGroup(g));
  const toolingTopics = new Map<string, Set<string>>();
  for (const cat of toolingCats) {
    for (const t of cat.topics) {
      toolingTopics.set(t, (toolingTopics.get(t) || new Set()).add(cat.title));
    }
  }
  const toolCounts = countTopicMatches(ownedRepos, stars, toolingTopics);
  const topTooling = [...toolCounts.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);
  for (const [item, counts] of topTooling) {
    results.push({
      type: "tooling",
      item,
      count: counts.total,
      fromOwned: counts.owned,
      fromStarred: counts.starred,
    });
  }

  return results;
}

/** Count repos matching known topic->label mappings, returning label-level counts. */
function countTopicMatches(
  ownedRepos: RepoData[],
  stars: RepoData[],
  topicToLabels: Map<string, Set<string>>,
): Map<string, { total: number; owned: number; starred: number }> {
  const counts = new Map<string, { total: number; owned: number; starred: number }>();

  for (const repo of ownedRepos) {
    const matched = new Set<string>();
    for (const t of (repo.topics || []).map((x) => x.toLowerCase())) {
      const labels = topicToLabels.get(t);
      if (labels) {
        for (const label of labels) matched.add(label);
      }
    }
    for (const label of matched) {
      const entry = counts.get(label) || { total: 0, owned: 0, starred: 0 };
      entry.total++;
      entry.owned++;
      counts.set(label, entry);
    }
  }

  for (const repo of stars) {
    const matched = new Set<string>();
    for (const t of (repo.topics || []).map((x) => x.toLowerCase())) {
      const labels = topicToLabels.get(t);
      if (labels) {
        for (const label of labels) matched.add(label);
      }
    }
    for (const label of matched) {
      const entry = counts.get(label) || { total: 0, owned: 0, starred: 0 };
      entry.total++;
      entry.starred++;
      counts.set(label, entry);
    }
  }

  return counts;
}
