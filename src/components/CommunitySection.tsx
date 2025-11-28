
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  MessageCircle, 
  Flag,
  Users,
  FileText,
  ThumbsUp
} from "lucide-react";

const communityActions = [
  {
    icon: Plus,
    title: "Submit New Tools",
    description: "Help grow our directory by submitting tools you've found useful",
    action: "Submit Tool",
    link: "/submit"
  },
  {
    icon: MessageCircle,
    title: "Share Reviews",
    description: "Rate and review tools to help other professionals make informed decisions",
    action: "Write Review",
    link: "/tools"
  },
  {
    icon: Flag,
    title: "Report Issues",
    description: "Help us maintain quality by reporting broken links or outdated information",
    action: "Report Issue",
    link: "/report"
  }
];

const CommunitySection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Users className="text-primary" size={48} />
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Help build the most comprehensive and trusted cybersecurity tools directory. 
            Your contributions make the community stronger and more reliable.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {communityActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 text-center">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-primary/10 rounded-xl">
                      <action.icon className="text-primary" size={32} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {action.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {action.description}
                  </p>
                  <Link to={action.link}>
                    <Button className="w-full">{action.action}</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Community Stats
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <FileText className="text-primary mb-3" size={32} />
                  <div className="text-3xl font-bold text-foreground mb-2">2,847</div>
                  <div className="text-muted-foreground">Tools Submitted</div>
                </div>
                <div className="flex flex-col items-center">
                  <ThumbsUp className="text-primary mb-3" size={32} />
                  <div className="text-3xl font-bold text-foreground mb-2">18,392</div>
                  <div className="text-muted-foreground">Reviews Written</div>
                </div>
                <div className="flex flex-col items-center">
                  <Users className="text-primary mb-3" size={32} />
                  <div className="text-3xl font-bold text-foreground mb-2">10,247</div>
                  <div className="text-muted-foreground">Active Members</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
