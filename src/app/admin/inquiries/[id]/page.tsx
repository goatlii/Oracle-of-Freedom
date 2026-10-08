import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { setInquiryStatus } from "@/app/admin/inquiries/actions";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/admin-auth";
import { readInquiries } from "@/lib/inquiry-store";

export const dynamic = "force-dynamic";

export default async function InquiryPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const inquiry = (await readInquiries()).find((item) => item.id === id);
  if (!inquiry) notFound();
  const phone = inquiry.phone.replace(/\D/g, "");
  const note = `Hola ${inquiry.name}, soy Agota de Oracle of Freedom. He leído tu mensaje sobre ${inquiry.serviceLabel}.`;
  const whatsapp = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(note)}` : "";

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-28 md:py-12 md:pb-12">
      <AdminHeader current="inquiries" title="Solicitud" />
      <Link href="/admin/inquiries" className="mt-4 inline-block text-sm underline underline-offset-4">
        Volver a la lista
      </Link>
      <article className="mt-6 rounded-3xl bg-white/80 p-5">
        <p className="text-xs tracking-[0.14em] text-ember uppercase">{inquiry.serviceLabel}</p>
        <h2 className="mt-2 font-serif text-4xl">{inquiry.name}</h2>
        <dl className="mt-5 grid gap-3 text-sm">
          <div>
            <dt className="text-ink/50">Email</dt>
            <dd>{inquiry.email}</dd>
          </div>
          <div>
            <dt className="text-ink/50">Teléfono</dt>
            <dd>{inquiry.phone || "No lo dejó"}</dd>
          </div>
          <div>
            <dt className="text-ink/50">Fecha</dt>
            <dd>{inquiry.when}</dd>
          </div>
          <div>
            <dt className="text-ink/50">Lugar</dt>
            <dd>{inquiry.place}</dd>
          </div>
          <div>
            <dt className="text-ink/50">Idioma</dt>
            <dd>{inquiry.languageLabel}</dd>
          </div>
          <div>
            <dt className="text-ink/50">Presupuesto</dt>
            <dd>{inquiry.budgetLabel}</dd>
          </div>
        </dl>
        <p className="mt-5 whitespace-pre-wrap text-ink/80">{inquiry.story || "No escribió una historia."}</p>
      </article>
      <div className="mt-4 grid gap-3">
        {whatsapp ? (
          <Button asChild className="w-full">
            <a href={whatsapp}>WhatsApp</a>
          </Button>
        ) : (
          <Button type="button" disabled className="w-full">
            WhatsApp · sin teléfono
          </Button>
        )}
        <Button asChild variant="outline" className="w-full">
          <a href={`mailto:${inquiry.email}?subject=${encodeURIComponent("Oracle of Freedom")}`}>Email</a>
        </Button>
        {inquiry.status !== "replied" ? (
          <form action={setInquiryStatus}>
            <input type="hidden" name="id" value={inquiry.id} />
            <input type="hidden" name="status" value="replied" />
            <Button type="submit" variant="outline" className="w-full">
              Marcar respondida
            </Button>
          </form>
        ) : null}
        {inquiry.status !== "archived" ? (
          <form action={setInquiryStatus}>
            <input type="hidden" name="id" value={inquiry.id} />
            <input type="hidden" name="status" value="archived" />
            <Button type="submit" variant="outline" className="w-full">
              Archivar
            </Button>
          </form>
        ) : (
          <form action={setInquiryStatus}>
            <input type="hidden" name="id" value={inquiry.id} />
            <input type="hidden" name="status" value="new" />
            <Button type="submit" variant="outline" className="w-full">
              Devolver a nuevas
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
