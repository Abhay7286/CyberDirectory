import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Heart, Star, ExternalLink, Github } from "lucide-react";
import { Tool, toggleWishlist, toggleVote } from "@/data/tools";
import { getValidUrl } from "@/hooks/valid-url";

interface ToolCardProps {
  tool: Tool;
  isWishlisted?: boolean;
  onWishlistChange?: () => void;
  onVoteSuccess?: () => void;
}

const ToolCard = ({
  tool,
  isWishlisted = false,
  onWishlistChange,
  onVoteSuccess,
}: ToolCardProps) => {
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  if (!tool) {
    return <div className="border p-4 rounded-lg">Error: Invalid tool data</div>;
  }

  /** ❤️ Handle Wishlist (Like) */
  const handleWishlistToggle = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to manage your wishlist.",
        variant: "destructive",
      });
      return;
    }

    setIsWishlistLoading(true);
    try {
      // ✅ Save wishlist toggle to Supabase
      const { error } = await toggleWishlist(user.id, tool.id, isWishlisted);
      if (error) throw error;

      toast({
        title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        description: `${tool.name} has been ${
          isWishlisted ? "removed from" : "added to"
        } your wishlist.`,
      });

      onWishlistChange?.(); // trigger refresh parent state
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update wishlist",
        variant: "destructive",
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  /** ⭐ Vote */
  const handleVote = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to vote for tools.",
        variant: "destructive",
      });
      return;
    }

    setIsVoting(true);
    try {
      const { error } = await toggleVote(user.id, tool.id);
      if (error) throw error;

      toast({
        title: "Vote recorded",
        description: `Your vote for ${tool.name} has been counted.`,
      });

      onVoteSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to record vote",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  /** 🌐 Visit Website */
  const handleVisitWebsite = () => {
    const validUrl = getValidUrl(tool.website);
    if (!tool.website || !validUrl) {
      toast({
        title: "Website unavailable",
        description: "This tool does not provide a valid website link.",
        variant: "destructive",
      });
      return;
    }
    window.open(validUrl, "_blank", "noopener,noreferrer");
  };

  /** 🐙 GitHub Repo */
  const handleGithubClick = () => {
    if (!tool.github) {
      toast({
        title: "GitHub link unavailable",
        description: "This tool does not provide a GitHub repository link.",
        variant: "destructive",
      });
      return;
    }
    window.open(tool.github, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 h-full flex flex-col">
      <CardContent className="p-6 flex-1 flex flex-col">
        {/* Header row: title + wishlist */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-muted w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg text-primary">
              {tool.name[0]}
            </div>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {tool.category}
              </Badge>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className="text-muted-foreground hover:text-primary"
          >
            <Heart
              className={`h-5 w-5 ${
                isWishlisted ? "fill-primary text-primary" : ""
              }`}
            />
          </Button>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {(tool.tags || []).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Footer: votes + buttons */}
        <div className="flex items-center justify-between mt-auto">
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
            onClick={handleVote}
          >
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {(tool.trust_score || 0).toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({tool.votes ?? 0} votes)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* GitHub Btn */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGithubClick}
              className={!tool.github ? "opacity-50" : ""}
            >
              <Github className="h-4 w-4" />
            </Button>

            {/* Website Btn */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleVisitWebsite}
              className={`gap-2 ${!tool.website ? "opacity-50" : ""}`}
            >
              <ExternalLink className="h-4 w-4" />
              Visit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
