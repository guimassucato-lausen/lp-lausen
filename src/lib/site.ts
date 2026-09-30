export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lausen.com.br";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://lausen.com.br";

export const APP_LINKS = {
  login: `${APP_URL}/`,
  signup: `${APP_URL}/account-create`,
};

export const CONTACT = {
  phoneDisplay: "+55 (44) 93618-0864",
  phoneE164: "+5544936180864",
  whatsapp: "5544936180864",
  // TODO: definir e-mail oficial da Lausen (o atual é da Nexus). Vazio = não exibe.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  cnpj: "59.509.598/0001-91",
  city: "Maringá, PR — Brasil",
};

export const TRACKING = {
  gtm: "GTM-5G2L3NT3",
  googleAds: "AW-18428695807",
  metaPixel: "1101816339005245",
};

export const SECTIONS = [
  { id: "home", key: "home" },
  { id: "mercado", key: "market" },
  { id: "por-que", key: "why" },
  { id: "como-funciona", key: "how" },
  { id: "regulacao", key: "regulation" },
  { id: "faq", key: "faq" },
  { id: "contato", key: "contact" },
] as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
