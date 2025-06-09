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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">
                Vibe Coding <span className="gradient-text">Tools</span>
              </h2>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Discover and vote for the best coding tools that make development more enjoyable and productive. Join our community of developers.
            </p>
            
            {/* Social Links */}
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
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full text-sm font-semibold text-white uppercase tracking-wider mb-4 hover:text-cyan-400 transition-colors duration-200"
              >
                {section.title}
                <ChevronDown 
                  className={`h-4 w-4 transform transition-transform duration-200 ${
                    openSections[section.title] ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openSections[section.title] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <ul className="space-y-3 pb-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 mx-1 fill-current" />
              <span>by developers, for developers</span>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-400">
              © {currentYear} Vibe Coding Tools. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}