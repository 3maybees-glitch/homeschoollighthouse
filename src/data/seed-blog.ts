import blogPostsJson from "@/data/blog-posts.json";
import type { BlogPost } from "@/types/blog";

export const seedBlogPosts: BlogPost[] = blogPostsJson as BlogPost[];
