"use client";

import { useRef } from "react";
import { useMessages, useTranslations } from "next-intl";
import { Building2, Headset, Landmark, ShieldCheck, Zap } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Orbits } from "@/components/visuals/Orbits";

const ICONS = [Landmark, Zap, Headset, ShieldCheck, Building2];

export function WhyLausen() {
  const t = useTranslations("why");
  const { why } = useMessages() as { why: { cards: { title: string; desc: string }[] } };
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();

      // desktop: seção fixa com scroll horizontal dos cards
      mm.add("(min-width: 1024px)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - el.clientWidth;
        const tween = gsap.to(el.children, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.3}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.to("[data-why-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance() + window.innerHeight * 0.3}`, scrub: true },
        });
        gsap.to("[data-knot]", {
          rotate: 60,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: () => `+=${distance() + window.innerHeight * 2}`, scrub: true },
        });
        return () => tween.scrollTrigger?.kill();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="por-que" className="relative scroll-mt-24 overflow-hidden py-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pb-10 lg:pt-28">
      <div data-knot className="pointer-events-none absolute -right-16 top-6 hidden w-[340px] opacity-80 md:block lg:top-20 xl:right-[6%]">
        <Orbits />
      </div>

      <div className="container-x relative">
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} className="lg:[&_h2]:text-5xl" />
        <div className="mt-8 hidden h-px w-full max-w-xs overflow-hidden bg-white/10 lg:block">
          <div data-why-progress className="h-full origin-left scale-x-0 bg-gradient-to-r from-brand-300 to-gold" />
        </div>
      </div>

      <div
        ref={track}
        className="container-x relative mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:flex lg:max-w-none lg:gap-5 lg:overflow-visible lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {why.cards.map((c, i) => {
          const Icon = ICONS[i];
          return (
            <SpotlightCard
              key={c.title}
              data-reveal="up"
              data-delay={(i % 2) * 0.08}
              className="glass group flex min-h-[240px] shrink-0 flex-col rounded-[2rem] p-7 transition-[border-color] duration-500 hover:border-brand-300/35 lg:min-h-[320px] lg:w-[380px] lg:p-9 xl:w-[420px] [@media(min-height:900px)]:lg:min-h-[380px]"
            >
              <span className="grid size-14 place-items-center rounded-2xl bg-brand/45 text-brand-300 ring-1 ring-brand-300/20 transition-all duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
                  <Icon className="size-6" strokeWidth={1.7} />
              </span>
              <h3 className="h-display mt-auto pt-12 text-2xl text-ice md:text-3xl">{c.title}</h3>
              <p className="mt-3 leading-relaxed text-mist">{c.desc}</p>
            </SpotlightCard>
          );
        })}
        <div className="hidden w-[10vw] shrink-0 lg:block" aria-hidden />
      </div>
    </section>
  );
}
