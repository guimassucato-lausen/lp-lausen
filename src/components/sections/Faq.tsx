"use client";

import { useState } from "react";
import { useMessages, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/cn";

export function Faq() {
  const t = useTranslations("faq");
  const { faq } = useMessages() as { faq: { items: { q: string; a: string }[] } };
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} className="lg:sticky lg:top-32 lg:self-start" />
        <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} data-reveal="up" data-delay={i * 0.05}>
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className={cn("font-display text-lg font-medium transition-colors md:text-xl", isOpen ? "text-ice" : "text-mist group-hover:text-ice")}>
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-out-expo",
                        isOpen ? "rotate-45 border-brand bg-brand text-white" : "border-white/15 text-mist group-hover:border-white/40",
                      )}
                    >
                      <Plus className="size-4" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      onAnimationComplete={() => ScrollTrigger.refresh()}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-7 pr-14 leading-relaxed text-mist">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
