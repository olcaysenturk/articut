import "server-only";

import { getStore } from "@netlify/blobs";

const CMS_STORE_NAME = "articut-cms";
const CMS_CONTENT_KEY = "cms/content.json";
const CMS_MEDIA_PREFIX = "cms-media";
const DASHBOARD_CREDENTIALS_KEY = "dashboard/credentials.json";

function cmsStore() {
  try {
    const siteID = process.env.NETLIFY_SITE_ID;
    const token = process.env.NETLIFY_AUTH_TOKEN;

    if (!siteID || !token) {
      // Netlify Functions provide the Blobs context automatically at runtime.
      // During a build this may throw, so the caller can use the local fallback.
      if (process.env.NETLIFY !== "true") return null;
      return getStore({ name: CMS_STORE_NAME });
    }

    return getStore({
      name: CMS_STORE_NAME,
      siteID,
      token,
    });
  } catch {
    // Allow production builds to use the checked-in CMS fallback when Blob
    // credentials are unavailable or invalid.
    return null;
  }
}

export function cmsMediaUrl(key: string) {
  return `/api/cms-media?key=${encodeURIComponent(key)}`;
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
  } catch {
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
  const key = `${CMS_MEDIA_PREFIX}/${Date.now()}-${baseName || "file"}${extension}`;
  const contentType = file.type || "application/octet-stream";

  await store.set(key, await file.arrayBuffer(), { metadata: { contentType } });
  return { key, contentType };
}

export async function readCmsMedia(key: string) {
  const store = cmsStore();
  if (!store || !key.startsWith(`${CMS_MEDIA_PREFIX}/`)) return null;

  return store.getWithMetadata(key, { type: "arrayBuffer" });
}
