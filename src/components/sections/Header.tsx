"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { Button } from "@/components/ui/Button";
import { scrollToId, useLenis } from "@/components/motion/SmoothScroll";
import { APP_LINKS, SECTIONS } from "@/lib/site";
import { cn } from "@/lib/cn";

const NAV = SECTIONS.filter((s) => s.id !== "home");

export function Header() {
  const t = useTranslations("nav");
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);

  // fundo sólido após sair do topo (o header fica sempre visível)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // seção ativa
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(lenis, id);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="container-x pt-3 md:pt-4">
          <nav
            aria-label="Principal"
            className={cn(
              "flex h-14 items-center justify-between rounded-full pl-5 pr-2 transition-all duration-500 md:h-16",
              scrolled
                ? "border border-white/[0.08] bg-ink/80 shadow-[0_10px_40px_-15px_rgb(0_0_0/0.8)] backdrop-blur-xl"
                : "border border-transparent",
            )}
          >
            <a href="#home" onClick={go("home")} className="shrink-0" aria-label="Lausen — início">
              <Logo className="h-5 md:h-6" />
            </a>

            <ul className="hidden items-center gap-1 lg:flex">
              {NAV.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={go(s.id)}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm transition-colors",
                      active === s.id ? "text-white" : "text-mist hover:text-white",
                    )}
                  >
                    {active === s.id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.08]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {t(s.key)}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <LocaleSwitcher />
              <a
                href={APP_LINKS.login}
                className="hidden px-3 text-sm text-mist transition-colors hover:text-white md:inline"
              >
                {t("login")}
              </a>
              <span className="hidden sm:block">
                <Button href="#contato" onClick={go("contato")} arrow>
                  {t("cta")}
                </Button>
              </span>
              <button
                onClick={() => setOpen((v) => !v)}
                className="grid size-10 place-items-center rounded-full bg-white/5 text-ice lg:hidden"
                aria-label={open ? t("close") : t("menu")}
                aria-expanded={open}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-ink/95 px-6 pb-10 pt-28 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-2">
              {NAV.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={`#${s.id}`}
                    onClick={go(s.id)}
                    className="h-display block py-2 text-4xl text-ice active:text-brand-300"
                  >
                    {t(s.key)}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-3">
              <Button href="#contato" onClick={go("contato")} size="lg" arrow>
                {t("cta")}
              </Button>
              <Button href={APP_LINKS.login} variant="ghost" size="lg">
                {t("login")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
