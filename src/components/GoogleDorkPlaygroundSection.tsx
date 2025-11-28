
import { useState } from "react";
import { Search, Copy, ExternalLink, Zap, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const quickDorks = [
  { label: "Site Search", syntax: "site:", example: "site:github.com" },
  { label: "File Type", syntax: "filetype:", example: "filetype:pdf" },
  { label: "In Title", syntax: "intitle:", example: 'intitle:"admin login"' },
  { label: "In URL", syntax: "inurl:", example: "inurl:admin" },
  { label: "In Text", syntax: "intext:", example: 'intext:"password"' },
  { label: "Cache", syntax: "cache:", example: "cache:example.com" }
];

const GoogleDorkPlaygroundSection = () => {
  const [dorkQuery, setDorkQuery] = useState("");
  const [isValidQuery, setIsValidQuery] = useState(true);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleQuickDork = (syntax: string) => {
    setDorkQuery(dorkQuery + syntax);
  };

  const handleSearch = () => {
    if (dorkQuery.trim()) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(dorkQuery)}`;
      window.open(searchUrl, '_blank');

      // Add to history
      const newHistory = [dorkQuery, ...searchHistory.slice(0, 4)];
      setSearchHistory(newHistory);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => {
      setCopiedText(null);
    }, 1500);
  };

  const validateQuery = (query: string) => {
    // Basic validation - check for common issues
    const hasOperator = quickDorks.some(dork => query.includes(dork.syntax));
    setIsValidQuery(hasOperator || query.length === 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDorkQuery(value);
    validateQuery(value);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Google Dork Playground
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Build and test your Google Dorks interactively with our playground
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Query Builder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mb-8 border-2 border-primary/20 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="text-primary" size={28} />
                  <h3 className="text-2xl font-bold text-foreground">Query Builder</h3>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      value={dorkQuery}
                      onChange={handleInputChange}
                      placeholder="Build your Google Dork query..."
                      className={`text-lg py-6 pr-12 ${!isValidQuery ? 'border-red-500' : ''}`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isValidQuery ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <AlertTriangle className="text-red-500" size={20} />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {quickDorks.map((dork) => (
                      <Button
                        key={dork.label}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickDork(dork.syntax)}
                        className="hover:bg-primary/10 hover:border-primary/50"
                      >
                        {dork.label}
                      </Button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleSearch}
                      disabled={!dorkQuery.trim()}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold"
                    >
                      <Search className="mr-2" size={20} />
                      Search Google
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(dorkQuery)}
                      disabled={!dorkQuery.trim()}
                      className="py-6"
                    >
                      {copiedText === dorkQuery ? (
                        <CheckCircle size={20} className="text-green-500" />
                      ) : (
                        <Copy size={20} />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="mb-8">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-foreground mb-6">Quick Examples</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {quickDorks.map((dork) => (
                    <div
                      key={dork.label}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setDorkQuery(dork.example)}
                    >
                      <div>
                        <div className="font-semibold text-foreground">{dork.label}</div>
                        <code className="text-sm text-muted-foreground">{dork.example}</code>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(dork.example);
                        }}
                      >
                        {copiedText === dork.example ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">Recent Searches</h3>
                  <div className="space-y-3">
                    {searchHistory.map((query, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <code className="text-sm text-foreground">{query}</code>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDorkQuery(query)}
                          >
                            Use
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(query)}
                          >
                            {copiedText === query ? (
                              <CheckCircle size={16} className="text-green-500" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-orange-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">Ethical Use Only</h4>
                    <p className="text-orange-700 text-sm">
                      This playground is for educational purposes. Always ensure you have proper authorization
                      before using Google Dorks for security research. Respect privacy and legal boundaries.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GoogleDorkPlaygroundSection;
