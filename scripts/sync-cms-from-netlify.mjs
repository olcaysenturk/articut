import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getStore } from "@netlify/blobs";

const CMS_STORE_NAME = "articut-cms";
const CMS_CONTENT_KEY = "cms/content.json";
const CMS_MEDIA_PREFIX = "cms-media";
const ROOT = process.cwd();
const CONTENT_PATH = path.join(ROOT, "data", "cms-content.json");
const MEDIA_DIR = path.join(ROOT, "public", "uploads", "cms");

function loadEnvFile(fileName) {
  const filePath = path.join(ROOT, fileName);
  if (!existsSync(filePath)) return;

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

function mediaKeysFromContent(value, keys = new Set()) {
  if (typeof value === "string") {
    const matches = value.matchAll(/\/api\/cms-media\/([^?#"'\s]+)/g);
    for (const match of matches) {
      keys.add(match[1].split("/").map(decodeURIComponent).join("/"));
    }
    return keys;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => mediaKeysFromContent(item, keys));
    return keys;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => mediaKeysFromContent(item, keys));
  }

  return keys;
}

function localMediaPath(key) {
  if (!key.startsWith(`${CMS_MEDIA_PREFIX}/`)) return null;
  const fileName = key.slice(CMS_MEDIA_PREFIX.length + 1);
  if (!fileName || fileName.includes("/") || fileName.includes("\\")) return null;
  return path.join(MEDIA_DIR, fileName);
}

loadEnvFile(".env.local");
loadEnvFile(".env.development.local");

const siteID = process.env.NETLIFY_SITE_ID;
const token = process.env.NETLIFY_AUTH_TOKEN;

if (!siteID || !token) {
  throw new Error("NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN are required in .env.local or the shell.");
}

const store = getStore({ name: CMS_STORE_NAME, consistency: "strong", siteID, token });
const rawContent = await store.get(CMS_CONTENT_KEY, { type: "text" });

if (!rawContent) {
  throw new Error(`Could not read ${CMS_CONTENT_KEY} from Netlify Blobs.`);
}

const content = JSON.parse(rawContent);
await mkdir(path.dirname(CONTENT_PATH), { recursive: true });
await writeFile(CONTENT_PATH, `${JSON.stringify(content, null, 2)}\n`, "utf8");

const mediaKeys = [...mediaKeysFromContent(content)].sort();
let downloaded = 0;

for (const key of mediaKeys) {
  const filePath = localMediaPath(key);
  if (!filePath) continue;

  const media = await store.getWithMetadata(key, { type: "arrayBuffer" });
  if (!media) {
    console.warn(`Missing media blob: ${key}`);
    continue;
  }

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, Buffer.from(media.data));
  downloaded += 1;
}

console.log(`Synced ${CMS_CONTENT_KEY} to ${path.relative(ROOT, CONTENT_PATH)}.`);
console.log(`Downloaded ${downloaded}/${mediaKeys.length} CMS media files to ${path.relative(ROOT, MEDIA_DIR)}.`);
