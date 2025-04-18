import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { fetchSchedule } from "@/lib/storage";
import { StreamSchedule } from "@/lib/types";

interface NextStreamSectionProps {
  className?: string;
}

export default function NextStreamSection({ className = "" }: NextStreamSectionProps) {
  const [schedule, setSchedule] = useState<StreamSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const data = await fetchSchedule();
        setSchedule(data);
      } catch (error) {
        console.error("Failed to load schedule:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSchedule();
  }, []);
  
  if (isLoading) {
    return (
      <section className={`mb-8 ${className}`}>
        <h2 className="mb-4 text-2xl font-bold">
          <span className="text-primary">#</span> Next Stream
        </h2>
        <Card>
          <div className="bg-primary/10 p-4">
            <div className="h-6 w-1/2 animate-pulse rounded bg-muted"></div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }
  
  if (!schedule) {
    return (
      <section className={`mb-8 ${className}`}>
        <h2 className="mb-4 text-2xl font-bold">
          <span className="text-primary">#</span> Next Stream
        </h2>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No scheduled streams at this time.</p>
          </CardContent>
        </Card>
      </section>
    );
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };
  
  // Format time for display
  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      const time = new Date();
      time.setHours(hours, minutes);
      
      const jstTime = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Tokyo'
      }).format(time);
      
      const utcTime = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
      }).format(time);
      
      return `${jstTime} JST (${utcTime} UTC)`;
    } catch (error) {
      return timeString;
    }
  };
  
  return (
    <section className={`mb-8 ${className}`}>
      <h2 className="mb-4 text-2xl font-bold">
        <span className="text-primary">#</span> Next Stream
      </h2>
      
      <Card className="overflow-hidden border border-primary/30">
        <div className="bg-primary/10 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{schedule.title}</h3>
            <span className="rounded bg-primary px-2 py-1 text-xs text-white">
              {schedule.streamType}
            </span>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span>{formatDate(schedule.date)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{formatTime(schedule.time)}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <a
            href={`https://www.twitch.tv/${schedule.streamType === 'Gaming' ? 'rennszino' : 'rennsz'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <Button variant="default" className="w-full">
              Set Reminder
            </Button>
          </a>
        </CardFooter>
      </Card>
    </section>
  );
}
