import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const timerSessions = pgTable("timer_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rounds: integer("rounds").notNull().default(5),
  roundDuration: integer("round_duration").notNull().default(6), // minutes
  restTime: integer("rest_time").notNull().default(60), // seconds
  currentRound: integer("current_round").notNull().default(1),
  currentTime: integer("current_time").notNull().default(0), // seconds
  isRunning: boolean("is_running").notNull().default(false),
  isResting: boolean("is_resting").notNull().default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const insertTimerSessionSchema = createInsertSchema(timerSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTimerSession = z.infer<typeof insertTimerSessionSchema>;
export type TimerSession = typeof timerSessions.$inferSelect;

// WebSocket message types
export const wsMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("timer_update"),
    data: z.object({
      currentTime: z.number(),
      currentRound: z.number(),
      isRunning: z.boolean(),
      isResting: z.boolean(),
      totalRounds: z.number(),
    }),
  }),
  z.object({
    type: z.literal("config_update"),
    data: z.object({
      rounds: z.number(),
      roundDuration: z.number(),
      restTime: z.number(),
    }),
  }),
  z.object({
    type: z.literal("timer_control"),
    data: z.object({
      action: z.enum(["start", "pause", "reset"]),
    }),
  }),
]);

export type WSMessage = z.infer<typeof wsMessageSchema>;

export const academyProfiles = pgTable("academy_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().unique(),
  academyName: text("academy_name").notNull(),
  instructorName: text("instructor_name").notNull(),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const insertAcademyProfileSchema = createInsertSchema(academyProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type AcademyProfile = typeof academyProfiles.$inferSelect;
export type InsertAcademyProfile = z.infer<typeof insertAcademyProfileSchema>;
