"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: React.ReactNode;
  /** anima imediatamente (hero) em vez de esperar o scroll */
  immediate?: boolean;
  delay?: number;
};

/** Título com reveal linha a linha (máscara) via GSAP SplitText. */
export function SplitHeading({ as: Tag = "h2", className, children, immediate, delay = 0 }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1 });
        return;
      }

      let split: SplitText | undefined;
      document.fonts.ready.then(() => {
        split = SplitText.create(el, { type: "lines,words", mask: "lines", linesClass: "split-line" });
        gsap.set(el, { opacity: 1 });
        gsap.from(split.words, {
          yPercent: 110,
          rotate: 4,
          duration: 1.2,
          delay,
          ease: "expo.out",
          stagger: 0.045,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 85%", once: true },
        });
      });
      return () => split?.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} data-split className={className}>
      {children}
    </Tag>
  );
}
