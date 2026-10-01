"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminConfigured, isAdmin, passwordsMatch, sealSession, sessionCookieOptions } from "@/lib/admin-auth";
import { catalog, type Promo } from "@/lib/pricing";
import { readStored, writeStored } from "@/lib/store";

export type ActionState = { ok?: boolean; error?: string } | null;

async function guard() {
  if (!(await isAdmin())) redirect("/admin/login");
}

function refreshSite() {
  revalidateTag("live-settings", "max");
  revalidatePath("/", "layout");
}

export async function login(_state: ActionState, formData: FormData): Promise<ActionState> {
  const expected = process.env.ADMIN_PASSWORD || "";
  const input = String(formData.get("password") || "");
  if (!adminConfigured() || !passwordsMatch(input, expected)) {
    return { error: "That password doesn’t match." };
  }
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, sealSession(), sessionCookieOptions());
  redirect("/admin");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

function cleanText(value: FormDataEntryValue | null, max: number) {
  return String(value || "").trim().slice(0, max);
}

export async function savePrices(_state: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const current = await readStored();
  const prices: typeof current.prices = {};
  for (const item of catalog) {
    const visible = formData.get(`visible:${item.id}`) === "on";
    if (item.custom) {
      prices[item.id] = { visible };
      continue;
    }
    const raw = String(formData.get(`from:${item.id}`) || "").trim();
    const amount = Number(raw);
    if (!Number.isInteger(amount) || amount < 1 || amount > 20000) {
      return { error: `Enter a whole euro amount for ${item.label}.` };
    }
    prices[item.id] = { from: amount, visible };
  }
  try {
    await writeStored({ prices, promos: current.promos });
    refreshSite();
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The prices didn’t save." };
  }
  return { ok: true };
}

export async function savePromo(_state: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const current = await readStored();
  const name = cleanText(formData.get("name"), 80);
  if (!name) return { error: "Give the promotion a name." };
  const type = formData.get("type") === "fixed" ? "fixed" : "percent";
  const amount = Number(String(formData.get("amount") || "").trim());
  if (!Number.isInteger(amount) || amount < 1) return { error: "Enter the discount as a whole number." };
  if (type === "percent" && amount > 90) return { error: "A percent discount can be at most 90." };
  if (type === "fixed" && amount > 5000) return { error: "That euro discount is too large." };
  const starts = cleanText(formData.get("starts"), 10);
  const ends = cleanText(formData.get("ends"), 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(starts) || !/^\d{4}-\d{2}-\d{2}$/.test(ends)) {
    return { error: "Add a start date and an end date." };
  }
  if (ends < starts) return { error: "The end date needs to be on or after the start date." };
  const all = formData.get("all") === "on";
  const targets = all ? "all" : catalog.filter((item) => formData.get(`target:${item.id}`) === "on").map((item) => item.id);
  if (targets !== "all" && targets.length === 0) return { error: "Choose which sessions this applies to, or tick all." };
  const code = cleanText(formData.get("code"), 40).toUpperCase();
  if (code && !/^[A-Z0-9-]+$/.test(code)) return { error: "The promo code can use letters, numbers and hyphens." };
  const promo: Promo = {
    id: cleanText(formData.get("id"), 80) || randomUUID(),
    name,
    type,
    amount,
    targets,
    starts,
    ends,
    code,
    banner: {
      en: cleanText(formData.get("bannerEn"), 180),
      es: cleanText(formData.get("bannerEs"), 180),
      pt: cleanText(formData.get("bannerPt"), 180),
    },
    active: formData.get("active") === "on",
  };
  const promos = current.promos.some((item) => item.id === promo.id)
    ? current.promos.map((item) => (item.id === promo.id ? promo : item))
    : [promo, ...current.promos];
  try {
    await writeStored({ prices: current.prices, promos });
    refreshSite();
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The promotion didn’t save." };
  }
  return { ok: true };
}

export async function deletePromo(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const current = await readStored();
  await writeStored({ prices: current.prices, promos: current.promos.filter((item) => item.id !== id) });
  refreshSite();
}
