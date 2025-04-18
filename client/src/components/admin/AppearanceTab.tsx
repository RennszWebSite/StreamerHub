import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AppSettings } from "@/lib/types";

interface AppearanceTabProps {
  primaryColor: string;
  seasonalTheme: string;
  darkMode: boolean;
  animationsEnabled: boolean;
  showAnnouncements: boolean;
  showNextStream: boolean;
  showSocials: boolean;
  onSettingsChange: (settings: Partial<AppSettings>) => void;
}

export default function AppearanceTab({
  primaryColor,
  seasonalTheme,
  darkMode,
  animationsEnabled,
  showAnnouncements,
  showNextStream,
  showSocials,
  onSettingsChange
}: AppearanceTabProps) {
  const [colorOptions] = useState([
    { label: "Orange", value: "#FF6B00", selected: primaryColor === "#FF6B00" },
    { label: "Red", value: "#FF3E3E", selected: primaryColor === "#FF3E3E" },
    { label: "Green", value: "#4CAF50", selected: primaryColor === "#4CAF50" },
    { label: "Blue", value: "#2196F3", selected: primaryColor === "#2196F3" },
    { label: "Purple", value: "#9C27B0", selected: primaryColor === "#9C27B0" },
    { label: "Gray", value: "#607D8B", selected: primaryColor === "#607D8B" },
  ]);
  
  const [customColor, setCustomColor] = useState(primaryColor);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  // Update custom color when primary color changes
  useEffect(() => {
    setCustomColor(primaryColor);
  }, [primaryColor]);
  
  const handleColorOptionClick = (color: string) => {
    setCustomColor(color);
  };
  
  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    try {
      onSettingsChange({
        primaryColor: customColor,
        seasonalTheme: seasonalTheme as any,
        darkMode,
        animationsEnabled,
        showAnnouncements,
        showNextStream,
        showSocials
      });
      
      toast({
        title: "Settings saved",
        description: "Appearance settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-lg font-semibold">Theme Settings</h2>
        <Card>
          <CardContent className="p-4">
            <div className="mb-4">
              <Label className="mb-1 block text-sm">Primary Color</Label>
              <div className="mb-4 flex flex-wrap gap-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`h-8 w-8 rounded-full ${
                      customColor === option.value ? "ring-2 ring-white ring-offset-2 ring-offset-black" : ""
                    }`}
                    style={{ backgroundColor: option.value }}
                    onClick={() => handleColorOptionClick(option.value)}
                    aria-label={`Select ${option.label} color`}
                  />
                ))}
                
                <div className="ml-2 flex items-center">
                  <span className="mr-2 text-sm">Custom:</span>
                  <Input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded bg-transparent p-0"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="seasonal-theme" className="mb-1 block text-sm">Seasonal Theme</Label>
              <Select
                value={seasonalTheme}
                onValueChange={(value) => onSettingsChange({ seasonalTheme: value as any })}
              >
                <SelectTrigger id="seasonal-theme">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default (No Season)</SelectItem>
                  <SelectItem value="halloween">Halloween</SelectItem>
                  <SelectItem value="christmas">Christmas/Winter</SelectItem>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Dark Mode</span>
              <Switch
                id="dark-mode-toggle"
                checked={darkMode}
                onCheckedChange={(checked) => onSettingsChange({ darkMode: checked })}
              />
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <span className="font-medium">Animation Effects</span>
              <Switch
                id="animation-toggle"
                checked={animationsEnabled}
                onCheckedChange={(checked) => onSettingsChange({ animationsEnabled: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="mb-4 text-lg font-semibold">Layout Settings</h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Show Announcements</span>
              <Switch
                id="show-announcements-toggle"
                checked={showAnnouncements}
                onCheckedChange={(checked) => onSettingsChange({ showAnnouncements: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Show Next Stream</span>
              <Switch
                id="show-next-stream-toggle"
                checked={showNextStream}
                onCheckedChange={(checked) => onSettingsChange({ showNextStream: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Social Links</span>
              <Switch
                id="show-socials-toggle"
                checked={showSocials}
                onCheckedChange={(checked) => onSettingsChange({ showSocials: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Button
        onClick={handleSaveChanges}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
