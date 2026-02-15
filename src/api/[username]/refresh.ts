import type { APIRoute } from 'astro';

const USERNAME_RE = /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;

function isValidUsername(username: string): boolean {
  return USERNAME_RE.test(username) && !username.includes('--');
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
};

function jsonResponse(
  body: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...extraHeaders },
  });
}

/**
 * OPTIONS /api/:username/refresh
 *
 * CORS preflight handler for the POST endpoint.
 */
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

/**
 * POST /api/:username/refresh
 *
 * Force a profile re-computation. Rate-limited to 1 refresh per hour per user
 * via a Durable Object rate limiter.
 */
export const POST: APIRoute = async ({ params, locals }) => {
  try {
    const env = locals.runtime.env as Env;
    const rawUsername = params.username ?? '';
    const username = rawUsername.toLowerCase();

    if (!isValidUsername(username)) {
      return jsonResponse({ error: 'Invalid username', username }, 400);
    }

    // ---- Rate limiter via Durable Object ----
    const rateLimiterId = env.RATE_LIMITER.idFromName(username);
    const rateLimiterStub = env.RATE_LIMITER.get(rateLimiterId);

    // Check whether a refresh is allowed
    const checkUrl = new URL('https://rate-limiter.internal');
    checkUrl.searchParams.set('action', 'check');
    checkUrl.searchParams.set('username', username);

    const checkResponse = await rateLimiterStub.fetch(checkUrl.toString());
    const checkResult = (await checkResponse.json()) as {
      allowed: boolean;
      retryAfter?: number;
    };

    if (!checkResult.allowed) {
      const retryAfter = checkResult.retryAfter ?? 3600;
      return jsonResponse(
        { error: 'Rate limited', retryAfter },
        429,
        { 'Retry-After': String(retryAfter) }
      );
    }

    // ---- Consume the rate limit token ----
    const consumeUrl = new URL('https://rate-limiter.internal');
    consumeUrl.searchParams.set('action', 'consume');
    consumeUrl.searchParams.set('username', username);

    await rateLimiterStub.fetch(consumeUrl.toString());

    // ---- Enqueue the forced refresh ----
    await env.PROFILE_QUEUE.send({
      username,
      requestedAt: Date.now(),
      force: true,
    });

    return jsonResponse(
      {
        status: 'queued',
        username,
        message: 'Profile refresh queued. Please retry in a few seconds.',
        eta: 15,
      },
      202
    );
  } catch (error) {
    console.error('POST /api/:username/refresh error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
};
