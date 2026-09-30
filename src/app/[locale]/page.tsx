import { setRequestLocale } from "next-intl/server";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { RevealController } from "@/components/motion/RevealController";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Market } from "@/components/sections/Market";
import { WhyLausen } from "@/components/sections/WhyLausen";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Audience } from "@/components/sections/Audience";
import { Regulation } from "@/components/sections/Regulation";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";

// cotações renovadas a cada 30s (ISR)
export const revalidate = 30;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <SmoothScroll>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Stats />
        <Market />
        <WhyLausen />
        <HowItWorks />
        <Audience />
        <Regulation />
        <Faq />
        <Contact />
        <FinalCta />
      </main>
      <Footer />
      <RevealController />
    </SmoothScroll>
  );
}
