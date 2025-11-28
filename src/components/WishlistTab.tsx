import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import ToolCard from "@/components/ToolCard";
import ErrorBoundary from "@/components/ErrorBoundary";
import { type Tool } from "@/data/tools";

interface WishlistTabProps {
  wishlistTools: Tool[];
  fetchWishlistTools: () => void; // callback to refresh wishlist if needed
}

const WishlistTab: React.FC<WishlistTabProps> = ({ wishlistTools, fetchWishlistTools }) => {
  if (wishlistTools.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tools in wishlist</h3>
          <p className="text-muted-foreground">
            Start adding tools to your wishlist to keep track of your favorites.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex-wrap">
      {wishlistTools.map((tool) => (
        <ErrorBoundary key={tool.id} fallback={<div className="border p-4 rounded-lg">Failed to load tool</div>}>
          <ToolCard tool={tool} isWishlisted={true} onWishlistChange={fetchWishlistTools} />
        </ErrorBoundary>
      ))}
    </div>
  );
};

export default WishlistTab;
