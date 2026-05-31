import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, builds, botStatus, serverConfig, InsertBuild, InsertBotStatus, InsertServerConfig } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Build Management ───────────────────────────────────────────────────────
export async function createBuild(userId: number, build: Omit<InsertBuild, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const result = await db.insert(builds).values({ ...build, userId });
  return result;
}

export async function getBuildHistory(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.select().from(builds).where(eq(builds.userId, userId)).orderBy(desc(builds.createdAt)).limit(limit);
}

export async function updateBuildProgress(buildId: number, blocksPlaced: number, status?: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const updates: Record<string, any> = { blocksPlaced };
  if (status) updates.status = status;
  return db.update(builds).set(updates).where(eq(builds.id, buildId));
}

// ─── Bot Status Management ──────────────────────────────────────────────────
export async function upsertBotStatus(userId: number, botName: string, status: Partial<InsertBotStatus>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const values: any = { ...status, userId, botName };
  return db.insert(botStatus).values(values).onDuplicateKeyUpdate({
    set: status,
  });
}

export async function getBotStatus(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.select().from(botStatus).where(eq(botStatus.userId, userId));
}

// ─── Server Configuration ───────────────────────────────────────────────────
export async function getServerConfig(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const result = await db.select().from(serverConfig).where(eq(serverConfig.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function upsertServerConfig(userId: number, config: Omit<InsertServerConfig, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const existing = await getServerConfig(userId);
  if (existing) {
    return db.update(serverConfig).set(config).where(eq(serverConfig.userId, userId));
  }
  return db.insert(serverConfig).values({ ...config, userId });
}

// TODO: add additional feature queries here as your schema grows.
