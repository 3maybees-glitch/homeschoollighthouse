export type SocialPlatform =
  | "youtube"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "pinterest"
  | "x";

export interface SocialMediaChannel {
  id: string;
  name: string;
  handle: string;
  url: string;
  platform: SocialPlatform;
  description: string;
}
