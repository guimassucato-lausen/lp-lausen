import { getTranslations } from "next-intl/server";
import { fetchMarket } from "@/lib/market";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MarketBoard } from "./MarketBoard";

export async function Market() {
  const t = await getTranslations("market");
  const initial = await fetchMarket();

  return (
    <section id="mercado" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
      <div className="container-x">
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <MarketBoard initial={initial} />
      </div>
    </section>
  );
}
