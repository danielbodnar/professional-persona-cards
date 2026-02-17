/**
 * Subdomain-aware URL helper.
 *
 * In production on profiles.sh, generates subdomain URLs: username.profiles.sh
 * In development (localhost), falls back to path-based: /username
 */

const PRODUCTION_DOMAIN = "profiles.sh";

/**
 * Build a profile URL for the given username.
 *
 * @param username - GitHub username
 * @param path - Optional sub-path (e.g. "/card/rust")
 * @param requestUrl - Current request URL for detecting environment
 */
export function profileUrl(
  username: string,
  path = "",
  requestUrl?: URL,
): string {
  // Use subdomain routing on production
  if (requestUrl && requestUrl.hostname.endsWith(PRODUCTION_DOMAIN)) {
    const protocol = requestUrl.protocol;
    return `${protocol}//${username}.${PRODUCTION_DOMAIN}${path}`;
  }

  // Fallback to path-based routing (dev, preview, non-production)
  return `/${username}${path}`;
}
