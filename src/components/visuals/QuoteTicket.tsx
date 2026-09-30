"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { CoinIcon } from "@/components/ui/CoinIcon";

/** Mock de "ticket" de cotação OTC: validade de 30s em contagem e etapas acendendo em sequência. */
export function QuoteTicket() {
  const t = useTranslations("how.ticket");
  const rows = [
    { k: t("pair"), v: "USDT / BRL" },
    { k: t("settlement"), v: "PIX · On-chain" },
    { k: t("validity"), v: "30s" },
  ];
  const steps = [t("s1"), t("s2"), t("s3")];

  return (
    <div className="glass relative w-full max-w-sm overflow-hidden rounded-[1.75rem] p-6 shadow-[0_30px_80px_-30px_rgb(45_0_165/0.8)]">
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand/55 blur-3xl" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <CoinIcon symbol="USDT" size={34} className="ring-2 ring-surface-2" />
            <span className="grid size-[34px] place-items-center rounded-full bg-[#009c3b] font-display text-[0.65rem] font-bold text-white ring-2 ring-surface-2">
              R$
            </span>
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-ice">{t("title")}</p>
            <p className="text-xs text-mist">{t("subtitle")}</p>
          </div>
        </div>
        {/* anel de validade */}
        <svg viewBox="0 0 36 36" className="size-11 -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgb(232 246 255 / 0.1)" strokeWidth="3" />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="#f5e9a3"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
            className="animate-[ticket-timer_6s_linear_infinite] [stroke-dasharray:1]"
          />
        </svg>
      </div>

      <dl className="relative mt-6 divide-y divide-white/[0.06] rounded-2xl bg-white/[0.03] px-4">
        {rows.map((r) => (
          <div key={r.k} className="flex items-center justify-between py-3 text-sm">
            <dt className="text-mist">{r.k}</dt>
            <dd className="font-display font-semibold text-ice">{r.v}</dd>
          </div>
        ))}
      </dl>

      <ol className="relative mt-5 space-y-2.5">
        {steps.map((s, i) => (
          <li
            key={s}
            className="ticket-step flex items-center gap-3 text-sm"
            style={{ animationDelay: `${i * 1.2}s` }}
          >
            <span className="ticket-dot grid size-6 place-items-center rounded-full border border-white/15">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
