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
    brandIcon: "data:image/jpeg;base64,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",
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
    brandIcon: "data:image/jpeg;base64,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",
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
      className="grid grid-cols-4 gap-8 md:gap-12 max-w-2xl mx-auto relative z-10 m-10 p-20 rounded-2xl"
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
          </div>
        );
      })}
    </div>
  );
}