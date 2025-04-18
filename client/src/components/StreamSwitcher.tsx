import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader,
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { STREAM_CHANNELS } from "@/lib/types";

interface StreamSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChannel: string;
  onSelectChannel: (channel: string) => void;
  onConfirm: () => void;
}

export default function StreamSwitcher({
  isOpen,
  onClose,
  selectedChannel,
  onSelectChannel,
  onConfirm
}: StreamSwitcherProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-white/10 bg-black/80 backdrop-blur-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Stream Channel Selection</DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose which Twitch channel to feature on your site
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup 
            value={selectedChannel} 
            onValueChange={onSelectChannel}
            className="space-y-3"
          >
            {STREAM_CHANNELS.map((channel) => (
              <div 
                key={channel.id}
                className="flex cursor-pointer items-center rounded-lg border border-white/5 bg-black/40 p-4 transition-all hover:border-primary/30 hover:bg-black/60"
              >
                <RadioGroupItem value={channel.id} id={channel.id} className="mr-3" />
                <Label htmlFor={channel.id} className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium text-white">{channel.displayName}</p>
                    <p className="text-sm text-gray-400">@{channel.username}</p>
                  </div>
                </Label>
                <div className="ml-auto rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {channel.type}
                </div>
              </div>
            ))}
            
            <div 
              className="flex cursor-pointer items-center rounded-lg border border-white/5 bg-black/40 p-4 transition-all hover:border-primary/30 hover:bg-black/60"
            >
              <RadioGroupItem value="offline" id="offline" className="mr-3" />
              <Label htmlFor="offline" className="flex-1 cursor-pointer">
                <div>
                  <p className="font-medium text-white">Offline Content</p>
                  <p className="text-sm text-gray-400">Display alternative content when streams are offline</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-white/10 bg-black/40 text-white hover:bg-black/60"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
