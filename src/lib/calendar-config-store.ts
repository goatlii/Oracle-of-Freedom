import { promises as fs } from "node:fs";
import path from "node:path";
import {
  defaultCalendarConfig,
  parseCalendarConfig,
  type CalendarConfig,
} from "@/lib/calendar-config";
import { storageMode } from "@/lib/store";

const BLOB_PATH = "site/calendar-config.json";
const LOCAL_PATH = path.join(process.cwd(), "data", "calendar-config.json");

async function readBlob(): Promise<CalendarConfig | null> {
  const { get } = await import("@vercel/blob");
  const result = await get(BLOB_PATH, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  return parseCalendarConfig(JSON.parse(await new Response(result.stream).text()));
}

async function readLocal(): Promise<CalendarConfig | null> {
  try {
    return parseCalendarConfig(JSON.parse(await fs.readFile(LOCAL_PATH, "utf8")));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function readCalendarConfig(): Promise<CalendarConfig> {
  const mode = storageMode();
  const saved = mode === "blob" ? await readBlob() : mode === "local" ? await readLocal() : null;
  if (saved) return saved;
  const initial = defaultCalendarConfig();
  if (mode !== "readonly") await writeCalendarConfig(initial);
  return initial;
}

export async function writeCalendarConfig(config: CalendarConfig) {
  const mode = storageMode();
  if (mode === "readonly") {
    throw new Error("Connect Vercel Blob before saving calendar settings.");
  }
  const json = JSON.stringify(config, null, 2);
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
