import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/admin/LoginForm";
import AdminTabs from "@/components/admin/AdminTabs";
import { getAuthToken, fetchSettings, saveSettingsToAPI } from "@/lib/storage";
import { AppSettings } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is authenticated
    const authToken = getAuthToken();
    setIsAuthenticated(!!authToken);
    
    // Load settings
    const loadSettings = async () => {
      try {
        const settings = await fetchSettings();
        setSettings(settings);
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast({
          title: "Error loading settings",
          description: "There was a problem loading your settings.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setLocation("/");
  };
  
  const handleSettingsChange = async (updatedSettings: Partial<AppSettings>) => {
    if (!settings) return;
    
    const newSettings = { ...settings, ...updatedSettings };
    setSettings(newSettings);
    
    try {
      await saveSettingsToAPI(updatedSettings);
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Layout>
      <div className="mx-auto max-w-4xl py-6">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Admin Panel
        </h1>
        
        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : !isAuthenticated ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : settings ? (
          <AdminTabs 
            onLogout={handleLogout} 
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load settings</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
