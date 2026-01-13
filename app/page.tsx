import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/home/HeroSection';
import ServicesGrid from './components/home/ServicesGrid';
import AudienceSegments from './components/home/AudienceSegments';
import BenefitsSection from './components/home/BenefitsSection';
import ToolsSection from './components/home/ToolsSection';
import CTASection from './components/home/CTASection';

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
