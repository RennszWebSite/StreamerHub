import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertAnnouncementSchema, insertSettingSchema, insertStreamScheduleSchema } from "@shared/schema";
import * as fs from 'fs';
import * as path from 'path';

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
  // Utility function to write to theme.json
  const updateThemeFile = (themeData: any) => {
    try {
      const themePath = path.join(process.cwd(), 'theme.json');
      fs.writeFileSync(themePath, JSON.stringify(themeData, null, 2));
      return true;
    } catch (error) {
      console.error('Error updating theme.json:', error);
      return false;
    }
  };
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
      
      // Ensure type is valid
      if (!['default', 'special', 'important'].includes(validated.type)) {
        validated.type = 'default';
      }
      
      const announcement = await storage.createAnnouncement({
        ...validated,
        createdAt: new Date().toISOString()
      });
      
      if (!announcement) {
        throw new Error("Failed to create announcement");
      }
      
      res.status(201).json(announcement);
    } catch (error) {
      console.error("Error creating announcement:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create announcement" });
    }
  });
  
  // Delete announcement (requires auth)
  app.delete("/api/announcements/:id", authenticateAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const success = await storage.deleteAnnouncement(id);
      if (!success) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      res.status(500).json({ message: "Failed to delete announcement" });
    }
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
  
  // Change admin password (requires auth)
  app.post("/api/auth/change-password", authenticateAdmin, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new passwords are required" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      
      // Verify current password
      const adminPasswordSetting = await storage.getSetting("admin_password");
      if (!adminPasswordSetting) {
        // If no password exists, create initial password
        await storage.saveSetting({
          key: "admin_password",
          value: newPassword
        });
        return res.json({ success: true, message: "Password set successfully" });
      }
      
      if (adminPasswordSetting.value !== currentPassword) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      // Update the password
      await storage.saveSetting({
        key: "admin_password",
        value: newPassword
      });
      
      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error("Failed to update admin password:", error);
      res.status(500).json({ message: "Failed to update admin password" });
    }
  });

  // Update theme.json (requires auth)
  app.post("/api/theme", authenticateAdmin, async (req, res) => {
    try {
      const themeData = req.body;
      
      // Validate theme data with less strict requirements
      if (!themeData || typeof themeData.primary !== 'string') {
        return res.status(400).json({ 
          message: "Invalid theme data format",
          required: {
            primary: "string (color)"
          }
        });
      }
      
      // Merge with existing theme data
      const themePath = path.join(process.cwd(), 'theme.json');
      const existingTheme = fs.existsSync(themePath) 
        ? JSON.parse(fs.readFileSync(themePath, 'utf-8'))
        : {};
        
      const updatedTheme = {
        ...existingTheme,
        ...themeData,
      };
      
      fs.writeFileSync(themePath, JSON.stringify(updatedTheme, null, 2));
      res.json({ success: true, message: "Theme updated successfully" });
    } catch (error) {
      console.error("Error updating theme:", error);
      res.status(500).json({ message: "Failed to update theme" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
