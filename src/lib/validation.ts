import { z } from "zod";

export const VOLUME_RANGES = ["lt10k", "10k-100k", "100k-1m", "gt1m"] as const;
export const OPERATION_TYPES = ["buy", "sell", "settlement", "partnership"] as const;

/** Mensagens são chaves de tradução em contact.form.errors. */
export const leadSchema = z.object({
  fullName: z.string().trim().min(2, "required").max(120),
  email: z.string().trim().toLowerCase().email("email").max(160),
  whatsapp: z
    .string()
    .trim()
    .refine((v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }, "phone"),
  country: z.string().trim().min(2, "required").max(60),
  city: z.string().trim().min(2, "required").max(80),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  volumeRange: z.enum(VOLUME_RANGES, { message: "required" }),
  operationTypes: z.array(z.enum(OPERATION_TYPES)).min(1, "operations"),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z.literal(true, { message: "consent" }),
  // honeypot: humanos deixam vazio; se vier preenchido o envio é descartado em silêncio
  website: z.string().max(200).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
