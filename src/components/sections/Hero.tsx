"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowDown, ArrowRight, BadgeCheck, CheckCircle2, Zap } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Magnetic } from "@/components/motion/Magnetic";
import { scrollToId, useLenis } from "@/components/motion/SmoothScroll";
import { Globe } from "@/components/visuals/Globe";
import { Button } from "@/components/ui/Button";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { APP_LINKS } from "@/lib/site";

export function Hero() {
  const t = useTranslations("hero");
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const words = [
    ...`${t("titleLine1")} ${t("titleLine2")}`.split(" ").map((text) => ({ text, hl: false })),
    ...t("titleHighlight").split(" ").map((text) => ({ text, hl: true })),
  ];

  // cartões de vidro flutuantes (só desktop); depth = quanto reagem ao mouse/scroll
  const cards = [
    {
      cls: "left-[3%] top-[24%] xl:left-[6%]",
      depth: 1.2,
      body: (
        <div className="flex items-center gap-3">
          <CoinIcon symbol="USDT" size={36} />
          <div>
            <p className="font-display text-sm font-semibold text-ice">USDT / BRL</p>
            <p className="text-xs text-mist">{t("cardPair")}</p>
          </div>
        </div>
      ),
    },
    {
      cls: "right-[3%] top-[20%] xl:right-[6%]",
      depth: 0.8,
      body: (
        <div className="min-w-48">
          <div className="flex items-center justify-between gap-6">
            <p className="text-xs text-mist">{t("cardOrder")}</p>
            <span className="flex items-center gap-1 rounded-full bg-up/15 px-2 py-0.5 text-[0.7rem] font-semibold text-up">
              <CheckCircle2 className="size-3" />
              {t("cardSettled")}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <CoinIcon symbol="USDT" size={22} />
            <ArrowRight className="size-3.5 text-slate" />
            <span className="grid size-[22px] place-items-center rounded-full bg-[#009c3b] font-display text-[0.55rem] font-bold text-white">R$</span>
            <span className="ml-1 font-display text-sm font-semibold text-ice">USDT → BRL</span>
          </div>
        </div>
      ),
    },
    {
      cls: "left-[7%] bottom-[14%] xl:left-[10%]",
      depth: 1.6,
      body: (
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-brand/20 text-brand-300">
            <BadgeCheck className="size-5" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-ice">{t("cardKyb")}</p>
            <p className="text-xs text-mist">{t("cardKybSub")}</p>
          </div>
        </div>
      ),
    },
    {
      cls: "right-[6%] bottom-[16%] xl:right-[10%]",
      depth: 1.4,
      body: (
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-up/15 text-up">
            <Zap className="size-5" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-ice">{t("cardRails")}</p>
            <p className="text-xs text-mist">{t("cardRailsSub")}</p>
          </div>
        </div>
      ),
    },
  ];

  useGSAP(
    (_, contextSafe) => {
      // a entrada é feita em CSS (.hero-in / .card-in / .hero-word) para não atrasar o LCP; aqui só scroll e mouse
      if (prefersReducedMotion()) return;

      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to("[data-hero-content]", { yPercent: 18, scale: 0.94, opacity: 0.2, ease: "none", scrollTrigger: st });
      gsap.to("[data-globe]", { yPercent: 12, scale: 1.12, ease: "none", scrollTrigger: st });
      gsap.utils.toArray<HTMLElement>("[data-card-wrap]").forEach((el) => {
        gsap.to(el, { y: -200 * Number(el.dataset.depth), opacity: 0, ease: "none", scrollTrigger: st });
      });

      // parallax do mouse (desktop)
      if (!window.matchMedia("(pointer: fine)").matches) return;
      const movers = gsap.utils.toArray<HTMLElement>("[data-card]").map((el) => ({
        d: Number(el.dataset.depth),
        x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
      }));
      const globe = {
        x: gsap.quickTo("[data-globe-inner]", "x", { duration: 1.6, ease: "power3.out" }),
        y: gsap.quickTo("[data-globe-inner]", "y", { duration: 1.6, ease: "power3.out" }),
      };
      const onMove = contextSafe!((e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(nx * 40 * m.d);
          m.y(ny * 40 * m.d);
        });
        globe.x(nx * -24);
        globe.y(ny * -24);
      });
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="home"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-16 pt-32"
    >
      {/* fundo */}
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="hero-orb pointer-events-none absolute left-1/2 top-[38%] size-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(107_70_255/0.3),transparent_60%)] blur-2xl" />
      <div className="hero-orb pointer-events-none absolute -bottom-1/3 left-[15%] size-[45vmax] rounded-full bg-[radial-gradient(circle,rgb(46_120_255/0.2),transparent_60%)] blur-3xl" />

      {/* globo com rotas de liquidação */}
      <div
        data-globe
        className="hero-orb pointer-events-none absolute left-1/2 top-[70%] w-[130vw] max-w-[1000px] -translate-x-1/2 -translate-y-1/2 [mask-image:linear-gradient(to_bottom,black_40%,transparent_85%)] md:w-[85vw]"
      >
        <div data-globe-inner className="opacity-60 md:opacity-80">
          <Globe />
        </div>
      </div>

      {cards.map((c, i) => (
        <div key={i} data-card-wrap data-depth={c.depth} className={`pointer-events-none absolute hidden lg:block ${c.cls}`}>
          <div data-card data-depth={c.depth}>
            <div className="card-in" style={{ animationDelay: `${0.7 + i * 0.12}s` }}>
              <div
                className="glass animate-float rounded-2xl px-4 py-3 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.9)]"
                style={{ animationDelay: `${i * -1.7}s`, animationDuration: `${7 + i}s` }}
              >
                {c.body}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* conteúdo */}
      <div data-hero-content className="container-x relative z-10 text-center">
        <div data-hero-in style={{ animationDelay: "0.1s" }} className="glass mx-auto inline-flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-4 text-xs text-mist md:text-sm">
          <span className="relative grid size-5 place-items-center">
            <span className="absolute size-2 animate-pulse-soft rounded-full bg-up" />
            <span className="absolute size-4 rounded-full bg-up/20" />
          </span>
          {t("eyebrow")}
        </div>

        <h1 className="h-display mx-auto mt-7 max-w-5xl text-[clamp(2.5rem,7.2vw,6rem)] text-ice">
          {words
            .map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span
                  className={`hero-word inline-block ${w.hl ? "text-gradient" : ""}`}
                  style={{ animationDelay: `${0.25 + i * 0.05}s` }}
                >
                  {w.text}
                </span>
              </span>
            ))
            .flatMap((el, i) => (i === 0 ? [el] : [" ", el]))}
        </h1>

        <p data-hero-in style={{ animationDelay: "0.61s" }} className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-mist md:text-lg">
          {t("subtitle")}
        </p>

        <div data-hero-in style={{ animationDelay: "0.69s" }} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Magnetic>
            <Button href={APP_LINKS.signup} size="lg" arrow>
              {t("ctaPrimary")}
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
              {t("ctaSecondary")}
            </Button>
          </Magnetic>
        </div>

        <ul data-hero-in style={{ animationDelay: "0.77s" }} className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-mist">
          {(["badge1", "badge2", "badge3"] as const).map((b) => (
            <li key={b} className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-brand-300" />
              {t(b)}
            </li>
          ))}
        </ul>
      </div>

      <button
        data-hero-in
        style={{ animationDelay: "0.85s" }}
        onClick={() => scrollToId(lenis, "mercado")}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate transition-colors hover:text-ice md:flex"
      >
        {t("scroll")}
        <ArrowDown className="size-4 animate-bounce" />
      </button>
    </section>
  );
}
