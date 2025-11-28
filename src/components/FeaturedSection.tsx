
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const featuredItems = [
  {
    name: "Shodan",
    category: "OSINT",
    description: "Search engine for Internet-connected devices",
    url: "https://shodan.io",
    tag: "IP Lookup"
  },
  {
    name: "Rapid7",
    category: "Provider",
    description: "Enterprise vulnerability management services",
    url: "https://rapid7.com",
    tag: "PenTest"
  },
  {
    name: "Maltego",
    category: "OSINT",
    description: "Link analysis and data mining platform",
    url: "https://maltego.com",
    tag: "Investigation"
  },
  {
    name: "CrowdStrike",
    category: "Provider",
    description: "AI-powered endpoint protection platform",
    url: "https://crowdstrike.com",
    tag: "Threat Detection"
  },
  {
    name: "Censys",
    category: "OSINT",
    description: "Internet-wide asset discovery platform",
    url: "https://censys.io",
    tag: "Asset Discovery"
  },
  {
    name: "Mandiant",
    category: "Provider",
    description: "Advanced threat intelligence and response",
    url: "https://mandiant.com",
    tag: "Threat Intel"
  }
];

const FeaturedSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="py-20 bg-gray-50">
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
            Featured Tools & Providers
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Handpicked resources trusted by cybersecurity professionals worldwide
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.name}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 group h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <motion.span 
                      className="text-xs font-semibold px-2 py-1 bg-black text-white rounded"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.tag}
                    </motion.span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      size="sm"
                      className="w-full bg-black text-white hover:bg-gray-800 transition-colors duration-300"
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      Visit Site
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedSection;
