import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { OfflineBanner } from "@/components/offline-banner";
import { LanguageToggle } from "@/components/studio-lang";
import { studioCopy } from "@/lib/studio-copy";
import { studioLang } from "@/lib/studio-locale.server";

const sectionIds = [
  { href: "/admin", id: "today" },
  { href: "/admin/inquiries", id: "inquiries" },
  { href: "/admin/calendar", id: "calendar" },
  { href: "/admin/prices", id: "prices" },
] as const;

export type StudioSection = (typeof sectionIds)[number]["id"];

function TabIcon({ id }: { id: StudioSection }) {
  const common = { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, "aria-hidden": true } as const;
  if (id === "today") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
      </svg>
    );
  }
  if (id === "inquiries") {
    return (
      <svg {...common}>
        <path d="M4 6h16v12H4z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }
  if (id === "calendar") {
    return (
      <svg {...common}>
        <path d="M5 5h14v15H5z" />
        <path d="M8 3v4M16 3v4M5 10h14" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 3v18M16 7H9.5a2.5 2.5 0 0 0 0 5H14a2.5 2.5 0 0 1 0 5H7" />
    </svg>
  );
}

export async function AdminHeader({ current, title }: { current: StudioSection; title: string }) {
  const t = studioCopy(await studioLang());
  const links = sectionIds.map((link) => ({
    ...link,
    label: t.nav[link.id],
  }));

  return (
    <>
      <header>
        <div className="flex items-center justify-between gap-3 md:hidden">
          <h1 className="min-w-0 truncate font-serif text-2xl leading-none">{title}</h1>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageToggle />
            <form action={logout}>
              <button type="submit" className="min-h-11 px-1 text-sm underline underline-offset-4">
                {t.nav.logout}
              </button>
            </form>
          </div>
        </div>
        <div className="hidden items-end justify-between gap-4 md:flex">
          <div className="min-w-0">
            <p className="text-xs tracking-[0.22em] text-ember uppercase">Oracle of Freedom</p>
            <h1 className="mt-2 font-serif text-5xl">{title}</h1>
            <nav className="mt-4 flex gap-2" aria-label={t.nav.menu}>
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
          <div className="flex shrink-0 flex-col items-end gap-2">
            <LanguageToggle />
            <form action={logout}>
              <button type="submit" className="text-sm underline underline-offset-4">
                {t.nav.logout}
              </button>
            </form>
          </div>
        </div>
      </header>
      <OfflineBanner />
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-sand/95 backdrop-blur-md md:hidden"
        style={{ height: "var(--studio-nav)", paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label={t.nav.menu}
      >
        <ul className="grid h-full grid-cols-4">
          {links.map((link) => {
            const active = link.id === current;
            return (
              <li key={link.id}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "flex h-full min-h-12 flex-col items-center justify-center gap-0.5 text-terracotta-ink"
                      : "flex h-full min-h-12 flex-col items-center justify-center gap-0.5 text-ink/70"
                  }
                >
                  <TabIcon id={link.id} />
                  <span className="text-[11px] leading-none">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
