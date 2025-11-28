import { ExternalLink, Shield, Lock, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const providers = [
  // Penetration Testing
  {
    name: "Rapid7",
    description: "Comprehensive vulnerability management and penetration testing services for enterprise security.",
    icon: Shield,
    category: "Penetration Testing",
    url: "https://rapid7.com",
    features: ["Vulnerability Assessment", "Penetration Testing", "Security Consulting"]
  },
  {
    name: "Offensive Security", 
    description: "Leading provider of penetration testing training and certification programs.",
    icon: Shield,
    category: "Penetration Testing",
    url: "https://offensive-security.com",
    features: ["Penetration Testing", "Security Training", "Certification"]
  },
  {
    name: "Core Security",
    description: "Advanced penetration testing and vulnerability assessment solutions.",
    icon: Shield,
    category: "Penetration Testing",
    url: "https://coresecurity.com",
    features: ["Penetration Testing", "Vulnerability Management", "Compliance"]
  },
  {
    name: "Bugcrowd",
    description: "Crowdsourced security testing platform connecting organizations with ethical hackers worldwide.",
    icon: Shield,
    category: "Penetration Testing",
    url: "https://bugcrowd.com",
    features: ["Bug Bounty Programs", "Penetration Testing", "Vulnerability Discovery"]
  },
  {
    name: "HackerOne",
    description: "Leading bug bounty and vulnerability coordination platform for continuous security testing.",
    icon: Shield,
    category: "Penetration Testing",
    url: "https://hackerone.com",
    features: ["Bug Bounty", "Vulnerability Coordination", "Security Testing"]
  },
  {
    name: "Synack",
    description: "Crowdsourced security platform combining human intelligence with technology.",
    icon: Shield,
    category: "Penetration Testing",
    url: "https://synack.com",
    features: ["Crowdsourced Testing", "Vulnerability Assessment", "Continuous Security"]
  },
  {
    name: "RedTeam Security",
    description: "Specialized red team services and advanced persistent threat simulation.",
    icon: Shield,
    category: "Penetration Testing",
    url: "https://redteamsecure.com",
    features: ["Red Team Services", "APT Simulation", "Security Assessment"]
  },
  {
    name: "Bishop Fox",
    description: "Offensive security services including penetration testing and security consulting.",
    icon: Shield,
    category: "Penetration Testing",
    url: "https://bishopfox.com",
    features: ["Penetration Testing", "Security Consulting", "Application Security"]
  },

  // Threat Intelligence
  {
    name: "Mandiant",
    description: "Advanced threat intelligence and incident response services from Google Cloud security experts.",
    icon: Network,
    category: "Threat Intelligence",
    url: "https://mandiant.com",
    features: ["Incident Response", "Threat Intelligence", "Security Consulting"]
  },
  {
    name: "Recorded Future",
    description: "Real-time threat intelligence platform providing actionable security insights and risk analysis.",
    icon: Network,
    category: "Threat Intelligence",
    url: "https://recordedfuture.com",
    features: ["Threat Intelligence", "Risk Analysis", "Security Research"]
  },
  {
    name: "ThreatConnect",
    description: "Threat intelligence platform for security orchestration and automated response.",
    icon: Network,
    category: "Threat Intelligence",
    url: "https://threatconnect.com",
    features: ["Threat Intelligence", "Security Orchestration", "Incident Response"]
  },
  {
    name: "IBM X-Force",
    description: "Enterprise threat intelligence and security research services.",
    icon: Network,
    category: "Threat Intelligence",
    url: "https://ibm.com/security/xforce",
    features: ["Threat Intelligence", "Security Research", "Incident Response"]
  },
  {
    name: "CrowdStrike",
    description: "Cloud-native endpoint protection and threat hunting services with AI-powered detection.",
    icon: Network,
    category: "Threat Intelligence",
    url: "https://crowdstrike.com",
    features: ["Endpoint Protection", "Threat Hunting", "Incident Response"]
  },

  // Managed Security Services
  {
    name: "Trustwave",
    description: "Managed security services including SIEM, vulnerability management, and compliance solutions.",
    icon: Lock,
    category: "Managed Security",
    url: "https://trustwave.com",
    features: ["SIEM Management", "Compliance", "Security Monitoring"]
  },
  {
    name: "SecureWorks",
    description: "Cloud-based security solutions with 24/7 threat detection and incident response services.",
    icon: Lock,
    category: "Managed Security",
    url: "https://secureworks.com",
    features: ["24/7 Monitoring", "Incident Response", "Cloud Security"]
  },
  {
    name: "Arctic Wolf",
    description: "Security operations cloud platform delivering managed detection and response.",
    icon: Lock,
    category: "Managed Security",
    url: "https://arcticwolf.com",
    features: ["Managed Detection", "Security Operations", "Threat Hunting"]
  },
  {
    name: "eSentire",
    description: "Managed detection and response services with 24/7 security operations center.",
    icon: Lock,
    category: "Managed Security",
    url: "https://esentire.com",
    features: ["MDR Services", "SOC as a Service", "Threat Intelligence"]
  },
  {
    name: "Expel",
    description: "Managed detection and response platform for transparent security operations.",
    icon: Lock,
    category: "Managed Security",
    url: "https://expel.io",
    features: ["MDR Platform", "Security Operations", "Incident Response"]
  },

  // Security Consulting
  {
    name: "Coalfire",
    description: "Cybersecurity consulting and compliance services specializing in risk assessments and audits.",
    icon: Shield,
    category: "Security Consulting",
    url: "https://coalfire.com",
    features: ["Risk Assessment", "Compliance Audits", "Security Consulting"]
  },
  {
    name: "Optiv",
    description: "Comprehensive cybersecurity consulting and managed services provider.",
    icon: Shield,
    category: "Security Consulting",
    url: "https://optiv.com",
    features: ["Security Consulting", "Risk Management", "Compliance Services"]
  },
  {
    name: "Booz Allen Hamilton",
    description: "Strategic cybersecurity consulting for government and enterprise clients.",
    icon: Shield,
    category: "Security Consulting",
    url: "https://boozallen.com",
    features: ["Strategic Consulting", "Risk Management", "Compliance"]
  },
  {
    name: "Deloitte Cyber",
    description: "Enterprise cybersecurity consulting and transformation services.",
    icon: Shield,
    category: "Security Consulting",
    url: "https://deloitte.com/cyber",
    features: ["Cyber Strategy", "Risk Management", "Digital Transformation"]
  },
  {
    name: "PwC Cybersecurity",
    description: "Global cybersecurity consulting and risk management services.",
    icon: Shield,
    category: "Security Consulting",
    url: "https://pwc.com/cybersecurity",
    features: ["Risk Assessment", "Cyber Strategy", "Compliance"]
  },

  // Risk Management
  {
    name: "RSA Security",
    description: "Identity and access management solutions with risk-based authentication.",
    icon: Lock,
    category: "Risk Management",
    url: "https://rsa.com",
    features: ["Identity Management", "Risk-Based Auth", "Fraud Detection"]
  },
  {
    name: "Qualys",
    description: "Cloud-based vulnerability management and continuous security monitoring.",
    icon: Lock,
    category: "Risk Management",
    url: "https://qualys.com",
    features: ["Vulnerability Management", "Compliance", "Asset Discovery"]
  },
  {
    name: "Tenable",
    description: "Vulnerability management and cyber exposure platform for risk reduction.",
    icon: Lock,
    category: "Risk Management",
    url: "https://tenable.com",
    features: ["Vulnerability Management", "Risk Assessment", "Compliance"]
  },
  {
    name: "RiskSense",
    description: "Vulnerability prioritization and risk management platform.",
    icon: Lock,
    category: "Risk Management",
    url: "https://risksense.com",
    features: ["Risk Prioritization", "Vulnerability Management", "Threat Intelligence"]
  },

  // Data Protection
  {
    name: "Varonis",
    description: "Data security platform for protecting sensitive information and preventing breaches.",
    icon: Lock,
    category: "Data Protection",
    url: "https://varonis.com",
    features: ["Data Security", "Access Management", "Threat Detection"]
  },
  {
    name: "Imperva",
    description: "Data and application security solutions including database protection and web security.",
    icon: Lock,
    category: "Data Protection",
    url: "https://imperva.com",
    features: ["Database Security", "Web Application Security", "DDoS Protection"]
  },
  {
    name: "Forcepoint",
    description: "Human-centric cybersecurity solutions for data loss prevention and insider threat protection.",
    icon: Lock,
    category: "Data Protection",
    url: "https://forcepoint.com",
    features: ["Data Loss Prevention", "Insider Threat", "Web Security"]
  },
  {
    name: "Symantec",
    description: "Comprehensive data protection and endpoint security solutions.",
    icon: Lock,
    category: "Data Protection",
    url: "https://symantec.com",
    features: ["Data Protection", "Endpoint Security", "Email Security"]
  },

  // Cloud Security
  {
    name: "Palo Alto Networks",
    description: "Next-generation firewall and cloud security platform provider.",
    icon: Network,
    category: "Cloud Security",
    url: "https://paloaltonetworks.com",
    features: ["Next-Gen Firewall", "Cloud Security", "Threat Prevention"]
  },
  {
    name: "Zscaler",
    description: "Cloud-based security platform for secure internet and private application access.",
    icon: Network,
    category: "Cloud Security",
    url: "https://zscaler.com",
    features: ["Zero Trust Access", "Cloud Security", "Web Gateway"]
  },
  {
    name: "Check Point",
    description: "Comprehensive cybersecurity solutions including network security and threat prevention.",
    icon: Network,
    category: "Cloud Security",
    url: "https://checkpoint.com",
    features: ["Network Security", "Threat Prevention", "Mobile Security"]
  }
];

const CybersecurityProvidersSection = () => {
  const categories = [...new Set(providers.map(provider => provider.category))];

  return (
    <section id="providers" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Trusted Cybersecurity Service Providers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with verified cybersecurity professionals and companies offering specialized 
            services across multiple security domains and industry verticals.
          </p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-20">
            <h3 className="text-3xl font-bold text-black mb-12 text-center">
              {category}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {providers
                .filter(provider => provider.category === category)
                .map((provider) => (
                  <Card 
                    key={provider.name} 
                    className="bg-white border-2 border-gray-200 hover:border-black transition-all duration-300 hover:shadow-lg group"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors">
                            <provider.icon className="text-black" size={28} />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-black mb-1 group-hover:text-gray-700 transition-colors">
                              {provider.name}
                            </h4>
                            <span className="text-sm text-gray-600 font-medium">{provider.category}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {provider.description}
                      </p>

                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {provider.features.map((feature) => (
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
                        onClick={() => window.open(provider.url, '_blank')}
                      >
                        Visit Provider
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

export default CybersecurityProvidersSection;
