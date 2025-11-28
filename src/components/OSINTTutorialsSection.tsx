
import { useState } from "react";
import { Play, Clock, BookOpen, Users, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const tutorials = [
  {
    title: "OSINT Fundamentals",
    description: "Master the basics of open source intelligence gathering",
    duration: "45 min",
    level: "Beginner",
    students: "12.5k",
    rating: 4.8,
    image: "🎯",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Social Media Intelligence",
    description: "Advanced techniques for social media investigation",
    duration: "60 min",
    level: "Intermediate",
    students: "8.2k",
    rating: 4.9,
    image: "📱",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Domain & Infrastructure Analysis",
    description: "Deep dive into DNS, WHOIS, and network reconnaissance",
    duration: "90 min",
    level: "Advanced",
    students: "5.7k",
    rating: 4.7,
    image: "🌐",
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Email & Identity Research",
    description: "Techniques for email investigation and identity verification",
    duration: "55 min",
    level: "Intermediate",
    students: "9.1k",
    rating: 4.8,
    image: "📧",
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Geolocation & Mapping",
    description: "Location intelligence and geospatial analysis",
    duration: "75 min",
    level: "Advanced",
    students: "4.3k",
    rating: 4.9,
    image: "🗺️",
    color: "from-indigo-500 to-blue-500"
  },
  {
    title: "Dark Web Investigation",
    description: "Ethical approaches to dark web research and monitoring",
    duration: "120 min",
    level: "Expert",
    students: "2.8k",
    rating: 4.6,
    image: "🔒",
    color: "from-gray-600 to-gray-800"
  }
];

const OSINTTutorialsSection = () => {
  const [selectedTutorial, setSelectedTutorial] = useState<number | null>(null);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-700";
      case "Intermediate": return "bg-yellow-100 text-yellow-700";
      case "Advanced": return "bg-orange-100 text-orange-700";
      case "Expert": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Interactive OSINT Tutorials
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn from industry experts with hands-on tutorials and real-world scenarios
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tutorials.map((tutorial, index) => (
            <motion.div
              key={tutorial.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onHoverStart={() => setSelectedTutorial(index)}
              onHoverEnd={() => setSelectedTutorial(null)}
            >
              <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 border-2 hover:border-primary/20 group">
                <CardContent className="p-0">
                  <div className={`h-48 bg-gradient-to-br ${tutorial.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">{tutorial.image}</span>
                    </div>
                    <motion.div 
                      className="absolute inset-0 bg-black/60 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: selectedTutorial === index ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button 
                        size="lg" 
                        className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
                      >
                        <Play size={20} className="mr-2" />
                        Start Tutorial
                      </Button>
                    </motion.div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getLevelColor(tutorial.level)}>
                        {tutorial.level}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock size={14} />
                        {tutorial.duration}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {tutorial.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {tutorial.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          {tutorial.students}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500" />
                          {tutorial.rating}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
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
            <BookOpen className="text-primary mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Become an OSINT Expert?
            </h3>
            <p className="text-muted-foreground mb-6">
              Access our complete library of tutorials, tools, and resources
            </p>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3 text-lg font-semibold rounded-lg">
              Start Learning Now
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OSINTTutorialsSection;
