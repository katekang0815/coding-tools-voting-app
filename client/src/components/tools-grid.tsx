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

      // Determine current state - check both local state and server state
      const currentServerLike = userLikes?.find((like) => like.toolId === toolId);
      const currentLocalLike = likedTools.has(toolId);
      
      // The actual current state should consider local state first
      const actualCurrentState = currentLocalLike !== undefined ? currentLocalLike : (currentServerLike?.liked || false);
      const newLiked = !actualCurrentState;

      // Optimistically update likes
      queryClient.setQueryData(
        ["/api/tools/likes", actualUserId],
        (old: any[]) => {
          return (
            old?.map((like) =>
              like.toolId === toolId ? { ...like, liked: newLiked } : like,
            ) || []
          );
        },
      );

      // Optimistically update tool counts
      queryClient.setQueryData(["/api/tools"], (old: any[]) => {
        const increment = actualCurrentState ? -1 : 1;

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
      // Rollback local state on error
      setLikedTools((prev) => {
        const next = new Set(prev);
        if (next.has(toolId)) next.delete(toolId);
        else next.add(toolId);
        return next;
      });
      
      // Rollback query cache on error
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
      // Update local state for immediate UI feedback
      setLikedTools((prev) => {
        const next = new Set(prev);
        if (next.has(toolId)) next.delete(toolId);
        else next.add(toolId);
        return next;
      });
      // Fire off mutation with optimistic updates
      likeMutation.mutate(toolId);
    },
    [likeMutation],
  );</old_str>

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
      // First check local state, then fall back to server state
      if (likedTools.has(toolId)) {
        return true;
      }
      const serverLike = userLikes.find((like) => like.toolId === toolId);
      return serverLike?.liked || false;
    },
    [userLikes, likedTools],
  );</old_str>

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
        const isLiked = isToolLiked(tool.id);
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
                className={`
                  absolute -top-1 -right-1 sm:-top-2 sm:-right-2
                  w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8
                  flex items-center justify-center
                  transition-transform duration-300 hover:scale-110
                  disabled:opacity-50
                  
                  opacity-0
                  group-hover:opacity-100
                  ${isLiked ? "opacity-100" : ""}
                `}
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
