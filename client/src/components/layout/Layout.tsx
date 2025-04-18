import { useEffect, useState } from "react";
import { fetchSettings } from "@/lib/storage";
import { AppSettings } from "@/lib/types";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementBanner from "../AnnouncementBanner";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const seasonalClass = settings?.seasonalTheme !== 'default' 
    ? `theme-${settings?.seasonalTheme}` 
    : '';

  const animationClass = settings?.animationsEnabled
    ? 'animations-enabled'
    : 'animations-disabled';

  return (
    <div className={`flex min-h-screen flex-col bg-background ${seasonalClass} ${animationClass}`}>
      {settings?.showBanner && (
        <AnnouncementBanner 
          text={settings.bannerText} 
          isVisible={settings.showBanner} 
        />
      )}
      <Header />
      <main className="container mx-auto flex-grow px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
