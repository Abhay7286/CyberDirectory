import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Shield, ExternalLink, Github, Heart, ArrowUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchTools, toggleWishlist, upvoteTool, fetchWishlistedTools, Tool } from "@/data/tools";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface ToolsListProps {
  searchQuery: string;
  selectedCategory: string;
  selectedType: string;
  sortBy: string;
  viewMode: "grid" | "list";
}

const ToolsList = ({ searchQuery, selectedCategory, selectedType, sortBy, viewMode }: ToolsListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tools, setTools] = useState<Tool[]>([]);
  const [wishlistedTools, setWishlistedTools] = useState<string[]>([]);
  const [votedTools, setVotedTools] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [toolsData, wishlistData] = await Promise.all([
          fetchTools(),
          user ? fetchWishlistedTools(user.id) : Promise.resolve([])
        ]);
        setTools(toolsData);
        setWishlistedTools(wishlistData);
      } catch (err) {
        console.error("Failed to load data:", {
          error: err,
          message: err instanceof Error ? err.message : "Unknown error"
        });
        setError(err instanceof Error ? err.message : 'Failed to load tools');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const searchTools = (query: string) => {
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase()) ||
      (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
    );
  };

  const normalizeFilterValue = (value: string) => value.toLowerCase().replace(/\s+/g, '-');

  let filteredTools = tools;

  if (searchQuery) {
    filteredTools = searchTools(searchQuery);
  }

  if (selectedCategory !== "all") {
    filteredTools = filteredTools.filter(tool => 
      tool.category && normalizeFilterValue(tool.category) === selectedCategory
    );
  }

  if (selectedType !== "all") {
    filteredTools = filteredTools.filter(tool => {
      if (!tool.type) return false;
      return normalizeFilterValue(tool.type) === selectedType;
    });
  }

  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "trust-score":
        return (b.trust_score || 0) - (a.trust_score || 0);
      case "popularity":
        return (b.votes || 0) - (a.votes || 0);
      case "recent":
        return new Date(b.last_updated || 0).getTime() - new Date(a.last_updated || 0).getTime();
      default:
        return 0;
    }
  });

  const handleWishlistToggle = async (toolId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to manage your wishlist.",
        variant: "destructive"
      });
      return;
    }

    try {
      const isWishlisted = wishlistedTools.includes(toolId);
      await toggleWishlist(user.id, toolId, isWishlisted);

      setWishlistedTools(prev =>
        isWishlisted
          ? prev.filter(id => id !== toolId)
          : [...prev, toolId]
      );

      toast({
        title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        description: `Tool has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
      });
    } catch (err) {
      console.error("Wishlist error:", err);
      setError(err instanceof Error ? err.message : 'Failed to update wishlist');
    }
  };

  const handleUpvote = async (toolId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to vote for tools.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await upvoteTool(user.id, toolId);

      if (error) {
        toast({
          title: "Vote failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setTools(prev => prev.map(tool =>
        tool.id === toolId ? { ...tool, votes: (tool.votes || 0) + 1 } : tool
      ));
      setVotedTools(prev => [...prev, toolId]);

      toast({
        title: "Vote recorded",
        description: "Your vote has been counted!",
      });
    } catch (error) {
      console.error('Error handling upvote:', error);
      toast({
        title: "Error",
        description: "Failed to record vote",
        variant: "destructive"
      });
    }
  };

  const getTypeColor = (type: string) => {
    if (!type) return "bg-gray-100 text-gray-800 border-gray-200";
    
    switch (type.toLowerCase()) {
      case "free":
        return "bg-green-100 text-green-800 border-green-200";
      case "open source":
      case "open-source":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "paid":
        return "bg-red-100 text-red-800 border-red-200";
      case "freemium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const ToolCard = ({ tool }: { tool: Tool }) => (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">
              <Link to={`/tools/${tool.id}`} className="hover:text-primary transition-colors">
                {tool.name}
              </Link>
            </CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {tool.description}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-1 ml-4">
            <Badge variant="secondary" className="text-xs">
              {tool.category || "Uncategorized"}
            </Badge>
            <Badge variant="outline" className={`text-xs ${getTypeColor(tool.type)}`}>
              {tool.type || "Unknown"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-3">
          {(tool.tags || []).slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tool.tags && tool.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tool.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{tool.trust_score || 0}</span>
            </div>
            {(tool.github_stars || 0) > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{(tool.github_stars || 0).toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <ArrowUp className={`h-4 w-4 ${votedTools.includes(tool.id) ? 'text-primary fill-current' : 'text-gray-400'}`} />
              <span className="text-sm">{tool.votes || 0}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{tool.last_updated ? new Date(tool.last_updated).toLocaleDateString() : "Unknown"}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleWishlistToggle(tool.id)}
              disabled={!user}
              className={wishlistedTools.includes(tool.id) ? 'text-red-500 border-red-200' : ''}
            >
              <Heart className={`h-3 w-3 ${wishlistedTools.includes(tool.id) ? 'fill-current' : ''}`} />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleUpvote(tool.id)}
              disabled={!user || votedTools.includes(tool.id)}
              className={votedTools.includes(tool.id) ? 'text-primary' : ''}
            >
              <ArrowUp className={`h-3 w-3 ${votedTools.includes(tool.id) ? 'fill-current' : ''}`} />
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={tool.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            {tool.github && (
              <Button size="sm" variant="outline" asChild>
                <a href={tool.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
          <Button size="sm" asChild>
            <Link to={`/tools/${tool.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ToolListItem = ({ tool }: { tool: Tool }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div>
                <h3 className="font-semibold text-lg">
                  <Link to={`/tools/${tool.id}`} className="hover:text-primary transition-colors">
                    {tool.name}
                  </Link>
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-1">
                  {tool.description}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {tool.category || "Uncategorized"}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${getTypeColor(tool.type)}`}>
                    {tool.type || "Unknown"}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3 text-primary" />
                    <span className="text-sm">{tool.trust_score || 0}</span>
                  </div>
                  {(tool.github_stars || 0) > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-sm">{(tool.github_stars || 0).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <ArrowUp className={`h-3 w-3 ${votedTools.includes(tool.id) ? 'text-primary fill-current' : 'text-gray-400'}`} />
                    <span className="text-sm">{tool.votes || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleWishlistToggle(tool.id)}
              disabled={!user}
              className={wishlistedTools.includes(tool.id) ? 'text-red-500 border-red-200' : ''}
            >
              <Heart className={`h-3 w-3 ${wishlistedTools.includes(tool.id) ? 'fill-current' : ''}`} />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleUpvote(tool.id)}
              disabled={!user || votedTools.includes(tool.id)}
              className={votedTools.includes(tool.id) ? 'text-primary' : ''}
            >
              <ArrowUp className={`h-3 w-3 ${votedTools.includes(tool.id) ? 'fill-current' : ''}`} />
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={tool.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            {tool.github && (
              <Button size="sm" variant="outline" asChild>
                <a href={tool.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-3 w-3" />
                </a>
              </Button>
            )}
            <Button size="sm" asChild>
              <Link to={`/tools/${tool.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p>Loading tools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500 py-12">
          <p>{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Cybersecurity Tools</h2>
        <p className="text-muted-foreground">
          Found {sortedTools.length} tools
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedCategory !== "all" && ` in ${selectedCategory.replace('-', ' ')}`}
          {selectedType !== "all" && ` (${selectedType.replace('-', ' ')})`}
        </p>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTools.map((tool) => (
            <ToolListItem key={tool.id} tool={tool} />
          ))}
        </div>
      )}

      {sortedTools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No tools found matching your criteria.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ToolsList;