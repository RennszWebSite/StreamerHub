import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/admin/LoginForm";
import AdminTabs from "@/components/admin/AdminTabs";
import { getAuthToken, fetchSettings, saveSettingsToAPI } from "@/lib/storage";
import { AppSettings } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Lock, ShieldCheck } from "lucide-react";

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
    toast({
      title: "Authentication successful",
      description: "Welcome to the admin dashboard.",
      variant: "default",
    });
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setLocation("/");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
      variant: "default",
    });
  };
  
  const handleSettingsChange = async (updatedSettings: Partial<AppSettings>) => {
    if (!settings) return;
    
    const newSettings = { ...settings, ...updatedSettings };
    setSettings(newSettings);
    
    try {
      const result = await saveSettingsToAPI(updatedSettings);
      if (result) {
        toast({
          title: "Settings updated",
          description: "Your changes have been saved successfully.",
          variant: "default",
        });
      }
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
      <div className="mx-auto max-w-6xl px-2 py-4 sm:px-4 sm:py-8">
        {loading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-gray-400">Loading administration panel...</p>
            </div>
          </div>
        ) : !isAuthenticated ? (
          <div className="relative overflow-hidden rounded-xl border border-white/5 bg-black/40 p-8 shadow-xl backdrop-blur-sm">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center mb-6">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                Admin Authentication
              </h1>
              <p className="mt-2 text-center text-gray-400">
                Enter your credentials to access the control panel
              </p>
            </div>
            
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        ) : settings ? (
          <div className="relative overflow-hidden rounded-lg sm:rounded-xl border border-white/5 bg-black/50 shadow-xl backdrop-blur-sm">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
            
            <div className="relative z-10 p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Premium Administration Dashboard
                </h1>
              </div>
              
              <AdminTabs 
                onLogout={handleLogout} 
                settings={settings}
                onSettingsChange={handleSettingsChange}
              />
            </div>
          </div>
        ) : (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-red-400">Failed to load system settings</p>
              <p className="mt-2 text-gray-400">Please try refreshing the page</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
