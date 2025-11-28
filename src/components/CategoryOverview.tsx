
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  Shield, 
  Eye, 
  Zap, 
  Database, 
  Network,
  Lock,
  Bug
} from "lucide-react";

const categories = [
  {
    name: "OSINT",
    description: "Open-source intelligence gathering and analysis tools",
    icon: Eye,
    count: 85,
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    name: "Vulnerability Scanners",
    description: "Tools for identifying security vulnerabilities",
    icon: Search,
    count: 42,
    color: "bg-red-500/10 text-red-500"
  },
  {
    name: "Network Security",
    description: "Network monitoring and security analysis tools",
    icon: Network,
    count: 67,
    color: "bg-green-500/10 text-green-500"
  },
  {
    name: "Threat Intelligence",
    description: "Intelligence platforms and threat detection systems",
    icon: Shield,
    count: 38,
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    name: "Penetration Testing",
    description: "Red team and penetration testing frameworks",
    icon: Zap,
    count: 54,
    color: "bg-orange-500/10 text-orange-500"
  },
  {
    name: "Forensics",
    description: "Digital forensics and incident response tools",
    icon: Database,
    count: 29,
    color: "bg-cyan-500/10 text-cyan-500"
  },
  {
    name: "Cryptography",
    description: "Encryption and cryptographic analysis tools",
    icon: Lock,
    count: 33,
    color: "bg-indigo-500/10 text-indigo-500"
  },
  {
    name: "Malware Analysis",
    description: "Malware detection and reverse engineering tools",
    icon: Bug,
    count: 21,
    color: "bg-pink-500/10 text-pink-500"
  }
];

const CategoryOverview = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Browse by Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive collection of cybersecurity tools, 
            organized by function and use case for easy discovery.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={`/tools?category=${category.name.toLowerCase().replace(' ', '-')}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <category.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="text-sm font-medium text-primary">
                      {category.count} tools →
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryOverview;
