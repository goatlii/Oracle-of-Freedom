"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Copy } from "@/content/types";
import { budgetGroup, peopleMode } from "@/lib/lead";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { rememberPromoCode, rememberWish } from "@/components/whatsapp-link";

type FormCopy = Copy["form"];

function schemaFor(copy: FormCopy) {
  return z
    .object({
      name: z.string().trim().min(1, copy.errors.required),
      email: z.email(copy.errors.email),
      phone: z.string().optional(),
      service: z.string().min(1, copy.errors.required),
      date: z.string().optional(),
      flexible: z.boolean(),
      place: z.string().trim().min(1, copy.errors.required),
      people: z.string().optional(),
      days: z.string().optional(),
      placeType: z.string().optional(),
      website: z.string().optional(),
      budget: z.string().min(1, copy.errors.required),
      media: z.string().optional(),
      story: z.string().optional(),
      found: z.string().min(1, copy.errors.required),
      language: z.string().min(1, copy.errors.required),
      consent: z.boolean().refine((value) => value, { error: copy.errors.consent }),
      promoCode: z.string().max(40).optional(),
      wish: z.string().max(400).optional(),
      company: z.string().optional(),
    })
    .superRefine((value, ctx) => {
      if (!value.flexible && !value.date) {
        ctx.addIssue({ code: "custom", path: ["date"], message: copy.errors.date });
      }
    });
}

type Values = z.infer<ReturnType<typeof schemaFor>>;

function presetService(value: string | undefined, services: Record<string, string>) {
  if (value === "couple" || value === "portraits") return "portraits";
  if (value && services[value]) return value;
  return "";
}

