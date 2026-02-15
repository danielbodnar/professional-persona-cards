/**
 * Durable Object rate limiter: 1 refresh per hour per username.
 *
 * Actions (via query params):
 *   ?action=check&username=X  -> { allowed: boolean, retryAfter?: number }
 *   ?action=consume&username=X -> { consumed: true }
 *
 * Reference: spec lines 948-973.
 */

const ONE_HOUR_MS = 3_600_000; // 60 * 60 * 1000

export class RateLimiter {
  private state: DurableObjectState;

  constructor(state: DurableObjectState, _env: unknown) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");
    const action = url.searchParams.get("action"); // "check" or "consume"

    if (!username || !action) {
      return Response.json(
        { error: "Missing username or action query parameter" },
        { status: 400 },
      );
    }

    const key = `ratelimit:${username}`;
    const existing = await this.state.storage.get<number>(key);

    if (action === "check") {
      if (existing && Date.now() - existing < ONE_HOUR_MS) {
        const elapsedSeconds = Math.floor((Date.now() - existing) / 1000);
        const retryAfter = 3600 - elapsedSeconds;
        return Response.json({ allowed: false, retryAfter });
      }
      return Response.json({ allowed: true });
    }

    if (action === "consume") {
      await this.state.storage.put(key, Date.now());
      return Response.json({ consumed: true });
    }

    return Response.json(
      { error: `Unknown action: ${action}` },
      { status: 400 },
    );
  }
}
