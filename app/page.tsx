import type { Metadata } from "next";
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/home/HeroSection';
import ServicesGrid from './components/home/ServicesGrid';
import AudienceSegments from './components/home/AudienceSegments';
import BenefitsSection from './components/home/BenefitsSection';
import ToolsSection from './components/home/ToolsSection';
import CTASection from './components/home/CTASection';

export const metadata: Metadata = {
  title: "Virtual Sampling & Tech Pack Services | Virtuality Fashion",
  description: "Curated marketplace connecting fashion brands with vetted 3D designers and technical developers. Virtual sampling, tech packs, CLO3D & Browzwear services. Reduce samples by 70%, cut development time in half.",
  keywords: [
    "virtual sampling services",
    "tech pack services",
    "CLO3D services",
    "Browzwear services",
    "3D garment development",
    "reduce physical samples",
    "faster fashion development",
    "digital garment production",
    "fashion tech talent"
  ],
  openGraph: {
    title: "Virtual Sampling & Tech Pack Services | Virtuality Fashion",
    description: "Curated marketplace connecting fashion brands with vetted 3D designers. Reduce samples by 70%, cut development time in half.",
    url: "https://virtuality.fashion",
  },
  alternates: {
    canonical: "https://virtuality.fashion"
  }
};

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <ServicesGrid />
      <AudienceSegments />
      <BenefitsSection />
      <ToolsSection />
      <CTASection />
      <Footer />
    </>
  );
}
