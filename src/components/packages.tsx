import { Link } from "@/i18n/navigation";
import type { PackageCopy } from "@/content/types";
import { TokenText } from "@/components/token-text";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { Button } from "@/components/ui/button";
import { formatEuro, formatFrom } from "@/lib/content";
import type { PricedPackage } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function FromPrice({
  locale,
  item,
  offer,
  className,
  mutedClassName,
}: {
  locale: string;
  item: Pick<PricedPackage, "custom" | "listFrom" | "promoFrom" | "unit" | "promoName" | "addon">;
  offer?: string;
  className?: string;
  mutedClassName?: string;
}) {
  if (item.custom || item.listFrom == null) {
    return (
      <p className={className}>
        {locale === "en" ? "Tailored quote" : locale === "es" ? "Presupuesto a medida" : "Orçamento à medida"}
      </p>
    );
  }
  const onOffer = item.promoFrom != null && item.promoFrom < item.listFrom;
  const addon = Boolean(item.addon);
  if (!onOffer) {
    return <p className={className}>{formatFrom(locale, item.listFrom, item.unit, addon)}</p>;
  }
  return (
    <p className={className}>
      <span className={cn("line-through", mutedClassName)}>{formatFrom(locale, item.listFrom, item.unit, addon)}</span>
      <span className="mt-1 block">
        {formatFrom(locale, item.promoFrom, item.unit, addon)}
        {offer ? <span className="ml-2 text-xs font-semibold tracking-[0.14em] uppercase">{offer}</span> : null}
      </span>
    </p>
  );
}

export function PackageCards({
  locale,
  items,
  copy,
  cta,
  offer,
  saveTemplate,
  personalizeCta,
  whatsappText,
  whatsappLabel,
  codeLabel,
  wishLabel,
}: {
  locale: string;
  items: PricedPackage[];
  copy: Record<string, PackageCopy>;
  cta: string;
  offer: string;
  saveTemplate: string;
  personalizeCta?: string;
  whatsappText?: string;
  whatsappLabel?: string;
  codeLabel?: string;
  wishLabel?: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const text = copy[item.id];
        if (!text) return null;
        return (
          <article
            key={item.id}
            className={cn(
              "flex flex-col rounded-3xl border bg-white/50 p-6",
              item.loved ? "border-ember shadow-[0_0_0_1px_#d9913a]" : "border-ink/10",
            )}
          >
            {text.badge ? (
              <p className="text-xs font-semibold tracking-[0.14em] text-ember uppercase">★ {text.badge}</p>
            ) : null}
            {item.promoName ? (
              <p className="mt-2 text-xs font-semibold tracking-[0.14em] text-terracotta-ink uppercase">{item.promoName}</p>
            ) : null}
            <h3 className="mt-2 font-serif text-3xl">{text.name}</h3>
            <FromPrice locale={locale} item={item} offer={offer} className="mt-2 text-lg text-terracotta-ink" mutedClassName="text-ink/40" />
            {item.save ? (
              <p className="mt-1 text-sm text-moss">{saveTemplate.replace("{amount}", formatEuro(locale, item.save))}</p>
            ) : null}
            <ul className="mt-4 flex-1 space-y-2 text-sm text-ink/80">
              {text.items.map((line) => (
                <li key={line}>
                  <TokenText text={line} />
                </li>
              ))}
            </ul>
            {item.personalize && personalizeCta ? (
              <div className="mt-6 flex flex-col items-start gap-3">
                <Button asChild>
                  <Link href={{ pathname: "/inquire", query: { service: item.inquiry, package: item.id } }}>
                    {personalizeCta}
                  </Link>
                </Button>
                {whatsappText && whatsappLabel ? (
                  <WhatsAppLink
                    text={whatsappText}
                    codeLabel={codeLabel || "Promo code"}
                    wishLabel={wishLabel}
                    className="text-sm font-medium text-terracotta-ink underline underline-offset-4"
                  >
                    {whatsappLabel}
                  </WhatsAppLink>
                ) : null}
              </div>
            ) : (
              <Link
                href={{ pathname: "/inquire", query: { service: item.inquiry, package: item.id } }}
                className="mt-6 inline-flex text-sm font-medium text-terracotta-ink underline underline-offset-4"
              >
                {cta}
              </Link>
            )}
          </article>
        );
      })}
    </div>
  );
}
