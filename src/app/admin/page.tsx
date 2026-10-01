import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/app/admin/actions";
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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.22em] text-ember uppercase">Oracle of Freedom</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl">Prices & offers</h1>
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
      </div>
      <div className="mt-8">
        <AdminPanel catalog={catalog} settings={settings} today={lisbonToday()} mode={storageMode()} />
      </div>
    </main>
  );
}
