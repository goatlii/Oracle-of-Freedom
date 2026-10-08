import { Link } from "@/i18n/navigation";
import type { PackageCopy } from "@/content/types";
import { TokenText } from "@/components/token-text";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { Button } from "@/components/ui/button";
import { formatEuro, formatFrom } from "@/lib/content";
import { packageDelivery, resolvePackageItems } from "@/lib/delivery";
import type { LiveSettings, PricedPackage } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function FromPrice({
  locale,
  item,
  offer,
  className,
  mutedClassName,
}: {
  locale: string;
  item: Pick<PricedPackage, "custom" | "listFrom" | "promoFrom" | "unit" | "promoName" | "kind" | "to" | "plus">;
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
  const promoFrom = item.promoFrom;
  const listFrom = item.listFrom;
  const onOffer = promoFrom != null && listFrom != null && promoFrom < listFrom;
  const addon = item.kind === "addon";
  const guide = { to: item.to, plus: item.plus };
  const offerGuide =
    onOffer && item.to != null && promoFrom != null && listFrom != null && listFrom > 0
      ? { to: Math.max(promoFrom, Math.round((item.to * promoFrom) / listFrom)), plus: item.plus }
      : guide;
  if (!onOffer) {
    return <p className={className}>{formatFrom(locale, item.listFrom, item.unit, addon, guide)}</p>;
  }
  return (
    <p className={className}>
      <span className={cn("line-through", mutedClassName)}>{formatFrom(locale, item.listFrom, item.unit, addon, guide)}</span>
      <span className="mt-1 block">
        {formatFrom(locale, item.promoFrom, item.unit, addon, offerGuide)}
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
  className,
  deliveries,
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
  className?: string;
  deliveries?: LiveSettings["deliveries"];
}) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-3", className)}>
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
              {resolvePackageItems(text.items, packageDelivery(deliveries, item.id, locale)).map((line, index) => (
                <li key={`${item.id}-${index}`}>
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
