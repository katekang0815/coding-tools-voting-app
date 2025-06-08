import { users, tools, userToolLikes, type User, type InsertUser, type Tool, type InsertTool, type UserToolLike, type InsertUserToolLike } from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Tool operations
  getAllTools(): Promise<Tool[]>;
  getToolByName(name: string): Promise<Tool | undefined>;
  createTool(tool: InsertTool): Promise<Tool>;
  
  // Like operations
  toggleToolLike(userId: number, toolId: number): Promise<{ liked: boolean; newCount: number }>;
  getUserToolLike(userId: number, toolId: number): Promise<UserToolLike | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllTools(): Promise<Tool[]> {
    return await db.select().from(tools);
  }

  async getToolByName(name: string): Promise<Tool | undefined> {
    const [tool] = await db.select().from(tools).where(eq(tools.name, name));
    return tool || undefined;
  }

  async createTool(tool: InsertTool): Promise<Tool> {
    const [newTool] = await db
      .insert(tools)
      .values(tool)
      .returning();
    return newTool;
  }

  async toggleToolLike(userId: number, toolId: number): Promise<{ liked: boolean; newCount: number }> {
    return await db.transaction(async (tx) => {
      // Check if user already liked this tool
      const [existingLike] = await tx
        .select()
        .from(userToolLikes)
        .where(and(eq(userToolLikes.userId, userId), eq(userToolLikes.toolId, toolId)));

      let liked: boolean;

      if (existingLike) {
        // Toggle the like status
        liked = !existingLike.liked;
        await tx
          .update(userToolLikes)
          .set({ liked })
          .where(and(eq(userToolLikes.userId, userId), eq(userToolLikes.toolId, toolId)));
      } else {
        // Create new like
        liked = true;
        await tx
          .insert(userToolLikes)
          .values({ userId, toolId, liked });
      }

      // Update tool like count
      const increment = liked ? 1 : -1;
      await tx
        .update(tools)
        .set({ 
          likeCount: sql`GREATEST(0, ${tools.likeCount} + ${increment})`
        })
        .where(eq(tools.id, toolId));

      // Get updated count
      const [updatedTool] = await tx
        .select()
        .from(tools)
        .where(eq(tools.id, toolId));

      return {
        liked,
        newCount: updatedTool.likeCount
      };
    });
  }

  async getUserToolLike(userId: number, toolId: number): Promise<UserToolLike | undefined> {
    const [like] = await db
      .select()
      .from(userToolLikes)
      .where(and(eq(userToolLikes.userId, userId), eq(userToolLikes.toolId, toolId)));
    return like || undefined;
  }
}

export const storage = new DatabaseStorage();
