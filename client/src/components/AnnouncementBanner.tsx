interface AnnouncementBannerProps {
  text: string;
  isVisible: boolean;
}

export default function AnnouncementBanner({ text, isVisible }: AnnouncementBannerProps) {
  if (!isVisible) return null;
  
  return (
    <div className="w-full bg-primary px-4 py-3 text-center text-white">
      <p className="text-sm font-medium md:text-base">{text}</p>
    </div>
  );
}
