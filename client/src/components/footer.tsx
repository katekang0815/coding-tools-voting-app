import { Heart, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Email", icon: Mail, href: "mailto:hello@vibecodingtools.com" },
  ];

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
              <h2 className="text-2xl font-bold text-[var(--brand-primary)]">
                Vibe Coding <span className="text-[var(--brand-secondary)]">Tools</span>
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Discover and vote for the best coding tools that make development more enjoyable and productive. Join our community of developers.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-[var(--brand-secondary)] transition-colors duration-200"
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
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-[var(--brand-secondary)] transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 mx-1 fill-current" />
              <span>by developers, for developers</span>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Vibe Coding Tools. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}