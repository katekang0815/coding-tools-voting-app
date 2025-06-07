import { useEffect, useRef } from "react";
import { 
  SiVisualstudiocode, 
  SiGithub, 
  SiFigma, 
  SiVercel, 
  SiNetlify,
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiTailwindcss,
  SiDocker
} from "react-icons/si";
import { Code, Zap, TreePine, Palette, Heart, RefreshCw, Pointer, Terminal, GitBranch, Layers } from "lucide-react";

interface Tool {
  name: string;
  icon: JSX.Element;
  gradientFrom: string;
  gradientTo: string;
}

const tools: Tool[] = [
  {
    name: "Corner",
    icon: <Code className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-purple-500",
    gradientTo: "to-pink-500"
  },
  {
    name: "Whizkdf",
    icon: <Zap className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-green-500",
    gradientTo: "to-teal-500"
  },
  {
    name: "Tree",
    icon: <TreePine className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-red-500",
    gradientTo: "to-orange-500"
  },
  {
    name: "V0",
    icon: <Palette className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-blue-500",
    gradientTo: "to-purple-500"
  },
  {
    name: "Bolt",
    icon: <Zap className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-yellow-500",
    gradientTo: "to-red-500"
  },
  {
    name: "Lovable",
    icon: <Heart className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-pink-500",
    gradientTo: "to-rose-500"
  },
  {
    name: "Replit",
    icon: <Terminal className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-500"
  },
  {
    name: "Stark",
    icon: <Layers className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-gray-700",
    gradientTo: "to-gray-900"
  },
  {
    name: "Pointer",
    icon: <Pointer className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-indigo-500",
    gradientTo: "to-purple-500"
  },
  {
    name: "Rewind",
    icon: <RefreshCw className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-teal-500",
    gradientTo: "to-green-500"
  },
  {
    name: "VS Code",
    icon: <SiVisualstudiocode className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-blue-600",
    gradientTo: "to-blue-800"
  },
  {
    name: "GitHub",
    icon: <SiGithub className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-gray-800",
    gradientTo: "to-black"
  },
  {
    name: "Figma",
    icon: <SiFigma className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-purple-600",
    gradientTo: "to-pink-600"
  },
  {
    name: "Vercel",
    icon: <SiVercel className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-black",
    gradientTo: "to-gray-800"
  },
  {
    name: "Netlify",
    icon: <SiNetlify className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-500"
  },
  {
    name: "React",
    icon: <SiReact className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-blue-400",
    gradientTo: "to-cyan-400"
  },
  {
    name: "Node.js",
    icon: <SiNodedotjs className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-green-600",
    gradientTo: "to-green-800"
  },
  {
    name: "TypeScript",
    icon: <SiTypescript className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-700"
  },
  {
    name: "Tailwind",
    icon: <SiTailwindcss className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-cyan-400",
    gradientTo: "to-teal-500"
  },
  {
    name: "Docker",
    icon: <SiDocker className="w-12 h-12 md:w-14 md:h-14 text-white" />,
    gradientFrom: "from-blue-400",
    gradientTo: "to-blue-600"
  }
];

export default function ToolsGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

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
    <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-12 mb-16">
      {tools.map((tool, index) => (
        <div key={tool.name} className="tool-item flex flex-col items-center group opacity-0">
          <div className={`tool-icon w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${tool.gradientFrom} ${tool.gradientTo} flex items-center justify-center shadow-lg mb-4`}>
            {tool.icon}
          </div>
          <span className="text-sm md:text-base font-medium text-[var(--brand-primary)] group-hover:text-[var(--brand-secondary)] transition-colors duration-300">
            {tool.name}
          </span>
        </div>
      ))}
    </div>
  );
}
