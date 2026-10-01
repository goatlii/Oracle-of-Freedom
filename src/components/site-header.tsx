"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NavItem = { href: StaticPathname; label: string };

export function SiteHeader({
  locale,
  items,
  inquire,
  menuLabel,
  closeLabel,
  homeLabel,
}: {
  locale: string;
  items: NavItem[];
  inquire: { href: StaticPathname; label: string };
  menuLabel: string;
  closeLabel: string;
  homeLabel: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-sand/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:h-20 md:px-6">
        <Link href="/" className="font-serif text-lg leading-none text-ink md:text-xl" aria-label={homeLabel}>
          Oracle of Freedom
        </Link>
        <nav className="ml-auto hidden items-center gap-5 lg:flex" aria-label="Main">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm text-ink/80 hover:text-terracotta-ink",
                pathname === item.href && "text-terracotta-ink",
              )}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden lg:ml-2 lg:block">
          <LanguageSwitcher locale={locale} />
        </div>
        <Button asChild size="sm" className="hidden lg:inline-flex">
          <Link href={inquire.href}>{inquire.label}</Link>
        </Button>
        <button
          type="button"
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
          <span className="sr-only">{open ? closeLabel : menuLabel}</span>
        </button>
      </div>
      {open ? (
        <div id="mobile-menu" className="grain bg-night text-sand lg:hidden">
          <nav className="relative z-10 flex flex-col gap-1 px-6 py-6" aria-label="Main">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-white/10 py-3 font-serif text-3xl"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-6 flex items-center justify-between">
              <LanguageSwitcher locale={locale} tone="light" />
              <Button asChild variant="light">
                <Link href={inquire.href} onClick={() => setOpen(false)}>
                  {inquire.label}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
