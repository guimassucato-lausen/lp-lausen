"use client";

import { useRef } from "react";
import { useMessages, useTranslations } from "next-intl";
import { FileCheck2, MessagesSquare, Rocket } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { QuoteTicket } from "@/components/visuals/QuoteTicket";

const ICONS = [FileCheck2, MessagesSquare, Rocket];

export function HowItWorks() {
  const t = useTranslations("how");
  const { how } = useMessages() as { how: { steps: { title: string; desc: string }[] } };
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
      if (prefersReducedMotion()) {
        steps.forEach((s) => s.classList.add("is-active"));
        return;
      }
      gsap.fromTo(
        "[data-line]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-steps]", start: "top 60%", end: "bottom 60%", scrub: 0.6 },
        },
      );
      steps.forEach((s) => {
        gsap.fromTo(
          s.querySelector("[data-step-body]"),
          { x: 30 },
          {
            x: 0,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: {
              trigger: s,
              start: "top 62%",
              toggleActions: "play none none reverse",
              toggleClass: "is-active",
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="como-funciona" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <span data-reveal="fade" className="eyebrow">
            {t("eyebrow")}
          </span>
          <SplitHeading className="h-display mt-5 text-4xl text-ice md:text-5xl lg:text-6xl">{t("title")}</SplitHeading>
          <div data-reveal="scale" className="relative mt-12 hidden lg:block" aria-hidden>
            <QuoteTicket />
          </div>
        </div>

        <div data-steps className="relative">
          <div aria-hidden className="absolute bottom-8 left-[27px] top-8 w-px bg-white/10 md:left-[31px]">
            <div data-line className="h-full w-full origin-top bg-gradient-to-b from-brand-300 via-brand to-brand-700 shadow-[0_0_16px_rgb(107_70_255/0.8)]" />
          </div>
          <ol className="relative">
          {how.steps.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <li key={s.title} data-step className="group relative flex gap-6 pb-16 last:pb-0 md:gap-8 md:pb-24">
                <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-surface-2 text-mist transition-all duration-700 group-[.is-active]:border-brand group-[.is-active]:bg-brand group-[.is-active]:text-white group-[.is-active]:shadow-[0_0_40px_rgb(107_70_255/0.6)] md:size-16">
                  <Icon className="size-6" strokeWidth={1.7} />
                </span>
                <div data-step-body className="pt-2">
                  <h3 className="h-display text-2xl text-mist transition-colors duration-700 group-[.is-active]:text-ice md:text-4xl">{s.title}</h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-mist md:text-lg">{s.desc}</p>
                </div>
              </li>
            );
          })}
          </ol>
        </div>
      </div>
    </section>
  );
}
