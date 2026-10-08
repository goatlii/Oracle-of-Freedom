import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin-header";
import { isAdmin } from "@/lib/admin-auth";
import { type InquiryStatus } from "@/lib/inquiries";
import { readInquiries } from "@/lib/inquiry-store";

export const dynamic = "force-dynamic";

const filters: { id: InquiryStatus; label: string }[] = [
  { id: "new", label: "Nuevas" },
  { id: "replied", label: "Hechas" },
  { id: "archived", label: "Archivo" },
];

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { estado } = await searchParams;
  const status: InquiryStatus = estado === "replied" || estado === "archived" ? estado : "new";
  const inquiries = (await readInquiries()).filter((item) => item.status === status);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-28 md:py-12 md:pb-12">
      <AdminHeader current="inquiries" title="Solicitudes" />
      <div className="mt-6 flex gap-2 overflow-x-auto" role="navigation" aria-label="Filtro">
        {filters.map((filter) => {
          const active = filter.id === status;
          return (
            <Link
              key={filter.id}
              href={filter.id === "new" ? "/admin/inquiries" : `/admin/inquiries?estado=${filter.id}`}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "rounded-full bg-ink px-4 py-2 text-sm text-sand"
                  : "rounded-full bg-white/70 px-4 py-2 text-sm"
              }
            >
              {filter.label}
            </Link>
          );
        })}
      </div>
      <ul className="mt-6 grid gap-3">
        {inquiries.length === 0 ? (
          <li className="text-sm text-ink/60">No hay solicitudes en esta lista.</li>
        ) : null}
        {inquiries.map((item) => (
          <li key={item.id}>
            <Link href={`/admin/inquiries/${item.id}`} className="block rounded-3xl bg-white/80 px-4 py-4">
              <span className="text-xs tracking-[0.14em] text-ember uppercase">
                {item.status === "new" ? "Nueva" : item.status === "replied" ? "Respondida" : "Archivada"}
              </span>
              <span className="mt-1 block font-medium">{item.name}</span>
              <span className="mt-1 block text-sm text-ink/65">
                {item.serviceLabel} · {item.when}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
