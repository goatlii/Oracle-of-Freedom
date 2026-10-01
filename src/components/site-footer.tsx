import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/language-switcher";
import { settings, whatsappHref } from "@/lib/content";
import { isPlaceholder } from "@/lib/utils";

export function SiteFooter({
  locale,
  blurb,
  whatsappLabel,
  privacyLabel,
  rights,
}: {
  locale: string;
  blurb: string;
  whatsappLabel: string;
  privacyLabel: string;
  rights: string;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="grain bg-night text-sand">
      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-[1.4fr_1fr] md:px-6">
        <div>
          <p className="font-serif text-3xl">Oracle of Freedom</p>
          <p className="mt-3 max-w-md text-sand/75">{blurb}</p>
        </div>
        <div className="space-y-2 text-sm text-sand/80">
          <p>
            <a className="underline decoration-white/30 underline-offset-4 hover:text-white" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
          </p>
          <p>
            <a
              className="underline decoration-white/30 underline-offset-4 hover:text-white"
              href={settings.instagramUrl}
              rel="noopener noreferrer"
            >
              Instagram @{settings.instagram}
            </a>
          </p>
          <p>
            <a className="underline decoration-white/30 underline-offset-4 hover:text-white" href={whatsappHref(whatsappLabel)}>
              WhatsApp{" "}
              <span className={isPlaceholder(settings.whatsappDisplay) || settings.whatsappIsPlaceholder ? "placeholder-chip" : undefined}>
                {settings.whatsappDisplay}
                {settings.whatsappIsPlaceholder ? " · PLACEHOLDER" : ""}
              </span>
            </a>
          </p>
          <div className="pt-3">
            <LanguageSwitcher locale={locale} tone="light" />
          </div>
          <p className="pt-3">
            <Link href={"/privacy" as StaticPathname} className="underline decoration-white/30 underline-offset-4 hover:text-white">
              {privacyLabel}
            </Link>
          </p>
        </div>
      </div>
      <p className="relative z-10 border-t border-white/10 px-4 py-4 text-center text-xs text-sand/50 md:px-6">
        © {year} {settings.founder}. {rights}
      </p>
    </footer>
  );
}
