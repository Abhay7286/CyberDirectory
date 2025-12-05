
import { useState } from "react";
import { Search, Shield, Eye, Database, Network, Globe, Users, Target, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: Search,
    title: "Advanced Search",
    description: "Master sophisticated search techniques across multiple platforms",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600"
  },
  {
    icon: Shield,
    title: "Security Research",
    description: "Ethical methodologies for cybersecurity investigations",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    textColor: "text-green-600"
  },
  {
    icon: Eye,
    title: "Digital Footprints",
    description: "Track and analyze online presence and digital traces",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600"
  },
  {
    icon: Database,
    title: "Data Analysis",
    description: "Process and correlate information from multiple sources",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600"
  },
  {
    icon: Network,
    title: "Network Intelligence",
    description: "Infrastructure mapping and network reconnaissance",
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600"
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Worldwide data sources and international resources",
    color: "from-teal-500 to-green-500",
    bgColor: "bg-teal-50",
    textColor: "text-teal-600"
  }
];

const OSINTFeaturesSection = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Master OSINT Techniques
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Develop professional-grade open source intelligence skills with our comprehensive toolkit
          </p>
        </motion.div>

        <div className="my-8 flex justify-center">
          <div id="ezoic-pub-ad-placeholder-115"></div>
        </div>

        <div className="my-8 flex justify-center">
          <div id="ezoic-pub-ad-placeholder-114"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onHoverStart={() => setHoveredFeature(index)}
              onHoverEnd={() => setHoveredFeature(null)}
            >
              <Card className={`h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-2 hover:border-primary/20 ${feature.bgColor}`}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <feature.icon className="text-white" size={32} />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold ${feature.textColor} mb-2`}>
                        {feature.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: hoveredFeature === index ? 1 : 0,
                      height: hoveredFeature === index ? "auto" : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      variant="outline"
                      className={`w-full border-2 ${feature.textColor} hover:bg-gradient-to-r ${feature.color} hover:text-white transition-all duration-300`}
                    >
                      Learn More
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-black to-gray-950 rounded-2xl p-8 max-w-4xl mx-auto text-white">
            <div className="flex items-center justify-center gap-6 mb-6">
              <Users className="text-white" size={32} />
              <Target className="text-gray-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center space-x-3">
              <span>Join Our Community on WhatsApp</span>
            </h3>
            <p className="text-gray-300 mb-8 text-center max-w-xl mx-auto">
              Connect with professionals, share techniques, and stay updated on the latest Cyber methodologies.
            </p>
            <div className="flex justify-center">
              <Button className="bg-gradient-to-r from-white to-gray-300 text-black px-8 py-3 text-lg font-semibold rounded-lg shadow-md hover:from-gray-300 hover:to-white transition-colors duration-300">
                <a
                  href="https://chat.whatsapp.com/JNAaD8vRyVQFem7Tt7lx5N"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-400 flex items-center space-x-2 transition-colors duration-200"
                  aria-label="Join WhatsApp Community"
                >
                  <MessageCircle className="h-6 w-6" style={{ filter: "invert(1)" }} />
                  <span className="text-black">Join Now</span>
                </a>
              </Button>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default OSINTFeaturesSection;
