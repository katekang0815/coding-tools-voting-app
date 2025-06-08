import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertToolSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all tools with their like counts
  app.get("/api/tools", async (req, res) => {
    try {
      const tools = await storage.getAllTools();
      res.json(tools);
    } catch (error) {
      console.error("Error fetching tools:", error);
      res.status(500).json({ message: "Failed to fetch tools" });
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
    } catch (error) {
      console.error("Error creating tool:", error);
      res.status(500).json({ message: "Failed to create tool" });
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
    } catch (error) {
      console.error("Error toggling tool like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
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
    } catch (error) {
      console.error("Error fetching user likes:", error);
      res.status(500).json({ message: "Failed to fetch user likes" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
