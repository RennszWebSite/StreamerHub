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
    <section id="socials" className={`mb-8 ${className}`}>
      <h2 className="mb-4 text-2xl font-bold">
        <span className="text-primary">#</span> Socials
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={getBgStyle(social.bgColor)}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white bg-opacity-20">
              {getIcon(social.icon)}
            </div>
            <div>
              <h3 className="font-semibold">{social.name}</h3>
              <p className="text-sm text-gray-200">{social.username}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
