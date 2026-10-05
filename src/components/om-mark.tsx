import Image from "next/image";

export function OmMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <Image
      src="/images/brand/om-logo.png"
      alt=""
      width={247}
      height={247}
      className={className}
      unoptimized
      aria-hidden="true"
    />
  );
}
