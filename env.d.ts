/// <reference path="../.astro/types.d.ts" />
/// <reference types="./worker-configuration.d.ts" />

// Secrets not in wrangler.jsonc vars — extend the generated Env
declare namespace Cloudflare {
  interface Env {
    GITHUB_TOKEN: string;

    // Optional config overrides (see src/lib/config.ts)
    GITHUB_PER_PAGE?: string;
    MAX_STAR_PAGES?: string;
    MAX_REPO_PAGES?: string;
    CACHE_TTL?: string;
    RATE_LIMIT_WINDOW?: string;
    PERSONA_THRESHOLD?: string;
    API_CACHE_MAX_AGE?: string;
    INACTIVE_YEARS?: string;
  }
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    subdomainUsername?: string;
  }
}