export function InquiryForm({
  copy,
  locale,
  initialService,
  thankYouPath,
  showPromoCode = false,
}: {
  copy: FormCopy;
  locale: string;
  initialService?: string;
  thankYouPath: string;
  showPromoCode?: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [fail, setFail] = useState(false);
  const schema = useMemo(() => schemaFor(copy), [copy]);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: presetService(initialService, copy.services),
      date: "",
      flexible: false,
      place: "",
      people: "",
      days: "",
      placeType: "",
      website: "",
      budget: "",
      media: "",
      story: "",
      found: "",
      language: locale === "pt" || locale === "es" ? locale : "en",
      consent: false,
      promoCode: "",
      wish: "",
      company: "",
    },
  });

  useEffect(() => {
    if (!showPromoCode) rememberPromoCode("");
  }, [showPromoCode]);

  const service = form.watch("service");

  useEffect(() => {
    if (service !== "portraits") rememberWish("");
  }, [service]);
  const people = form.watch("people");
  const group = budgetGroup(service || "other");
  const mode = peopleMode(service || "other");
  const showLimit = service === "wedding" && people === "30+";

  async function goNext() {
    const fields: (keyof Values)[][] = [
      ["service"],
      ["date", "flexible", "place", "budget"],
      ["name", "email", "found", "consent"],
    ];
    const ok = await form.trigger(fields[step]);
    if (ok) setStep((value) => Math.min(value + 1, 2));
  }

  async function onSubmit(values: Values) {
    setFail(false);
    const response = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, locale }),
    });
    if (!response.ok) {
      setFail(true);
      return;
    }
    const data = (await response.json()) as { emailed?: boolean };
    router.push(`${thankYouPath}?sent=${data.emailed ? "1" : "0"}`);
  }

  const error = (name: keyof Values) => form.formState.errors[name]?.message as string | undefined;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-3xl bg-white/60 p-5 md:p-8" noValidate>
      <ol className="mb-8 flex gap-3 text-xs tracking-[0.14em] uppercase" aria-label="Progress">
        {copy.steps.map((label, index) => (
          <li key={label} className={cn(index === step ? "text-terracotta-ink" : "text-ink/40")} aria-current={index === step ? "step" : undefined}>
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <fieldset>
          <legend className="mb-3 text-sm font-medium">{copy.service} *</legend>
          <div className="grid gap-2">
            {Object.entries(copy.services).map(([value, label]) => (
              <label key={value} className={cn("cursor-pointer rounded-2xl border px-4 py-3", service === value ? "border-terracotta bg-clay/60" : "border-ink/10")}>
                <input type="radio" value={value} className="mr-2" {...form.register("service")} />
                {label}
              </label>
            ))}
          </div>
          <FieldError>{error("service")}</FieldError>
          {service === "portraits" ? (
            <div className="mt-6">
              <Label htmlFor="wish">{copy.wish}</Label>
              <Textarea
                id="wish"
                placeholder={copy.wishPlaceholder}
                {...form.register("wish", {
                  onChange: (event) => rememberWish(event.target.value),
                })}
              />
            </div>
          ) : null}
          <fieldset className="mt-6">
            <legend className="mb-3 text-sm font-medium">{copy.media}</legend>
            <div className="flex flex-wrap gap-2">
              {Object.entries(copy.mediaOptions).map(([value, label]) => (
                <label key={value} className="rounded-full border border-ink/15 px-4 py-2">
                  <input type="radio" value={value} className="mr-2" {...form.register("media")} />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        </fieldset>
      ) : null}

      {step === 1 ? (
        <div className="grid gap-5">
          <div>
            <Label htmlFor="date">{copy.date} *</Label>
            <Input id="date" type="date" {...form.register("date")} aria-invalid={Boolean(error("date"))} />
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("flexible")} />
              {copy.flexible}
            </label>
            <FieldError>{error("date")}</FieldError>
          </div>
          <div>
            <Label htmlFor="place">{copy.place} *</Label>
            <Input id="place" {...form.register("place")} aria-invalid={Boolean(error("place"))} />
            <FieldError>{error("place")}</FieldError>
          </div>
          {mode !== "none" ? (
            <div>
              <Label htmlFor="people">{copy.people}</Label>
              <select id="people" className="h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4" {...form.register("people")}>
                <option value="">—</option>
                {Object.entries(mode === "event" ? copy.eventOptions : copy.peopleOptions).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {showLimit ? <p className="mt-2 rounded-2xl bg-clay p-3 text-sm">{copy.weddingLimit}</p> : null}
            </div>
          ) : null}
          {service === "retreat" || service === "festival" ? (
            <div>
              <Label htmlFor="days">{copy.days}</Label>
              <select id="days" className="h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4" {...form.register("days")}>
                <option value="">—</option>
                {Object.entries(copy.dayOptions).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          ) : null}
          {service === "place" ? (
            <>
              <div>
                <Label htmlFor="placeType">{copy.placeType}</Label>
                <select id="placeType" className="h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4" {...form.register("placeType")}>
                  <option value="">—</option>
                  {Object.entries(copy.placeTypes).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="website">{copy.website}</Label>
                <Input id="website" {...form.register("website")} />
              </div>
            </>
          ) : null}
          <div>
            <Label htmlFor="budget">{copy.budget} *</Label>
            <select id="budget" className="h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4" {...form.register("budget")} aria-invalid={Boolean(error("budget"))}>
              <option value="">—</option>
              {copy.budgets[group].map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <FieldError>{error("budget")}</FieldError>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-5">
          <div>
            <Label htmlFor="name">{copy.name} *</Label>
            <Input id="name" autoComplete="name" {...form.register("name")} aria-invalid={Boolean(error("name"))} />
            <FieldError>{error("name")}</FieldError>
          </div>
          <div>
            <Label htmlFor="email">{copy.email} *</Label>
            <Input id="email" type="email" autoComplete="email" {...form.register("email")} aria-invalid={Boolean(error("email"))} />
            <FieldError>{error("email")}</FieldError>
          </div>
          <div>
            <Label htmlFor="phone">{copy.phone}</Label>
            <Input id="phone" type="tel" autoComplete="tel" {...form.register("phone")} />
          </div>
          <div>
            <Label htmlFor="story">{copy.story}</Label>
            <Textarea id="story" placeholder={copy.storyPlaceholder} {...form.register("story")} />
          </div>
          <div>
            <Label htmlFor="found">{copy.found} *</Label>
            <select id="found" className="h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4" {...form.register("found")} aria-invalid={Boolean(error("found"))}>
              <option value="">—</option>
              {Object.entries(copy.foundOptions).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <FieldError>{error("found")}</FieldError>
          </div>
          <div>
            <Label htmlFor="language">{copy.language}</Label>
            <select id="language" className="h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4" {...form.register("language")}>
              {Object.entries(copy.languages).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          {showPromoCode ? (
            <div>
              <Label htmlFor="promoCode">{copy.promoCode}</Label>
              <Input
                id="promoCode"
                autoComplete="off"
                className="text-base"
                {...form.register("promoCode", {
                  onChange: (event) => rememberPromoCode(event.target.value),
                })}
              />
              <p className="mt-1 text-sm text-ink/60">{copy.promoHint}</p>
            </div>
          ) : null}
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1" {...form.register("consent")} />
            <span>{copy.consent} *</span>
          </label>
          <FieldError>{error("consent")}</FieldError>
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label>
              Company
              <input tabIndex={-1} autoComplete="off" {...form.register("company")} />
            </label>
          </div>
        </div>
      ) : null}

      {fail ? <p className="mt-4 text-sm text-terracotta-ink">{copy.fail}</p> : null}
      <div className="mt-8 flex flex-wrap gap-3">
        {step > 0 ? (
          <Button type="button" variant="outline" onClick={() => setStep((value) => value - 1)}>
            {copy.back}
          </Button>
        ) : null}
        {step < 2 ? (
          <Button type="button" onClick={goNext}>{copy.next}</Button>
        ) : (
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? copy.sending : copy.submit}
          </Button>
        )}
      </div>
    </form>
  );
}
