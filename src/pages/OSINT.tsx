
import Navigation from "@/components/Navigation";
import OSINTHeroSection from "@/components/OSINTHeroSection";
import OSINTProvidersSection from "@/components/OSINTProvidersSection";
import OSINTFeaturesSection from "@/components/OSINTFeaturesSection";
import OSINTTutorialsSection from "@/components/OSINTTutorialsSection";
import Footer from "@/components/Footer";

const OSINT = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />
      <OSINTHeroSection />
      <OSINTFeaturesSection />
      <OSINTProvidersSection />
      <OSINTTutorialsSection />
      <Footer />
    </div>
  );
};

export default OSINT;
