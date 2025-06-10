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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold gradient-text">
              Vibe Tools
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {categories.map((category) => (
              <a
                key={category.name}
                href={category.href}
                className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {category.name}
              </a>
            ))}
            <Button
              size="sm"
              className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 hover:from-green-500 hover:via-cyan-500 hover:to-blue-600 text-white font-semibold"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 touch-manipulation"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black border-t border-gray-800">
              {categories.map((category) => (
                <a
                  key={category.name}
                  href={category.href}
                  className="text-gray-300 hover:text-cyan-400 block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </a>
              ))}
              <div className="pt-3">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 hover:from-green-500 hover:via-cyan-500 hover:to-blue-600 text-white font-semibold py-3 touch-manipulation"
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