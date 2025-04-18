// Types for client-side use

export type AnnouncementType = 'default' | 'special' | 'important';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: AnnouncementType;
  timestamp: string;
}

export interface StreamInfo {
  id: string;
  displayName: string;
  type: 'IRL' | 'Gaming' | 'Just Chatting';
}

export interface StreamSchedule {
  id: number;
  title: string;
  streamType: string;
  date: string;
  time: string;
  isActive: boolean;
}

export interface QuickAction {
  id: string;
  label: string;
  action: string;
  setting: string;
  value?: any;
  toggleValue?: any;
  icon?: string;
  enabled: boolean;
}

export interface AppSettings {
  bannerText: string;
  showBanner: boolean;
  primaryColor: string;
  currentStream: string;
  autoDetectStream: boolean;
  offlineBehavior: 'clips' | 'message' | 'schedule';
  darkMode: boolean;
  animationsEnabled: boolean;
  showAnnouncements: boolean;
  showNextStream: boolean;
  showSocials: boolean;
  seasonalTheme: 'default' | 'halloween' | 'christmas' | 'spring' | 'summer';
  quickActions: QuickAction[];
}

export const STREAM_CHANNELS = [
  { id: 'rennsz', displayName: 'IRL Channel', username: 'rennsz', type: 'IRL' as const },
  { id: 'rennszino', displayName: 'Gaming Channel', username: 'rennszino', type: 'Gaming' as const },
];

export const SOCIAL_LINKS = [
  {
    id: 'twitch-irl',
    name: 'Twitch - IRL',
    username: '@rennsz',
    url: 'https://www.twitch.tv/rennsz',
    icon: 'twitch',
    bgColor: '#6441a5'
  },
  {
    id: 'twitch-gaming',
    name: 'Twitch - Gaming',
    username: '@rennszino',
    url: 'https://www.twitch.tv/rennszino',
    icon: 'twitch',
    bgColor: '#6441a5'
  },
  {
    id: 'discord',
    name: 'Discord Server',
    username: 'Join the community',
    url: 'https://discord.gg/hUTXCaSdKC',
    icon: 'discord',
    bgColor: '#5865F2'
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    username: '@rennsz96',
    url: 'https://x.com/rennsz96?s=21',
    icon: 'twitter',
    bgColor: '#000000'
  },
  {
    id: 'x-community',
    name: 'X Community',
    username: 'Join the discussion',
    url: 'https://x.com/i/communities/1823168507401634218',
    icon: 'twitter',
    bgColor: '#000000'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    username: '@rennsz',
    url: 'https://www.instagram.com/rennsz?igsh=MWhjYjg2ZDV4dHc0bw==',
    icon: 'instagram',
    bgColor: 'linear-gradient(to right, #833AB4, #FD1D1D, #FCAF45)'
  }
];
