"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

const LANGUAGES: Record<Locale, { label: string; short: string }> = {
  pt: { label: "Português", short: "PT" },
  en: { label: "English", short: "EN" },
};

/** Dropdown com os idiomas disponíveis (lista vem de routing.locales). */
export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={LANGUAGES[locale].label}
        className={cn(
          "flex h-10 items-center gap-1.5 rounded-full px-3 font-display text-xs font-semibold text-mist transition-colors hover:bg-white/5 hover:text-white",
          open && "bg-white/5 text-white",
        )}
      >
        <Globe className="size-4" />
        {LANGUAGES[locale].short}
        <ChevronDown className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full z-50 mt-2 min-w-44 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-surface-2/95 p-1.5 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.9)] backdrop-blur-xl"
          >
            {routing.locales.map((l) => {
              const active = l === locale;
              return (
                <li key={l} role="option" aria-selected={active}>
                  <Link
                    href={pathname}
                    locale={l}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-sm transition-colors",
                      active ? "bg-brand/15 text-white" : "text-mist hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 font-display text-xs font-semibold text-slate">{LANGUAGES[l].short}</span>
                      {LANGUAGES[l].label}
                    </span>
                    {active && <Check className="size-4 text-brand-300" />}
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
