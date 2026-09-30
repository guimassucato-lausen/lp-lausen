"use client";

import { useState } from "react";
import { useMessages, useTranslations } from "next-intl";
import { LineChart, Plane, Ship, Wallet } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";

const ICONS = [Ship, Plane, Wallet, LineChart];

export function Audience() {
  const t = useTranslations("audience");
  const { audience } = useMessages() as { audience: { items: { title: string; desc: string }[] } };
  const [active, setActive] = useState(0);

  return (
    <section className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />

        <div className="mt-14 flex flex-col gap-4 lg:h-[440px] lg:flex-row">
          {audience.items.map((item, i) => {
            const Icon = ICONS[i];
            const on = active === i;
            return (
              <article
                key={item.title}
                data-reveal="up"
                data-delay={i * 0.08}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
                className={cn(
                  "group relative flex cursor-default flex-col overflow-hidden rounded-[2rem] border p-7 outline-none transition-[flex-grow,background-color,border-color] duration-700 ease-out-expo lg:p-9",
                  on
                    ? "border-brand-300/40 bg-gradient-to-br from-brand/65 via-brand/25 to-transparent lg:flex-[2.4]"
                    : "border-white/[0.07] bg-white/[0.02] lg:flex-1",
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-brand/60 blur-3xl transition-opacity duration-700",
                    on ? "opacity-100" : "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "relative grid size-14 place-items-center rounded-2xl transition-all duration-700",
                    on ? "bg-white text-brand" : "bg-white/[0.06] text-mist",
                  )}
                >
                  <Icon className="size-6" strokeWidth={1.7} />
                </span>
                <div className="relative mt-10 lg:mt-auto">
                  <h3 className="h-display text-2xl text-ice md:text-3xl">{item.title}</h3>
                  <p
                    className={cn(
                      "mt-3 max-w-sm leading-relaxed text-mist transition-all duration-700 ease-out-expo",
                      on ? "lg:translate-y-0 lg:opacity-100" : "lg:pointer-events-none lg:translate-y-4 lg:opacity-0",
                    )}
                  >
                    {item.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
