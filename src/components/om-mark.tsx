import Image from "next/image";

export function OmMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <Image
      src="/images/brand/om-logo.png"
      alt=""
      width={128}
      height={128}
      className={className}
      unoptimized
      aria-hidden="true"
    />
  );
}
