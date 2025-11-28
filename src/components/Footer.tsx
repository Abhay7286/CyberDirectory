
import { Link } from "react-router-dom";
import {
  MailIcon as EmailIcon,
  Instagram,
  LinkedinIcon,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">CD</span>
              </div>
              <span className="text-2xl font-bold text-white">CyberDirectory</span>
            </div>
            <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
              Your comprehensive directory for cybersecurity tools, services, and intelligence resources.
              Connecting you with trusted providers and powerful research tools.
            </p>
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-sm text-gray-300">
                <strong>Disclaimer:</strong> We only list external cybersecurity tools and do not offer services directly.
                All listed resources are third-party providers.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Link to="/submit" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                🛡️ Add Tool
              </Link>
              <Link to="/osint" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                🧰 OSINT Tools
              </Link>
              <Link to="/google-dork" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                🔍 Google Dorks
              </Link>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <a
                  href={`https://www.linkedin.com/company/cyberdirectory`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                  className="hover:text-blue-600"
                >
                  <LinkedinIcon className="h-6 w-6" />
                </a>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                 <a
                  href={`mailto:trustcyberdirectory@gmail.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Email"
                  className="hover:text-blue-600"
                >
                  <EmailIcon className="h-6 w-6" />
                </a>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                 <a
                  href={`https://www.instagram.com/cyberdirectory/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                  className="hover:text-blue-600"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <div className="text-gray-400">
            © 2025 CyberDirectory. Informational directory only.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
