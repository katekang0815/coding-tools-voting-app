import { useEffect, useRef, useState, useCallback, memo } from "react";
import { Circle, Heart, MessageSquare, Sparkles, Layers, Code, Pointer, Wind, RefreshCw, Palette, Square } from "lucide-react";
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

const getToolIcon = (toolName: string): JSX.Element => {
  switch (toolName) {
    case "ChatGPT":
      return <MessageSquare className="w-8 h-8 text-white" />;
    case "Claude":
      return <Sparkles className="w-8 h-8 text-white" />;
    case "Gemini":
      return <Layers className="w-8 h-8 text-white" />;
    case "Copilot":
      return <Code className="w-8 h-8 text-white" />;
    case "Cursor":
      return <Pointer className="w-8 h-8 text-white" />;
    case "Windsurf":
      return <Wind className="w-8 h-8 text-white" />;
    case "Replit":
      return <RefreshCw className="w-8 h-8 text-white" />;
    case "Lovable":
      return <Heart className="w-8 h-8 text-white" />;
    case "Canva":
      return <Palette className="w-8 h-8 text-white" />;
    case "Figma":
      return <Square className="w-8 h-8 text-white" />;
    default:
      return <Circle className="w-8 h-8 text-white" />;
  }
};

const getToolConfig = (toolName: string): ToolDisplay => {
  const configs: Record<string, Omit<ToolDisplay, 'icon'>> = {
    "ChatGPT": {
      name: "ChatGPT",
      gradientFrom: "from-green-500",
      gradientTo: "to-green-700",
      brandIcon: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    },
    "Claude": {
      name: "Claude",
      gradientFrom: "from-orange-500",
      gradientTo: "to-red-600",
      brandIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7iNXqjh0pgjHO0dQko43yhy8Z4Uj4NRGAYA&s",
    },
    "Gemini": {
      name: "Gemini",
      gradientFrom: "from-blue-500",
      gradientTo: "to-purple-600",
      brandIcon: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg",
    },
    "Copilot": {
      name: "Copilot",
      gradientFrom: "from-blue-600",
      gradientTo: "to-indigo-700",
      brandIcon: "https://github.githubassets.com/images/modules/site/copilot/copilot.png",
    },
    "Cursor": {
      name: "Cursor",
      gradientFrom: "from-cyan-500",
      gradientTo: "to-blue-600",
      brandIcon: "https://cursor.sh/favicon.ico",
    },
    "Windsurf": {
      name: "Windsurf",
      gradientFrom: "from-teal-400",
      gradientTo: "to-blue-500",
      brandIcon: "https://windsurf.ai/favicon.ico",
    },
    "Replit": {
      name: "Replit",
      gradientFrom: "from-orange-400",
      gradientTo: "to-pink-500",
      brandIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAaVBMVEX////yYgfyXADxVwD60ML3pIbyYADzcTH4tZ70hVf5wK3zeD/xTwDxVgDxUwD84Nb+9vL828/4sJT0fkj0gk/6yLbyZRD2mXT1kWj2n3z5vKj85dz718nzbyv1i173o4HzbCP+8Or6y7ptYnHQAAACWklEQVR4nO3c727aMBSH4dihYcnslATo2PqHtvd/kaWVJu2TQ2NPP3P0vleQR8EBpHPSNERERERERERERERERDfe5rzffr9+vldf+JUNPvpuRd6Pz5P64q9pHzu3ti6c1Ze/3Ktf7fssntSApQ55wAvxh5qQ7jhmAp0Lb2pEsof1Z/Bv/pcakWrKv4XOjWpFqjn3FH4Wa/7KOJUQtoOakagvIfQ1P00RIkSoDyFChPoQIkSoDyFChPoQIkSoDyFChPoQIkSoDyFChPoQIqxf+GJe+Nu88NhaF+6CdWGRkaG6hbuxwOhe1cLmPf9zWrmwGULuXaxd2Exdm2esXni5jdsQ2/WF+oWXB860yejPXUbz+06tX24YfUZt6B/VgqWGzF9GPtypCQvlCp1re7UhXb7QtVUP/JcQuvCkVqQqIeye1YpUJYRurHnVr4jQz2pGojLCFzUjURFh91PNSIQQIUJ9CBEi1IcQIUJ9CBEi1IcQIUJ9CBEi1IcQIUJ9CBEi1IcQIUJ9zGJcJzQ/T2N+Jsr+XJv52UTz86XWZ4RvYM77Bmb1re9bWN+ZMb/3ZH53zfz+of0dUvN7wPZ3ucv8s6tZaP+dCvbfi2H/3SYIESLUhxAhQn0IESLUhxAhQn0IESLUhxAhQn0IESLUhxAhQn0IEdYvLDEw5NpBzUg0lxDGSc1INI0FhKNakeyhwOBe3WP2x/ybGN7UiHSH3JMYa36SfvWaR4wnNWC5fVx/FrtwVl/+NQ0++m5F3o/bmr8o/m1zPmy/Xz/XvFBHRERERERERERERET0X/sAPXxLpNfvdI0AAAAASUVORK5CYII=",
    },
    "Lovable": {
      name: "Lovable",
      gradientFrom: "from-pink-500",
      gradientTo: "to-rose-600",
      brandIcon: "https://lovable.dev/favicon.ico",
    },
    "Canva": {
      name: "Canva",
      gradientFrom: "from-purple-500",
      gradientTo: "to-violet-600",
      brandIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbeb8FCADSu0s3ka0NPIRePMqdIUUVcjsTOg&s",
    },
    "Figma": {
      name: "Figma",
      gradientFrom: "from-red-500",
      gradientTo: "to-purple-600",
      brandIcon: "https://static.figma.com/app/icon/1/favicon.ico",
    },
  };

  const config = configs[toolName] || {
    name: toolName,
    gradientFrom: "from-gray-500",
    gradientTo: "to-gray-600",
  };

  return {
    ...config,
    icon: getToolIcon(toolName),
  };
};

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
      // Ensure session exists before making like request
      if (!userSession?.userId) {
        throw new Error("User session not established");
      }
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
      const toolNames = ["ChatGPT", "Claude", "Gemini", "Copilot", "Cursor", "Windsurf", "Replit", "Lovable", "Canva", "Figma"];
      toolNames.forEach((toolName) => {
        seedMutation.mutate(toolName);
      });
    }
  }, [tools.length, isLoading, seeded, seedMutation]);

  const handleLike = useCallback((toolId: number) => {
    likeMutation.mutate(toolId);
  }, [likeMutation]);

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

  // Sort tools by like count (descending)
  const sortedTools = [...tools].sort((a, b) => b.likeCount - a.likeCount);

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-8 md:gap-12 max-w-2xl mx-auto relative z-10 p-10 rounded-2xl">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-800 rounded-full animate-pulse mb-3"></div>
            <div className="w-12 h-3 bg-gray-800 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-4 gap-8 md:gap-12 max-w-2xl mx-auto relative z-10 p-10 rounded-2xl"
    >
      {sortedTools.map((tool) => {
        const displayConfig = getToolConfig(tool.name);
        const isLiked = isToolLiked(tool.id);
        return (
          <ToolItem
            key={tool.id}
            tool={tool}
            displayConfig={displayConfig}
            isLiked={isLiked}
            onLike={handleLike}
            isLikePending={likeMutation.isPending}
          />
        );
      })}
    </div>
  );
}