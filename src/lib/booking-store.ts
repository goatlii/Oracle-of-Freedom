import { promises as fs } from "node:fs";
import path from "node:path";
import { isBooking, sortBookings, type Booking } from "@/lib/bookings";
import { storageMode } from "@/lib/store";

const BLOB_PATH = "site/bookings.json";
const LOCAL_PATH = path.join(process.cwd(), "data", "bookings.json");

function asList(value: unknown): Booking[] {
  const raw =
    value && typeof value === "object" && "bookings" in value
      ? (value as { bookings: unknown }).bookings
      : value;
  if (!Array.isArray(raw)) return [];
  return sortBookings(raw.filter(isBooking));
}

async function readBlob(): Promise<Booking[]> {
  const { get } = await import("@vercel/blob");
  const result = await get(BLOB_PATH, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) return [];
  const text = await new Response(result.stream).text();
  return asList(JSON.parse(text));
}

async function readLocal(): Promise<Booking[]> {
  try {
    const text = await fs.readFile(LOCAL_PATH, "utf8");
    return asList(JSON.parse(text));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function readBookings(): Promise<Booking[]> {
  const mode = storageMode();
  if (mode === "readonly") return [];
  return mode === "blob" ? readBlob() : readLocal();
}

export async function writeBookings(bookings: Booking[]) {
  const mode = storageMode();
  if (mode === "readonly") {
    throw new Error("Connect Vercel Blob before saving. The calendar cannot be stored on the live site until then.");
  }
  const json = JSON.stringify({ bookings: sortBookings(bookings) }, null, 2);
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
