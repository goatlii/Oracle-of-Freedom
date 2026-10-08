import Link from "next/link";
import { logout } from "@/app/admin/actions";

const links = [
  { href: "/admin", id: "prices", label: "Prices" },
  { href: "/admin/calendar", id: "calendar", label: "Calendar" },
] as const;

export function AdminHeader({
  current,
  title,
}: {
  current: (typeof links)[number]["id"];
  title: string;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs tracking-[0.22em] text-ember uppercase">Oracle of Freedom</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">{title}</h1>
        <nav className="mt-4 flex gap-2" aria-label="Studio">
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
      <div className="flex items-center gap-4 text-sm">
        <Link href="/" className="underline underline-offset-4">
          View the site
        </Link>
        <form action={logout}>
          <button type="submit" className="underline underline-offset-4">
            Log out
          </button>
        </form>
      </div>
    </header>
  );
}
