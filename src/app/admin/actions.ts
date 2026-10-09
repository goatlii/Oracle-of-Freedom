"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminConfigured, isAdmin, passwordsMatch, sealSession, sessionCookieOptions } from "@/lib/admin-auth";
import { deliveriesFromForm, timingsFromForm } from "@/lib/delivery";
import { deliveryDefaults } from "@/lib/delivery-copy";
import { catalog, type LiveSettings, type Promo } from "@/lib/pricing";
import { studioCopy } from "@/lib/studio-copy";
import { studioLang } from "@/lib/studio-locale.server";
import { readStored, writeStored } from "@/lib/store";

export type ActionState = { ok?: boolean; error?: string } | null;

async function guard() {
  if (!(await isAdmin())) redirect("/admin/login");
}

function refreshSite() {
  revalidateTag("live-settings", "max");
  revalidatePath("/", "layout");
}

function withSchedule(
  base: { prices: LiveSettings["prices"]; promos: Promo[] },
  timings: LiveSettings["timings"],
  deliveries: LiveSettings["deliveries"],
): LiveSettings {
  return {
    prices: base.prices,
    promos: base.promos,
    ...(timings && Object.keys(timings).length > 0 ? { timings } : {}),
    ...(deliveries && Object.keys(deliveries).length > 0 ? { deliveries } : {}),
  };
}

export async function login(_state: ActionState, formData: FormData): Promise<ActionState> {
  const t = studioCopy(await studioLang());
  const expected = process.env.ADMIN_PASSWORD || "";
  const input = String(formData.get("password") || "");
  if (!adminConfigured() || !passwordsMatch(input, expected)) {
    return { error: t.errors.password };
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
  const lang = await studioLang();
  const t = studioCopy(lang);
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
      return { error: t.errors.wholeEuros(item.label) };
    }
    prices[item.id] = { from: amount, visible };
  }
  const timingResult = timingsFromForm(formData, lang);
  if (timingResult.error) return { error: timingResult.error };
  const deliveryResult = deliveriesFromForm(formData, deliveryDefaults(), lang);
  if (deliveryResult.error) return { error: deliveryResult.error };
  try {
    await writeStored(withSchedule({ prices, promos: current.promos }, timingResult.timings, deliveryResult.deliveries));
    refreshSite();
  } catch (error) {
    return { error: error instanceof Error ? error.message : t.errors.prices };
  }
  return { ok: true };
}

export async function savePromo(_state: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const t = studioCopy(await studioLang());
  const current = await readStored();
  const name = cleanText(formData.get("name"), 80);
  if (!name) return { error: t.errors.promoName };
  const type = formData.get("type") === "fixed" ? "fixed" : "percent";
  const amount = Number(String(formData.get("amount") || "").trim());
  if (!Number.isInteger(amount) || amount < 1) return { error: t.errors.promoAmount };
  if (type === "percent" && amount > 90) return { error: t.errors.promoPercent };
  if (type === "fixed" && amount > 5000) return { error: t.errors.promoFixed };
  const starts = cleanText(formData.get("starts"), 10);
  const ends = cleanText(formData.get("ends"), 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(starts) || !/^\d{4}-\d{2}-\d{2}$/.test(ends)) {
    return { error: t.errors.promoDates };
  }
  if (ends < starts) return { error: t.errors.promoOrder };
  const all = formData.get("all") === "on";
  const targets = all ? "all" : catalog.filter((item) => formData.get(`target:${item.id}`) === "on").map((item) => item.id);
  if (targets !== "all" && targets.length === 0) return { error: t.errors.promoTargets };
  const code = cleanText(formData.get("code"), 40).toUpperCase();
  if (code && !/^[A-Z0-9-]+$/.test(code)) return { error: t.errors.promoCode };
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
    await writeStored(withSchedule({ prices: current.prices, promos }, current.timings, current.deliveries));
    refreshSite();
  } catch (error) {
    return { error: error instanceof Error ? error.message : t.errors.promoSave };
  }
  return { ok: true };
}

export async function deletePromo(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const current = await readStored();
  await writeStored(
    withSchedule(
      { prices: current.prices, promos: current.promos.filter((item) => item.id !== id) },
      current.timings,
      current.deliveries,
    ),
  );
  refreshSite();
}
