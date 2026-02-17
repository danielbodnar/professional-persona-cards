import { defineMiddleware } from "astro:middleware";

const RESERVED = new Set(["www", "api", "cdn", "static"]);
const PRODUCTION_DOMAIN = "profiles.sh";

export const onRequest = defineMiddleware(async (ctx, next) => {
  const url = new URL(ctx.request.url);

  // Only apply subdomain routing on the production domain (e.g. danielbodnar.profiles.sh)
  // Skip on *.workers.dev, localhost, and other non-production hosts
  if (!url.hostname.endsWith(PRODUCTION_DOMAIN)) {
    return next();
  }

  const parts = url.hostname.split(".");

  // Detect subdomain: e.g. "danielbodnar.profiles.sh" -> sub = "danielbodnar"
  if (parts.length >= 3) {
    const sub = parts[0].toLowerCase();
    if (!RESERVED.has(sub) && sub.length > 0) {
      ctx.locals.subdomainUsername = sub;

      // Rewrite root to /{username}
      if (url.pathname === "/" || url.pathname === "") {
        return ctx.rewrite(`/${sub}`);
      }

      // Rewrite other paths to /{username}/...
      if (!url.pathname.startsWith(`/${sub}`)) {
        return ctx.rewrite(`/${sub}${url.pathname}`);
      }
    }
  }

  return next();
});
