import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertAnnouncementSchema, insertSettingSchema, insertStreamScheduleSchema } from "@shared/schema";

// Admin authentication middleware
const authenticateAdmin = async (req: Request, res: Response, next: Function) => {
  const authToken = req.headers.authorization;
  
  if (!authToken || !authToken.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const password = authToken.split(' ')[1];
  const adminPasswordSetting = await storage.getSetting("admin_password");
  
  if (!adminPasswordSetting || adminPasswordSetting.value !== password) {
    return res.status(401).json({ message: "Invalid authentication" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  // Get all announcements
  app.get("/api/announcements", async (req, res) => {
    const announcements = await storage.getAnnouncements();
    res.json(announcements);
  });
  
  // Create announcement (requires auth)
  app.post("/api/announcements", authenticateAdmin, async (req, res) => {
    try {
      const validated = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(validated);
      res.status(201).json(announcement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create announcement" });
    }
  });
  
  // Delete announcement (requires auth)
  app.delete("/api/announcements/:id", authenticateAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    
    const success = await storage.deleteAnnouncement(id);
    if (!success) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    res.status(204).send();
  });
  
  // Get all settings
  app.get("/api/settings", async (req, res) => {
    const settings = await storage.getAllSettings();
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
    
    res.json(settingsObject);
  });
  
  // Get a specific setting
  app.get("/api/settings/:key", async (req, res) => {
    const setting = await storage.getSetting(req.params.key);
    if (!setting) {
      return res.status(404).json({ message: "Setting not found" });
    }
    
    res.json({ value: setting.value });
  });
  
  // Update settings (requires auth)
  app.post("/api/settings", authenticateAdmin, async (req, res) => {
    try {
      const settingsToUpdate = req.body;
      
      const updatedSettings = [];
      for (const [key, value] of Object.entries(settingsToUpdate)) {
        if (typeof value !== 'string') continue;
        
        const settingData = insertSettingSchema.parse({
          key,
          value
        });
        
        const setting = await storage.saveSetting(settingData);
        updatedSettings.push(setting);
      }
      
      res.json(updatedSettings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to update settings" });
    }
  });
  
  // Get stream schedule
  app.get("/api/schedule", async (req, res) => {
    const schedule = await storage.getActiveStreamSchedule();
    if (!schedule) {
      return res.status(404).json({ message: "No active schedule found" });
    }
    
    res.json(schedule);
  });
  
  // Update stream schedule (requires auth)
  app.post("/api/schedule", authenticateAdmin, async (req, res) => {
    try {
      const validated = insertStreamScheduleSchema.parse(req.body);
      
      // Get active schedule and set it to inactive
      const activeSchedule = await storage.getActiveStreamSchedule();
      if (activeSchedule) {
        await storage.updateStreamSchedule(activeSchedule.id, { isActive: false });
      }
      
      // Create new active schedule
      const schedule = await storage.createStreamSchedule({
        ...validated,
        isActive: true
      });
      
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to update schedule" });
    }
  });
  
  // Verify admin password
  app.post("/api/auth/verify", async (req, res) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    
    const adminPasswordSetting = await storage.getSetting("admin_password");
    if (!adminPasswordSetting) {
      return res.status(500).json({ message: "Admin password not set" });
    }
    
    const isValid = adminPasswordSetting.value === password;
    res.json({ valid: isValid });
  });

  const httpServer = createServer(app);
  return httpServer;
}
