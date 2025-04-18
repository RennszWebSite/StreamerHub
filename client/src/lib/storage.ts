import { AppSettings, Announcement, StreamSchedule } from "./types";

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  bannerText: "Welcome to Rennsz's Stream Hub!",
  showBanner: false,
  primaryColor: "#FF6B00",
  currentStream: "rennsz",
  autoDetectStream: true,
  offlineBehavior: "clips",
  darkMode: true,
  animationsEnabled: true,
  showAnnouncements: true,
  showNextStream: true,
  showSocials: true,
  seasonalTheme: "default"
};

// Local storage keys
const SETTINGS_KEY = "rennsz_stream_hub_settings";
const ANNOUNCEMENTS_KEY = "rennsz_stream_hub_announcements";
const SCHEDULE_KEY = "rennsz_stream_hub_schedule";
const AUTH_TOKEN_KEY = "rennsz_stream_hub_auth";

// Local storage functions
export const getSettings = (): AppSettings => {
  try {
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    return storedSettings ? { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Failed to parse settings from localStorage:", error);
    return DEFAULT_SETTINGS;
  }
};

// Import seasonal theme utility
import { applySeasonalTheme } from './themeUtils';

// Function to update theme.json based on settings
export const updateThemeFile = async (settings: Partial<AppSettings>): Promise<void> => {
  try {
    // Only update if relevant theme properties are included
    if (settings.primaryColor || settings.seasonalTheme || settings.darkMode) {
      const currentSettings = getSettings();
      const appearance = settings.darkMode !== undefined 
        ? (settings.darkMode ? 'dark' : 'light')
        : (currentSettings.darkMode ? 'dark' : 'light');
      
      const primaryColor = settings.primaryColor || currentSettings.primaryColor;
      
      // Adjust radius based on seasonal theme
      let radius = 0.75; // Default radius
      let variant = 'vibrant'; // Default variant
      
      const seasonalTheme = settings.seasonalTheme || currentSettings.seasonalTheme;
      if (seasonalTheme === 'christmas') {
        radius = 1.0;
        variant = 'tint';
      } else if (seasonalTheme === 'halloween') {
        radius = 0.25;
        variant = 'vibrant';
      } else if (seasonalTheme === 'spring') {
        radius = 0.85;
        variant = 'professional';
      } else if (seasonalTheme === 'summer') {
        radius = 0.5;
        variant = 'vibrant';
      }
      
      // Always apply the seasonal theme class immediately
      if (settings.seasonalTheme) {
        applySeasonalTheme(settings.seasonalTheme);
      } else if (seasonalTheme) {
        applySeasonalTheme(seasonalTheme);
      }
      
      // Fetch to modify the theme
      const token = getAuthToken();
      if (token) {
        await fetch('/api/theme', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            primary: primaryColor,
            appearance,
            radius,
            variant
          })
        });
      }
    }
  } catch (error) {
    console.error("Failed to update theme file:", error);
  }
};

export const saveSettings = (settings: Partial<AppSettings>): void => {
  try {
    const currentSettings = getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
    
    // Update theme.json when saving settings
    updateThemeFile(settings);
  } catch (error) {
    console.error("Failed to save settings to localStorage:", error);
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const saveAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// API helper functions using localStorage for fallback
export const fetchAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const response = await fetch("/api/announcements");
    if (!response.ok) throw new Error("Failed to fetch announcements");
    return response.json();
  } catch (error) {
    console.error("Failed to fetch announcements from API, using localStorage:", error);
    try {
      const storedAnnouncements = localStorage.getItem(ANNOUNCEMENTS_KEY);
      return storedAnnouncements ? JSON.parse(storedAnnouncements) : [];
    } catch (storageError) {
      console.error("Failed to parse announcements from localStorage:", storageError);
      return [];
    }
  }
};

export const saveAnnouncement = async (announcement: Omit<Announcement, 'id' | 'timestamp'>): Promise<Announcement | null> => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const response = await fetch("/api/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(announcement)
    });
    
    if (!response.ok) throw new Error("Failed to save announcement");
    return response.json();
  } catch (error) {
    console.error("Failed to save announcement to API:", error);
    // No local saving fallback for writes - require API
    return null;
  }
};

