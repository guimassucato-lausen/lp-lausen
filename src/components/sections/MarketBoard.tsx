"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowDownUp, TrendingDown, TrendingUp } from "lucide-react";
import type { MarketPayload, Ticker } from "@/lib/market";
import { Button } from "@/components/ui/Button";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { scrollToId, useLenis } from "@/components/motion/SmoothScroll";
import { cn } from "@/lib/cn";

const POLL_MS = 30_000;

function useMarket(initial: MarketPayload) {
  const [data, setData] = useState(initial);
  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch("/api/market", { cache: "no-store" });
        if (res.ok && alive) setData(await res.json());
      } catch {
        /* mantém o último valor */
      }
    };
    const id = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);
  return data;
}

function formatBRL(n: number, locale: string) {
  const digits = n < 10 ? 4 : 2;
  return new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

/** Pisca verde/vermelho quando o valor muda. */
function Flash({ value, children, className }: { value: number; children: React.ReactNode; className?: string }) {
  const prev = useRef(value);
  const [dir, setDir] = useState<"up" | "down" | null>(null);
  useEffect(() => {
    if (value !== prev.current) {
      setDir(value > prev.current ? "up" : "down");
      prev.current = value;
      const t = setTimeout(() => setDir(null), 900);
      return () => clearTimeout(t);
    }
  }, [value]);
  return (
    <span
      className={cn(
        "rounded-md transition-colors duration-700",
        dir === "up" && "bg-up/15 text-up",
        dir === "down" && "bg-down/15 text-down",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Change({ value }: { value: number }) {
  const up = value >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
        up ? "bg-up/10 text-up" : "bg-down/10 text-down",
      )}
    >
      <Icon className="size-3.5" />
      {up ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

/** Faixa mín./máx. do dia com marcador do último preço. */
function RangeBar({ t, delay = 0 }: { t: Ticker; delay?: number }) {
  const span = t.high - t.low;
  const pos = span > 0 ? Math.min(1, Math.max(0, (t.price - t.low) / span)) : 0.5;
  const up = t.change24h >= 0;
  return (
    <div className="relative h-1.5 w-full rounded-full bg-white/[0.07]">
      <motion.div
        className={cn("absolute inset-y-0 left-0 rounded-full", up ? "bg-gradient-to-r from-up/20 to-up" : "bg-gradient-to-r from-down/20 to-down")}
        initial={{ width: 0 }}
        whileInView={{ width: `${pos * 100}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-ice shadow-[0_0_12px_rgb(232_246_255/0.6)]"
        initial={{ left: 0, opacity: 0 }}
        whileInView={{ left: `${pos * 100}%`, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

function Simulator({ usdt }: { usdt: Ticker }) {
  const t = useTranslations("market");
  const locale = useLocale();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState(side === "buy" ? 100000 : 20000);

  const nf = useMemo(() => new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US", { maximumFractionDigits: 2 }), [locale]);
  const result = side === "buy" ? amount / usdt.price : amount * usdt.price;
  const payCur = side === "buy" ? "BRL" : "USDT";
  const getCur = side === "buy" ? "USDT" : "BRL";

  return (
    <div className="mt-8 border-t border-white/[0.07] pt-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-sm font-semibold text-ice">{t("simTitle")}</p>
        <div className="relative flex rounded-full bg-white/[0.05] p-1 text-xs">
          {(["buy", "sell"] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setSide(s);
                setAmount(s === "buy" ? 100000 : 20000);
              }}
              className={cn("relative rounded-full px-3 py-1.5 font-semibold transition-colors", side === s ? "text-white" : "text-mist")}
            >
              {side === s && (
                <motion.span layoutId="sim-pill" className="absolute inset-0 -z-0 rounded-full bg-brand" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
              )}
              <span className="relative">{s === "buy" ? t("simBuy") : t("simSell")}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <label className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/[0.06] focus-within:ring-brand/60">
          <span className="text-xs text-mist">{t("simYouPay")}</span>
          <span className="flex items-center gap-2">
            <input
              inputMode="decimal"
              aria-label={t("simYouPay")}
              value={nf.format(amount)}
              onChange={(e) => {
                const n = Number(e.target.value.replace(/\D/g, ""));
                setAmount(Number.isFinite(n) ? Math.min(n, 1e10) : 0);
              }}
              className="w-40 bg-transparent text-right font-display text-lg font-semibold tabular-nums text-ice outline-none"
            />
            <span className="w-11 text-xs font-semibold text-mist">{payCur}</span>
          </span>
        </label>
        <div className="relative z-10 -my-4 mx-auto grid size-8 place-items-center rounded-full bg-surface-2 ring-1 ring-white/10">
          <ArrowDownUp className="size-3.5 text-brand-300" />
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-brand/[0.08] px-4 py-3 ring-1 ring-brand/20">
          <span className="text-xs text-mist">{t("simYouGet")}</span>
          <span className="flex items-center gap-2">
            <span className="font-display text-lg font-semibold tabular-nums text-ice">{nf.format(result)}</span>
            <span className="w-11 text-xs font-semibold text-mist">{getCur}</span>
          </span>
        </div>
      </div>
      <p className="mt-3 text-[0.7rem] leading-relaxed text-slate">{t("simNote")}</p>
    </div>
  );
}

export function MarketBoard({ initial }: { initial: MarketPayload }) {
  const t = useTranslations("market");
  const locale = useLocale();
  const lenis = useLenis();
  const data = useMarket(initial);
  const usdt = data.tickers.find((x) => x.symbol === "USDT") ?? data.tickers[0];
  const others = data.tickers.filter((x) => x !== usdt);
  const time = new Date(data.updatedAt).toLocaleTimeString(locale === "pt" ? "pt-BR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mt-14 grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* destaque USDT/BRL + simulador */}
      <div data-reveal="left" className="glass spotlight relative overflow-hidden rounded-[2rem] p-6 md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-brand/30 blur-3xl" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CoinIcon symbol={usdt.symbol} size={44} className="shadow-[0_0_24px_rgb(38_161_123/0.45)]" />
            <div>
              <p className="font-display font-semibold text-ice">USDT / BRL</p>
              <p className="text-xs text-mist">{t("featured")}</p>
            </div>
          </div>
          <span className="flex items-center gap-2 text-xs text-mist">
            <span className={cn("size-2 rounded-full", data.live ? "animate-pulse-soft bg-up" : "bg-slate")} />
            {data.live ? t("live") : t("delayed")} · {time}
          </span>
        </div>

        <div className="mt-8 flex flex-wrap items-end gap-3">
          <Flash value={usdt.price} className="h-display px-1 text-5xl tabular-nums text-ice md:text-6xl">
            {formatBRL(usdt.price, locale)}
          </Flash>
          <Change value={usdt.change24h} />
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs text-slate">
            <span>{formatBRL(usdt.low, locale)}</span>
            <span>{t("range")}</span>
            <span>{formatBRL(usdt.high, locale)}</span>
          </div>
          <RangeBar t={usdt} />
        </div>

        <Simulator usdt={usdt} />

        <Button
          href="#contato"
          arrow
          className="mt-6 w-full"
          onClick={(e) => {
            e.preventDefault();
            scrollToId(lenis, "contato");
          }}
        >
          {t("cta")}
        </Button>
      </div>

      {/* tabela */}
      <div data-reveal="right" className="glass overflow-hidden rounded-[2rem]">
        <div className="grid grid-cols-[1.4fr_1fr_auto] gap-4 border-b border-white/[0.07] px-6 py-4 text-xs uppercase tracking-wider text-slate md:grid-cols-[1.4fr_1fr_0.7fr_1.3fr] md:px-8">
          <span>{t("asset")}</span>
          <span className="text-right">{t("price")}</span>
          <span className="text-right">{t("change")}</span>
          <span className="hidden md:block">{t("range")}</span>
        </div>
        <ul>
          {others.map((x, i) => (
            <motion.li
              key={x.symbol}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="group grid grid-cols-[1.4fr_1fr_auto] items-center gap-4 border-b border-white/[0.05] px-6 py-5 transition-colors last:border-0 hover:bg-white/[0.03] md:grid-cols-[1.4fr_1fr_0.7fr_1.3fr] md:px-8"
            >
              <div className="flex items-center gap-3">
                <CoinIcon symbol={x.symbol} size={40} className="transition-transform duration-500 ease-out-expo group-hover:scale-110" />
                <div>
                  <p className="font-display text-sm font-semibold text-ice">{x.name}</p>
                  <p className="text-xs text-slate">{x.symbol}/BRL</p>
                </div>
              </div>
              <Flash value={x.price} className="justify-self-end px-1 text-right text-sm font-semibold tabular-nums text-ice">
                {formatBRL(x.price, locale)}
              </Flash>
              <span className="justify-self-end">
                <Change value={x.change24h} />
              </span>
              <div className="hidden md:block">
                <RangeBar t={x} delay={0.2 + i * 0.07} />
              </div>
            </motion.li>
          ))}
        </ul>
        <p className="border-t border-white/[0.07] px-6 py-4 text-xs text-slate md:px-8">{t("disclaimer")}</p>
      </div>
    </div>
  );
}
