
import { ExternalLink, Search, Globe, Database, User, Eye, Shield, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const osintTools = [
  // Domain & DNS Analysis
  {
    name: "Shodan",
    description: "The search engine for Internet-connected devices. Find exposed services, IoT devices, and security vulnerabilities across the globe.",
    icon: Search,
    category: "Asset Discovery",
    url: "https://shodan.io",
    features: ["Device Discovery", "Port Scanning", "Vulnerability Detection"]
  },
  {
    name: "Censys",
    description: "Internet-wide asset discovery and attack surface management platform for cybersecurity professionals.",
    icon: Globe,
    category: "Asset Discovery", 
    url: "https://censys.io",
    features: ["Certificate Monitoring", "Asset Discovery", "Attack Surface Management"]
  },
  {
    name: "SecurityTrails",
    description: "Comprehensive DNS and domain intelligence platform for threat hunting and cybersecurity research.",
    icon: Database,
    category: "Domain Analysis",
    url: "https://securitytrails.com",
    features: ["DNS History", "Domain Intelligence", "Threat Hunting"]
  },
  {
    name: "DNSDumpster",
    description: "Free domain research tool for finding host-related information and mapping attack surfaces.",
    icon: Network,
    category: "Domain Analysis",
    url: "https://dnsdumpster.com",
    features: ["DNS Records", "Subdomain Discovery", "Network Mapping"]
  },
  {
    name: "BuiltWith",
    description: "Technology profiler that shows what websites are built with, including analytics and hosting info.",
    icon: Globe,
    category: "Website Analysis",
    url: "https://builtwith.com",
    features: ["Technology Stack", "Analytics Detection", "CMS Identification"]
  },
  {
    name: "Wayback Machine",
    description: "Internet Archive's digital archive of the World Wide Web for historical website analysis.",
    icon: Database,
    category: "Website Analysis",
    url: "https://archive.org/web",
    features: ["Website History", "Content Archive", "Historical Analysis"]
  },

  // People & Social Media
  {
    name: "Pipl",
    description: "Professional people search engine for identity verification and background research.",
    icon: User,
    category: "People Search",
    url: "https://pipl.com",
    features: ["Identity Verification", "Background Research", "Contact Discovery"]
  },
  {
    name: "Have I Been Pwned",
    description: "Check if personal data has been compromised in data breaches and credential leaks.",
    icon: Shield,
    category: "Data Breach",
    url: "https://haveibeenpwned.com",
    features: ["Breach Detection", "Password Monitoring", "Email Verification"]
  },
  {
    name: "Dehashed",
    description: "Comprehensive database of hacked credentials and leaked data for security research.",
    icon: Database,
    category: "Data Breach",
    url: "https://dehashed.com",
    features: ["Credential Search", "Data Leak Analysis", "Breach Intelligence"]
  },
  {
    name: "Social Searcher",
    description: "Social media search engine for monitoring mentions, hashtags, and social intelligence.",
    icon: Search,
    category: "Social Media",
    url: "https://socialsearcher.com",
    features: ["Social Monitoring", "Hashtag Tracking", "Sentiment Analysis"]
  },

  // Analysis & Investigation Tools
  {
    name: "Maltego",
    description: "Comprehensive link analysis and data mining platform for investigations and intelligence gathering.",
    icon: Network,
    category: "Investigation",
    url: "https://maltego.com",
    features: ["Link Analysis", "Data Mining", "Relationship Mapping"]
  },
  {
    name: "OSINT Framework",
    description: "Comprehensive collection of OSINT tools and resources organized by category and use case.",
    icon: Database,
    category: "Tool Collection",
    url: "https://osintframework.com",
    features: ["Tool Directory", "Resource Collection", "Research Framework"]
  },
  {
    name: "TinEye",
    description: "Reverse image search engine for finding where images appear online and tracking their usage.",
    icon: Eye,
    category: "Image Analysis",
    url: "https://tineye.com",
    features: ["Reverse Image Search", "Image Tracking", "Visual Intelligence"]
  },
  {
    name: "ExifTool",
    description: "Platform-independent library and application for reading, writing and editing metadata.",
    icon: Eye,
    category: "Image Analysis",
    url: "https://exiftool.org",
    features: ["Metadata Extraction", "EXIF Analysis", "File Forensics"]
  },

  // Threat Intelligence
  {
    name: "VirusTotal",
    description: "Free online service for analyzing suspicious files and URLs to detect malware and threats.",
    icon: Shield,
    category: "Threat Analysis",
    url: "https://virustotal.com",
    features: ["File Analysis", "URL Scanning", "Malware Detection"]
  },
  {
    name: "AlienVault OTX",
    description: "Open Threat Exchange platform for collaborative threat intelligence and IOC sharing.",
    icon: Network,
    category: "Threat Intelligence",
    url: "https://otx.alienvault.com",
    features: ["Threat Intelligence", "IOC Sharing", "Community Research"]
  },
  {
    name: "Hybrid Analysis",
    description: "Free malware analysis service powered by Falcon Sandbox for threat detection.",
    icon: Shield,
    category: "Threat Analysis", 
    url: "https://hybrid-analysis.com",
    features: ["Malware Analysis", "Behavioral Analysis", "Threat Detection"]
  },

  // Network & Infrastructure
  {
    name: "Wigle",
    description: "Wireless network mapping and wardriving database for WiFi security research.",
    icon: Network,
    category: "Network Analysis",
    url: "https://wigle.net",
    features: ["WiFi Mapping", "Network Discovery", "Geolocation Data"]
  },
  {
    name: "Spyse",
    description: "Internet assets search engine for cybersecurity professionals and researchers.",
    icon: Search,
    category: "Asset Discovery",
    url: "https://spyse.com",
    features: ["Asset Discovery", "Certificate Monitoring", "Infrastructure Analysis"]
  },
  {
    name: "Netcraft",
    description: "Internet security services including website analysis and threat intelligence.",
    icon: Globe,
    category: "Website Analysis",
    url: "https://netcraft.com",
    features: ["Website Intelligence", "Hosting Analysis", "Security Research"]
  },

  // Communication & Messaging
  {
    name: "Telegram Search",
    description: "Search engine for finding public Telegram channels, groups, and shared content.",
    icon: Search,
    category: "Social Media",
    url: "https://tgstat.com",
    features: ["Channel Discovery", "Content Analysis", "Messaging Intelligence"]
  },
  {
    name: "WhatsApp Monitor",
    description: "Tool for monitoring WhatsApp groups and analyzing messaging patterns for research.",
    icon: Search,
    category: "Social Media", 
    url: "https://whatsapp-monitor.com",
    features: ["Group Monitoring", "Message Analysis", "Communication Intelligence"]
  }
];

const OSINTProvidersSection = () => {
  const categories = [...new Set(osintTools.map(tool => tool.category))];

  return (
    <section id="osint-tools" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Professional OSINT Tools Directory
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover powerful open-source intelligence tools for cybersecurity research, 
            threat hunting, and investigative analysis across multiple domains.
          </p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-20">
            <h3 className="text-3xl font-bold text-black mb-12 text-center">
              {category}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {osintTools
                .filter(tool => tool.category === category)
                .map((tool) => (
                  <Card 
                    key={tool.name} 
                    className="bg-white border-2 border-gray-200 hover:border-black transition-all duration-300 hover:shadow-lg group"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors">
                            <tool.icon className="text-black" size={28} />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-black mb-1 group-hover:text-gray-700 transition-colors">
                              {tool.name}
                            </h4>
                            <span className="text-sm text-gray-600 font-medium">{tool.category}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {tool.description}
                      </p>

                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {tool.features.map((feature) => (
                            <span 
                              key={feature}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 group-hover:shadow-md"
                        onClick={() => window.open(tool.url, '_blank')}
                      >
                        Visit Tool
                        <ExternalLink size={16} className="ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OSINTProvidersSection;
