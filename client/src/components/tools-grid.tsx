import { useEffect, useRef, useState, useCallback } from "react";
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
    brandIcon:
      "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  },
  {
    name: "Copilot",
    icon: <Zap className="w-8 h-8 text-white" />,
    gradientFrom: "from-blue-600", // GitHub blue
    gradientTo: "to-indigo-700",
    brandIcon:
      "https://github.githubassets.com/images/modules/site/copilot/copilot.png",
  },
  {
    name: "Canva",
    icon: <TreePine className="w-8 h-8 text-white" />,
    gradientFrom: "from-purple-500", // Canva purple
    gradientTo: "to-violet-600",
    brandIcon:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3DOVfJ3byuTZsaWnGQb8O6w-y9_zkwweOnw&s",
  },
  {
    name: "Claude",
    icon: <Palette className="w-8 h-8 text-white" />,
    gradientFrom: "from-orange-500", // Anthropic orange
    gradientTo: "to-orange-700",
    brandIcon:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCIZYpPXuiY_Dw0M0ffBoN8X8zsUKVvPsn8mAUb_t5zWUKXtrCMWzyYwU&s", // Using your provided AI logo
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
    brandIcon:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-HnpgESCXTePDDnjoCQ62_tcBT0_2NFygWhY-9irhL0-I2SPB_LS6GE0&s",
  },
  {
    name: "Figma",
    icon: <Square className="w-8 h-8 text-white" />,
    gradientFrom: "from-red-500", // Figma red
    gradientTo: "to-purple-600", // with purple accent
    brandIcon:
      "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
  },
  {
    name: "Cursor",
    icon: <Pointer className="w-8 h-8 text-white" />,
    gradientFrom: "from-blue-500", // Cursor blue
    gradientTo: "to-cyan-600",
    brandIcon:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQosGiHkTgcRjw4jfE7diGzPub1TYhReObk8g&s",
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
    brandIcon:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg",
  },
];

export default function ToolsGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();



  // Generate or get user ID from localStorage
  const [currentUserId] = useState(() => {
    const stored = localStorage.getItem("toolsAppUserId");
    if (stored) {
      return parseInt(stored);
    }
    // Generate a unique user ID based on timestamp and random
    const newUserId = Date.now() + Math.floor(Math.random() * 1000);
    localStorage.setItem("toolsAppUserId", newUserId.toString());
    return newUserId;
  });

  // Create user in database and get actual user ID
  const { data: userSession } = useQuery<{ userId: number; username: string }>({
    queryKey: ["/api/tools/user", currentUserId],
    queryFn: async () => {
      const response = await apiRequest("/api/tools/user", "POST", {
        tempUserId: currentUserId,
      });
      return (await response.json()) as { userId: number; username: string };
    },
  });

  const actualUserId = userSession?.userId;

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
    queryKey: ["/api/tools/likes", actualUserId],
    enabled: !!actualUserId,
  });

  // Like toggle mutation
  const likeMutation = useMutation({
    mutationFn: async (toolId: number) => {
      return await apiRequest(`/api/tools/${toolId}/like`, "POST", {
        userId: actualUserId,
      });
    },
    onMutate: async (toolId: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["/api/tools"] });
      await queryClient.cancelQueries({
        queryKey: ["/api/tools/likes", actualUserId],
      });

      // Snapshot the previous values
      const previousTools = queryClient.getQueryData(["/api/tools"]);
      const previousLikes = queryClient.getQueryData([
        "/api/tools/likes",
        actualUserId,
      ]);

      // Optimistically update likes
      queryClient.setQueryData(
        ["/api/tools/likes", actualUserId],
        (old: any[]) => {
          const currentLike = old?.find((like) => like.toolId === toolId);
          const newLiked = !currentLike?.liked;

          return (
            old?.map((like) =>
              like.toolId === toolId ? { ...like, liked: newLiked } : like,
            ) || []
          );
        },
      );

      // Optimistically update tool counts
      queryClient.setQueryData(["/api/tools"], (old: any[]) => {
        const currentLike = userLikes?.find((like) => like.toolId === toolId);
        const increment = currentLike?.liked ? -1 : 1;

        return (
          old?.map((tool) =>
            tool.id === toolId
              ? { ...tool, likeCount: Math.max(0, tool.likeCount + increment) }
              : tool,
          ) || []
        );
      });

      return { previousTools, previousLikes };
    },
    onError: (err, toolId, context) => {
      // Rollback on error
      if (context?.previousTools) {
        queryClient.setQueryData(["/api/tools"], context.previousTools);
      }
      if (context?.previousLikes) {
        queryClient.setQueryData(
          ["/api/tools/likes", actualUserId],
          context.previousLikes,
        );
      }
    },
    onSettled: () => {
      // Refetch to ensure data is up to date, but only if needed
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
        queryClient.invalidateQueries({
          queryKey: ["/api/tools/likes", actualUserId],
        });
      }, 100);
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

  const handleLike = useCallback(
    (toolId: number) => {
      likeMutation.mutate(toolId);
    },
    [likeMutation],
  );

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

  const isToolLiked = useCallback(
    (toolId: number): boolean => {
      return userLikes.find((like) => like.toolId === toolId)?.liked || false;
    },
    [userLikes],
  );

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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-16 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative z-10 px-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-full bg-gray-700 animate-pulse mb-2 sm:mb-3 md:mb-4 2xl:mb-6"></div>
            <div className="w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16 2xl:w-20 h-2 sm:h-2.5 md:h-3 lg:h-3.5 xl:h-4 2xl:h-5 bg-gray-700 animate-pulse rounded"></div>
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
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-16 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative z-10 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 rounded-2xl"
    >
      {sortedTools.map((tool) => {
        const displayConfig = getToolDisplayConfig(tool.name);
        const isLiked = isToolLiked(tool.id);
        return (
          <div
            key={tool.name}
            className="tool-item flex flex-col items-center group opacity-100"
          >
            <div className="relative p-3 sm:p-4 md:p-5 2xl:px-18 2xl:py-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-300 w-full">
              <div className="flex flex-col items-center">
                <div
                  className={`tool-icon w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg mb-2 sm:mb-3 md:mb-4 2xl:mb-6`}
                >
                  {displayConfig.brandIcon ? (
                    <img
                      src={displayConfig.brandIcon}
                      alt={`${tool.name} icon`}
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10"
                    />
                  ) : (
                    <div className="text-white scale-50 sm:scale-75 md:scale-100 lg:scale-110 xl:scale-125 2xl:scale-150">
                      {displayConfig.icon}
                    </div>
                  )}
                </div>
                <span className="text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium text-white group-hover:text-gray-200 transition-colors duration-300 text-center leading-tight">
                  {tool.name}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(tool.id);
                }}
                disabled={likeMutation.isPending}
                className={`
                  absolute -top-1 -right-1 sm:-top-2 sm:-right-2 2xl:-top-3 2xl:-right-3
                  w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12
                  flex items-center justify-center
                  transition-all duration-300 hover:scale-110
                  disabled:opacity-50
                  ${isLiked ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                `}
              >
                <Heart
                  className={`
                    w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10
                    stroke-2 transition-all duration-300
                    ${
                      isLiked
                        ? "fill-red-500 stroke-red-500"
                        : "fill-none stroke-red-500"
                    }
                  `}
                />
              </button>
              {tool.likeCount > 0 && (
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 2xl:-bottom-3 2xl:-right-3 bg-gray-500/50 text-green-400 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl rounded-full w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 flex items-center justify-center font-bold transition-all duration-300">
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
