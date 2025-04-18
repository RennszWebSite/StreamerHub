import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "lucide-react";
import { STREAM_CHANNELS } from "@/lib/types";
import { checkTwitchChannelStatus, saveSettingsToAPI } from "@/lib/storage";
import StreamSwitcher from "./StreamSwitcher";

interface StreamSectionProps {
  currentStream: string;
  isAdmin?: boolean;
  autoDetectStream?: boolean;
  offlineBehavior?: string;
}

export default function StreamSection({ 
  currentStream, 
  isAdmin = false,
  autoDetectStream = true,
  offlineBehavior = "clips" 
}: StreamSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(currentStream);
  const [streamToDisplay, setStreamToDisplay] = useState(currentStream);
  
  const checkChannelStatus = async () => {
    if (!autoDetectStream && isAdmin) {
      // If in admin mode with auto-detect off, use the forced channel
      setIsLive(true);
      return;
    }
    
    // Try to detect if any channel is live
    const channel1Status = await checkTwitchChannelStatus('rennsz');
    if (channel1Status) {
      setIsLive(true);
      setStreamToDisplay('rennsz');
      return;
    }
    
    const channel2Status = await checkTwitchChannelStatus('rennszino');
    if (channel2Status) {
      setIsLive(true);
      setStreamToDisplay('rennszino');
      return;
    }
    
    // No channel is live
    setIsLive(false);
    setStreamToDisplay(currentStream); // Keep the current selection for offline content
  };
  
  useEffect(() => {
    checkChannelStatus();
    
    // Set up a refresh interval (every 2 minutes)
    const interval = setInterval(checkChannelStatus, 120000);
    return () => clearInterval(interval);
  }, [currentStream, autoDetectStream]);
  
  // Update selected channel when currentStream changes
  useEffect(() => {
    setSelectedChannel(currentStream);
    if (!autoDetectStream) {
      setStreamToDisplay(currentStream);
    }
  }, [currentStream, autoDetectStream]);

  const handleSwitchStream = () => {
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  
  const handleConfirmSwitch = async () => {
    setStreamToDisplay(selectedChannel);
    
    if (isAdmin) {
      // Save the setting if admin
      await saveSettingsToAPI({ currentStream: selectedChannel });
    }
    
    setIsDialogOpen(false);
  };
  
  const currentStreamInfo = STREAM_CHANNELS.find(s => s.id === streamToDisplay);
  const streamTitle = currentStreamInfo ? 
    (currentStreamInfo.type === 'IRL' ? 'IRL Stream' : 'Gaming Stream') : 
    'Stream';
  
  return (
    <section id="streams" className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          <span className="text-primary">#</span> Live Streams
        </h2>
        {isLive && (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
            <span className="text-sm text-green-500">LIVE NOW</span>
          </div>
        )}
      </div>
      
      <Card className="overflow-hidden border border-primary border-opacity-50">
        <div className="aspect-video w-full bg-black">
          {isLive || (offlineBehavior !== "message" && !isLive) ? (
            <iframe 
              src={`https://player.twitch.tv/?channel=${streamToDisplay}&parent=${window.location.hostname}`}
              allowFullScreen
              className="h-full w-full"
              title="Twitch Stream"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-card">
              <div className="text-center">
                <h3 className="mb-2 text-xl font-semibold text-primary">Currently Offline</h3>
                <p className="text-muted-foreground">Check back later or visit our social media!</p>
              </div>
            </div>
          )}
        </div>
        
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div>
            <h3 className="text-lg font-semibold">{isLive ? streamTitle : "Offline"}</h3>
            <p className="text-sm text-muted-foreground">
              {isLive ? `@${streamToDisplay}` : "No live streams"}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleSwitchStream}
              className="flex items-center gap-2 border-primary text-primary"
            >
              Switch Channel
            </Button>
            <a 
              href={`https://www.twitch.tv/${streamToDisplay}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded bg-primary px-3 py-2 text-sm text-white transition-colors hover:bg-primary/90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29l-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43Z" />
              </svg>
              Watch on Twitch
            </a>
          </div>
        </CardContent>
      </Card>
      
      <StreamSwitcher
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        selectedChannel={selectedChannel}
        onSelectChannel={setSelectedChannel}
        onConfirm={handleConfirmSwitch}
      />
    </section>
  );
}
