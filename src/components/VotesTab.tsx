import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Calendar } from "lucide-react";
import { type VoteHistory } from "@/data/tools";

interface VotesTabProps {
  votingHistory: VoteHistory[];
}

const VotesTab: React.FC<VotesTabProps> = ({ votingHistory }) => {
  if (votingHistory.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="h-12 w-12 mx-auto text-muted-foreground mb-4 flex items-center justify-center">
            <ArrowUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No voting history</h3>
          <p className="text-muted-foreground">Your votes on tools will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {votingHistory.map((vote) => {
        const voteDate = new Date(vote.created_at);
        const isValidDate = !isNaN(voteDate.getTime());

        return (
          <Card key={`${vote.tool_id}-${vote.created_at}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{vote.tool_name || "Unnamed Tool"}</h3>
                  {(vote.tool_category || vote.tool_type) && (
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {vote.tool_category && (
                        <Badge variant="secondary" className="truncate max-w-[120px] text-[9px]">
                          {vote.tool_category}
                        </Badge>
                      )}
                      {vote.tool_type && (
                        <Badge variant="outline" className="truncate max-w-[120px]">
                          {vote.tool_type}
                        </Badge>
                      )}
                    </div>
                  )}
                  {vote.comment && (
                    <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                      "{vote.comment}"
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <Badge variant={vote.vote_type === "upvote" ? "default" : "destructive"} className="mb-2">
                    {vote.vote_type === "upvote" ? "Upvoted" : "Downvoted"}
                  </Badge>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {isValidDate ? voteDate.toLocaleDateString() : "Unknown date"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default VotesTab;
