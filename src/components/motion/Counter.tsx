"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = { value: number; prefix?: string; suffix?: string; className?: string };

export function Counter({ value, prefix = "", suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const render = (n: number) => (el.textContent = `${prefix}${Math.round(n)}${suffix}`);
    if (prefersReducedMotion() || value === 0) return;
    render(0);
    const obj = { n: 0 };
    gsap.to(obj, {
      n: value,
      duration: 2,
      ease: "power3.out",
      onUpdate: () => render(obj.n),
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
