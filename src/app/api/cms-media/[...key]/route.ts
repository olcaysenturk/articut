import { readCmsMedia } from "@/lib/netlify-blobs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key: keyParts } = await params;
  const key = keyParts.join("/");

  if (!key) return new Response("Missing media key", { status: 400 });

  const media = await readCmsMedia(key);
  if (!media) return new Response("Media not found", { status: 404 });

  const contentType = typeof media.metadata.contentType === "string"
    ? media.metadata.contentType
    : "application/octet-stream";

  const headers = new Headers({
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "Content-Type": contentType,
  });
  if (media.etag) headers.set("ETag", media.etag);

  return new Response(media.data, { headers });
}
