import { useMessages, useTranslations } from "next-intl";
import { BadgeCheck, Fingerprint, KeyRound, ScanSearch } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Shield } from "@/components/visuals/Shield";

const ICONS = [BadgeCheck, ScanSearch, KeyRound, Fingerprint];

export function Regulation() {
  const t = useTranslations("regulation");
  const { regulation } = useMessages() as { regulation: { items: { title: string; desc: string }[] } };

  return (
    <section id="regulacao" className="relative scroll-mt-24 overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgb(107_70_255/0.12),transparent_60%)]" />
      <div className="container-x relative grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div data-reveal="scale" className="relative mx-auto aspect-square w-full max-w-[520px]">
          {/* anéis orbitais */}
          <div className="absolute inset-0 animate-[spin_40s_linear_infinite] rounded-full border border-dashed border-white/10" />
          <div className="absolute inset-[12%] animate-[spin_28s_linear_infinite_reverse] rounded-full border border-brand/25">
            <span className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full bg-brand shadow-[0_0_20px_rgb(107_70_255)]" />
          </div>
          <div className="absolute inset-[26%] rounded-full bg-brand/25 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 w-[52%] -translate-x-1/2 -translate-y-1/2">
            <Shield className="w-full animate-[float_8s_ease-in-out_infinite]" />
          </div>
          <div className="glass absolute bottom-[8%] left-0 flex items-center gap-3 rounded-2xl px-4 py-3 md:left-[-4%]">
            <span className="grid size-9 place-items-center rounded-xl bg-up/15 text-up">
              <BadgeCheck className="size-5" />
            </span>
            <div className="text-left">
              <p className="font-display text-sm font-semibold text-ice">PSAV</p>
              <p className="text-xs text-mist">Res. BCB nº 520</p>
            </div>
          </div>
        </div>

        <div>
          <SectionHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {regulation.items.map((item, i) => {
              const Icon = ICONS[i];
              return (
                <li
                  key={item.title}
                  data-reveal="up"
                  data-delay={i * 0.08}
                  className="group rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors duration-500 hover:border-brand/30 hover:bg-brand/[0.06]"
                >
                  <Icon className="size-6 text-brand-300 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.7} />
                  <h3 className="mt-5 font-display text-lg font-semibold text-ice">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{item.desc}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
