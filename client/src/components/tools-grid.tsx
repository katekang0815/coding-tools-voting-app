import { useEffect, useRef, useState } from "react";
import { Code, Zap, TreePine, Palette, Heart, RefreshCw, Pointer, Terminal, Circle, Square, Layers, MessageSquare } from "lucide-react";

interface Tool {
  name: string;
  icon: JSX.Element;
  gradientFrom: string;
  gradientTo: string;
}

const tools: Tool[] = [
  // First row - matching your image
  {
    name: "ChatGPT",
    icon: <MessageSquare className="w-8 h-8 text-white" />,
    gradientFrom: "from-green-600",
    gradientTo: "to-green-700"
  },
  {
    name: "Whizkdf",
    icon: <Zap className="w-8 h-8 text-white" />,
    gradientFrom: "from-green-500",
    gradientTo: "to-green-600"
  },
  {
    name: "Tree",
    icon: <TreePine className="w-8 h-8 text-white" />,
    gradientFrom: "from-red-500",
    gradientTo: "to-red-600"
  },
  {
    name: "V0",
    icon: <Palette className="w-8 h-8 text-white" />,
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-600"
  },
  {
    name: "Bolt",
    icon: <Zap className="w-8 h-8 text-white" />,
    gradientFrom: "from-yellow-500",
    gradientTo: "to-orange-500"
  },
  // Second row
  {
    name: "Lovable",
    icon: <Heart className="w-8 h-8 text-white" />,
    gradientFrom: "from-green-400",
    gradientTo: "to-green-500"
  },
  {
    name: "Replit",
    icon: <Terminal className="w-8 h-8 text-white" />,
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-500"
  },
  {
    name: "Stark",
    icon: <Square className="w-8 h-8 text-white" />,
    gradientFrom: "from-gray-700",
    gradientTo: "to-gray-900"
  },
  {
    name: "Cursor",
    icon: <Pointer className="w-8 h-8 text-white" />,
    gradientFrom: "from-blue-400",
    gradientTo: "to-blue-600"
  },
  {
    name: "Rewind",
    icon: <RefreshCw className="w-8 h-8 text-white" />,
    gradientFrom: "from-gray-300",
    gradientTo: "to-gray-400"
  }
];

export default function ToolsGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [likedTools, setLikedTools] = useState<Set<string>>(new Set());

  const toggleLike = (toolName: string) => {
    setLikedTools(prev => {
      const newSet = new Set(prev);
      if (newSet.has(toolName)) {
        newSet.delete(toolName);
      } else {
        newSet.add(toolName);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const toolElements = entry.target.querySelectorAll('.tool-item');
            toolElements.forEach((tool, index) => {
              setTimeout(() => {
                tool.classList.add('animate-fade-in-up');
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={gridRef} className="grid grid-cols-5 gap-8 md:gap-12 mb-16 max-w-2xl mx-auto">
      {tools.map((tool, index) => (
        <div key={tool.name} className="tool-item flex flex-col items-center group opacity-0">
          <div className="relative">
            <div className={`tool-icon w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${tool.gradientFrom} ${tool.gradientTo} flex items-center justify-center shadow-lg mb-3`}>
              {tool.icon}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(tool.name);
              }}
              className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                likedTools.has(tool.name)
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-400 hover:text-red-500 shadow-md border border-gray-200'
              }`}
            >
              <Heart 
                className={`w-3 h-3 ${likedTools.has(tool.name) ? 'fill-current' : ''}`}
              />
            </button>
          </div>
          <span className="text-xs md:text-sm font-medium text-[var(--brand-primary)] group-hover:text-[var(--brand-secondary)] transition-colors duration-300 text-center">
            {tool.name}
          </span>
        </div>
      ))}
    </div>
  );
}
