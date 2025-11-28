import Navigation from "@/components/Navigation";
import GoogleDorkHeroSection from "@/components/GoogleDorkHeroSection";
import GoogleDorkExamplesSection from "@/components/GoogleDorkExamplesSection";
import GoogleDorkPlaygroundSection from "@/components/GoogleDorkPlaygroundSection";
import GoogleDorkTipsSection from "@/components/GoogleDorkTipsSection";
import Footer from "@/components/Footer";

const GoogleDork = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />
      <GoogleDorkHeroSection />
      <GoogleDorkPlaygroundSection />
      <GoogleDorkExamplesSection />
      <GoogleDorkTipsSection />
      <Footer />
    </div>
  );
};

export default GoogleDork;
