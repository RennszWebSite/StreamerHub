import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AppSettings } from "@/lib/types";
import { STREAM_CHANNELS } from "@/lib/types";
import { fetchSchedule, saveSchedule } from "@/lib/storage";

interface StreamTabProps {
  currentStream: string;
  autoDetectStream: boolean;
  offlineBehavior: string;
  showNextStream: boolean;
  onSettingsChange: (settings: Partial<AppSettings>) => void;
}

const scheduleFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be under 100 characters"),
  streamType: z.string().min(1, "Stream type is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

export default function StreamTab({
  currentStream,
  autoDetectStream,
  offlineBehavior,
  showNextStream,
  onSettingsChange
}: StreamTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      title: "",
      streamType: "IRL",
      date: "",
      time: "",
    },
  });

  useEffect(() => {
    // Load current schedule data
    const loadScheduleData = async () => {
      try {
        const schedule = await fetchSchedule();
        if (schedule) {
          form.reset({
            title: schedule.title,
            streamType: schedule.streamType,
            date: schedule.date,
            time: schedule.time,
          });
        }
      } catch (error) {
        console.error("Failed to load schedule:", error);
      }
    };

    loadScheduleData();
  }, [form]);

  const onSubmitSchedule = async (data: ScheduleFormValues) => {
    setIsSubmitting(true);

    try {
      const result = await saveSchedule(data);
      
      if (result) {
        toast({
          title: "Schedule updated",
          description: "Your stream schedule has been updated.",
        });
      } else {
        toast({
          title: "Error updating schedule",
          description: "There was a problem updating your schedule.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-lg font-semibold">Stream Status</h2>
        <Card>
          <CardContent className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium">Auto-detect live status</span>
              <Switch
                id="auto-detect-toggle"
                checked={autoDetectStream}
                onCheckedChange={(checked) => onSettingsChange({ autoDetectStream: checked })}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="current-stream-select" className="mb-2 block text-sm">
                  Current Stream
                </Label>
                <Select
                  value={currentStream}
                  onValueChange={(value) => onSettingsChange({ currentStream: value })}
                >
                  <SelectTrigger id="current-stream-select">
                    <SelectValue placeholder="Select a stream" />
                  </SelectTrigger>
                  <SelectContent>
                    {STREAM_CHANNELS.map((channel) => (
                      <SelectItem key={channel.id} value={channel.id}>
                        {channel.displayName} ({channel.username})
                      </SelectItem>
                    ))}
                    <SelectItem value="none">No Stream (Show Offline)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="offline-behavior-select" className="mb-2 block text-sm">
                  When Offline
                </Label>
                <Select
                  value={offlineBehavior}
                  onValueChange={(value) => 
                    onSettingsChange({ 
                      offlineBehavior: value as "clips" | "message" | "schedule" 
                    })
                  }
                >
                  <SelectTrigger id="offline-behavior-select">
                    <SelectValue placeholder="Select behavior" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clips">Show Recent Clips</SelectItem>
                    <SelectItem value="message">Show Offline Message</SelectItem>
                    <SelectItem value="schedule">Show Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Next Stream Schedule</h2>
          <div className="flex items-center gap-2">
            <Switch
              id="show-next-stream-toggle"
              checked={showNextStream}
              onCheckedChange={(checked) => onSettingsChange({ showNextStream: checked })}
            />
            <Label htmlFor="show-next-stream-toggle">
              {showNextStream ? "Visible" : "Hidden"}
            </Label>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitSchedule)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stream Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter stream title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="streamType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stream Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="IRL">IRL</SelectItem>
                            <SelectItem value="Gaming">Gaming</SelectItem>
                            <SelectItem value="Just Chatting">Just Chatting</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time (JST)</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Schedule"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
