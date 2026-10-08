import { promises as fs } from "node:fs";
import path from "node:path";
import { isInquiry, sortInquiries, type Inquiry } from "@/lib/inquiries";
import { storageMode } from "@/lib/store";

const BLOB_PATH = "site/inquiries.json";
const LOCAL_PATH = path.join(process.cwd(), "data", "inquiries.json");

function asList(value: unknown): Inquiry[] {
  const raw =
    value && typeof value === "object" && "inquiries" in value
      ? (value as { inquiries: unknown }).inquiries
      : value;
  if (!Array.isArray(raw)) return [];
  return sortInquiries(raw.filter(isInquiry));
}

async function readBlob(): Promise<Inquiry[]> {
  const { get } = await import("@vercel/blob");
  const result = await get(BLOB_PATH, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) return [];
  return asList(JSON.parse(await new Response(result.stream).text()));
}

async function readLocal(): Promise<Inquiry[]> {
  try {
    return asList(JSON.parse(await fs.readFile(LOCAL_PATH, "utf8")));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function readInquiries(): Promise<Inquiry[]> {
  const mode = storageMode();
  if (mode === "readonly") return [];
  return mode === "blob" ? readBlob() : readLocal();
}

export async function writeInquiries(inquiries: Inquiry[]) {
  const mode = storageMode();
  if (mode === "readonly") {
    throw new Error("Conecta Vercel Blob antes de guardar solicitudes.");
  }
  const json = JSON.stringify({ inquiries: sortInquiries(inquiries) }, null, 2);
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
