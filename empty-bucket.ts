/**
 * Temporary one-shot script: empty the old R2 bucket via wrangler.
 * Run: npx wrangler dev empty-bucket.ts --remote -r OLD_R2=identity-deck-assets
 * Then: curl http://localhost:8787
 * Then: Ctrl+C and delete this file.
 */
export default {
  async fetch(_req: Request, env: { OLD_R2: R2Bucket }) {
    let deleted = 0;
    let cursor: string | undefined;
    do {
      const listed = await env.OLD_R2.list({ cursor, limit: 500 });
      if (listed.objects.length === 0) break;
      await Promise.all(listed.objects.map((o) => env.OLD_R2.delete(o.key)));
      deleted += listed.objects.length;
      cursor = listed.truncated ? listed.cursor : undefined;
    } while (cursor);
    return Response.json({ deleted });
  },
};
