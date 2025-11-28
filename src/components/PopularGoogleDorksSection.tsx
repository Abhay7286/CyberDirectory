
import { Lock, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const popularDorks = [
  {
    syntax: "site:example.com",
    description: "Search within a specific domain"
  },
  {
    syntax: "filetype:pdf",
    description: "Find specific file types"
  },
  {
    syntax: "intitle:\"index of\"",
    description: "Find directory listings"
  }
];

const PopularGoogleDorksSection = () => {
  return (
    <section className="py-20 bg-gray-800/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Popular Google Dorks
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Master advanced search operators for ethical OSINT research and security testing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {popularDorks.map((dork) => (
            <Card key={dork.syntax} className="bg-gray-900/50 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="text-purple-400" size={24} />
                </div>
                <code className="text-lg font-mono text-purple-400 mb-3 block">{dork.syntax}</code>
                <p className="text-gray-400 mb-6">{dork.description}</p>
                <Button
                  variant="outline"
                  className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  onClick={() => navigator.clipboard.writeText(dork.syntax)}
                >
                  <Copy size={16} className="mr-2" />
                  Copy Syntax
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/google-dork">
            <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-8 py-3 text-lg font-semibold">
              Master All Google Dorks
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularGoogleDorksSection;
