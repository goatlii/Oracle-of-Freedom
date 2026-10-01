import { unstable_cache } from "next/cache";
import { mergeCatalog } from "@/lib/pricing";
import { readStored } from "@/lib/store";

async function loadSettings() {
  try {
    return await readStored();
  } catch (error) {
    console.error("[offers] using the prices in the repo", error);
    return { prices: {}, promos: [] };
  }
}

const cachedSettings = unstable_cache(loadSettings, ["live-settings"], { tags: ["live-settings"] });

export async function getSettings() {
  return cachedSettings();
}

export async function getCatalog() {
  return mergeCatalog(await getSettings());
}
