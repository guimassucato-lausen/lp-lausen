"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/cn";

// [lat, lon]
const HUB: [number, number] = [-23.55, -46.63]; // São Paulo
const ROUTES: [number, number][] = [
  [40.71, -74.0], // Nova York
  [25.76, -80.19], // Miami
  [51.5, -0.12], // Londres
  [25.2, 55.27], // Dubai
  [22.3, 114.17], // Hong Kong
  [1.35, 103.82], // Singapura
  [-34.6, -58.38], // Buenos Aires
  [6.52, 3.38], // Lagos
];

const DEG = Math.PI / 180;
const TILT = 18 * DEG; // inclina o polo sul para o observador (Brasil mais visível)

type Vec = [number, number, number];

function toVec(lat: number, lon: number, r = 1): Vec {
  const la = lat * DEG;
  const lo = lon * DEG;
  return [r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo)];
}

/** Rotação em Y (giro) seguida de X (inclinação). */
function rotate([x, y, z]: Vec, ry: number): Vec {
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cx = Math.cos(TILT);
  const sx = Math.sin(TILT);
  return [x1, y * cx - z1 * sx, y * sx + z1 * cx];
}

/** Pontos da rota em arco (slerp entre dois pontos + elevação). */
function arcPoints(a: Vec, b: Vec, steps = 64): Vec[] {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  const so = Math.sin(omega) || 1;
  const lift = 0.12 + omega * 0.12;
  const pts: Vec[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const k1 = Math.sin((1 - t) * omega) / so;
    const k2 = Math.sin(t * omega) / so;
    const h = 1 + Math.sin(Math.PI * t) * lift;
    pts.push([(a[0] * k1 + b[0] * k2) * h, (a[1] * k1 + b[1] * k2) * h, (a[2] * k1 + b[2] * k2) * h]);
  }
  return pts;
}

/** Esfera de pontos (distribuição de Fibonacci). */
function fibonacciSphere(n: number): Vec[] {
  const pts: Vec[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  return pts;
}

/**
 * Globo em canvas 2D com rotas de liquidação partindo do Brasil.
 * Leve (sem WebGL), pausa fora da viewport e fica estático com prefers-reduced-motion.
 */
export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const small = window.innerWidth < 768;
    const dots = fibonacciSphere(small ? 700 : 1400);
    const hub = toVec(...HUB);
    const arcs = ROUTES.map((r, i) => ({
      pts: arcPoints(hub, toVec(...r)),
      end: toVec(...r),
      offset: i / ROUTES.length,
      speed: 0.16 + (i % 3) * 0.04,
    }));

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // começa com o Brasil de frente
    let spin = 50 * DEG;
    let raf = 0;
    let running = true;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) spin += dt * 0.08;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.46;
      const cx = w / 2;
      const cy = h / 2;
      const project = (v: Vec) => [cx + v[0] * R, cy - v[1] * R, v[2]] as const;

      // halo
      const halo = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.25);
      halo.addColorStop(0, "rgba(45,0,165,0.35)");
      halo.addColorStop(1, "rgba(45,0,165,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      // borda
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(183,193,247,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // pontos
      for (const d of dots) {
        const [x, y, z] = project(rotate(d, spin));
        if (z < -0.15) continue;
        const a = z < 0 ? 0.08 : 0.22 + z * 0.6;
        ctx.fillStyle = `rgba(198,229,255,${a})`;
        const s = 0.9 + Math.max(0, z) * 1.2;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }

      // rotas
      const t = now / 1000;
      for (const arc of arcs) {
        const rp = arc.pts.map((p) => project(rotate(p, spin)));
        ctx.beginPath();
        let started = false;
        for (const [x, y, z] of rp) {
          if (z < 0) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(183,193,247,0.42)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // pacote percorrendo a rota
        const prog = reduced ? 0.6 : (t * arc.speed + arc.offset) % 1;
        const head = Math.floor(prog * (rp.length - 1));
        const tail = Math.max(0, head - 14);
        for (let i = tail; i < head; i++) {
          const [x1, y1, z1] = rp[i];
          const [x2, y2, z2] = rp[i + 1];
          if (z1 < 0 || z2 < 0) continue;
          const k = (i - tail) / Math.max(1, head - tail);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(255,247,213,${k * 0.95})`;
          ctx.lineWidth = 1 + k * 1.4;
          ctx.stroke();
        }

        // destino
        const [ex, ey, ez] = project(rotate(arc.end, spin));
        if (ez > 0) {
          ctx.beginPath();
          ctx.arc(ex, ey, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(245,233,163,0.9)";
          ctx.fill();
        }
      }

      // hub (Brasil) com pulso
      const [hx, hy, hz] = project(rotate(hub, spin));
      if (hz > 0) {
        const pulse = reduced ? 0.5 : (t % 2) / 2;
        ctx.beginPath();
        ctx.arc(hx, hy, 4 + pulse * 16, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245,233,163,${0.7 * (1 - pulse)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(hx, hy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#f5e9a3";
        ctx.fill();
      }

      if (running && !reduced) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (reduced) {
        draw(performance.now());
        return;
      }
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running) start();
      else cancelAnimationFrame(raf);
    });
    io.observe(canvas);
    start();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={cn("block aspect-square w-full", className)} />;
}
