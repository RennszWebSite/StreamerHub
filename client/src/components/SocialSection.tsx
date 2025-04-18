import { Card } from "@/components/ui/card";
import { SOCIAL_LINKS } from "@/lib/types";
import { 
  FaTwitch, 
  FaDiscord, 
  FaTwitter, 
  FaInstagram 
} from "react-icons/fa";

interface SocialSectionProps {
  className?: string;
}

export default function SocialSection({ className = "" }: SocialSectionProps) {
  // Helper to get the right icon component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'twitch':
        return <FaTwitch className="text-2xl" />;
      case 'discord':
        return <FaDiscord className="text-2xl" />;
      case 'twitter':
        return <FaTwitter className="text-2xl" />;
      case 'instagram':
        return <FaInstagram className="text-2xl" />;
      default:
        return null;
    }
  };

  const getBgStyle = (bg: string) => {
    if (bg.startsWith('linear-gradient')) {
      return { background: bg };
    }
    return { backgroundColor: bg };
  };
  
  return (
    <section id="socials" className={`${className}`}>
      <h2 className="mb-6 text-2xl font-bold flex items-center">
        <span className="mr-2 text-primary">#</span> Connect & Follow
      </h2>
      
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-black/30 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-black/50 hover:shadow-lg hover:shadow-primary/10"
          >
            <div 
              className="mb-2 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
              style={getBgStyle(social.bgColor)}
            >
              {getIcon(social.icon)}
            </div>
            <h3 className="font-bold text-white transition-colors group-hover:text-primary">{social.name}</h3>
            <p className="text-sm text-gray-400">{social.username}</p>
          </a>
        ))}
      </div>
      
      <div className="mt-8 text-center text-xs text-gray-500">
        Made with ♥️ by sf.xen on discord
      </div>
    </section>
  );
}
