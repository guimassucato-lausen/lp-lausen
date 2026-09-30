import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "light";
type Size = "md" | "lg";

type Common = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

type AsLink = Common & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type AsButton = Common & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-display font-semibold tracking-tight transition-[transform,box-shadow,background-color,color] duration-300 ease-out-expo focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-[0_10px_40px_-8px_rgb(107_70_255/0.7),inset_0_1px_0_rgb(255_255_255/0.25)] hover:shadow-[0_14px_60px_-6px_rgb(107_70_255/0.9),inset_0_1px_0_rgb(255_255_255/0.3)] hover:-translate-y-0.5",
  ghost: "glass text-ice hover:bg-white/10 hover:-translate-y-0.5",
  light: "bg-ice text-navy hover:bg-white hover:-translate-y-0.5 shadow-[0_10px_40px_-10px_rgb(232_246_255/0.5)]",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-[0.95rem]",
};

function Inner({ children, arrow }: { children: React.ReactNode; arrow?: boolean }) {
  return (
    <>
      {/* brilho que atravessa no hover */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out-expo group-hover/btn:translate-x-full" />
      <span className="relative">{children}</span>
      {arrow && (
        <span className="relative grid size-5 place-items-center overflow-hidden">
          <ArrowUpRight className="size-4 transition-transform duration-500 ease-out-expo group-hover/btn:-translate-y-5 group-hover/btn:translate-x-5" />
          <ArrowUpRight className="absolute size-4 -translate-x-5 translate-y-5 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
        </span>
      )}
    </>
  );
}

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", arrow, className, children, ...rest } = props;
  const cls = cn(base, variants[variant], sizes[size], className);

  if (rest.href !== undefined) {
    return (
      <a className={cls} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        <Inner arrow={arrow}>{children}</Inner>
      </a>
    );
  }
  return (
    <button className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
}
