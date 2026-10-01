import { getSettings } from "@/lib/offers";
import { liveBanners } from "@/lib/pricing";

export async function PromoBanner({ locale }: { locale: string }) {
  const settings = await getSettings();
  const lang = locale === "es" || locale === "pt" ? locale : "en";
  const lines = liveBanners(settings)
    .map((promo) => promo.banner[lang].trim())
    .filter(Boolean);
  if (!lines.length) return null;
  return (
    <div className="bg-terracotta px-4 py-2 text-center text-sm text-sand">
      {lines.join(" · ")}
    </div>
  );
}
