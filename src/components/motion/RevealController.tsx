"use client";

import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Anima todo elemento com [data-reveal] ao entrar na viewport.
 * Variantes: "up" (padrão), "fade", "scale", "left", "right".
 * [data-delay] em segundos para escalonar manualmente.
 */
const FROM: Record<string, gsap.TweenVars> = {
  up: { y: 48 },
  fade: {},
  scale: { scale: 0.92, y: 24 },
  left: { x: -56 },
  right: { x: 56 },
};

export function RevealController() {
  useGSAP(() => {
    const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    if (prefersReducedMotion()) {
      gsap.set(els, { opacity: 1 });
      return;
    }

    els.forEach((el) => {
      const variant = el.dataset.reveal || "up";
      const delay = Number(el.dataset.delay || 0);
      const from = FROM[variant] ?? FROM.up;
      // anima só as propriedades da variante, para não brigar com outros tweens (ex.: scroll horizontal)
      const to: gsap.TweenVars = { opacity: 1 };
      for (const key of Object.keys(from)) to[key] = key === "scale" ? 1 : 0;
      gsap.fromTo(
        el,
        { opacity: 0, ...from },
        {
          ...to,
          duration: 1.1,
          delay,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    });

    // recalcula depois que fontes/imagens carregarem
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener("load", refresh);
  });

  return null;
}
