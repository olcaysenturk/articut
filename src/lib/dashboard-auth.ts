import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export const DASHBOARD_SESSION_COOKIE = "dashboard_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const SESSION_SECRET = process.env.DASHBOARD_SESSION_SECRET || "articut-cms-dashboard-secret";
const CREDENTIALS_PATH = path.join(process.cwd(), "data", "dashboard-credentials.json");

type StoredCredentials = {
  username: string;
  salt: string;
  passwordHash: string;
};

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

async function readCredentials(): Promise<StoredCredentials> {
  try {
    const raw = await readFile(CREDENTIALS_PATH, "utf8");
    return JSON.parse(raw) as StoredCredentials;
  } catch {
    const salt = randomBytes(16).toString("hex");
    const initialUsername = process.env.DASHBOARD_USERNAME || "admin";
    const initialPassword = process.env.DASHBOARD_PASSWORD || "admin";
    const credentials: StoredCredentials = {
      username: initialUsername,
      salt,
      passwordHash: hashPassword(initialPassword, salt),
    };

    await mkdir(path.dirname(CREDENTIALS_PATH), { recursive: true });
    await writeFile(CREDENTIALS_PATH, JSON.stringify(credentials, null, 2), "utf8");

    return credentials;
  }
}

export async function getDashboardUsername(): Promise<string> {
  const envUsername = process.env.DASHBOARD_USERNAME;
  if (envUsername) {
    return envUsername;
  }

  const credentials = await readCredentials();
  return credentials.username;
}

export async function checkCredentials(username: string, password: string): Promise<boolean> {
  const envUsername = process.env.DASHBOARD_USERNAME;
  const envPassword = process.env.DASHBOARD_PASSWORD;

  if (envUsername && envPassword) {
    return username === envUsername && password === envPassword;
  }

  const credentials = await readCredentials();

  if (username !== credentials.username) return false;

  const candidateHash = hashPassword(password, credentials.salt);
  const candidateBuffer = Buffer.from(candidateHash);
  const expectedBuffer = Buffer.from(credentials.passwordHash);

  if (candidateBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(candidateBuffer, expectedBuffer);
}

export async function verifyCurrentPassword(password: string): Promise<boolean> {
  const envUsername = process.env.DASHBOARD_USERNAME;
  const envPassword = process.env.DASHBOARD_PASSWORD;

  if (envUsername && envPassword) {
    return password === envPassword;
  }

  const credentials = await readCredentials();
  return checkCredentials(credentials.username, password);
}

export function isUsingEnvironmentVariables(): boolean {
  return !!(process.env.DASHBOARD_USERNAME && process.env.DASHBOARD_PASSWORD);
}

export async function updateCredentials(newUsername: string, newPassword: string): Promise<void> {
  if (isUsingEnvironmentVariables()) {
    throw new Error(
      "Cannot update credentials when using environment variables. Update DASHBOARD_USERNAME and DASHBOARD_PASSWORD in your deployment settings."
    );
  }

  const salt = randomBytes(16).toString("hex");
  const credentials: StoredCredentials = {
    username: newUsername,
    salt,
    passwordHash: hashPassword(newPassword, salt),
  };

  await mkdir(path.dirname(CREDENTIALS_PATH), { recursive: true });
  await writeFile(CREDENTIALS_PATH, JSON.stringify(credentials, null, 2), "utf8");
}

function sign(payload: string): string {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

export function createSessionToken(): { token: string; maxAge: number } {
  const expires = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${expires}`;
  const signature = sign(payload);
  return { token: `${payload}.${signature}`, maxAge: SESSION_MAX_AGE_SECONDS };
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expectedSignature = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return false;

  const expires = Number(payload);
  if (Number.isNaN(expires) || expires < Date.now()) return false;

  return true;
}
