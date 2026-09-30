"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, ChevronDown, MessageCircle, Phone } from "lucide-react";
import { leadSchema, OPERATION_TYPES, VOLUME_RANGES, type LeadInput } from "@/lib/validation";
import { getUtm, trackLead } from "@/lib/tracking";
import { CONTACT, whatsappLink } from "@/lib/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const field =
  "peer w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-[0.95rem] text-ice placeholder:text-slate outline-none transition-[border-color,background-color,box-shadow] duration-300 hover:border-white/20 focus:border-brand focus:bg-brand/[0.05] focus:shadow-[0_0_0_4px_rgb(107_70_255/0.15)] aria-[invalid=true]:border-down/70";

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-xs font-medium tracking-wide text-mist">{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 block text-xs text-down"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

const DEFAULTS: Partial<LeadInput> = {
  fullName: "",
  email: "",
  whatsapp: "",
  country: "",
  city: "",
  company: "",
  operationTypes: [],
  message: "",
  website: "",
};

export function Contact() {
  const t = useTranslations("contact");
  const tf = useTranslations("contact.form");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [waLink, setWaLink] = useState("");
  const [utm, setUtm] = useState<Record<string, string>>({});

  useEffect(() => setUtm(getUtm()), []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { ...DEFAULTS, country: locale === "pt" ? "Brasil" : "" },
  });

  const err = (key?: string) => (key ? tf(`errors.${key}` as "errors.required") : undefined);

  // Sem backend por enquanto: o lead segue para o WhatsApp da mesa com a mensagem pronta.
  const buildMessage = (v: LeadInput) =>
    [
      t("whatsappMessage"),
      "",
      `${tf("fullName")}: ${v.fullName}`,
      `${tf("email")}: ${v.email}`,
      `${tf("whatsapp")}: ${v.whatsapp}`,
      `${tf("city")}/${tf("country")}: ${v.city} — ${v.country}`,
      v.company ? `${tf("company").replace(/\s*\(.*\)/, "")}: ${v.company}` : null,
      `${tf("volume")}: ${tf(`volumes.${v.volumeRange}`)}`,
      `${tf("operations")}: ${v.operationTypes.map((op) => tf(`operationTypes.${op}`)).join(", ")}`,
      v.message ? `${tf("message")}: ${v.message}` : null,
    ]
      .filter((line) => line !== null)
      .join("\n");

  const onSubmit = (values: LeadInput) => {
    // honeypot preenchido: finge sucesso sem abrir nada
    if (values.website) {
      setStatus("success");
      return;
    }
    const link = whatsappLink(buildMessage(values));
    setWaLink(link);
    trackLead({ volume_range: values.volumeRange, operation_types: values.operationTypes.join(","), ...utm });
    // se o navegador bloquear o popup, o botão na tela de sucesso cobre o caso
    window.open(link, "_blank", "noopener,noreferrer");
    setStatus("success");
    reset({ ...DEFAULTS, country: values.country });
  };

  return (
    <section id="contato" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

          <div data-reveal="up" className="glass mt-10 rounded-3xl p-6">
            <p className="text-sm text-mist">{t("whatsapp")}</p>
            <Button
              href={whatsappLink(t("whatsappMessage"))}
              target="_blank"
              rel="noopener noreferrer"
              variant="light"
              arrow
              className="mt-4 w-full sm:w-auto"
            >
              <MessageCircle className="-ml-1 mr-1 inline size-4" />
              {t("whatsappCta")}
            </Button>
            <a
              href={`tel:${CONTACT.phoneE164}`}
              className="mt-5 flex items-center gap-3 text-sm text-mist transition-colors hover:text-ice"
            >
              <Phone className="size-4 text-brand-300" />
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>

        <div data-reveal="up" className="glass relative overflow-hidden rounded-[2rem] p-6 md:p-10">
          <div className="pointer-events-none absolute -left-32 -top-32 size-80 rounded-full bg-brand/20 blur-3xl" />

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex min-h-[520px] flex-col items-center justify-center text-center"
                role="status"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                  className="grid size-20 place-items-center rounded-full bg-up/15 text-up ring-8 ring-up/5"
                >
                  <CheckCircle2 className="size-10" />
                </motion.span>
                <h3 className="h-display mt-8 text-3xl text-ice">{tf("successTitle")}</h3>
                <p className="mt-3 max-w-sm text-mist">{tf("successText")}</p>
                {waLink && (
                  <Button href={waLink} target="_blank" rel="noopener noreferrer" variant="light" arrow className="mt-8">
                    <MessageCircle className="-ml-1 mr-1 inline size-4" />
                    {tf("openWhatsapp")}
                  </Button>
                )}
                <button onClick={() => setStatus("idle")} className="mt-8 text-sm text-brand-300 underline-offset-4 hover:underline">
                  {tf("again")}
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="relative grid gap-5 sm:grid-cols-2"
              >
                <Field label={`${tf("fullName")} *`} error={err(errors.fullName?.message)} className="sm:col-span-2">
                  <input {...register("fullName")} autoComplete="name" placeholder={tf("fullNamePh")} aria-invalid={!!errors.fullName} className={field} />
                </Field>
                <Field label={`${tf("email")} *`} error={err(errors.email?.message)}>
                  <input {...register("email")} type="email" autoComplete="email" placeholder={tf("emailPh")} aria-invalid={!!errors.email} className={field} />
                </Field>
                <Field label={`${tf("whatsapp")} *`} error={err(errors.whatsapp?.message)}>
                  <input {...register("whatsapp")} type="tel" autoComplete="tel" placeholder={tf("whatsappPh")} aria-invalid={!!errors.whatsapp} className={field} />
                </Field>
                <Field label={`${tf("country")} *`} error={err(errors.country?.message)}>
                  <input {...register("country")} autoComplete="country-name" placeholder={tf("countryPh")} aria-invalid={!!errors.country} className={field} />
                </Field>
                <Field label={`${tf("city")} *`} error={err(errors.city?.message)}>
                  <input {...register("city")} autoComplete="address-level2" placeholder={tf("cityPh")} aria-invalid={!!errors.city} className={field} />
                </Field>
                <Field label={tf("company")}>
                  <input {...register("company")} autoComplete="organization" placeholder={tf("companyPh")} className={field} />
                </Field>
                <Field label={`${tf("volume")} *`} error={err(errors.volumeRange?.message)}>
                  <div className="relative">
                    <select {...register("volumeRange")} defaultValue="" aria-invalid={!!errors.volumeRange} className={cn(field, "appearance-none pr-10 invalid:text-slate")} required>
                      <option value="" disabled>
                        {tf("volumePh")}
                      </option>
                      {VOLUME_RANGES.map((v) => (
                        <option key={v} value={v} className="bg-surface-2 text-ice">
                          {tf(`volumes.${v}`)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-mist" />
                  </div>
                </Field>

                <fieldset className="sm:col-span-2">
                  <legend className="mb-3 text-xs font-medium tracking-wide text-mist">{tf("operations")} *</legend>
                  <Controller
                    control={control}
                    name="operationTypes"
                    render={({ field: { value = [], onChange } }) => (
                      <div className="flex flex-wrap gap-2">
                        {OPERATION_TYPES.map((op) => {
                          const on = value.includes(op);
                          return (
                            <button
                              type="button"
                              key={op}
                              role="checkbox"
                              aria-checked={on}
                              onClick={() => onChange(on ? value.filter((v) => v !== op) : [...value, op])}
                              className={cn(
                                "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all duration-300",
                                on
                                  ? "border-brand bg-brand/20 text-white shadow-[0_0_24px_-6px_rgb(107_70_255/0.8)]"
                                  : "border-white/10 text-mist hover:border-white/25 hover:text-ice",
                              )}
                            >
                              <span className={cn("grid size-4 place-items-center rounded-full border transition-all", on ? "border-brand bg-brand" : "border-white/30")}>
                                {on && <Check className="size-3" strokeWidth={3} />}
                              </span>
                              {tf(`operationTypes.${op}`)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                  {errors.operationTypes && <p className="mt-2 text-xs text-down">{err(errors.operationTypes.message)}</p>}
                </fieldset>

                <Field label={tf("message")} className="sm:col-span-2">
                  <textarea {...register("message")} rows={4} placeholder={tf("messagePh")} className={cn(field, "resize-none")} />
                </Field>

                {/* honeypot */}
                <input {...register("website")} tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-0 w-0 opacity-0" />

                <label className="flex cursor-pointer items-start gap-3 sm:col-span-2">
                  <input type="checkbox" {...register("consent")} className="peer sr-only" />
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border border-white/25 transition-all peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand-300 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                    <Check className="size-3.5 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-relaxed text-mist">
                    {tf("consent")}
                    {errors.consent && <span className="mt-1 block text-xs text-down">{err(errors.consent.message)}</span>}
                  </span>
                </label>

                <Button type="submit" size="lg" arrow className="sm:col-span-2">
                  <MessageCircle className="-ml-1 mr-1 inline size-4" />
                  {tf("submit")}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
