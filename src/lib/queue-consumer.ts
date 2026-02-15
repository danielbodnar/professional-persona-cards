/**
 * Queue batch handler for background profile computation.
 *
 * Receives messages of shape { username, requestedAt } from PROFILE_QUEUE.
 * For each message:
 *   1. Fetch GitHub data (profile, repos, stars)
 *   2. Run the persona engine (deterministic algorithms)
 *   3. Write computed results to D1
 *   4. Generate OG image and store in R2
 *
 * Reference: spec lines 910-940.
 *
 * NOTE: This file imports from `src/lib/engine/index.ts` which is owned
 * by the persona-engine agent. That module is expected to export:
 *
 *   export function computeProfile(
 *     githubProfile: GitHubProfile,
 *     repos: GitHubRepo[],
 *     stars: GitHubRepo[],
 *   ): ComputedProfile;
 *
 *   export interface ComputedProfile {
 *     personas: PersonaRow[];    (without id)
 *     projects: ProjectRow[];    (without id)
 *     radarAxes: RadarAxisRow[]; (without id)
 *     starInterests: StarInterestRow[]; (without id)
 *   }
 */

import { fetchProfile, fetchRepos, fetchAllStars } from "./github/client";
import {
  upsertProfile,
  upsertPersonas,
  upsertProjects,
  upsertRadarAxes,
  upsertStarInterests,
} from "./db/queries";
import type { ProfileRow } from "./db/types";
import { generateOGImage } from "./og/generator";

// The persona engine barrel — created by the persona-engine agent.
// If not yet available, the build will fail with a clear import error.
import type { ComputedProfile } from "./engine/index";
import { computeProfile } from "./engine/index";

/** Shape of messages produced by the API layer onto PROFILE_QUEUE. */
export interface QueueMessage {
  username: string;
  requestedAt: number;
}

/**
 * Queue batch handler. Exported so it can be wired into the Worker entrypoint.
 *
 * Usage in the Worker entrypoint:
 *   export default {
 *     async queue(batch, env) { await handleQueueBatch(batch, env); }
 *   };
 */
export async function handleQueueBatch(
  batch: MessageBatch<QueueMessage>,
  env: Env,
): Promise<void> {
  for (const msg of batch.messages) {
    try {
      const { username } = msg.body;
      await processUsername(username, env);
      msg.ack();
    } catch (err) {
      // On failure, the message will be retried by the queue infrastructure.
      console.error(
        `[queue-consumer] Failed to process ${msg.body.username}:`,
        err,
      );
      msg.retry();
    }
  }
}

/**
 * Full pipeline for a single username:
 *   GitHub fetch -> persona engine -> D1 persist -> OG image generation.
 */
async function processUsername(username: string, env: Env): Promise<void> {
  // 1. Fetch GitHub data (cached in KV)
  const [githubProfile, repos, stars] = await Promise.all([
    fetchProfile(username, env),
    fetchRepos(username, env),
    fetchAllStars(username, env),
  ]);

  // 2. Run persona engine (deterministic — no AI/LLM)
  const computed: ComputedProfile = computeProfile(githubProfile, repos, stars);

  // 3. Build a simple hash of raw data to detect changes on next run
  const githubDataHash = simpleHash(
    JSON.stringify({
      login: githubProfile.login,
      public_repos: githubProfile.public_repos,
      followers: githubProfile.followers,
      repoCount: repos.length,
      starCount: stars.length,
    }),
  );

  // 4. Build profile row
  const profileRow: ProfileRow = {
    username: githubProfile.login,
    display_name: githubProfile.name,
    bio: githubProfile.bio,
    location: githubProfile.location,
    email: githubProfile.email,
    blog: githubProfile.blog,
    company: githubProfile.company,
    avatar_url: githubProfile.avatar_url,
    followers: githubProfile.followers,
    following: githubProfile.following,
    public_repos: githubProfile.public_repos,
    created_at: githubProfile.created_at,
    computed_at: new Date().toISOString(),
    github_data_hash: githubDataHash,
    raw_profile: JSON.stringify(githubProfile),
  };

  // 5. Write everything to D1
  await upsertProfile(env.DB, profileRow);
  await Promise.all([
    upsertPersonas(env.DB, username, computed.personas),
    upsertProjects(env.DB, username, computed.projects),
    upsertRadarAxes(env.DB, username, computed.radarAxes),
    upsertStarInterests(env.DB, username, computed.starInterests),
  ]);

  // 6. Generate OG image (stores in R2)
  try {
    await generateOGImage(profileRow, computed.personas, env);
  } catch (err) {
    // OG image generation failure should not fail the whole pipeline
    console.error(`[queue-consumer] OG image generation failed for ${username}:`, err);
  }
}

/** Simple FNV-1a-inspired hash for change detection (not cryptographic). */
function simpleHash(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}
