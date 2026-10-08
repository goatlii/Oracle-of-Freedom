import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { OfflineBanner } from "@/components/offline-banner";

const links = [
  { href: "/admin", id: "today", label: "Hoy" },
  { href: "/admin/inquiries", id: "inquiries", label: "Solicitudes" },
  { href: "/admin/calendar", id: "calendar", label: "Agenda" },
  { href: "/admin/prices", id: "prices", label: "Precios" },
] as const;

export type StudioSection = (typeof links)[number]["id"];

export function AdminHeader({ current, title }: { current: StudioSection; title: string }) {
  return (
    <>
      <header className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs tracking-[0.22em] text-ember uppercase">Oracle of Freedom</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl">{title}</h1>
          <nav className="mt-4 hidden gap-2 md:flex" aria-label="Estudio">
            {links.map((link) => {
              const active = link.id === current;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "rounded-full bg-ink px-4 py-2 text-sm text-sand"
                      : "rounded-full px-4 py-2 text-sm text-ink/80 underline-offset-4 hover:underline"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm underline underline-offset-4">
            Salir
          </button>
        </form>
      </header>
      <OfflineBanner />
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-sand/95 px-1 pt-1 backdrop-blur-md md:hidden"
        style={{
          paddingBottom: "max(0.35rem, env(safe-area-inset-bottom))",
          paddingRight: "var(--studio-install-gap, 0px)",
        }}
        aria-label="Estudio"
      >
        <ul className="grid grid-cols-4">
          {links.map((link) => {
            const active = link.id === current;
            return (
              <li key={link.id}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "flex min-h-12 items-center justify-center px-0.5 text-center text-xs font-medium leading-tight text-terracotta-ink"
                      : "flex min-h-12 items-center justify-center px-0.5 text-center text-xs leading-tight text-ink/70"
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
