import { useTranslations, useMessages } from "next-intl";
import { Marquee } from "@/components/motion/Marquee";
import { Counter } from "@/components/motion/Counter";
import { SplitHeading } from "@/components/motion/SplitHeading";

type Stat = { value: number; prefix: string; suffix: string; label: string };

export function Stats() {
  const t = useTranslations("stats");
  const messages = useMessages() as { marquee: string[]; stats: { items: Stat[] } };

  return (
    <section className="relative py-24 md:py-32">
      <div className="border-y border-white/[0.06] bg-white/[0.015] py-6">
        <Marquee
          items={messages.marquee.map((m) => (
            <span key={m} className="font-display text-lg font-medium tracking-tight text-mist md:text-2xl">
              {m}
            </span>
          ))}
        />
      </div>

      <div className="container-x mt-24 md:mt-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <span data-reveal="fade" className="eyebrow">
              {t("eyebrow")}
            </span>
            <SplitHeading className="h-display mt-5 text-3xl text-ice md:text-5xl">{t("title")}</SplitHeading>
          </div>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] bg-white/[0.07]">
            {messages.stats.items.map((s, i) => (
              <div key={i} data-reveal="scale" data-delay={i * 0.08} className="group bg-ink p-6 transition-colors hover:bg-surface-2 md:p-10">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <Counter
                    value={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    className="h-display block text-4xl tabular-nums text-ice transition-colors group-hover:text-brand-300 md:text-6xl"
                  />
                  <p className="mt-3 text-sm leading-relaxed text-mist">{s.label}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
