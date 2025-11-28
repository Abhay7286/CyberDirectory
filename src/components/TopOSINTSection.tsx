
import { ExternalLink, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const topOSINTTools = [
  {
    name: "Shodan",
    description: "Search engine for Internet-connected devices",
    url: "https://shodan.io"
  },
  {
    name: "Censys",
    description: "Internet-wide asset discovery and attack surface management",
    url: "https://censys.io"
  },
  {
    name: "Maltego",
    description: "Link analysis and data mining platform for investigations",
    url: "https://maltego.com"
  }
];

const TopOSINTSection = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Top OSINT Tools
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Essential open-source intelligence tools for cybersecurity research and investigations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {topOSINTTools.map((tool) => (
            <Card key={tool.name} className="bg-gray-800/50 border border-gray-700 hover:border-green-500/50 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Network className="text-green-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{tool.name}</h3>
                <p className="text-gray-400 mb-6">{tool.description}</p>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => window.open(tool.url, '_blank')}
                >
                  Visit Tool
                  <ExternalLink size={16} className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/osint">
            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-8 py-3 text-lg font-semibold">
              Explore All OSINT Tools
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopOSINTSection;
