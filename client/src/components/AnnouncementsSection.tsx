import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchAnnouncements } from "@/lib/storage";
import { Announcement } from "@/lib/types";

interface AnnouncementsSectionProps {
  className?: string;
}

export default function AnnouncementsSection({ className = "" }: AnnouncementsSectionProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const data = await fetchAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error("Failed to load announcements:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAnnouncements();
  }, []);
  
  if (isLoading) {
    return (
      <section className={`mb-8 ${className}`}>
        <h2 className="mb-4 text-2xl font-bold">
          <span className="text-primary">#</span> Announcements
        </h2>
        <div className="space-y-4">
          <Card className="border-l-4 border-primary">
            <CardContent className="p-4">
              <div className="h-6 w-3/4 animate-pulse rounded bg-muted"></div>
              <div className="mt-2 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
                <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-primary">
            <CardContent className="p-4">
              <div className="h-6 w-1/2 animate-pulse rounded bg-muted"></div>
              <div className="mt-2 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }
  
  if (announcements.length === 0) {
    return (
      <section className={`mb-8 ${className}`}>
        <h2 className="mb-4 text-2xl font-bold">
          <span className="text-primary">#</span> Announcements
        </h2>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No announcements at this time.</p>
          </CardContent>
        </Card>
      </section>
    );
  }
  
  const getBorderColor = (type: string) => {
    switch (type) {
      case 'important':
        return 'border-red-500';
      case 'special':
        return 'border-accent';
      default:
        return 'border-primary';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    } else {
      return `${Math.floor(diffInDays / 30)} months ago`;
    }
  };
  
  return (
    <section className={`mb-8 ${className}`}>
      <h2 className="mb-4 text-2xl font-bold">
        <span className="text-primary">#</span> Announcements
      </h2>
      
      <div id="announcements-container" className="space-y-4">
        {announcements.map((announcement) => (
          <Card 
            key={announcement.id} 
            className={`border-l-4 ${getBorderColor(announcement.type)}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">{announcement.title}</h3>
                <span className="text-xs text-muted-foreground">
                  {formatDate(announcement.timestamp)}
                </span>
              </div>
              <p className="mt-2 text-muted-foreground">
                {announcement.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
