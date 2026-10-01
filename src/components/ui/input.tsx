import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-ink/15 bg-white/70 px-4 text-base text-ink placeholder:text-ink/40",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-2xl border border-ink/15 bg-white/70 px-4 py-3 text-base text-ink placeholder:text-ink/40",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label className={cn("mb-2 block text-sm font-medium text-ink", className)} {...props} />
  );
}

export function FieldError({ id, children }: { id?: string; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1 text-sm text-terracotta-ink" role="alert">
      {children}
    </p>
  );
}
