import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-terracotta text-white hover:bg-[#9a4522]",
        light: "bg-sand text-ink hover:bg-white",
        ghost: "border border-white/70 text-white hover:bg-white/10",
        outline: "border border-ink/20 text-ink hover:border-terracotta hover:text-terracotta-ink",
        moss: "bg-moss text-sand hover:bg-[#36442d]",
      },
      size: {
        default: "h-12 px-6 text-base",
        sm: "h-10 px-4 text-sm",
        lg: "h-14 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
