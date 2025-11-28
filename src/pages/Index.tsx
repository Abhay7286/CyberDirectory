
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CategoryOverview from "@/components/CategoryOverview";
import FeaturedTools from "@/components/FeaturedTools";
import TrustModelSection from "@/components/TrustModelSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <CategoryOverview />
      <FeaturedTools />
      <TrustModelSection />
      <CommunitySection />
      <Footer />
    </div>
  );
};

export default Index;
