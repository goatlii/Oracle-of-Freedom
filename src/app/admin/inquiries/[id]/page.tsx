import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { setInquiryStatus } from "@/app/admin/inquiries/actions";
import { en } from "@/content/en";
import { es } from "@/content/es";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/admin-auth";
import { readInquiries } from "@/lib/inquiry-store";
import { inquiryWhen, studioCopy } from "@/lib/studio-copy";
import { studioLang } from "@/lib/studio-locale.server";

export const dynamic = "force-dynamic";

export default async function InquiryPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const lang = await studioLang();
  const t = studioCopy(lang);
  const services = (lang === "en" ? en : es).form.services;
  const { id } = await params;
  const inquiry = (await readInquiries()).find((item) => item.id === id);
  if (!inquiry) notFound();
  const service =
    inquiry.service in services ? services[inquiry.service as keyof typeof services] : inquiry.serviceLabel;
  const phone = inquiry.phone.replace(/\D/g, "");
  const note = t.inquiries.whatsapp(inquiry.name, service);
  const whatsapp = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(note)}` : "";

  return (
    <main className="studio-page-reply mx-auto max-w-3xl px-4 py-4 md:py-12">
      <AdminHeader current="inquiries" title={inquiry.name} />
      <Link href="/admin/inquiries" className="mt-3 inline-flex min-h-11 items-center text-sm underline underline-offset-4">
        {t.inquiries.back}
      </Link>
      <article className="mt-4">
        <p className="text-xs tracking-[0.14em] text-ember uppercase">{service}</p>
        <p className="mt-3 whitespace-pre-wrap text-lg text-ink/85">{inquiry.story || t.inquiries.noStory}</p>
        <dl className="mt-5 grid gap-3 text-sm">
          <div>
            <dt className="text-ink/50">{t.inquiries.email}</dt>
            <dd>{inquiry.email}</dd>
          </div>
          <div>
            <dt className="text-ink/50">{t.inquiries.phone}</dt>
            <dd>{inquiry.phone || t.inquiries.noPhone}</dd>
          </div>
          <div>
            <dt className="text-ink/50">{t.inquiries.date}</dt>
            <dd>{inquiryWhen(inquiry.when, t)}</dd>
          </div>
          <div>
            <dt className="text-ink/50">{t.inquiries.place}</dt>
            <dd>{inquiry.place}</dd>
          </div>
          <div>
            <dt className="text-ink/50">{t.inquiries.clientLanguage}</dt>
            <dd>{t.inquiries.languages[inquiry.language] || inquiry.languageLabel}</dd>
          </div>
          <div>
            <dt className="text-ink/50">{t.inquiries.budget}</dt>
            <dd>{inquiry.budgetLabel}</dd>
          </div>
        </dl>
      </article>
      <div className="studio-dock border-t border-ink/10 bg-sand/95 px-4 py-3 md:mt-6 md:border-0 md:bg-transparent md:px-0">
        {whatsapp ? (
          <Button asChild className="min-h-12 w-full">
            <a href={whatsapp}>WhatsApp</a>
          </Button>
        ) : (
          <Button asChild className="min-h-12 w-full">
            <a href={`mailto:${inquiry.email}?subject=${encodeURIComponent("Oracle of Freedom")}`}>Email</a>
          </Button>
        )}
        <div className="mt-2 flex gap-2">
          {whatsapp ? (
            <Button asChild variant="outline" className="h-auto min-h-12 flex-1 whitespace-normal px-3 text-sm leading-tight">
              <a href={`mailto:${inquiry.email}?subject=${encodeURIComponent("Oracle of Freedom")}`}>Email</a>
            </Button>
          ) : null}
          {inquiry.status !== "replied" ? (
            <form action={setInquiryStatus} className="flex-1">
              <input type="hidden" name="id" value={inquiry.id} />
              <input type="hidden" name="status" value="replied" />
            <Button type="submit" variant="outline" className="h-auto min-h-12 w-full whitespace-normal px-3 text-sm leading-tight">
              {t.inquiries.replied}
            </Button>
            </form>
          ) : null}
          {inquiry.status !== "archived" ? (
            <form action={setInquiryStatus} className="flex-1">
              <input type="hidden" name="id" value={inquiry.id} />
              <input type="hidden" name="status" value="archived" />
            <Button type="submit" variant="outline" className="h-auto min-h-12 w-full whitespace-normal px-3 text-sm leading-tight">
              {t.inquiries.archive}
            </Button>
            </form>
          ) : (
            <form action={setInquiryStatus} className="flex-1">
              <input type="hidden" name="id" value={inquiry.id} />
              <input type="hidden" name="status" value="new" />
            <Button type="submit" variant="outline" className="h-auto min-h-12 w-full whitespace-normal px-3 text-sm leading-tight">
              {t.inquiries.restore}
            </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
