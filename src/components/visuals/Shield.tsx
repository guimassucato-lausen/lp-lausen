import { cn } from "@/lib/cn";

/** Escudo em SVG com check desenhado e linha de varredura. */
export function Shield({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 280" aria-hidden className={cn("overflow-visible", className)}>
      <defs>
        <linearGradient id="sh-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2d00a5" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#1c2339" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="sh-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff7d5" />
          <stop offset="50%" stopColor="#b7c1f7" />
          <stop offset="100%" stopColor="#2d00a5" />
        </linearGradient>
        <linearGradient id="sh-scan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b7c1f7" stopOpacity="0" />
          <stop offset="50%" stopColor="#b7c1f7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#b7c1f7" stopOpacity="0" />
        </linearGradient>
        <clipPath id="sh-clip">
          <path d="M120 10 L220 48 V130 C220 196 176 244 120 270 C64 244 20 196 20 130 V48 Z" />
        </clipPath>
        <filter id="sh-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      <path d="M120 10 L220 48 V130 C220 196 176 244 120 270 C64 244 20 196 20 130 V48 Z" fill="#2d00a5" opacity="0.8" filter="url(#sh-glow)" />
      <path d="M120 10 L220 48 V130 C220 196 176 244 120 270 C64 244 20 196 20 130 V48 Z" fill="url(#sh-fill)" stroke="url(#sh-stroke)" strokeWidth="2.5" />
      <path d="M120 34 L198 64 V130 C198 182 164 222 120 244 C76 222 42 182 42 130 V64 Z" fill="none" stroke="rgb(232 246 255 / 0.12)" strokeDasharray="3 6" />

      <g clipPath="url(#sh-clip)">
        <rect x="0" y="-60" width="240" height="60" fill="url(#sh-scan)" className="animate-[shield-scan_3.2s_ease-in-out_infinite]" />
      </g>

      <path
        d="M78 142 L108 172 L166 110"
        fill="none"
        stroke="#f5e9a3"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="animate-[shield-check_3.2s_ease-in-out_infinite] [stroke-dasharray:1]"
      />
    </svg>
  );
}
