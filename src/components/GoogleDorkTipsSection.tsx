
import { useState } from "react";
import { Lightbulb, Shield, Target, Zap, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const tips = [
  {
    category: "Basic Techniques",
    icon: Lightbulb,
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    tips: [
      {
        title: "Use Quotation Marks",
        description: "Wrap exact phrases in quotes to find precise matches",
        example: '"login page"',
        difficulty: "Beginner"
      },
      {
        title: "Combine Operators",
        description: "Stack multiple operators for more specific results",
        example: 'site:github.com filetype:txt "password"',
        difficulty: "Beginner"
      },
      {
        title: "Use Wildcards",
        description: "The asterisk (*) acts as a wildcard for unknown words",
        example: 'site:*.edu "student * database"',
        difficulty: "Intermediate"
      }
    ]
  },
  {
    category: "Advanced Search",
    icon: Target,
    color: "from-blue-500 to-purple-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    tips: [
      {
        title: "Date Range Filtering",
        description: "Use daterange: to find content from specific time periods",
        example: 'site:news.com daterange:2023-01-01..2023-12-31',
        difficulty: "Advanced"
      },
      {
        title: "Exclude Terms",
        description: "Use minus (-) to exclude specific terms from results",
        example: 'hacking -tutorial -course',
        difficulty: "Intermediate"
      },
      {
        title: "Number Ranges",
        description: "Search for numbers within specific ranges",
        example: 'price:$100..$500',
        difficulty: "Intermediate"
      }
    ]
  },
  {
    category: "Security Research",
    icon: Shield,
    color: "from-green-500 to-teal-500",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    tips: [
      {
        title: "Find Configuration Files",
        description: "Look for exposed configuration files",
        example: 'filetype:ini "database" OR "config"',
        difficulty: "Advanced"
      },
      {
        title: "Directory Traversal",
        description: "Find open directories and file listings",
        example: 'intitle:"Index of" parent directory',
        difficulty: "Advanced"
      },
      {
        title: "Error Messages",
        description: "Search for error messages that reveal information",
        example: 'intext:"SQL syntax" OR "mysql_fetch"',
        difficulty: "Expert"
      }
    ]
  },
  {
    category: "Productivity Hacks",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    tips: [
      {
        title: "Save Complex Queries",
        description: "Bookmark frequently used dork combinations",
        example: 'site:linkedin.com "security engineer" "hiring"',
        difficulty: "Beginner"
      },
      {
        title: "Use Google Operators",
        description: "Combine Google's built-in operators for better results",
        example: 'related:example.com OR link:example.com',
        difficulty: "Intermediate"
      },
      {
        title: "Regional Searches",
        description: "Use location-specific searches for targeted results",
        example: 'site:gov.uk "vulnerability assessment"',
        difficulty: "Intermediate"
      }
    ]
  }
];

const GoogleDorkTipsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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
            Pro Tips & Techniques
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master advanced Google Dork techniques with expert tips and real-world examples
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {/* Category Tabs */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {tips.map((category, index) => (
              <motion.button
                key={category.category}
                onClick={() => setSelectedCategory(index)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                  selectedCategory === index
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : `${category.bgColor} ${category.textColor} hover:shadow-md`
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon size={20} />
                <span className="font-semibold">{category.category}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Tips Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {tips[selectedCategory].tips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className={getDifficultyColor(tip.difficulty)}>
                        {tip.difficulty}
                      </Badge>
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${tips[selectedCategory].color}`}>
                        <CheckCircle className="text-white" size={16} />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {tip.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {tip.description}
                    </p>
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="text-sm font-semibold text-muted-foreground mb-2">
                        Example:
                      </div>
                      <code className="text-sm text-foreground font-mono bg-background p-2 rounded block">
                        {tip.example}
                      </code>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Best Practices */}
          <motion.div 
            className="mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="text-primary" size={28} />
                  <h3 className="text-2xl font-bold text-foreground">Best Practices</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold text-foreground">Always Get Permission</h4>
                        <p className="text-sm text-muted-foreground">
                          Only search for information you're authorized to find
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold text-foreground">Respect Rate Limits</h4>
                        <p className="text-sm text-muted-foreground">
                          Don't overwhelm servers with rapid-fire queries
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold text-foreground">Document Your Findings</h4>
                        <p className="text-sm text-muted-foreground">
                          Keep detailed records of your research methodology
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold text-foreground">Stay Updated</h4>
                        <p className="text-sm text-muted-foreground">
                          Google's algorithms change; adapt your techniques
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GoogleDorkTipsSection;
