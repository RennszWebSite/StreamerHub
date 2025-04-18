import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Announcement Model
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default("default"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  timestamp: true,
});

// Settings Model
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
});

// Stream Schedule Model
export const streamSchedules = pgTable("stream_schedules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  streamType: text("stream_type").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertStreamScheduleSchema = createInsertSchema(streamSchedules).omit({
  id: true,
});

// Types
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;

export type StreamSchedule = typeof streamSchedules.$inferSelect;
export type InsertStreamSchedule = z.infer<typeof insertStreamScheduleSchema>;

// Settings keys - these would be stored in the settings table
export enum SettingKey {
  BANNER_TEXT = "banner_text",
  SHOW_BANNER = "show_banner",
  PRIMARY_COLOR = "primary_color",
  CURRENT_STREAM = "current_stream",
  AUTO_DETECT_STREAM = "auto_detect_stream",
  OFFLINE_BEHAVIOR = "offline_behavior",
  DARK_MODE = "dark_mode",
  ANIMATIONS_ENABLED = "animations_enabled",
  SHOW_ANNOUNCEMENTS = "show_announcements",
  SHOW_NEXT_STREAM = "show_next_stream",
  SHOW_SOCIALS = "show_socials",
  SEASONAL_THEME = "seasonal_theme",
  ADMIN_PASSWORD = "admin_password"
}
