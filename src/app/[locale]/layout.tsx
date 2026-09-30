import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter, Sora } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE_URL, TRACKING } from "@/lib/site";
import { Tracking } from "@/components/Tracking";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["400", "500", "600", "700"], display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0a0d12",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    applicationName: "Lausen",
    authors: [{ name: "Lausen" }],
    alternates: {
      canonical: `/${locale}`,
      languages: { "pt-BR": "/pt", en: "/en", "x-default": "/pt" },
    },
    openGraph: {
      type: "website",
      siteName: "Lausen",
      title: t("title"),
      description: t("description"),
      locale: locale === "pt" ? "pt_BR" : "en_US",
      url: `/${locale}`,
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Lausen",
    url: SITE_URL,
    logo: `${SITE_URL}/img/lausen-logo-site.png`,
    telephone: "+55-44-93618-0864",
    taxID: "59.509.598/0001-91",
    address: { "@type": "PostalAddress", addressLocality: "Maringá", addressRegion: "PR", addressCountry: "BR" },
    areaServed: "BR",
  };

  return (
    <html lang={locale === "pt" ? "pt-BR" : "en"} className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <head>
        {/* marca que o JS está ativo para aplicar estados iniciais das animações */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="grain">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${TRACKING.gtm}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Tracking />
      </body>
    </html>
  );
}
