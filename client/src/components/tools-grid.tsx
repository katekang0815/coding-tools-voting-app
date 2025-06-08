import { useEffect, useRef, useState } from "react";
import { Code, Zap, TreePine, Palette, Heart, RefreshCw, Pointer, Terminal, Circle, Square, Layers, MessageSquare } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Tool } from "@shared/schema";

interface ToolDisplay {
  name: string;
  icon: JSX.Element;
  gradientFrom: string;
  gradientTo: string;
}

const toolDisplayConfig: ToolDisplay[] = [
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
  const queryClient = useQueryClient();
  const [currentUserId] = useState(1); // For demo purposes - in real app this would come from auth

  // Fetch tools from database
  const { data: tools = [], isLoading } = useQuery<Tool[]>({
    queryKey: ["/api/tools"],
  });

  // Fetch user likes
  const { data: userLikes = [] } = useQuery<Array<{ toolId: number; liked: boolean }>>({
    queryKey: ["/api/tools/likes", currentUserId],
    enabled: !!currentUserId,
  });

  // Like toggle mutation
  const likeMutation = useMutation({
    mutationFn: async (toolId: number) => {
      return await apiRequest(`/api/tools/${toolId}/like`, {
        method: "POST",
        body: JSON.stringify({ userId: currentUserId }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tools/likes", currentUserId] });
    },
  });

  // Seed tools on first load
  const seedMutation = useMutation({
    mutationFn: async (toolName: string) => {
      return await apiRequest("/api/tools", {
        method: "POST",
        body: JSON.stringify({ name: toolName }),
        headers: { "Content-Type": "application/json" },
      });
    },
  });

  // Seed tools if they don't exist
  useEffect(() => {
    if (tools.length === 0 && !isLoading) {
      toolDisplayConfig.forEach(tool => {
        seedMutation.mutate(tool.name);
      });
    }
  }, [tools.length, isLoading]);

  const handleLike = (toolId: number) => {
    likeMutation.mutate(toolId);
  };

  const getToolDisplayConfig = (toolName: string): ToolDisplay => {
    return toolDisplayConfig.find(config => config.name === toolName) || {
      name: toolName,
      icon: <Circle className="w-8 h-8 text-white" />,
      gradientFrom: "from-gray-500",
      gradientTo: "from-gray-600"
    };
  };

  const isToolLiked = (toolId: number): boolean => {
    return userLikes.find(like => like.toolId === toolId)?.liked || false;
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
