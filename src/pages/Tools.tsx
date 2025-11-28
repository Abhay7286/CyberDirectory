import { useState } from "react";
import Navigation from "@/components/Navigation";
import SearchAndFilters from "@/components/SearchAndFilters";
import ToolsList from "@/components/ToolsList";
import Footer from "@/components/Footer";

const Tools = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("trust-score");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-2">
        <SearchAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <ToolsList
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedType={selectedType}
          sortBy={sortBy}
          viewMode={viewMode}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Tools;
