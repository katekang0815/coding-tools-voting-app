import type { Express } from "express";
import { storage } from "./storage";
import { insertToolSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<void> {
  // Get all tools with their like counts
  app.get("/api/tools", async (req, res) => {
    try {
      const tools = await storage.getAllTools();
      res.json(tools);
    } catch (error: any) {
      console.error("Error fetching tools:", error);
      if (error.message === "Database not available") {
        // Return mock data when database is not available
        const mockTools = [
          { id: 1, name: "ChatGPT", likeCount: 0 },
          { id: 2, name: "Claude", likeCount: 0 },
          { id: 3, name: "Cursor", likeCount: 0 },
          { id: 4, name: "V0", likeCount: 0 },
          { id: 5, name: "Bolt", likeCount: 0 }
        ];
        res.json(mockTools);
      } else {
        res.status(500).json({ message: "Failed to fetch tools" });
      }
    }
  });

  // Create or seed tools
  app.post("/api/tools", async (req, res) => {
    try {
      const validatedTool = insertToolSchema.parse(req.body);
      const existingTool = await storage.getToolByName(validatedTool.name);
      
      if (existingTool) {
        return res.json(existingTool);
      }

      const tool = await storage.createTool(validatedTool);
      res.status(201).json(tool);
    } catch (error: any) {
      console.error("Error creating tool:", error);
      if (error.message === "Database not available") {
        res.status(503).json({ message: "Database temporarily unavailable" });
      } else {
        res.status(500).json({ message: "Failed to create tool" });
      }
    }
  });

  // Toggle like for a tool (requires user session)
  app.post("/api/tools/:toolId/like", async (req, res) => {
    try {
      const toolId = parseInt(req.params.toolId);
      const { userId } = req.body;

      if (!userId || !toolId) {
        return res.status(400).json({ message: "User ID and Tool ID are required" });
      }

      const result = await storage.toggleToolLike(userId, toolId);
      res.json(result);
    } catch (error: any) {
      console.error("Error toggling tool like:", error);
      if (error.message === "Database not available") {
        res.status(503).json({ message: "Database temporarily unavailable" });
      } else {
        res.status(500).json({ message: "Failed to toggle like" });
      }
    }
  });

  // Get user's like status for tools
  app.get("/api/tools/likes/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const tools = await storage.getAllTools();
      
      const userLikes = await Promise.all(
        tools.map(async (tool) => {
          const like = await storage.getUserToolLike(userId, tool.id);
          return {
            toolId: tool.id,
            liked: like?.liked || false
          };
        })
      );

      res.json(userLikes);
    } catch (error: any) {
      console.error("Error fetching user likes:", error);
      if (error.message === "Database not available") {
        res.json([]); // Return empty array when database is not available
      } else {
        res.status(500).json({ message: "Failed to fetch user likes" });
      }
    }
  });


}
