import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { CONTACT, SECTIONS } from "@/lib/site";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-12 overflow-hidden border-t border-white/[0.07] pt-20">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-12 pb-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <Logo className="h-7" />
          <p className="mt-6 max-w-sm leading-relaxed text-mist">{t("tagline")}</p>
        </div>
        <nav aria-label={t("links")}>
          <p className="font-display text-sm font-semibold text-ice">{t("links")}</p>
          <ul className="mt-5 space-y-3 text-sm">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-mist transition-colors hover:text-ice">
                  {nav(s.key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-display text-sm font-semibold text-ice">{t("contact")}</p>
          <ul className="mt-5 space-y-3 text-sm text-mist">
            <li>
              <a href={`tel:${CONTACT.phoneE164}`} className="flex items-center gap-2.5 transition-colors hover:text-ice">
                <Phone className="size-4 text-brand-300" />
                {CONTACT.phoneDisplay}
              </a>
            </li>
            {CONTACT.email && (
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2.5 transition-colors hover:text-ice">
                  <Mail className="size-4 text-brand-300" />
                  {CONTACT.email}
                </a>
              </li>
            )}
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 text-brand-300" />
              {CONTACT.city}
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x border-t border-white/[0.07] py-8 text-xs leading-relaxed text-slate">
        <p className="max-w-3xl">{t("legal")}</p>
        <div className="mt-4 flex flex-col justify-between gap-2 md:flex-row">
          <p>{t("company")}</p>
          <p>{t("rights", { year })}</p>
        </div>
      </div>

      {/* wordmark gigante */}
      <p
        aria-hidden
        className="h-display pointer-events-none select-none bg-gradient-to-b from-linen/[0.08] to-transparent bg-clip-text text-center text-[26vw] leading-[0.75] text-transparent"
      >
        lausen
      </p>
    </footer>
  );
}
