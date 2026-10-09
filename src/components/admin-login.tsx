"use client";

import { useActionState } from "react";
import { login, type ActionState } from "@/app/admin/actions";
import { useStudioCopy } from "@/components/studio-lang";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function LoginForm({ action }: { action: typeof login }) {
  const t = useStudioCopy();
  const [state, formAction, pending] = useActionState(action, null as ActionState);
  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <div>
        <Label htmlFor="password">{t.login.password}</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required className="text-base" />
      </div>
      {state?.error ? <p className="text-sm text-terracotta-ink">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? t.login.checking : t.login.enter}
      </Button>
    </form>
  );
}
