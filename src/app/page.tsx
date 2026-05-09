import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/stats";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { FAQ } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative pt-16">
        <Hero />
        <SocialProof />
        <HowItWorks />
        <Features />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
