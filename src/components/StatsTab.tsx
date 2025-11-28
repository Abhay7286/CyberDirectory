import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { type Tool } from "@/data/tools";

interface StatsTabProps {
  userTools: Tool[];
  wishlistTools: Tool[];
  joinDate?: string;
}

const StatsTab: React.FC<StatsTabProps> = ({ userTools, wishlistTools, joinDate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" /> Activity Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Member Since</span>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {joinDate ? new Date(joinDate).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Tools Submitted</span>
          <span className="text-sm font-bold">{userTools.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Wishlist Items</span>
          <span className="text-sm font-bold">{wishlistTools.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total Votes Received</span>
          <span className="text-sm font-bold">
            {userTools.reduce((sum, tool) => sum + (tool.votes || 0), 0)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsTab;
