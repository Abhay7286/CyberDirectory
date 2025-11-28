
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Users, 
  CheckCircle, 
  Star,
  Eye,
  Award
} from "lucide-react";

const trustFeatures = [
  {
    icon: Users,
    title: "Community Ratings",
    description: "Tools are rated and reviewed by real cybersecurity professionals based on their experience."
  },
  {
    icon: CheckCircle,
    title: "Expert Verification",
    description: "Our team of security experts validates tool authenticity, safety, and effectiveness."
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "See who rated each tool, read detailed reviews, and understand the reasoning behind ratings."
  },
  {
    icon: Award,
    title: "Trust Scores",
    description: "Comprehensive scoring based on community feedback, expert analysis, and tool maintenance."
  }
];

const TrustModelSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Shield className="text-primary" size={48} />
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Built on Trust
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our trust model combines community wisdom with expert validation 
            to ensure you can confidently choose the right tools for your security needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <feature.icon className="text-primary" size={32} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Card className="max-w-4xl mx-auto bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                <Star className="text-yellow-500 fill-current" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                How We Calculate Trust Scores
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our trust algorithm considers multiple factors: community ratings, expert reviews, 
                tool maintenance status, security track record, and adoption by security professionals. 
                Scores are updated regularly to reflect the latest information.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">40%</div>
                  <div className="text-sm text-muted-foreground">Community Reviews</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">35%</div>
                  <div className="text-sm text-muted-foreground">Expert Analysis</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">25%</div>
                  <div className="text-sm text-muted-foreground">Technical Metrics</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustModelSection;
