import React from "react";
import {
  Code,
  Zap,
  Palette,
  Heart,
  RefreshCw,
  Pointer,
  Square,
  Layers,
  MessageSquare,
  Wind,
  Sparkles,
} from "lucide-react";

export interface ToolDisplay {
  name: string;
  icon: JSX.Element;
  gradientFrom: string;
  gradientTo: string;
  brandIcon?: string;
}

export const toolDisplayConfig: ToolDisplay[] = [
  {
    name: "ChatGPT",
    icon: <MessageSquare className="w-8 h-8 text-white" />,
    gradientFrom: "from-green-500",
    gradientTo: "to-green-700",
    brandIcon: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  },
  {
    name: "Claude",
    icon: <Sparkles className="w-8 h-8 text-white" />,
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-600",
    brandIcon: "https://claude.ai/favicon.ico",
  },
  {
    name: "Gemini",
    icon: <Layers className="w-8 h-8 text-white" />,
    gradientFrom: "from-blue-500",
    gradientTo: "to-purple-600",
    brandIcon: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg",
  },
  {
    name: "Copilot",
    icon: <Code className="w-8 h-8 text-white" />,
    gradientFrom: "from-blue-600",
    gradientTo: "to-indigo-700",
    brandIcon: "https://github.githubassets.com/assets/copilot-logo-fb8c88c71feb.png",
  },
  {
    name: "Cursor",
    icon: <Pointer className="w-8 h-8 text-white" />,
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-600",
    brandIcon: "https://cursor.sh/favicon.ico",
  },
  {
    name: "Windsurf",
    icon: <Wind className="w-8 h-8 text-white" />,
    gradientFrom: "from-teal-400",
    gradientTo: "to-blue-500",
    brandIcon: "https://windsurf.ai/favicon.ico",
  },
  {
    name: "Replit",
    icon: <RefreshCw className="w-8 h-8 text-white" />,
    gradientFrom: "from-orange-400",
    gradientTo: "to-pink-500",
    brandIcon: "https://replit.com/favicon.ico",
  },
  {
    name: "Lovable",
    icon: <Heart className="w-8 h-8 text-white" />,
    gradientFrom: "from-pink-500",
    gradientTo: "to-rose-600",
    brandIcon: "https://lovable.dev/favicon.ico",
  },
  {
    name: "Canva",
    icon: <Palette className="w-8 h-8 text-white" />,
    gradientFrom: "from-purple-500",
    gradientTo: "to-violet-600",
    brandIcon: "https://static.canva.com/web/images/favicon.ico",
  },
  {
    name: "Figma",
    icon: <Square className="w-8 h-8 text-white" />,
    gradientFrom: "from-red-500",
    gradientTo: "to-purple-600",
    brandIcon: "https://static.figma.com/app/icon/1/favicon.ico",
  },
];