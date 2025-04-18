import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import StreamSection from "@/components/StreamSection";
import SocialSection from "@/components/SocialSection";
import AnnouncementsSection from "@/components/AnnouncementsSection";
import NextStreamSection from "@/components/NextStreamSection";
import { fetchSettings } from "@/lib/storage";
import { AppSettings } from "@/lib/types";

export default function Home() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await fetchSettings();
        setSettings(settings);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div id="home" className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="order-2 lg:col-span-2 lg:order-1">
          <StreamSection 
            currentStream={settings?.currentStream || 'rennsz'} 
            autoDetectStream={settings?.autoDetectStream}
            offlineBehavior={settings?.offlineBehavior}
          />
          
          {settings?.showAnnouncements && (
            <AnnouncementsSection />
          )}
        </div>
        
        {/* Right Column - Sidebar */}
        <div className="order-1 lg:col-span-1 lg:order-2">
          {settings?.showSocials && (
            <SocialSection />
          )}
          
          {settings?.showNextStream && (
            <NextStreamSection />
          )}
        </div>
      </div>
    </Layout>
  );
}
