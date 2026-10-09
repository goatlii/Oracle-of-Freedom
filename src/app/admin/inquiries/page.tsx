import Link from "next/link";
import { redirect } from "next/navigation";
import { en } from "@/content/en";
import { es } from "@/content/es";
import { AdminHeader } from "@/components/admin-header";
import { isAdmin } from "@/lib/admin-auth";
import { type InquiryStatus } from "@/lib/inquiries";
import { readInquiries } from "@/lib/inquiry-store";
import { inquiryWhen, studioCopy } from "@/lib/studio-copy";
import { studioLang } from "@/lib/studio-locale.server";

export const dynamic = "force-dynamic";

const filterIds: InquiryStatus[] = ["new", "replied", "archived"];

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const lang = await studioLang();
  const t = studioCopy(lang);
  const services = (lang === "en" ? en : es).form.services;
  const { estado } = await searchParams;
  const status: InquiryStatus = estado === "replied" || estado === "archived" ? estado : "new";
  const inquiries = (await readInquiries()).filter((item) => item.status === status);

  return (
    <main className="studio-page mx-auto max-w-3xl px-4 py-4 md:py-12">
      <AdminHeader current="inquiries" title={t.inquiries.title} />
      <div className="mt-6 flex gap-2 overflow-x-auto" role="navigation" aria-label={t.inquiries.filter}>
        {filterIds.map((id) => {
          const active = id === status;
          return (
            <Link
              key={id}
              href={id === "new" ? "/admin/inquiries" : `/admin/inquiries?estado=${id}`}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "inline-flex min-h-12 shrink-0 items-center rounded-full bg-ink px-4 text-sm text-sand"
                  : "inline-flex min-h-12 shrink-0 items-center rounded-full bg-white/70 px-4 text-sm"
              }
            >
              {t.inquiries.filters[id]}
            </Link>
          );
        })}
      </div>
      <ul className="mt-6 grid gap-3">
        {inquiries.length === 0 ? (
          <li className="text-sm text-ink/60">{t.inquiries.empty}</li>
        ) : null}
        {inquiries.map((item) => (
          <li key={item.id}>
            <Link href={`/admin/inquiries/${item.id}`} className="block rounded-3xl bg-white/80 px-4 py-4">
              <span className="text-xs tracking-[0.14em] text-ember uppercase">
                {t.inquiries.badge[item.status]}
              </span>
              <span className="mt-1 block font-medium">{item.name}</span>
              <span className="mt-1 block text-sm text-ink/65">
                {(item.service in services ? services[item.service as keyof typeof services] : item.serviceLabel)} · {inquiryWhen(item.when, t)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
