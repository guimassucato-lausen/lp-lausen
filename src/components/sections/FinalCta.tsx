"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { scrollToId, useLenis } from "@/components/motion/SmoothScroll";
import { APP_LINKS } from "@/lib/site";

const BUBBLES = [
  { symbol: "USDT", size: 44, cls: "left-[6%] top-[18%]", delay: "0s" },
  { symbol: "BTC", size: 30, cls: "left-[14%] bottom-[14%]", delay: "-2s" },
  { symbol: "ETH", size: 32, cls: "right-[8%] top-[14%]", delay: "-3.5s" },
  { symbol: "USDC", size: 38, cls: "right-[12%] bottom-[16%]", delay: "-1s" },
];

export function FinalCta() {
  const t = useTranslations("cta");
  const lenis = useLenis();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // o card "abre" conforme entra na tela
      gsap.fromTo(
        "[data-cta-card]",
        { clipPath: "inset(12% 8% 12% 8% round 48px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 40px)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 90%", end: "top 30%", scrub: true },
        },
      );
      gsap.to("[data-cta-coin]", {
        y: -120,
        rotate: 30,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative py-12 md:py-20">
      <div className="container-x">
        <div
          data-cta-card
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand via-brand-700 to-navy px-6 py-20 text-center md:px-16 md:py-28"
        >
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
          {BUBBLES.map((b) => (
            <div key={b.symbol} data-cta-coin className={`pointer-events-none absolute hidden md:block ${b.cls}`}>
              <div
                className="grid animate-float place-items-center rounded-full border border-white/20 bg-white/10 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.6)] backdrop-blur-md"
                style={{ width: b.size * 1.8, height: b.size * 1.8, animationDelay: b.delay }}
              >
                <CoinIcon symbol={b.symbol} size={b.size} />
              </div>
            </div>
          ))}

          <div className="relative mx-auto max-w-3xl">
            <SplitHeading className="h-display text-4xl text-white md:text-6xl">{t("title")}</SplitHeading>
            <p data-reveal className="mx-auto mt-6 max-w-xl text-lg text-white/80">
              {t("subtitle")}
            </p>
            <div data-reveal data-delay="0.1" className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Magnetic>
                <Button href={APP_LINKS.signup} variant="light" size="lg" arrow>
                  {t("primary")}
                </Button>
              </Magnetic>
              <Magnetic>
                <Button
                  href="#contato"
                  variant="ghost"
                  size="lg"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(lenis, "contato");
                  }}
                >
                  {t("secondary")}
                </Button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
