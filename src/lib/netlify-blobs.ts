import "server-only";

import { createHash } from "node:crypto";
import { getStore } from "@netlify/blobs";

const CMS_STORE_NAME = "articut-cms";
const CMS_CONTENT_KEY = "cms/content.json";
const CMS_MEDIA_PREFIX = "cms-media";
const DASHBOARD_CREDENTIALS_KEY = "dashboard/credentials.json";

function cmsStore() {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_AUTH_TOKEN;

  try {
    if (!siteID || !token) {
      // Netlify Functions expose the site context to @netlify/blobs.
      // The explicit credentials remain supported for local/CI execution.
      if (process.env.NETLIFY !== "true") return null;
      return getStore({ name: CMS_STORE_NAME, consistency: "strong" });
    }

    return getStore({
      name: CMS_STORE_NAME,
      consistency: "strong",
      siteID,
      token,
    });
  } catch (error) {
    console.error("Netlify Blobs store initialization failed", error);
    // Allow production builds to use the checked-in CMS fallback when Blob
    // credentials are unavailable or invalid.
    return null;
  }
}

export function cmsMediaUrl(key: string) {
  return `/api/cms-media?key=${encodeURIComponent(key)}`;
}

function contentHash(data: ArrayBuffer) {
  return createHash("sha256").update(Buffer.from(data)).digest("hex");
}

export async function readCmsContentBlob() {
  const store = cmsStore();
  if (!store) return null;

  try {
    return await store.get(CMS_CONTENT_KEY, { type: "text" });
  } catch {
    // Keep local development usable when the Blob API is unavailable.
    return null;
  }
}

export async function readDashboardCredentials() {
  const store = cmsStore();
  if (!store) return null;

  try {
    const value = await store.get(DASHBOARD_CREDENTIALS_KEY, { type: "json" });
    return value as {
      username?: unknown;
      salt?: unknown;
      passwordHash?: unknown;
    } | null;
  } catch {
    return null;
  }
}

export async function writeDashboardCredentials(credentials: {
  username: string;
  salt: string;
  passwordHash: string;
}) {
  const store = cmsStore();
  if (!store) return false;

  try {
    await store.setJSON(DASHBOARD_CREDENTIALS_KEY, credentials);
    return true;
  } catch (error) {
    console.error("Netlify Blobs CMS content write failed", error);
    return false;
  }
}

export async function writeCmsContentBlob(content: unknown) {
  const store = cmsStore();
  if (!store) return false;

  try {
    await store.setJSON(CMS_CONTENT_KEY, content);
    return true;
  } catch {
    return false;
  }
}

export async function uploadCmsMedia(file: File, baseName: string) {
  const store = cmsStore();
  if (!store) return null;

  const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : ".bin";
  const data = await file.arrayBuffer();
  const hash = contentHash(data);
  const key = `${CMS_MEDIA_PREFIX}/${Date.now()}-${hash.slice(0, 16)}-${baseName || "file"}${extension}`;
  const contentType = file.type || "application/octet-stream";

  try {
    await store.set(key, data, { metadata: { contentType, sha256: hash } });

    const saved = await store.get(key, { type: "arrayBuffer" });
    if (contentHash(saved) !== hash) {
      throw new Error(`Uploaded media verification failed for ${key}`);
    }
  } catch (error) {
    console.error("Netlify Blobs media upload failed", error);
    throw error;
  }
  return { key, contentType };
}

export async function readCmsMedia(key: string) {
  const store = cmsStore();
  if (!store || !key.startsWith(`${CMS_MEDIA_PREFIX}/`)) return null;

  return store.getWithMetadata(key, { type: "arrayBuffer" });
}
