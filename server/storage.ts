import { 
  Announcement, 
  InsertAnnouncement, 
  Setting, 
  InsertSetting, 
  StreamSchedule, 
  InsertStreamSchedule,
  SettingKey
} from "@shared/schema";

export interface IStorage {
  // Announcements
  getAnnouncements(): Promise<Announcement[]>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;
  
  // Settings
  getSetting(key: string): Promise<Setting | undefined>;
  getAllSettings(): Promise<Setting[]>;
  saveSetting(setting: InsertSetting): Promise<Setting>;
  
  // Stream Schedule
  getActiveStreamSchedule(): Promise<StreamSchedule | undefined>;
  getAllStreamSchedules(): Promise<StreamSchedule[]>;
  createStreamSchedule(schedule: InsertStreamSchedule): Promise<StreamSchedule>;
  updateStreamSchedule(id: number, schedule: Partial<InsertStreamSchedule>): Promise<StreamSchedule | undefined>;
  deleteStreamSchedule(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private announcements: Map<number, Announcement>;
  private settings: Map<string, Setting>;
  private streamSchedules: Map<number, StreamSchedule>;
  
  private announcementId: number;
  private settingId: number;
  private scheduleId: number;
  
  constructor() {
    this.announcements = new Map();
    this.settings = new Map();
    this.streamSchedules = new Map();
    
    this.announcementId = 1;
    this.settingId = 1;
    this.scheduleId = 1;
    
    // Initialize with default settings
    this.initializeDefaultSettings();
  }
  
  private initializeDefaultSettings() {
    const defaultSettings: InsertSetting[] = [
      { key: SettingKey.BANNER_TEXT, value: "Welcome to Rennsz's Stream Hub!" },
      { key: SettingKey.SHOW_BANNER, value: "false" },
      { key: SettingKey.PRIMARY_COLOR, value: "#FF6B00" },
      { key: SettingKey.CURRENT_STREAM, value: "rennsz" },
      { key: SettingKey.AUTO_DETECT_STREAM, value: "true" },
      { key: SettingKey.OFFLINE_BEHAVIOR, value: "clips" },
      { key: SettingKey.DARK_MODE, value: "true" },
      { key: SettingKey.ANIMATIONS_ENABLED, value: "true" },
      { key: SettingKey.SHOW_ANNOUNCEMENTS, value: "true" },
      { key: SettingKey.SHOW_NEXT_STREAM, value: "true" },
      { key: SettingKey.SHOW_SOCIALS, value: "true" },
      { key: SettingKey.SEASONAL_THEME, value: "default" },
      { key: SettingKey.ADMIN_PASSWORD, value: "admin123" } // Default password for demo
    ];
    
    defaultSettings.forEach(setting => {
      this.saveSetting(setting);
    });
    
    // Add some example announcements
    this.createAnnouncement({
      title: "Next IRL Stream: Tokyo Exploration",
      content: "Join me this Friday at 7PM JST for an exciting Tokyo night exploration stream! We'll be visiting Shibuya, trying street food, and maybe some karaoke later!",
      type: "default"
    });
    
    this.createAnnouncement({
      title: "New Gaming Schedule",
      content: "Starting next week, gaming streams will be every Tuesday and Thursday at 9PM JST. We'll continue our Elden Ring playthrough and maybe try some new titles!",
      type: "special"
    });
    
    // Add default stream schedule
    this.createStreamSchedule({
      title: "Tokyo Night Adventure",
      streamType: "IRL",
      date: "2023-10-15",
      time: "19:00",
      isActive: true
    });
  }
  
  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }
  
  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const id = this.announcementId++;
    const newAnnouncement: Announcement = {
      ...announcement,
      id,
      timestamp: new Date()
    };
    this.announcements.set(id, newAnnouncement);
    return newAnnouncement;
  }
  
  async updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const existingAnnouncement = this.announcements.get(id);
    if (!existingAnnouncement) return undefined;
    
    const updatedAnnouncement: Announcement = {
      ...existingAnnouncement,
      ...announcement
    };
    
    this.announcements.set(id, updatedAnnouncement);
    return updatedAnnouncement;
  }
  
  async deleteAnnouncement(id: number): Promise<boolean> {
    return this.announcements.delete(id);
  }
  
  // Settings
  async getSetting(key: string): Promise<Setting | undefined> {
    return Array.from(this.settings.values()).find(s => s.key === key);
  }
  
  async getAllSettings(): Promise<Setting[]> {
    return Array.from(this.settings.values());
  }
  
  async saveSetting(setting: InsertSetting): Promise<Setting> {
    const existingSetting = Array.from(this.settings.values()).find(s => s.key === setting.key);
    
    if (existingSetting) {
      const updatedSetting = {
        ...existingSetting,
        value: setting.value
      };
      this.settings.set(existingSetting.id, updatedSetting);
      return updatedSetting;
    }
    
    const id = this.settingId++;
    const newSetting: Setting = {
      ...setting,
      id
    };
    this.settings.set(id, newSetting);
    return newSetting;
  }
  
  // Stream Schedule
  async getActiveStreamSchedule(): Promise<StreamSchedule | undefined> {
    return Array.from(this.streamSchedules.values())
      .find(schedule => schedule.isActive);
  }
  
  async getAllStreamSchedules(): Promise<StreamSchedule[]> {
    return Array.from(this.streamSchedules.values());
  }
  
  async createStreamSchedule(schedule: InsertStreamSchedule): Promise<StreamSchedule> {
    const id = this.scheduleId++;
    const newSchedule: StreamSchedule = {
      ...schedule,
      id
    };
    this.streamSchedules.set(id, newSchedule);
    return newSchedule;
  }
  
  async updateStreamSchedule(id: number, schedule: Partial<InsertStreamSchedule>): Promise<StreamSchedule | undefined> {
    const existingSchedule = this.streamSchedules.get(id);
    if (!existingSchedule) return undefined;
    
    const updatedSchedule: StreamSchedule = {
      ...existingSchedule,
      ...schedule
    };
    
    this.streamSchedules.set(id, updatedSchedule);
    return updatedSchedule;
  }
  
  async deleteStreamSchedule(id: number): Promise<boolean> {
    return this.streamSchedules.delete(id);
  }
}

// Singleton instance of the storage
export const storage = new MemStorage();
