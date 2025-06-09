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
    brandIcon?: string;
}

const toolDisplayConfig: ToolDisplay[] = [
  {
    name: "ChatGPT",
    icon: <MessageSquare className="w-8 h-8 text-white" />,
    gradientFrom: "from-green-500", // OpenAI brand green
    gradientTo: "to-green-700",
    brandIcon: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  },
  {
    name: "Copilot",
    icon: <Zap className="w-8 h-8 text-white" />,
    gradientFrom: "from-blue-600", // GitHub blue
    gradientTo: "to-indigo-700",
    brandIcon: "https://github.githubassets.com/images/modules/site/copilot/copilot.png",
  },
  {
    name: "Canva",
    icon: <TreePine className="w-8 h-8 text-white" />,
    gradientFrom: "from-purple-500", // Canva purple
    gradientTo: "to-violet-600",
    brandIcon: "",
  },
  {
    name: "Claude",
    icon: <Palette className="w-8 h-8 text-white" />,
    gradientFrom: "from-orange-500", // Anthropic orange
    gradientTo: "to-orange-700",
    brandIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCIZYpPXuiY_Dw0M0ffBoN8X8zsUKVvPsn8mAUb_t5zWUKXtrCMWzyYwU&s", // Using your provided AI logo
  },
  {
    name: "Lovable",
    icon: <Heart className="w-8 h-8 text-white" />,
    gradientFrom: "from-pink-500", // Lovable pink/magenta
    gradientTo: "to-rose-600",
    brandIcon: "https://lovable.dev/favicon.ico",
  },
  {
    name: "Replit",
    icon: <Terminal className="w-8 h-8 text-white" />,
    gradientFrom: "from-orange-400", // Replit orange
    gradientTo: "to-red-500",
    brandIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-HnpgESCXTePDDnjoCQ62_tcBT0_2NFygWhY-9irhL0-I2SPB_LS6GE0&s",
  },
  {
    name: "Figma",
    icon: <Square className="w-8 h-8 text-white" />,
    gradientFrom: "from-red-500", // Figma red
    gradientTo: "to-purple-600", // with purple accent
    brandIcon: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
  },
  {
    name: "Cursor",
    icon: <Pointer className="w-8 h-8 text-white" />,
    gradientFrom: "from-blue-500", // Cursor blue
    gradientTo: "to-cyan-600",
    brandIcon: "",
  },
  {
    name: "Windsurf",
    icon: <Wind className="w-8 h-8 text-white" />,
    gradientFrom: "from-teal-400", // Windsurf teal/aqua
    gradientTo: "to-blue-500",
    brandIcon: "https://windsurf.ai/favicon.ico",
  },
  {
    name: "Gemini",
    icon: <Layers className="w-8 h-8 text-white" />,
    gradientFrom: "from-blue-500", // Google blue
    gradientTo: "to-purple-600", // with purple gradient
    brandIcon: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg",
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
      className="grid grid-cols-4 gap-8 md:gap-12 max-w-2xl mx-auto relative z-10 p-10 rounded-2xl"
    >
      {sortedTools.map((tool) => {
        const displayConfig = getToolDisplayConfig(tool.name);
        const isLiked = isToolLiked(tool.id);
        return (
          <div
            key={tool.name}
            className="tool-item flex flex-col items-center group opacity-100"
          >
            <div className="relative p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-300">
              <div className="flex flex-col items-center">
                <div
                  className={`tool-icon w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg mb-3`}
                >
                  {displayConfig.brandIcon ? (
                    <img
                      src={displayConfig.brandIcon}
                      alt={`${tool.name} icon`}
                      className="w-8 h-8"
                    />
                  ) : (
                    displayConfig.icon
                  )}
                </div>
                <span className="text-xs md:text-sm font-medium text-white group-hover:text-gray-200 transition-colors duration-300 text-center">
                  {tool.name}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(tool.id);
                }}
                disabled={likeMutation.isPending}
                className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 disabled:opacity-50 opacity-0 group-hover:opacity-100 ${
                  isLiked
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-white text-gray-400 hover:text-red-500 shadow-md border border-gray-200"
                }`}
              >
                <Heart className={`w-3 h-3 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </button>
              {tool.likeCount > 0 && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {tool.likeCount}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}