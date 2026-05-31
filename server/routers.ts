import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createBuild, getBuildHistory, updateBuildProgress, getBotStatus, upsertBotStatus, getServerConfig, upsertServerConfig } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  builds: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        gridData: z.string(),
        originX: z.number(),
        originY: z.number(),
        originZ: z.number(),
        totalBlocks: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createBuild(ctx.user.id, {
          name: input.name,
          gridData: input.gridData,
          originX: input.originX,
          originY: input.originY,
          originZ: input.originZ,
          totalBlocks: input.totalBlocks,
          status: 'pending',
        });
      }),
    history: protectedProcedure.query(({ ctx }) => getBuildHistory(ctx.user.id)),
    updateProgress: protectedProcedure
      .input(z.object({ buildId: z.number(), blocksPlaced: z.number(), status: z.string().optional() }))
      .mutation(({ input }) => updateBuildProgress(input.buildId, input.blocksPlaced, input.status)),
  }),

  botStatus: router({
    list: protectedProcedure.query(({ ctx }) => getBotStatus(ctx.user.id)),
    update: protectedProcedure
      .input(z.object({
        botName: z.string(),
        isOnline: z.number().optional(),
        currentTask: z.string().optional(),
        blocksPlaced: z.number().optional(),
        obsidianCount: z.number().optional(),
        posX: z.number().optional(),
        posY: z.number().optional(),
        posZ: z.number().optional(),
      }))
      .mutation(({ ctx, input }) => {
        const { botName, ...status } = input;
        return upsertBotStatus(ctx.user.id, botName, status);
      }),
  }),

  serverConfig: router({
    get: protectedProcedure.query(({ ctx }) => getServerConfig(ctx.user.id)),
    update: protectedProcedure
      .input(z.object({
        host: z.string(),
        port: z.number(),
        botUsernames: z.string(),
        whitelist: z.string(),
      }))
      .mutation(({ ctx, input }) => upsertServerConfig(ctx.user.id, input)),
  }),
});

export type AppRouter = typeof appRouter;
