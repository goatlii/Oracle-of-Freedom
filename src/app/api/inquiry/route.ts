import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { getCopy } from "@/content";
import { en } from "@/content/en";
import { settings } from "@/lib/content";
import { budgetGroup, gradeInquiry } from "@/lib/lead";

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.email(),
  phone: z.string().max(40).optional(),
  service: z.string().min(1).max(40),
  date: z.string().max(40).optional(),
  flexible: z.boolean(),
  place: z.string().trim().min(1).max(300),
  people: z.string().max(20).optional(),
  days: z.string().max(20).optional(),
  placeType: z.string().max(40).optional(),
  website: z.string().max(300).optional(),
  budget: z.string().min(1).max(40),
  media: z.string().max(40).optional(),
  story: z.string().max(4000).optional(),
  found: z.string().min(1).max(40),
  language: z.string().min(1).max(10),
  consent: z.boolean().refine((value) => value),
  promoCode: z.string().max(40).optional(),
  wish: z.string().max(400).optional(),
  company: z.string().optional(),
  locale: z.string().max(10).optional(),
});

const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

function label(map: Record<string, string>, key?: string) {
  if (!key) return "—";
  return map[key] || key;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const data = parsed.data;
  if (data.company?.trim()) {
    return NextResponse.json({ ok: true, emailed: false });
  }
  if (!data.flexible && !data.date) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const grade = gradeInquiry({
    service: data.service,
    budget: data.budget,
    date: data.date,
    flexible: data.flexible,
    phone: data.phone,
    people: data.people,
  });
  const group = budgetGroup(data.service);
  const budgetLabel = en.form.budgets[group]?.find((item) => item.value === data.budget)?.label || data.budget;
  const lines = [
    `Grade: ${grade}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "—"}`,
    `Service: ${label(en.form.services, data.service)}`,
    `Media: ${label(en.form.mediaOptions, data.media)}`,
    `Date: ${data.flexible ? "Flexible" : data.date}`,
    `Place: ${data.place}`,
    `People / size: ${data.people || "—"}`,
    `Duration: ${data.days || "—"}`,
    `Place type: ${data.placeType || "—"}`,
    `Website: ${data.website || "—"}`,
    `Budget: ${budgetLabel}`,
    ...(data.wish?.trim() ? [`What they want: ${data.wish.trim()}`] : []),
    ...(data.promoCode?.trim() ? [`Promo code: ${data.promoCode.trim()}`] : []),
    `Found via: ${label(en.form.foundOptions, data.found)}`,
    `Preferred language: ${label(en.form.languages, data.language)}`,
    "",
    data.story || "(no story)",
  ];

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[inquiry] email not configured · grade ${grade} · ${data.service}`);
    return NextResponse.json({ ok: true, emailed: false, grade });
  }

  const from = process.env.RESEND_FROM_EMAIL || "Oracle of Freedom <onboarding@resend.dev>";
  const to = process.env.INQUIRY_TO_EMAIL || settings.email;
  const resend = new Resend(apiKey);
  const reply = getCopy(data.language);

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `[${grade}] ${label(en.form.services, data.service)} — ${data.name}`,
      text: lines.join("\n"),
    });
    await resend.emails.send({
      from,
      to: data.email,
      replyTo: to,
      subject: reply.thankYou.title,
      text: reply.inquire.confirm,
    });
  } catch (error) {
    console.error("[inquiry] send failed", error);
    return NextResponse.json({ ok: false, emailed: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true, emailed: true, grade });
}
