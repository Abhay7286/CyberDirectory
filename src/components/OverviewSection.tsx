
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const overviewCards = [
  {
    icon: "🛡️",
    title: "Security Providers",
    description: "Discover trusted cybersecurity companies offering penetration testing, security consulting, and risk management services.",
    link: "/providers"
  },
  {
    icon: "🧰",
    title: "OSINT Tools",
    description: "Access powerful open-source intelligence tools for research, investigation, and security analysis.",
    link: "/osint"
  },
  {
    icon: "🔍",
    title: "Google Dorks",
    description: "Master advanced search operators to find hidden information and exposed data for ethical research.",
    link: "/google-dork"
  }
];

const OverviewSection = () => {
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

  const cardVariants = {
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 
            className="text-4xl font-bold text-black mb-4"
            variants={itemVariants}
          >
            What You'll Find
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Everything you need to navigate the cybersecurity landscape
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {overviewCards.map((card, index) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white border-2 border-gray-200 hover:border-black transition-all duration-300 group h-full">
                <CardContent className="p-8 text-center">
                  <motion.div 
                    className="text-4xl mb-4"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {card.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-black mb-4">{card.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{card.description}</p>
                  <Link to={card.link}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button 
                        variant="outline" 
                        className="border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                      >
                        Explore
                      </Button>
                    </motion.div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OverviewSection;
