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
      <div id="home" className="flex flex-col gap-8">
        {/* Premium Banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-black to-primary/20 p-8 shadow-2xl backdrop-blur">
          <div className="z-10 max-w-3xl">
            <h1 className="mb-3 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
              <span className="text-primary">Rennsz</span> Stream Hub
            </h1>
            <p className="mb-6 text-lg text-gray-300">
              Experience premium IRL and gaming streams from your favorite creator
            </p>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="col-span-full lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-white/5 bg-black/40 p-2 shadow-xl backdrop-blur-sm">
              <StreamSection 
                currentStream={settings?.currentStream || 'rennsz'} 
                autoDetectStream={settings?.autoDetectStream}
                offlineBehavior={settings?.offlineBehavior}
              />
            </div>
            
            {settings?.showAnnouncements && (
              <div className="mt-8 rounded-xl border border-white/5 bg-black/40 p-6 shadow-xl backdrop-blur-sm">
                <AnnouncementsSection />
              </div>
            )}
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="col-span-full lg:col-span-1">
            {settings?.showNextStream && (
              <div className="rounded-xl border border-white/5 bg-black/40 p-6 shadow-xl backdrop-blur-sm">
                <NextStreamSection />
              </div>
            )}
          </div>
        </div>
        
        {/* Social Links at Bottom */}
        {settings?.showSocials && (
          <div className="mt-8 rounded-xl border border-white/5 bg-black/40 p-6 shadow-xl backdrop-blur-sm">
            <SocialSection className="mb-0" />
          </div>
        )}
      </div>
    </Layout>
  );
}
