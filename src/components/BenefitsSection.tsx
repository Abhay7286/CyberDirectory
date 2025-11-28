
import { Shield, Lock, Users, Server } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Shield,
      title: "24/7 Monitoring",
      description: "Round-the-clock security monitoring and incident response to ensure your systems are always protected."
    },
    {
      icon: Lock,
      title: "Advanced Encryption",
      description: "Military-grade encryption protocols to safeguard your sensitive data and communications."
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Certified cybersecurity professionals with years of experience in threat detection and prevention."
    },
    {
      icon: Server,
      title: "Scalable Solutions",
      description: "Security solutions that grow with your business, from startups to enterprise-level organizations."
    }
  ];

  return (
    <section className="py-20 bg-gray-800/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">SecureShield</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We provide comprehensive cybersecurity solutions with unmatched expertise, 
            cutting-edge technology, and personalized service for your peace of mind.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="mb-6 flex justify-center">
                <div className="p-6 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-full border border-blue-400/30 group-hover:border-green-400/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                  <benefit.icon size={48} className="text-blue-400 group-hover:text-green-400 transition-colors duration-300" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 bg-gradient-to-r from-blue-900/50 to-green-900/50 rounded-2xl p-8 border border-blue-400/30 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-300">Clients Protected</div>
            </div>
            <div className="w-px h-12 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime Guarantee</div>
            </div>
            <div className="w-px h-12 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-300">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
