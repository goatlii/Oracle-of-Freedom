import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin-header";
import { AdminPanel } from "@/components/admin-panel";
import { isAdmin } from "@/lib/admin-auth";
import { defaultTiming, TIMING_FIELDS } from "@/lib/delivery";
import { deliveryDefaults } from "@/lib/delivery-copy";
import { catalog, lisbonToday } from "@/lib/pricing";
import { readStored, storageMode } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PricesPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const settings = await readStored();
  const defaults = deliveryDefaults();
  for (const [id, row] of Object.entries(settings.deliveries ?? {})) {
    const current = defaults[id] ?? { en: "", es: "", pt: "" };
    defaults[id] = {
      en: row.en || current.en,
      es: row.es || current.es,
      pt: row.pt || current.pt,
    };
  }
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-44 md:py-12 md:pb-12">
      <AdminHeader current="prices" title="Precios" />
      <div className="mt-8">
        <AdminPanel
          catalog={catalog}
          settings={settings}
          today={lisbonToday()}
          mode={storageMode()}
          timingFields={TIMING_FIELDS.map((field) => ({
            key: field.key,
            token: field.token,
            label: field.label,
            hint: field.hint,
            value: settings.timings?.[field.key] ?? defaultTiming(field.key),
          }))}
          deliveryDefaults={defaults}
        />
      </div>
    </main>
  );
}
