import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Build history table — stores every grid sent to bots
 */
export const builds = mysqlTable('builds', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('userId').notNull().references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  gridData: text('gridData').notNull(), // JSON array of blocks
  originX: int('originX').notNull().default(0),
  originY: int('originY').notNull().default(0),
  originZ: int('originZ').notNull().default(0),
  totalBlocks: int('totalBlocks').notNull(),
  status: mysqlEnum('status', ['pending', 'in_progress', 'completed', 'failed']).default('pending'),
  blocksPlaced: int('blocksPlaced').notNull().default(0),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp('completedAt'),
});

export type Build = typeof builds.$inferSelect;
export type InsertBuild = typeof builds.$inferInsert;

/**
 * Bot status table — real-time bot information
 */
export const botStatus = mysqlTable('botStatus', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('userId').notNull().references(() => users.id),
  botName: varchar('botName', { length: 64 }).notNull(),
  isOnline: int('isOnline').notNull().default(0), // 0 = offline, 1 = online
  currentTask: varchar('currentTask', { length: 255 }),
  blocksPlaced: int('blocksPlaced').notNull().default(0),
  obsidianCount: int('obsidianCount').notNull().default(0),
  posX: int('posX'),
  posY: int('posY'),
  posZ: int('posZ'),
  lastUpdate: timestamp('lastUpdate').defaultNow().onUpdateNow(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export type BotStatus = typeof botStatus.$inferSelect;
export type InsertBotStatus = typeof botStatus.$inferInsert;

/**
 * Server configuration table — Minecraft server settings
 */
export const serverConfig = mysqlTable('serverConfig', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('userId').notNull().references(() => users.id),
  host: varchar('host', { length: 255 }).notNull(),
  port: int('port').notNull().default(25565),
  botUsernames: text('botUsernames').notNull(), // JSON array
  whitelist: text('whitelist').notNull(), // JSON array
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export type ServerConfig = typeof serverConfig.$inferSelect;
export type InsertServerConfig = typeof serverConfig.$inferInsert;