import Image from "next/image";
import { cn } from "@/lib/cn";

// ícones de /public/img/crypto (pacote cryptocurrency-icons, CC0)
const AVAILABLE = new Set(["USDT", "BTC", "ETH", "SOL", "XRP", "USDC"]);

export function CoinIcon({ symbol, size = 40, className }: { symbol: string; size?: number; className?: string }) {
  if (!AVAILABLE.has(symbol)) {
    return (
      <span
        className={cn("grid place-items-center rounded-full bg-white/10 font-display text-[0.6rem] font-bold text-ice", className)}
        style={{ width: size, height: size }}
      >
        {symbol.slice(0, 4)}
      </span>
    );
  }
  return (
    <Image
      src={`/img/crypto/${symbol.toLowerCase()}.svg`}
      alt={symbol}
      width={size}
      height={size}
      unoptimized
      className={cn("shrink-0 rounded-full", className)}
    />
  );
}
