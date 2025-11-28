
import { useState } from "react";
import { ExternalLink, Star, Users, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const featuredProviders = [
  {
    name: "CyberSecure Pro",
    description: "Leading cybersecurity consulting firm with 15+ years of experience in penetration testing and security audits.",
    rating: 4.9,
    clients: "500+",
    specialties: ["Penetration Testing", "Security Audits", "Compliance"],
    image: "🛡️",
    color: "from-blue-500 to-cyan-500",
    featured: true,
    verified: true
  },
  {
    name: "RedTeam Solutions",
    description: "Elite red team specialists providing advanced threat simulation and security testing services.",
    rating: 4.8,
    clients: "200+",
    specialties: ["Red Team", "Threat Simulation", "Advanced Testing"],
    image: "🎯",
    color: "from-red-500 to-pink-500",
    featured: true,
    verified: true
  },
  {
    name: "SecureCode Labs",
    description: "Application security experts specializing in code review, SAST, and secure development practices.",
    rating: 4.7,
    clients: "300+",
    specialties: ["Code Review", "SAST", "Secure Development"],
    image: "💻",
    color: "from-green-500 to-emerald-500",
    featured: true,
    verified: true
  },
  {
    name: "CloudShield Security",
    description: "Cloud security specialists focusing on AWS, Azure, and GCP security assessments and configurations.",
    rating: 4.9,
    clients: "150+",
    specialties: ["Cloud Security", "AWS", "Azure", "GCP"],
    image: "☁️",
    color: "from-purple-500 to-indigo-500",
    featured: true,
    verified: true
  }
];

const FeaturedProvidersSection = () => {
  const [hoveredProvider, setHoveredProvider] = useState<number | null>(null);

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
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="text-primary" size={28} />
            <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2">
              Featured
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Top-Rated Security Providers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hand-picked cybersecurity professionals with proven track records and exceptional client satisfaction
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {featuredProviders.map((provider, index) => (
            <motion.div
              key={provider.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onHoverStart={() => setHoveredProvider(index)}
              onHoverEnd={() => setHoveredProvider(null)}
            >
              <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 border-2 hover:border-primary/20 group relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${provider.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${provider.color} shadow-lg`}>
                        <span className="text-3xl">{provider.image}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {provider.name}
                          </h3>
                          {provider.verified && (
                            <Badge className="bg-green-100 text-green-700">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="text-yellow-500" size={16} />
                            {provider.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            {provider.clients} clients
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {provider.description}
                  </p>
                  
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {provider.specialties.map((specialty) => (
                        <Badge
                          key={specialty}
                          variant="outline"
                          className="hover:bg-primary/10 hover:border-primary/50"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: hoveredProvider === index ? 1 : 0,
                      y: hoveredProvider === index ? 0 : 10
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold">
                        View Profile
                        <ExternalLink size={16} className="ml-2" />
                      </Button>
                      <Button variant="outline" className="hover:bg-primary/10 hover:border-primary/50">
                        Contact
                      </Button>
                    </div>
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
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <TrendingUp className="text-primary mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Want to Be Featured?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join our curated directory of top cybersecurity service providers
            </p>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3 text-lg font-semibold rounded-lg">
              Apply for Featured Status
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProvidersSection;
