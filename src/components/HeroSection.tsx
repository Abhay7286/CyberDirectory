
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Shield, Users, Star } from "lucide-react";

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  const stats = [
    { icon: Shield, value: "500+", label: "Verified Tools" },
    { icon: Users, value: "10K+", label: "Community Members" },
    { icon: Star, value: "4.8", label: "Average Rating" },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center bg-black text-white pt-32 pb-20">
      <div className="container mx-auto px-6 text-center">
        <motion.div 
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight text-foreground text-white">
              Your Trusted AI-powered
              <span className="text-primary text-white"> Cybersecurity</span>
              <br />Tools Directory
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto text-white">
              Discover, evaluate, and trust the best cybersecurity tools. 
              Curated by experts, rated by the community, organized for professionals.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <Link to="/tools" className="flex-1">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold rounded-lg">
                  <Search className="mr-2" size={20} />
                  Browse Tools
                </Button>
              </Link>
              <Link to="/submit" className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full border-2 px-8 py-6 text-lg font-semibold rounded-lg text-black"
                >
                  Submit Tool
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center p-6 bg-card rounded-xl border">
                  <stat.icon className="text-primary mb-3" size={32} />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
