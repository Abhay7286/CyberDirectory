
import { Search, Database, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const OSINTHeroSection = () => {
  const scrollToTools = () => {
    const element = document.getElementById("osint-tools");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-black text-white pt-32 pb-20">
      <div className="container mx-auto px-6 text-center">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 leading-tight"
            variants={itemVariants}
          >
            Professional OSINT Tools Directory
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto mt-4"
            variants={itemVariants}
          >
            Discover the most effective open-source intelligence tools for cybersecurity research, 
            threat hunting, and investigative analysis.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16 mt-8"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                onClick={scrollToTools}
                className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-300 min-w-[200px] hover:shadow-lg transform hover:shadow-white/20"
              >
                🧰 Explore Tools
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                variant="outline" 
                className="border-2 border-black bg-black text-white hover:bg-gray-800 hover:border-gray-800 px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-300 min-w-[200px] hover:shadow-lg hover:shadow-black/20"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                📋 Browse Categories
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Features Grid */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mt-12"
            variants={containerVariants}
          >
            <motion.div 
              className="text-center group cursor-pointer"
              variants={featureVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 group-hover:bg-white/20 transition-all duration-300"
                whileHover={{ rotate: 5 }}
              >
                <Database className="text-white" size={32} />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-200 transition-colors">Domain Analysis</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors">Comprehensive domain and DNS investigation tools</p>
            </motion.div>
            
            <motion.div 
              className="text-center group cursor-pointer"
              variants={featureVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 group-hover:bg-white/20 transition-all duration-300"
                whileHover={{ rotate: 5 }}
              >
                <Search className="text-white" size={32} />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-200 transition-colors">Asset Discovery</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors">Find and analyze internet-exposed assets</p>
            </motion.div>
            
            <motion.div 
              className="text-center group cursor-pointer"
              variants={featureVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 group-hover:bg-white/20 transition-all duration-300"
                whileHover={{ rotate: 5 }}
              >
                <Eye className="text-white" size={32} />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-200 transition-colors">People Search</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors">Professional identity verification and research</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default OSINTHeroSection;
