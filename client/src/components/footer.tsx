import { Heart, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { name: "GitHub", icon: Github, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Email", icon: Mail, href: "mailto:hello@vibecodingtools.com" },
  ];

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mt-2 pt-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-400 gradient-text">
              <span>Made with</span>
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mx-1 fill-current" />
              <span>by Yehsun Kang</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-400 font-light">
              © {currentYear} Powered By Replit
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}