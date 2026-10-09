import { redirect } from "next/navigation";
import { login } from "@/app/admin/actions";
import { LoginForm } from "@/components/admin-login";
import { LanguageToggle } from "@/components/studio-lang";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { studioCopy } from "@/lib/studio-copy";
import { studioLang } from "@/lib/studio-locale.server";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  const t = studioCopy(await studioLang());
  return (
    <main className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <div className="absolute top-4 right-4" style={{ top: "max(1rem, env(safe-area-inset-top))" }}>
        <LanguageToggle />
      </div>
      <p className="text-xs tracking-[0.22em] text-ember uppercase">Oracle of Freedom</p>
      <h1 className="mt-3 font-serif text-4xl">{t.login.title}</h1>
      {adminConfigured() ? (
        <>
          <p className="mt-3 text-ink/70">{t.login.intro}</p>
          <LoginForm action={login} />
        </>
      ) : (
        <p className="mt-4 rounded-2xl bg-clay p-4 text-sm">{t.login.closed}</p>
      )}
    </main>
  );
}
