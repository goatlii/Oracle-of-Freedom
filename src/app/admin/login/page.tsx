import { redirect } from "next/navigation";
import { login } from "@/app/admin/actions";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { LoginForm } from "@/components/admin-login";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <p className="text-xs tracking-[0.22em] text-ember uppercase">Oracle of Freedom</p>
      <h1 className="mt-3 font-serif text-4xl">Studio</h1>
      {adminConfigured() ? (
        <>
          <p className="mt-3 text-ink/70">Enter the password to manage prices, delivery times, offers and the calendar.</p>
          <LoginForm action={login} />
        </>
      ) : (
        <p className="mt-4 rounded-2xl bg-clay p-4 text-sm">
          This page is locked until <span className="font-medium">ADMIN_PASSWORD</span> is added in Vercel and the site is redeployed.
        </p>
      )}
    </main>
  );
}
