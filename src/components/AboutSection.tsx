
import { Shield, Users, Globe } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">CyberDirectory</span>
            </h2>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              CyberDirectory is your trusted informational hub for discovering verified cybersecurity 
              service providers. We don't provide services directly – instead, we curate and showcase 
              reputable third-party companies that specialize in various cybersecurity disciplines.
            </p>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Our mission is to bridge the gap between businesses seeking security solutions and 
              qualified professionals who can deliver them. Every provider in our directory has been 
              carefully vetted to ensure they meet industry standards and maintain excellent reputations.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Shield size={24} className="text-blue-400" />
                </div>
                <span className="text-lg">Carefully Vetted Service Providers</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Users size={24} className="text-green-400" />
                </div>
                <span className="text-lg">Multiple Security Specializations</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Globe size={24} className="text-blue-400" />
                </div>
                <span className="text-lg">Global Network of Professionals</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600/20 to-green-600/20 rounded-2xl p-8 border border-blue-400/30 backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&crop=center"
                alt="Cybersecurity Network"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Connecting You with Excellence
                </h3>
                <p className="text-gray-300">
                  Our platform serves as a bridge between your security needs and the industry's 
                  most qualified professionals, ensuring you find the right expertise for your specific requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
