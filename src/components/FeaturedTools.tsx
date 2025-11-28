import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, Github, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; 
import { Tool } from "@/lib/supabase"; 

const FeaturedTools = () => {
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedTools = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('featured', true)
          .order('trust_score', { ascending: false })
          .limit(3);

        if (error) {
          throw error;
        }

        if (data) {
          setFeaturedTools(data);
          console.log("Featured tools fetched:", data);
        }
      } catch (err) {
        console.error("Error fetching featured tools:", err);
        setError("Failed to load featured tools. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTools();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <p>Loading featured tools...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Featured Tools
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the most trusted and widely-used cybersecurity tools, 
            vetted by our community and security experts.
          </p>
        </motion.div>

        {featuredTools.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
            {featuredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{tool.name}</h3>
                        <Badge variant="secondary" className="mb-2">{tool.category}</Badge>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          variant={tool.type === 'Free' ? 'default' : 'outline'}
                          className={tool.type === 'Free' ? 'bg-green-500 text-white' : ''}
                        >
                          {tool.type}
                        </Badge>
                        <div className="text-sm font-medium text-primary">
                          Trust: {tool.trust_score}%
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {tool.description}
                    </p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      {tool.average_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="text-yellow-500 fill-current" size={16} />
                          <span className="font-medium">{tool.average_rating.toFixed(1)}</span>
                          <span>({tool.total_reviews || 0})</span>
                        </div>
                      )}
                      {tool.github_stars && (
                        <div className="flex items-center gap-1">
                          <Github size={16} />
                          <span>{tool.github_stars.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {tool.tags && tool.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tool.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <a href={tool.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={16} className="mr-2" />
                          Visit Site
                        </a>
                      </Button>
                      <Link to={`/tools/${tool.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured tools found.</p>
          </div>
        )}

        <div className="text-center">
          <Link to="/tools">
            <Button size="lg" variant="outline" className="px-8">
              View All Tools
              <Users className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTools;