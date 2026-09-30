import { CoinIcon } from "@/components/ui/CoinIcon";
import { cn } from "@/lib/cn";

/** Anéis orbitais em SVG/CSS com moedas girando — decorativo. */
export function Orbits({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative aspect-square", className)}>
      <div className="absolute inset-[30%] rounded-full bg-brand/55 blur-3xl" />
      <svg viewBox="0 0 400 400" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id="orb-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5e9a3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#b7c1f7" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="190" fill="none" stroke="rgb(232 246 255 / 0.08)" strokeDasharray="2 8" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="rgb(232 246 255 / 0.1)" />
        <circle cx="200" cy="200" r="90" fill="none" stroke="rgb(183 193 247 / 0.28)" strokeDasharray="4 6" />
        <g className="origin-center animate-[spin_18s_linear_infinite]" style={{ transformBox: "fill-box" }}>
          <circle cx="200" cy="200" r="140" fill="none" stroke="url(#orb-g)" strokeWidth="2" strokeDasharray="220 660" strokeLinecap="round" />
        </g>
        <circle cx="200" cy="200" r="36" fill="rgb(45 0 165 / 0.55)" stroke="rgb(183 193 247 / 0.5)" />
      </svg>
      {/* moedas em órbita */}
      <div className="absolute inset-[2.5%] animate-[spin_40s_linear_infinite]">
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 animate-[spin_40s_linear_infinite_reverse]">
          <CoinIcon symbol="BTC" size={40} />
        </span>
        <span className="absolute bottom-[14%] left-[3%] animate-[spin_40s_linear_infinite_reverse]">
          <CoinIcon symbol="ETH" size={32} />
        </span>
      </div>
      <div className="absolute inset-[15%] animate-[spin_26s_linear_infinite_reverse]">
        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 animate-[spin_26s_linear_infinite]">
          <CoinIcon symbol="USDC" size={34} />
        </span>
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <CoinIcon symbol="USDT" size={52} className="shadow-[0_0_40px_rgb(38_161_123/0.6)]" />
      </div>
    </div>
  );
}
