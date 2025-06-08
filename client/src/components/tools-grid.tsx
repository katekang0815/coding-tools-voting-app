import { useEffect, useRef, useState } from "react";
import {
  Code,
  Zap,
  TreePine,
  Palette,
  Heart,
  RefreshCw,
  Pointer,
  Terminal,
  Circle,
  Square,
  Layers,
  MessageSquare,
  Wind,
} from "lucide-react";
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
  {
    name: "ChatGPT",
    icon: <MessageSquare className="w-8 h-8 text-white" />,
    gradientFrom: "from-green-600",
    gradientTo: "to-green-700",
  },
  {
    name: "Copilot",
    icon: <Zap className="w-8 h-8 text-white" />,
    gradientFrom: "from-green-500",
    gradientTo: "to-green-600",
  },
  {
    name: "Canva",
    icon: <TreePine className="w-8 h-8 text-white" />,
    gradientFrom: "from-red-500",
    gradientTo: "to-red-600",
  },
  {
    name: "Claude",
    icon: <Palette className="w-8 h-8 text-white" />,
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-600",
  },
  {
    name: "Lovable",
    icon: <Heart className="w-8 h-8 text-white" />,
    gradientFrom: "from-green-400",
    gradientTo: "to-green-500",
  },
  {
    name: "Replit",
    icon: <Terminal className="w-8 h-8 text-white" />,
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-500",
  },
  {
    name: "Figma",
    icon: <Square className="w-8 h-8 text-white" />,
    gradientFrom: "from-gray-700",
    gradientTo: "to-gray-900",
  },
  {
    name: "Cursor",
    icon: <Pointer className="w-8 h-8 text-white" />,
    gradientFrom: "from-blue-400",
    gradientTo: "to-blue-600",
  },
  {
    name: "Windsurf",
    icon: <Wind className="w-8 h-8 text-white" />,
    gradientFrom: "from-cyan-400",
    gradientTo: "to-blue-500",
  },
  {
    name: "Gemini",
    icon: <Layers className="w-8 h-8 text-white" />,
    gradientFrom: "from-purple-500",
    gradientTo: "to-indigo-600",
  },
];

export default function ToolsGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [currentUserId] = useState(1); // Using the test user we created

  // Fetch tools from database
  const {
    data: tools = [],
    isLoading,
    error,
  } = useQuery<Tool[]>({
    queryKey: ["/api/tools"],
  });

  // Fetch user likes
  const { data: userLikes = [] } = useQuery<
    Array<{ toolId: number; liked: boolean }>
  >({
    queryKey: ["/api/tools/likes", currentUserId],
    enabled: !!currentUserId,
  });

  // Like toggle mutation
  const likeMutation = useMutation({
    mutationFn: async (toolId: number) => {
      return await apiRequest(`/api/tools/${toolId}/like`, "POST", {
        userId: currentUserId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/tools/likes", currentUserId],
      });
    },
  });

  // Seed tools on first load
  const seedMutation = useMutation({
    mutationFn: async (toolName: string) => {
      return await apiRequest("/api/tools", "POST", {
        name: toolName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
    },
  });

  // Seed tools if they don't exist
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (tools.length === 0 && !isLoading && !seeded) {
      setSeeded(true);
      toolDisplayConfig.forEach((tool) => {
        seedMutation.mutate(tool.name);
      });
    }
  }, [tools.length, isLoading, seeded, seedMutation]);

  const handleLike = (toolId: number) => {
    likeMutation.mutate(toolId);
  };

  const getToolDisplayConfig = (toolName: string): ToolDisplay => {
    return (
      toolDisplayConfig.find((config) => config.name === toolName) || {
        name: toolName,
        icon: <Circle className="w-8 h-8 text-white" />,
        gradientFrom: "from-gray-500",
        gradientTo: "to-gray-600",
      }
    );
  };

  const isToolLiked = (toolId: number): boolean => {
    return userLikes.find((like) => like.toolId === toolId)?.liked || false;
  };

  useEffect(() => {
    // Simple animation trigger when tools are loaded
    if (tools.length > 0 && gridRef.current) {
      const toolElements = gridRef.current.querySelectorAll(".tool-item");
      toolElements.forEach((tool, index) => {
        setTimeout(() => {
          tool.classList.add("animate-fade-in-up");
        }, index * 100);
      });
    }
  }, [tools.length]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-5 gap-8 md:gap-12 max-w-2xl mx-auto relative z-10">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-700 animate-pulse mb-3"></div>
            <div className="w-12 h-3 bg-gray-700 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Sort tools by their predefined order to maintain consistent positioning
  const sortedTools = [...tools].sort((a, b) => {
    const orderA = toolDisplayConfig.findIndex(
      (config) => config.name === a.name,
    );
    const orderB = toolDisplayConfig.findIndex(
      (config) => config.name === b.name,
    );
    return orderA - orderB;
  });

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-4 gap-8 md:gap-12 max-w-2xl mx-auto relative z-10 m-20 p-20 rounded-2xl bg-gray-900 text-slate-200 shadow-2xl"
    >
      {sortedTools.map((tool) => {
        const displayConfig = getToolDisplayConfig(tool.name);
        const isLiked = isToolLiked(tool.id);

        return (
          <div
            key={tool.name}
            className="tool-item flex flex-col items-center group opacity-100"
          >
            <div className="relative">
              <div
                className={`tool-icon w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${displayConfig.gradientFrom} ${displayConfig.gradientTo} flex items-center justify-center shadow-lg mb-3`}
              >
                {displayConfig.icon}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(tool.id);
                }}
                disabled={likeMutation.isPending}
                className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 disabled:opacity-50 ${
                  isLiked
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-white text-gray-400 hover:text-red-500 shadow-md border border-gray-200"
                }`}
              >
                <Heart className={`w-3 h-3 ${isLiked ? "fill-current" : ""}`} />
              </button>
              {tool.likeCount > 0 && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {tool.likeCount}
                </div>
              )}
            </div>
            <span className="text-xs md:text-sm font-medium text-[var(--brand-primary)] group-hover:text-[var(--brand-secondary)] transition-colors duration-300 text-center">
              {tool.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
