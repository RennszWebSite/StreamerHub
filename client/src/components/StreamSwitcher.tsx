import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader,
  DialogFooter 
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Stream Channel</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="mb-4 text-muted-foreground">Select which channel to display:</p>
          
          <RadioGroup 
            value={selectedChannel} 
            onValueChange={onSelectChannel}
            className="space-y-3"
          >
            {STREAM_CHANNELS.map((channel) => (
              <div 
                key={channel.id}
                className="flex cursor-pointer items-center rounded-lg border border-transparent bg-card p-3 hover:border-primary"
              >
                <RadioGroupItem value={channel.id} id={channel.id} className="mr-3" />
                <Label htmlFor={channel.id} className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">{channel.displayName}</p>
                    <p className="text-sm text-muted-foreground">@{channel.username}</p>
                  </div>
                </Label>
              </div>
            ))}
            
            <div 
              className="flex cursor-pointer items-center rounded-lg border border-transparent bg-card p-3 hover:border-primary"
            >
              <RadioGroupItem value="offline" id="offline" className="mr-3" />
              <Label htmlFor="offline" className="flex-1 cursor-pointer">
                <div>
                  <p className="font-medium">Show Offline Message/Clips</p>
                  <p className="text-sm text-muted-foreground">If no channel is actually live</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Switch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
