export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "pinterest"
  | "reddit"
  | "discord"
  | "x";

export interface SocialChannel {
  id: string;
  name: string;
  handle?: string;
  url: string;
  description: string;
  memberCount?: string;
}

export interface SocialPlatformGroup {
  platform: SocialPlatform;
  label: string;
  tagline: string;
  channels: SocialChannel[];
}
