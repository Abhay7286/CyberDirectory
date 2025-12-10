import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Tool } from "@/data/tools";
import Loader from "@/components/Loader";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Contributor from "@/components/ContributorToolDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, ExternalLink, Github, Heart, Star, Calendar, Flag, ArrowLeft, Share2, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import ResourcesSection from "@/components/ResourceSection";
import ReviewSection from "@/components/ReviewSection";

const ToolDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [votes, setVotes] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [contributor, setContributor] = useState<any>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string | undefined | null) => {
    if (!userId) {
      console.error("Invalid userId provided for profile fetch");
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();  // Allows 0 or 1 row, no error if none found

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    if (!data) {
      console.warn(`No profile found for userId: ${userId}`);
      return null;
    }

    return data;
  };


  useEffect(() => {
    const fetchTools = async () => {
      try {
        const { data, error } = await supabase.from("tools").select("*");
        if (error) {
          console.error("Error fetching tools:", error);
          setError("Failed to load tool");
          setLoading(false);
          return;
        }
        const parsePgArray = (str: string | null | undefined) =>
          str?.startsWith("{") ? str.replace(/^{|}$/g, "").split(",") : [];
        const fixedTools = data.map((tool) => ({
          ...tool,
          tags: Array.isArray(tool.tags) ? tool.tags : parsePgArray(tool.tags),
        }));
        const foundTool = fixedTools.find((t) => String(t.id) === String(id));
        if (foundTool) {
          setTool(foundTool);
          setVotes(foundTool.votes || 0);
          if (foundTool.submitted_by) {
            console.log("Fetching contributor profile for user ID:", foundTool.submitted_by);
            const profile = await fetchUserProfile(foundTool.submitted_by);
            console.log("Fetched contributor profile:", profile);
            setContributor(profile);
          }
          const related = fixedTools
            .filter(t => t.category === foundTool.category && t.id !== foundTool.id)
            .slice(0, 5);
          setRelatedTools(related);
          setError(null);
        } else {
          setTool(null);
          setError("Tool not found");
        }
      } catch (error) {
        console.error("Error in fetchTools:", error);
        setError("Failed to load tool");
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, [id]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user || !tool) {
        setIsWishlisted(false);
        return;
      }
      const { data, error } = await supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", user.id)
        .eq("tool_id", tool.id)
        .single();
      if (error) {
        setIsWishlisted(false);
        return;
      }
      setIsWishlisted(Boolean(data));
    };
    checkWishlistStatus();
  }, [user, tool]);

  const handleWishlistToggle = async () => {
    if (!user || !tool) {
      toast({
        title: "Login required",
        description: "Please login to add/remove from wishlist.",
        variant: "destructive",
      });
      return;
    }
    try {
      if (isWishlisted) {
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("tool_id", tool.id);
        if (error) throw error;
        setIsWishlisted(false);
        toast({ title: "Removed from wishlist" });
      } else {
        const { error } = await supabase
          .from("wishlist")
          .insert([{ user_id: user.id, tool_id: tool.id }]);
        if (error) throw error;
        setIsWishlisted(true);
        toast({ title: "Added to wishlist" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!tool) return;
    const shareData = {
      title: tool.name,
      text: tool.description,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Tool link has been copied to clipboard.",
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Tool link has been copied to clipboard.",
        });
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Free":
        return "bg-green-100 text-green-800 border-green-200";
      case "Open Source":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Paid":
        return "bg-red-100 text-red-800 border-red-200";
      case "Freemium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const safeTool = {
    ...tool,
    name: tool?.name || "Unnamed Tool",
    description: tool?.description || "No description available.",
    category: tool?.category || "Uncategorized",
    type: tool?.type || "Unknown",
    trust_score: tool?.trust_score || 0,
    github_stars: tool?.github_stars || 0,
    tags: tool?.tags || [],
    last_updated: tool?.last_updated || new Date().toISOString(),
    submitted_by: tool?.submitted_by || "Unknown",
    votes: tool?.votes || 0,
    website: tool?.website || "#",
    github: tool?.github || null
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <Loader />
        <Footer />
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The tool you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/tools">Browse All Tools</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  function handleAskAI(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    toast({
      title: "Feature Coming Soon",
      description: "The 'Ask AI' feature is under development and will be available soon.",
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link to="/tools">
                <span className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Tools
                </span>
              </Link>
            </Button>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-3xl mb-2">{safeTool.name}</CardTitle>
                      <p className="text-muted-foreground text-lg mb-4">{safeTool.description}</p>
                      <div className="flex items-center space-x-4 mb-4">
                        <Badge variant="secondary" className="text-sm">{safeTool.category}</Badge>
                        <Badge variant="outline" className={`text-sm ${getTypeColor(safeTool.type)}`}>{safeTool.type}</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/report?tool=${safeTool.id}`}>
                          <span className="flex items-center">
                            <Flag className="h-4 w-4" />
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold mb-2">Trust Score</h3>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="text-xl font-bold">{safeTool.trust_score}</span>
                        <span className="text-muted-foreground">out of 5</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Community Support</h3>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Heart className={`h-4 w-4 ${isLiked ? "text-red-500 fill-current" : "text-gray-400"}`} />
                          <span>{safeTool.votes} votes</span>
                        </div>
                        {safeTool.github_stars > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{safeTool.github_stars.toLocaleString()} stars</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {safeTool.tags.length > 0 ? (
                        safeTool.tags.map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">No tags available</span>
                      )}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold mb-2">Last Updated</h3>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(safeTool.last_updated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleWishlistToggle}
                      variant={isWishlisted ? "default" : "outline"}
                      className={isWishlisted ? "bg-red-500 hover:bg-red-600" : ""}
                    >
                      <Heart
                        className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      />
                      {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                    </Button>
                    <Button asChild>
                      <a href={safeTool.website} target="_blank" rel="noopener noreferrer">
                        <span className="flex items-center">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Website
                        </span>
                      </a>
                    </Button>
                    {safeTool.github && (
                      <Button variant="outline" asChild>
                        <a href={safeTool.github} target="_blank" rel="noopener noreferrer" aria-label="View on GitHub">
                          <span className="flex items-center">
                            <Github className="mr-2 h-4 w-4" />
                            View on GitHub
                          </span>
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {contributor ? (
                <Contributor
                  name={contributor.full_name || contributor.username || 'Anonymous User'}
                  bio={contributor.bio}
                  role={contributor.email}
                  organization={contributor.organization}
                  avatarUrl={contributor.avatar_url}
                />
              ) : (
                <p className="text-muted-foreground justify-center align-center text-black">Contributor information not available.</p>
              )}

            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" asChild>
                    <a href={safeTool.website} target="_blank" rel="noopener noreferrer">
                      <span className="flex items-center">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Official Site
                      </span>
                    </a>
                  </Button>
                  {safeTool.github && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={safeTool.github} target="_blank" rel="noopener noreferrer">
                        <span className="flex items-center">
                          <Github className="mr-2 h-4 w-4" />
                          View Source Code
                        </span>
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/report?tool=${safeTool.id}`}>
                      <span className="flex items-center">
                        <Flag className="mr-2 h-4 w-4" />
                        Report Issue
                      </span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {relatedTools.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Related Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {relatedTools.map((relatedTool) => (
                        <div key={relatedTool.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <h4 className="font-medium">
                              <Link to={`/tools/${relatedTool.id}`} className="hover:text-primary">
                                {relatedTool.name}
                              </Link>
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {relatedTool.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Shield className="h-3 w-3 text-primary" />
                            <span className="text-sm">{relatedTool.trust_score || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        <ResourcesSection toolId={tool.id} />
        <div className="max-w-3xl mx-auto px-4 my-20">
          <ReviewSection toolId={tool.id} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ToolDetail;
