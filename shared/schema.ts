import { pgTable, text, serial, integer, boolean, timestamp, varchar, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  likeCount: integer("like_count").notNull().default(0),
});

export const userToolLikes = pgTable("user_tool_likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  toolId: integer("tool_id").notNull().references(() => tools.id),
  liked: boolean("liked").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userToolUnique: uniqueIndex("user_tool_unique").on(table.userId, table.toolId),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  likes: many(userToolLikes),
}));

export const toolsRelations = relations(tools, ({ many }) => ({
  likes: many(userToolLikes),
}));

export const userToolLikesRelations = relations(userToolLikes, ({ one }) => ({
  user: one(users, {
    fields: [userToolLikes.userId],
    references: [users.id],
  }),
  tool: one(tools, {
    fields: [userToolLikes.toolId],
    references: [tools.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertToolSchema = createInsertSchema(tools).pick({
  name: true,
});

export const insertUserToolLikeSchema = createInsertSchema(userToolLikes).pick({
  userId: true,
  toolId: true,
  liked: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Tool = typeof tools.$inferSelect;
export type InsertTool = z.infer<typeof insertToolSchema>;
export type UserToolLike = typeof userToolLikes.$inferSelect;
export type InsertUserToolLike = z.infer<typeof insertUserToolLikeSchema>;
