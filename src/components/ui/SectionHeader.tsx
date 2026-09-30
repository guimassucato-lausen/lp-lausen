import { SplitHeading } from "@/components/motion/SplitHeading";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({ eyebrow, title, subtitle, align = "left", className }: Props) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <span data-reveal="fade" className="eyebrow">
        {eyebrow}
      </span>
      <SplitHeading className="h-display mt-5 text-4xl text-ice md:text-5xl lg:text-6xl">{title}</SplitHeading>
      {subtitle && (
        <p data-reveal data-delay="0.15" className="mt-6 text-base leading-relaxed text-mist md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
