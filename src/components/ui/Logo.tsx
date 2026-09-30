import Image from "next/image";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/img/lausen-logo-site.png"
      alt="Lausen"
      width={839}
      height={211}
      priority
      className={cn("h-7 w-auto", className)}
    />
  );
}
