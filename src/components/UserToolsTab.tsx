import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ToolCard from "@/components/ToolCard";
import { type Tool } from "@/data/tools";
import { useNavigate } from "react-router-dom";

interface UserToolsTabProps {
  userTools: Tool[];
}

const UserToolsTab: React.FC<UserToolsTabProps> = ({ userTools }) => {
  const navigate = useNavigate();

  if (userTools.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Plus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tools submitted</h3>
          <p className="text-muted-foreground">Share your favorite cybersecurity tools with the community.</p>
          <Button className="mt-4" onClick={() => navigate("/submit-tool")}>
            Submit Your First Tool
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex-wrap">
      {userTools.map((tool) => (
        <div key={tool.id} className="mb-4">
          <ToolCard tool={tool} />
        </div>
      ))}
    </div>
  );
};

export default UserToolsTab;

