import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const categories = [
  { name: "Research", href: "#research" },
  { name: "Movie/Video", href: "#video" },
  { name: "Visualization", href: "#visualization" },
  { name: "Image Editing", href: "#image-editing" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-white">
              Vibe Coding <span className="gradient-text">Tools</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {categories.map((category) => (
                <a
                  key={category.name}
                  href={category.href}
                  className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              size="sm"
              className="bg-transparent border-2 border-gradient-to-r from-green-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 hover:bg-gradient-to-r hover:from-green-400 hover:via-cyan-400 hover:to-blue-500 hover:text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black border-t border-gray-800">
              {categories.map((category) => (
                <a
                  key={category.name}
                  href={category.href}
                  className="text-gray-300 hover:text-cyan-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </a>
              ))}
              <div className="pt-2">
                <Button
                  size="sm"
                  className="w-full bg-transparent border-2 border-gradient-to-r from-green-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 hover:bg-gradient-to-r hover:from-green-400 hover:via-cyan-400 hover:to-blue-500 hover:text-white font-semibold"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}