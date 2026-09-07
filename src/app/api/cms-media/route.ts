import { readCmsMedia } from "@/lib/netlify-blobs";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key");

  if (!key) return new Response("Missing media key", { status: 400 });

  const media = await readCmsMedia(key);
  if (!media) return new Response("Media not found", { status: 404 });

  const contentType = typeof media.metadata.contentType === "string"
    ? media.metadata.contentType
    : "application/octet-stream";

  const headers = new Headers({
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Type": contentType,
  });
  if (media.etag) headers.set("ETag", media.etag);

  return new Response(media.data, { headers });
}
