import { Heart, Github, Twitter, Linkedin, Mail, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Email", icon: Mail, href: "mailto:hello@vibecodingtools.com" },
  ];

  const toggleSection = (sectionTitle: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const footerSections = [
    {
      title: "Categories",
      links: [
        { name: "Research", href: "#research" },
        { name: "Movie/Video", href: "#video" },
        { name: "Visualization", href: "#visualization" },
        { name: "Image Editing", href: "#image-editing" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#docs" },
        { name: "Tutorials", href: "#tutorials" },
        { name: "Blog", href: "#blog" },
        { name: "Community", href: "#community" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#about" },
        { name: "Contact", href: "#contact" },
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
      ],
    },
  ];

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Brand Section */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Vibe Coding <span className="gradient-text">Tools</span>
            </h2>
            <p className="text-gray-400 text-lg">Discover and vote for your favorite AI coding tools</p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 transform hover:scale-110"
                aria-label={social.name}
              >
                <social.icon className="h-7 w-7" />
              </a>
            ))}
          </div>

          {/* Made by Section */}
          <div className="flex items-center text-gray-400 text-lg">
            <span>Made with</span>
            <Heart className="h-5 w-5 text-red-500 mx-2 fill-current" />
            <span>by Yehsun Kang</span>
          </div>

          {/* Copyright */}
          <div className="text-gray-500 text-sm border-t border-gray-800 pt-4 w-full">
            © {currentYear} Powered By Replit. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}