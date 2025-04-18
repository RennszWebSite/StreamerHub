import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { fetchAnnouncements, saveAnnouncement, deleteAnnouncement } from "@/lib/storage";
import { Announcement } from "@/lib/types";
import { Trash2 } from "lucide-react";

interface AnnouncementTabProps {
  bannerText: string;
  showBanner: boolean;
  onBannerChange: (text: string, show: boolean) => void;
}

const announcementFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be under 100 characters"),
  content: z.string().min(10, "Content must be at least 10 characters").max(500, "Content must be under 500 characters"),
  type: z.enum(["default", "special", "important"]),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

export default function AnnouncementTab({ 
  bannerText, 
  showBanner, 
  onBannerChange 
}: AnnouncementTabProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "default"
    }
  });
  
  useEffect(() => {
    loadAnnouncements();
  }, []);
  
  const loadAnnouncements = async () => {
    setIsLoadingAnnouncements(true);
    try {
      const data = await fetchAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      toast({
        title: "Error loading announcements",
        description: "There was a problem fetching announcements.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAnnouncements(false);
    }
  };
  
  const onSubmitAnnouncement = async (data: AnnouncementFormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await saveAnnouncement(data);
      
      if (result) {
        toast({
          title: "Announcement created",
          description: "Your announcement has been posted.",
        });
        
        form.reset({
          title: "",
          content: "",
          type: "default"
        });
        
        // Reload announcements to show the new one
        await loadAnnouncements();
      } else {
        toast({
          title: "Error creating announcement",
          description: "There was a problem creating your announcement.",
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
  
  const handleDeleteAnnouncement = async (id: number) => {
    try {
      const success = await deleteAnnouncement(id);
      
      if (success) {
        toast({
          title: "Announcement deleted",
          description: "The announcement has been removed.",
        });
        
        // Update the local state
        setAnnouncements(announcements.filter(a => a.id !== id));
      } else {
        toast({
          title: "Error deleting announcement",
          description: "There was a problem deleting the announcement.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-lg font-semibold">Banner Announcement</h2>
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2 inline-block h-3 w-3 rounded-full bg-primary"></span>
                <span className="font-medium">Banner Announcement</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  id="banner-toggle"
                  checked={showBanner} 
                  onCheckedChange={(checked) => onBannerChange(bannerText, checked)}
                />
                <Label htmlFor="banner-toggle">
                  {showBanner ? "Visible" : "Hidden"}
                </Label>
              </div>
            </div>
            
            <Input
              id="banner-text"
              placeholder="Enter banner announcement"
              value={bannerText}
              onChange={(e) => onBannerChange(e.target.value, showBanner)}
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="mb-4 text-lg font-semibold">Current Announcements</h2>
        
        {isLoadingAnnouncements ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="mb-2 h-6 w-3/4 rounded bg-muted"></div>
                  <div className="h-12 w-full rounded bg-muted"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No announcements yet. Create one below.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => {
              const borderColor = announcement.type === 'special' 
                ? 'border-accent' 
                : announcement.type === 'important' 
                  ? 'border-destructive' 
                  : 'border-primary';
              
              return (
                <Card key={announcement.id} className={`border-l-4 ${borderColor}`}>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{announcement.content}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      <div>
        <h2 className="mb-4 text-lg font-semibold">Add New Announcement</h2>
        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitAnnouncement)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Announcement title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Announcement content" 
                          rows={4} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
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
                          <SelectItem value="default">Default (Orange)</SelectItem>
                          <SelectItem value="special">Special (Purple)</SelectItem>
                          <SelectItem value="important">Important (Red)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Announcement"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