export const deleteAnnouncement = async (id: number): Promise<boolean> => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const response = await fetch(`/api/announcements/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error("Failed to delete announcement:", error);
    return false;
  }
};

export const fetchSchedule = async (): Promise<StreamSchedule | null> => {
  try {
    const response = await fetch("/api/schedule");
    if (!response.ok) throw new Error("Failed to fetch schedule");
    return response.json();
  } catch (error) {
    console.error("Failed to fetch schedule from API, using localStorage:", error);
    try {
      const storedSchedule = localStorage.getItem(SCHEDULE_KEY);
      return storedSchedule ? JSON.parse(storedSchedule) : null;
    } catch (storageError) {
      console.error("Failed to parse schedule from localStorage:", storageError);
      return null;
    }
  }
};

export const saveSchedule = async (schedule: Omit<StreamSchedule, 'id' | 'isActive'>): Promise<StreamSchedule | null> => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const response = await fetch("/api/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(schedule)
    });
    
    if (!response.ok) throw new Error("Failed to save schedule");
    const newSchedule = await response.json();
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(newSchedule));
    return newSchedule;
  } catch (error) {
    console.error("Failed to save schedule to API:", error);
    return null;
  }
};

export const fetchSettings = async (): Promise<AppSettings> => {
  try {
    const response = await fetch("/api/settings");
    if (!response.ok) throw new Error("Failed to fetch settings");
    
    const apiSettings = await response.json();
    
    // Convert string values to appropriate types
    const typedSettings: Partial<AppSettings> = {
      bannerText: apiSettings.banner_text,
      showBanner: apiSettings.show_banner === "true",
      primaryColor: apiSettings.primary_color,
      currentStream: apiSettings.current_stream,
      autoDetectStream: apiSettings.auto_detect_stream === "true",
      offlineBehavior: apiSettings.offline_behavior as "clips" | "message" | "schedule",
      darkMode: apiSettings.dark_mode === "true",
      animationsEnabled: apiSettings.animations_enabled === "true",
      showAnnouncements: apiSettings.show_announcements === "true",
      showNextStream: apiSettings.show_next_stream === "true",
      showSocials: apiSettings.show_socials === "true",
      seasonalTheme: apiSettings.seasonal_theme as "default" | "halloween" | "christmas" | "spring" | "summer"
    };
    
    const mergedSettings = { ...DEFAULT_SETTINGS, ...typedSettings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(mergedSettings));
    return mergedSettings;
  } catch (error) {
    console.error("Failed to fetch settings from API, using localStorage:", error);
    return getSettings();
  }
};

export const saveSettingsToAPI = async (settings: Partial<AppSettings>): Promise<boolean> => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Convert settings to API format (string values)
    const apiSettings: Record<string, string> = {};
    
    if (settings.bannerText !== undefined) apiSettings.banner_text = settings.bannerText;
    if (settings.showBanner !== undefined) apiSettings.show_banner = String(settings.showBanner);
    if (settings.primaryColor !== undefined) apiSettings.primary_color = settings.primaryColor;
    if (settings.currentStream !== undefined) apiSettings.current_stream = settings.currentStream;
    if (settings.autoDetectStream !== undefined) apiSettings.auto_detect_stream = String(settings.autoDetectStream);
    if (settings.offlineBehavior !== undefined) apiSettings.offline_behavior = settings.offlineBehavior;
    if (settings.darkMode !== undefined) apiSettings.dark_mode = String(settings.darkMode);
    if (settings.animationsEnabled !== undefined) apiSettings.animations_enabled = String(settings.animationsEnabled);
    if (settings.showAnnouncements !== undefined) apiSettings.show_announcements = String(settings.showAnnouncements);
    if (settings.showNextStream !== undefined) apiSettings.show_next_stream = String(settings.showNextStream);
    if (settings.showSocials !== undefined) apiSettings.show_socials = String(settings.showSocials);
    if (settings.seasonalTheme !== undefined) apiSettings.seasonal_theme = settings.seasonalTheme;
    
    const response = await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(apiSettings)
    });
    
    if (!response.ok) throw new Error("Failed to save settings to API");
    
    // Update local storage
    saveSettings(settings);
    
    // If appearance settings changed, update theme.json
    if (settings.primaryColor !== undefined || 
        settings.seasonalTheme !== undefined || 
        settings.darkMode !== undefined) {
      await updateThemeFile(settings);
    }
    
    return true;
  } catch (error) {
    console.error("Failed to save settings to API:", error);
    
    // Still update local storage even if API fails
    saveSettings(settings);
    
    // Try to update theme.json even if API call fails
    if (settings.primaryColor !== undefined || 
        settings.seasonalTheme !== undefined || 
        settings.darkMode !== undefined) {
      await updateThemeFile(settings);
    }
    
    return false;
  }
};

export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });
    
    if (!response.ok) return false;
    
    const { valid } = await response.json();
    if (valid) {
      saveAuthToken(password);
    }
    
    return valid;
  } catch (error) {
    console.error("Failed to verify admin password:", error);
    return false;
  }
};

// Helper for checking if a Twitch channel is live
export const checkTwitchChannelStatus = async (channelName: string): Promise<boolean> => {
  try {
    // This is a public endpoint that doesn't require authentication
    // It's rate-limited but works well enough for our use case
    const response = await fetch(`https://is-twitch-live.vercel.app/api/is-live?channel=${channelName}`);
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.isLive === true;
  } catch (error) {
    console.error(`Failed to check status for ${channelName}:`, error);
    return false;
  }
};
