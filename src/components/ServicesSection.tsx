
import { Shield, Lock, Database, Server } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ServicesSection = () => {
  const services = [
    {
      icon: Shield,
      title: "Penetration Testing",
      description: "Comprehensive security assessments to identify vulnerabilities before attackers do. Our ethical hackers simulate real-world attacks to strengthen your defenses."
    },
    {
      icon: Lock,
      title: "Risk Management",
      description: "Strategic risk assessment and mitigation planning to protect your business assets. We help you understand and manage cybersecurity risks effectively."
    },
    {
      icon: Server,
      title: "Security Consulting",
      description: "Expert guidance on cybersecurity strategy, compliance, and best practices. Our consultants work with you to build robust security frameworks."
    },
    {
      icon: Database,
      title: "Data Protection",
      description: "Advanced data security solutions including encryption, backup strategies, and compliance with privacy regulations like GDPR and CCPA."
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-800/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Services</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive cybersecurity solutions tailored to protect your business 
            from evolving digital threats and ensure regulatory compliance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="bg-gray-900/80 border-gray-700 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 group backdrop-blur-sm"
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-full border border-blue-400/30 group-hover:border-green-400/50 transition-colors duration-300">
                    <service.icon size={40} className="text-blue-400 group-hover:text-green-400 transition-colors duration-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
