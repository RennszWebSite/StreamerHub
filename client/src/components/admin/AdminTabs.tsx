import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  Megaphone, 
  MonitorPlay, 
  Paintbrush, 
  Gauge, 
  Users,
  ExternalLink,
  Shield
} from "lucide-react";
import { clearAuthToken } from "@/lib/storage";
import AnnouncementTab from "./AnnouncementTab";
import StreamTab from "./StreamTab";
import AppearanceTab from "./AppearanceTab";
import SecurityTab from "./SecurityTab";
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
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    clearAuthToken();
    onLogout();
  };

  const handleOpenSite = () => {
    window.open('/', '_blank');
  };

  return (
    <div className="flex flex-col w-full max-w-full sm:max-w-3xl mx-auto p-3 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary">Admin</Badge>
          <h2 className="text-xl font-medium text-gray-400">
            Control Panel v1.0
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleOpenSite}
            className="flex items-center gap-2 border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4" />
            View Site
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center gap-2 border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue="dashboard" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4 sm:mb-8 flex w-full flex-wrap gap-1 sm:gap-2 bg-black/20 p-1">
          <TabsTrigger value="dashboard" className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-primary/20 min-w-[120px]">
            <Gauge className="h-5 w-5" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex items-center justify-center gap-2 data-[state=active]:bg-primary/20">
            <Megaphone className="h-5 w-5" />
            <span className="hidden sm:inline">Announcements</span>
          </TabsTrigger>
          <TabsTrigger value="streams" className="flex items-center justify-center gap-2 data-[state=active]:bg-primary/20">
            <MonitorPlay className="h-5 w-5" />
            <span className="hidden sm:inline">Streams</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center justify-center gap-2 data-[state=active]:bg-primary/20">
            <Paintbrush className="h-5 w-5" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center justify-center gap-2 data-[state=active]:bg-primary/20">
            <Shield className="h-5 w-5" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center justify-center gap-2 data-[state=active]:bg-primary/20">
            <Users className="h-5 w-5" />
            <span className="hidden sm:inline">Community</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="rounded-lg border border-white/5 bg-black/30 p-4 sm:p-6">
            <h2 className="mb-4 text-xl font-bold">Welcome to your Dashboard</h2>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-white/5 bg-black/20 p-5">
                <h3 className="font-semibold text-gray-400">Current Stream</h3>
                <p className="mt-2 text-2xl font-bold">
                  {settings.currentStream}
                  <span className="ml-2 text-sm text-gray-400">
                    ({settings.autoDetectStream ? 'Auto' : 'Manual'})
                  </span>
                </p>
                <div className="mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full border-primary/20 bg-primary/10 text-primary"
                    onClick={() => setActiveTab("streams")}
                  >
                    Manage Streams
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-white/5 bg-black/20 p-5">
                <h3 className="font-semibold text-gray-400">Appearance</h3>
                <div className="mt-2 flex items-center gap-3">
                  <div 
                    className="h-8 w-8 rounded-full" 
                    style={{ backgroundColor: settings.primaryColor }}
                  ></div>
                  <p className="text-xl font-semibold">
                    {settings.seasonalTheme.charAt(0).toUpperCase() + settings.seasonalTheme.slice(1)} Theme
                  </p>
                </div>
                <div className="mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full border-primary/20 bg-primary/10 text-primary"
                    onClick={() => setActiveTab("appearance")}
                  >
                    Customize
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-white/5 bg-black/20 p-5">
                <h3 className="font-semibold text-gray-400">Banner Status</h3>
                <div className="mt-2 flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full ${settings.showBanner ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <p className="text-xl font-semibold">
                    {settings.showBanner ? 'Active' : 'Hidden'}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-400 line-clamp-1">
                  {settings.bannerText}
                </p>
                <div className="mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full border-primary/20 bg-primary/10 text-primary"
                    onClick={() => setActiveTab("announcements")}
                  >
                    Manage Banner
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <h3 className="mb-3 font-semibold text-gray-400">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <Button 
                    variant="outline" 
                    className="border-white/10 bg-black/40 hover:bg-black/60"
                    onClick={() => {
                      onSettingsChange({ showBanner: !settings.showBanner });
                    }}
                  >
                    {settings.showBanner ? 'Hide Banner' : 'Show Banner'}
                  </Button>

                  <Button 
                    variant="outline" 
                    className="border-white/10 bg-black/40 hover:bg-black/60"
                    onClick={() => {
                      onSettingsChange({ autoDetectStream: !settings.autoDetectStream });
                    }}
                  >
                    {settings.autoDetectStream ? 'Manual Stream' : 'Auto-Detect'}
                  </Button>

                  <Button 
                    variant="outline" 
                    className="border-white/10 bg-black/40 hover:bg-black/60"
                    onClick={() => {
                      onSettingsChange({ 
                        currentStream: settings.currentStream === 'rennsz' ? 'rennszino' : 'rennsz' 
                      });
                    }}
                  >
                    Switch Stream
                  </Button>

                  <Button 
                    variant="outline" 
                    className="border-white/10 bg-black/40 hover:bg-black/60"
                    onClick={() => {
                      onSettingsChange({ darkMode: !settings.darkMode });
                    }}
                  >
                    {settings.darkMode ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="announcements">
          <div className="rounded-lg border border-white/5 bg-black/30 p-6">
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
          </div>
        </TabsContent>

        <TabsContent value="streams">
          <div className="rounded-lg border border-white/5 bg-black/30 p-6">
            <StreamTab 
              currentStream={settings.currentStream}
              autoDetectStream={settings.autoDetectStream}
              offlineBehavior={settings.offlineBehavior}
              showNextStream={settings.showNextStream}
              onSettingsChange={onSettingsChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="rounded-lg border border-white/5 bg-black/30 p-6">
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
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="rounded-lg border border-white/5 bg-black/30 p-6">
            <SecurityTab />
          </div>
        </TabsContent>

        <TabsContent value="community">
          <div className="rounded-lg border border-white/5 bg-black/30 p-6">
            <h2 className="mb-4 text-xl font-bold">Community Management</h2>
            <p className="text-gray-400">
              Manage your community channels and social media integration. This section allows you to configure how your audience can interact with your content.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-white/5 bg-black/20 p-5">
                <h3 className="font-semibold">Social Media Links</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Configure which social platforms are displayed on your site
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded-md bg-black/30 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6441a5]">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29l-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43Z" />
                        </svg>
                      </div>
                      <span className="font-medium">Twitch</span>
                    </div>
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="text-primary"
                    >
                      Edit
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-md bg-black/30 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5865F2]">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                        </svg>
                      </div>
                      <span className="font-medium">Discord</span>
                    </div>
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="text-primary"
                    >
                      Edit
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-md bg-black/30 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </div>
                      <span className="font-medium">Twitter/X</span>
                    </div>
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="text-primary"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-white/5 bg-black/20 p-5">
                <h3 className="font-semibold">Display Settings</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Configure which elements are visible to users
                </p>

                <div className="mt-4 grid gap-3">
                  <Button 
                    variant="outline"
                    className={`justify-start border-white/10 text-left ${settings.showSocials ? 'bg-primary/10 text-primary' : 'bg-black/30'}`}
                    onClick={() => onSettingsChange({ showSocials: !settings.showSocials })}
                  >
                    <div className={`mr-2 h-5 w-5 rounded-full ${settings.showSocials ? 'bg-primary' : 'bg-gray-600'}`}></div>
                    Social Media Section {settings.showSocials ? '(Visible)' : '(Hidden)'}
                  </Button>

                  <Button 
                    variant="outline"
                    className={`justify-start border-white/10 text-left ${settings.showAnnouncements ? 'bg-primary/10 text-primary' : 'bg-black/30'}`}
                    onClick={() => onSettingsChange({ showAnnouncements: !settings.showAnnouncements })}
                  >
                    <div className={`mr-2 h-5 w-5 rounded-full ${settings.showAnnouncements ? 'bg-primary' : 'bg-gray-600'}`}></div>
                    Announcements Section {settings.showAnnouncements ? '(Visible)' : '(Hidden)'}
                  </Button>

                  <Button 
                    variant="outline"
                    className={`justify-start border-white/10 text-left ${settings.showNextStream ? 'bg-primary/10 text-primary' : 'bg-black/30'}`}
                    onClick={() => onSettingsChange({ showNextStream: !settings.showNextStream })}
                  >
                    <div className={`mr-2 h-5 w-5 rounded-full ${settings.showNextStream ? 'bg-primary' : 'bg-gray-600'}`}></div>
                    Next Stream Section {settings.showNextStream ? '(Visible)' : '(Hidden)'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}