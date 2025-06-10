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
      "data:image/jpeg;base64,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",
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
      "data:image/jpeg;base64,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",
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
  
  // Keep track of which tool IDs are "liked" locally for immediate UI feedback
  const [likedTools, setLikedTools] = useState<Set<number>>(new Set());

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
      // 1) Toggle our local UI state immediately
      setLikedTools((prev) => {
        const next = new Set(prev);
        if (next.has(toolId)) next.delete(toolId);
        else next.add(toolId);
        return next;
      });
      // 2) Fire off your mutation (optimistic UI)
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-12 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto relative z-10 px-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gray-700 animate-pulse mb-2 sm:mb-3"></div>
            <div className="w-8 sm:w-10 md:w-12 h-2 sm:h-2.5 md:h-3 bg-gray-700 animate-pulse rounded"></div>
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
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto relative z-10 p-4 sm:p-6 md:p-8 rounded-2xl"
    >
      {sortedTools.map((tool) => {
        const displayConfig = getToolDisplayConfig(tool.name);
        const isLiked = likedTools.has(tool.id);
        return (
          <div
            key={tool.name}
            className="tool-item flex flex-col items-center group opacity-100"
          >
            <div className="relative p-3 sm:p-4 md:p-5 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-300 w-full">
              <div className="flex flex-col items-center">
                <div
                  className={`tool-icon w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg mb-2 sm:mb-3`}
                >
                  {displayConfig.brandIcon ? (
                    <img
                      src={displayConfig.brandIcon}
                      alt={`${tool.name} icon`}
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                    />
                  ) : (
                    <div className="text-white scale-50 sm:scale-75 md:scale-100">
                      {displayConfig.icon}
                    </div>
                  )}
                </div>
                <span className="text-xs sm:text-xs md:text-sm font-medium text-white group-hover:text-gray-200 transition-colors duration-300 text-center leading-tight">
                  {tool.name}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(tool.id);
                }}
                disabled={likeMutation.isPending}
                className="
                  absolute -top-1 -right-1
                  w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8
                  flex items-center justify-center
                  transition-transform duration-300
                  hover:scale-110
                  disabled:opacity-50
                  opacity-80 sm:opacity-0 sm:group-hover:opacity-100
                "
              >
                <Heart
                  className={`
                    w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6
                    stroke-2 transition-all duration-300
                    ${isLiked
                      ? "fill-red-500 stroke-red-500"
                      : "fill-none stroke-red-500"}
                  `}
                />
              </button>
              {tool.likeCount > 0 && (
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-gray-500/50 text-green-400 text-xs sm:text-sm md:text-base rounded-full w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex items-center justify-center font-bold transition-all duration-300">
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
