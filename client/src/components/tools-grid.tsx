import { useEffect, useRef, useState, useCallback, memo } from "react";
import { Circle, Heart } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Tool } from "@shared/schema";
import { toolDisplayConfig, type ToolDisplay } from "./tool-config";

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

// Memoized ToolItem component to prevent unnecessary re-renders
const ToolItem = memo(({ 
  tool, 
  displayConfig, 
  isLiked, 
  onLike, 
  isLikePending 
}: {
  tool: Tool;
  displayConfig: ToolDisplay;
  isLiked: boolean;
  onLike: (toolId: number) => void;
  isLikePending: boolean;
}) => {
  return (
    <div className="tool-item flex flex-col items-center group opacity-100">
      <div className="relative p-3 sm:p-4 md:p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-300">
        <div className="flex flex-col items-center">
          <div
            className={`tool-icon w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg mb-2 sm:mb-3`}
          >
            {displayConfig.brandIcon ? (
              <img
                src={displayConfig.brandIcon}
                alt={`${tool.name} icon`}
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
              />
            ) : (
              displayConfig.icon
            )}
          </div>
          <span className="text-xs sm:text-sm font-medium text-white group-hover:text-gray-200 transition-colors duration-300 text-center leading-tight">
            {tool.name}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike(tool.id);
          }}
          disabled={isLikePending}
          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center transition-all duration-300 transform hover:scale-110 disabled:opacity-50 opacity-0 group-hover:opacity-100"
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 stroke-2 transition-all duration-300 ${
            isLiked 
              ? "fill-red-500 stroke-red-500 text-red-500" 
              : "fill-none stroke-red-500 hover:fill-red-500"
          }`} />
        </button>
        {tool.likeCount > 0 && (
          <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-gray-500/50 text-green-400 text-xs sm:text-sm md:text-base rounded-full w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center font-bold transition-all duration-300">
            {tool.likeCount}
          </div>
        )}
      </div>
    </div>
  );
});

export default function ToolsGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Initialize user session
  const { data: userSession } = useQuery<{ userId: number; username: string }>({
    queryKey: ["/api/user/session"],
  });

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
    queryKey: ["/api/tools/likes"],
    enabled: !!userSession?.userId,
  });

  // Like toggle mutation
  const likeMutation = useMutation({
    mutationFn: async (toolId: number) => {
      return await apiRequest(`/api/tools/${toolId}/like`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/tools/likes"],
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

  const handleLike = useCallback((toolId: number) => {
    likeMutation.mutate(toolId);
  }, [likeMutation]);

  const getToolDisplayConfig = useCallback((toolName: string): ToolDisplay => {
    return (
      toolDisplayConfig.find((config) => config.name === toolName) || {
        name: toolName,
        icon: <Circle className="w-8 h-8 text-white" />,
        gradientFrom: "from-gray-500",
        gradientTo: "to-gray-600",
      }
    );
  }, []);

  const isToolLiked = useCallback((toolId: number): boolean => {
    return userLikes.find((like) => like.toolId === toolId)?.liked || false;
  }, [userLikes]);

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
            <div className="relative p-3 sm:p-4 md:p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-300">
              <div className="flex flex-col items-center">
                <div
                  className={`tool-icon w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg mb-2 sm:mb-3`}
                >
                  {displayConfig.brandIcon ? (
                    <img
                      src={displayConfig.brandIcon}
                      alt={`${tool.name} icon`}
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
                    />
                  ) : (
                    displayConfig.icon
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium text-white group-hover:text-gray-200 transition-colors duration-300 text-center leading-tight">
                  {tool.name}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(tool.id);
                }}
                disabled={likeMutation.isPending}
                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center transition-all duration-300 transform hover:scale-110 disabled:opacity-50 opacity-0 group-hover:opacity-100"
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 stroke-2 transition-all duration-300 ${
                  isLiked 
                    ? "fill-red-500 stroke-red-500 text-red-500" 
                    : "fill-none stroke-red-500 hover:fill-red-500"
                }`} />
              </button>
              {tool.likeCount > 0 && (
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-gray-500/50 text-green-400 text-xs sm:text-sm md:text-base rounded-full w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center font-bold transition-all duration-300">
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