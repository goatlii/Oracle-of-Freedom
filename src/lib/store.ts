import { promises as fs } from "node:fs";
import path from "node:path";
import type { LiveSettings, StorageMode } from "@/lib/pricing";

const EMPTY: LiveSettings = { prices: {}, promos: [] };
const BLOB_PATH = "site/live-settings.json";
const LOCAL_PATH = path.join(process.cwd(), "data", "live-settings.json");

export function storageMode(): StorageMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (process.env.VERCEL) return "readonly";
  return "local";
}

function asSettings(value: unknown): LiveSettings | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Partial<LiveSettings>;
  if (!record.prices || typeof record.prices !== "object" || !Array.isArray(record.promos)) return null;
  return { prices: record.prices, promos: record.promos };
}

async function readBlob(): Promise<LiveSettings | null> {
  const { get } = await import("@vercel/blob");
  const result = await get(BLOB_PATH, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  const text = await new Response(result.stream).text();
  return asSettings(JSON.parse(text));
}

async function readLocal(): Promise<LiveSettings | null> {
  try {
    const text = await fs.readFile(LOCAL_PATH, "utf8");
    return asSettings(JSON.parse(text));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function readStored(): Promise<LiveSettings> {
  const mode = storageMode();
  if (mode === "readonly") return EMPTY;
  const stored = mode === "blob" ? await readBlob() : await readLocal();
  return stored ?? EMPTY;
}

export async function writeStored(settings: LiveSettings) {
  const mode = storageMode();
  if (mode === "readonly") {
    throw new Error("Connect Vercel Blob before saving. The public site is still using the starting prices.");
  }
  const json = JSON.stringify(settings, null, 2);
  if (mode === "blob") {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATH, json, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return;
  }
  await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PATH, json, "utf8");
}
