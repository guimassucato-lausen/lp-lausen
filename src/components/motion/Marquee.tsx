import { cn } from "@/lib/cn";

type Props = { items: React.ReactNode[]; duration?: number; reverse?: boolean; className?: string };

/** Faixa infinita em CSS puro (duplica o conteúdo e translada -50%). */
export function Marquee({ items, duration = 40, reverse, className }: Props) {
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={hidden}>
      {items.map((item, i) => (
        <li key={i} className="flex shrink-0 items-center gap-12">
          {item}
          <span className="size-1.5 rounded-full bg-gold/70" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(
        "group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
        style={{ "--marquee-duration": `${duration}s`, animationDirection: reverse ? "reverse" : undefined } as React.CSSProperties}
      >
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
