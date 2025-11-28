import { useState } from "react";
import { Search, Copy, Check, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

const googleDorks = [
  {
    category: "File Discovery",
    syntax: "filetype:pdf site:example.com",
    description: "Find PDF files on a specific website.",
    example: "filetype:pdf site:microsoft.com",
    risk: "Low"
  },
  {
    category: "File Discovery",
    syntax: "filetype:docx site:example.com",
    description: "Find Word documents on a specific website.",
    example: "filetype:docx site:harvard.edu",
    risk: "Low"
  },
  {
    category: "Directory Listing",
    syntax: "intitle:\"index of\" site:example.com",
    description: "Find open directory listings on a specific website.",
    example: 'intitle:"index of" site:apache.org',
    risk: "Medium"
  },
  {
    category: "Directory Listing",
    syntax: "intitle:\"parent directory\" site:example.com",
    description: "Find parent directory listings on a specific website.",
    example: 'intitle:"parent directory" site:mozilla.org',
    risk: "Medium"
  },
  {
    category: "Database Exploits",
    syntax: "inurl:.php?id= site:example.com",
    description: "Find potential SQL injection points on a specific website.",
    example: "inurl:.php?id= site:gov",
    risk: "High"
  },
  {
    category: "Database Exploits",
    syntax: "inurl:wp-content site:example.com",
    description: "Find WordPress content directories.",
    example: "inurl:wp-content site:nytimes.com",
    risk: "Low"
  },
  {
    category: "Login Pages",
    syntax: "inurl:login.php site:example.com",
    description: "Find login pages on a specific website.",
    example: "inurl:login.php site:bankofamerica.com",
    risk: "Medium"
  },
  {
    category: "Login Pages",
    syntax: "intitle:\"Sign In\" site:example.com",
    description: "Find sign-in pages on a specific website.",
    example: 'intitle:"Sign In" site:amazon.com',
    risk: "Medium"
  },
  {
    category: "Vulnerable Servers",
    syntax: "intitle:\"Apache2 Ubuntu Default Page\" site:example.com",
    description: "Find default Apache server pages on Ubuntu.",
    example: 'intitle:"Apache2 Ubuntu Default Page" site:edu',
    risk: "High"
  },
  {
    category: "Vulnerable Servers",
    syntax: "intitle:\"IIS Windows Server\" site:example.com",
    description: "Find default IIS server pages on Windows Server.",
    example: 'intitle:"IIS Windows Server" site:gov',
    risk: "High"
  },
  {
    category: "Error Messages",
    syntax: "intext:\"SQL syntax near\" site:example.com",
    description: "Find SQL syntax errors on a specific website.",
    example: 'intext:"SQL syntax near" site:wikipedia.org',
    risk: "High"
  },
  {
    category: "Error Messages",
    syntax: "intext:\"Warning: mysqli_connect()\" site:example.com",
    description: "Find MySQL connection warnings on a specific website.",
    example: 'intext:"Warning: mysqli_connect()" site:wordpress.org',
    risk: "High"
  },
  {
    category: "Network Information",
    syntax: "site:example.com intext:\"@example.com\"",
    description: "Find email addresses associated with a specific domain.",
    example: "site:mit.edu intext:\"@mit.edu\"",
    risk: "Low"
  },
  {
    category: "Network Information",
    syntax: "site:example.com intext:\"password is\"",
    description: "Find potential password leaks on a specific website.",
    example: "site:github.com intext:\"password is\"",
    risk: "High"
  },
  {
    category: "Sensitive Files",
    syntax: "filetype:log site:example.com",
    description: "Find log files on a specific website.",
    example: "filetype:log site:nasa.gov",
    risk: "Medium"
  },
  {
    category: "Sensitive Files",
    syntax: "filetype:sql site:example.com",
    description: "Find SQL database files on a specific website.",
    example: "filetype:sql site:cia.gov",
    risk: "High"
  },
  {
    category: "Configuration Files",
    syntax: "filetype:xml site:example.com",
    description: "Find XML configuration files on a specific website.",
    example: "filetype:xml site:oracle.com",
    risk: "Medium"
  },
  {
    category: "Configuration Files",
    syntax: "filetype:ini site:example.com",
    description: "Find INI configuration files on a specific website.",
    example: "filetype:ini site:cisco.com",
    risk: "Medium"
  },
  {
    category: "Backup Files",
    syntax: "filetype:bak site:example.com",
    description: "Find backup files on a specific website.",
    example: "filetype:bak site:whitehouse.gov",
    risk: "High"
  },
  {
    category: "Backup Files",
    syntax: "filetype:old site:example.com",
    description: "Find old files on a specific website.",
    example: "filetype:old site:fbi.gov",
    risk: "Medium"
  }
];

const categories = [...new Set(googleDorks.map(dork => dork.category))];

const GoogleDorkExamplesSection = () => {
  const [activeCategory, setActiveCategory] = useState("File Discovery");
  const [copiedDork, setCopiedDork] = useState<string | null>(null);

  const handleCopy = async (syntax: string) => {
    try {
      await navigator.clipboard.writeText(syntax);
      setCopiedDork(syntax);
      setTimeout(() => setCopiedDork(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const filteredDorks = googleDorks.filter(dork => dork.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.section 
      id="google-dorks" 
      className="py-20 bg-gray-900"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-6">
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            Google Dork Collection
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Advanced search operators for ethical cybersecurity research and penetration testing
          </motion.p>
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={containerVariants}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? "bg-white text-black shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Google Dorks Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {filteredDorks.map((dork, index) => (
              <motion.div
                key={`${activeCategory}-${index}`}
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <Card className="bg-gray-800 border border-gray-700 hover:border-gray-500 transition-all duration-300 h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div 
                        className="flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Search className="text-blue-400" size={20} />
                        <span className="text-xs font-semibold px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                          {dork.risk}
                        </span>
                      </motion.div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button
                            onClick={() => handleCopy(dork.syntax)}
                            className="text-gray-400 hover:text-white transition-colors p-1 rounded"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                          >
                            {copiedDork === dork.syntax ? <Check size={16} /> : <Copy size={16} />}
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{copiedDork === dork.syntax ? "Copied!" : "Copy syntax"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    <motion.code 
                      className="text-green-400 font-mono text-sm mb-4 block bg-gray-900/50 p-3 rounded border group-hover:bg-gray-900/70 transition-colors"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      {dork.syntax}
                    </motion.code>
                    
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-2">{dork.description}</h3>
                      {dork.example && (
                        <motion.p 
                          className="text-gray-400 text-sm"
                          whileHover={{ color: "#d1d5db" }}
                          transition={{ duration: 0.2 }}
                        >
                          <strong>Example:</strong> {dork.example}
                        </motion.p>
                      )}
                    </div>
                    
                    <motion.div 
                      className="mt-4 pt-4 border-t border-gray-700"
                      whileHover={{ borderColor: "#6b7280" }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.button
                        onClick={() => handleCopy(dork.syntax)}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        {copiedDork === dork.syntax ? (
                          <>
                            <Check size={16} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copy Dork
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Disclaimer */}
        <motion.div 
          className="mt-16 max-w-4xl mx-auto"
          variants={itemVariants}
        >
          <motion.div 
            className="bg-red-900/20 border border-red-500/30 rounded-lg p-6"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-400 mt-1" size={20} />
              <div>
                <h3 className="text-red-400 font-semibold mb-2">⚠️ Ethical Use Disclaimer</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  These Google Dorks are provided for <strong>educational and ethical security research purposes only</strong>. 
                  Always ensure you have proper authorization before using these techniques. Unauthorized access to computer 
                  systems is illegal and unethical. Use responsibly and respect others' privacy and security.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default GoogleDorkExamplesSection;
