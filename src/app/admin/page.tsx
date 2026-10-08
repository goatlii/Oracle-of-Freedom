import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin-header";
import { AdminPanel } from "@/components/admin-panel";
import { isAdmin } from "@/lib/admin-auth";
import { catalog, lisbonToday } from "@/lib/pricing";
import { readStored, storageMode } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const settings = await readStored();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <AdminHeader current="prices" title="Prices & offers" />
      <div className="mt-8">
        <AdminPanel catalog={catalog} settings={settings} today={lisbonToday()} mode={storageMode()} />
      </div>
    </main>
  );
}
