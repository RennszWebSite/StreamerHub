import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { clearAuthToken } from "@/lib/storage";
import AnnouncementTab from "./AnnouncementTab";
import StreamTab from "./StreamTab";
import AppearanceTab from "./AppearanceTab";
import { AppSettings } from "@/lib/types";

interface AdminTabsProps {
  onLogout: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: Partial<AppSettings>) => void;
}

export default function AdminTabs({ 
  onLogout, 
  settings, 
  onSettingsChange 
}: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState("announcements");
  
  const handleLogout = () => {
    clearAuthToken();
    onLogout();
  };
  
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      
      <Tabs 
        defaultValue="announcements" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="streams">Stream Settings</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="announcements">
          <AnnouncementTab 
            bannerText={settings.bannerText} 
            showBanner={settings.showBanner}
            onBannerChange={(bannerText, showBanner) => {
              onSettingsChange({ 
                bannerText, 
                showBanner 
              });
            }}
          />
        </TabsContent>
        
        <TabsContent value="streams">
          <StreamTab 
            currentStream={settings.currentStream}
            autoDetectStream={settings.autoDetectStream}
            offlineBehavior={settings.offlineBehavior}
            showNextStream={settings.showNextStream}
            onSettingsChange={onSettingsChange}
          />
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceTab 
            primaryColor={settings.primaryColor}
            seasonalTheme={settings.seasonalTheme}
            darkMode={settings.darkMode}
            animationsEnabled={settings.animationsEnabled}
            showAnnouncements={settings.showAnnouncements}
            showNextStream={settings.showNextStream}
            showSocials={settings.showSocials}
            onSettingsChange={onSettingsChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
