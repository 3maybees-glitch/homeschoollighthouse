export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  tags: string[];
  weekKey: string;
  authorName: string;
  publishedAt: string;
  isPublished: boolean;
}
