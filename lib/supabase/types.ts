export interface TeamMember {
  id: string;
  name: string;
  email: string | null;
  role: string;
  location: string;
  bio: string;
  portrait: string | null;
  languages: string[];
  specialties: string[];
  tools: string[];
  years_experience: number;
  display_order: number;
  is_active: boolean;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamCredential {
  id: string;
  team_member_id: string;
  email: string;
  password_plaintext: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'admin' | 'author';

export interface UserRoleRow {
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface PortfolioItem {
  id: string;
  team_member_id: string;
  title: string;
  description: string | null;
  image_url: string | null; // Can be a single URL or JSON array of URLs
  category: string | null;
  display_type: 'project' | 'gallery';
  created_at: string;
}

// Helper to parse media URLs from portfolio item (handles both single URL and JSON array)
export function getMediaUrls(item: PortfolioItem): string[] {
  if (!item.image_url) return [];
  try {
    const parsed = JSON.parse(item.image_url);
    return Array.isArray(parsed) ? parsed : [item.image_url];
  } catch {
    return [item.image_url];
  }
}

// Link entry types for external URLs in portfolio items
export interface LinkEntry {
  link: string;
  label: string;
  type: 'link' | 'image' | 'video';
}

export function isLinkEntry(url: string): boolean {
  try {
    const parsed = JSON.parse(url);
    return parsed && typeof parsed === 'object' && 'link' in parsed && 'type' in parsed;
  } catch {
    return false;
  }
}

export function parseLinkEntry(url: string): LinkEntry | null {
  try {
    const parsed = JSON.parse(url);
    if (parsed && parsed.link && parsed.type) return parsed as LinkEntry;
    return null;
  } catch {
    return null;
  }
}

export type BlogReviewStatus =
  | 'draft'
  | 'pending_review'
  | 'published'
  | 'rejected';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  status: 'draft' | 'published';
  published_at: string | null;
  reading_time_minutes: number | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  author_id: string | null;
  review_status: BlogReviewStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

/** Post with its author joined from team_members. Author may be null for
 *  legacy posts or admin-authored posts where no team member was linked. */
export type BlogPostWithAuthor = BlogPost & {
  author: Pick<TeamMember, 'id' | 'name' | 'portrait' | 'role'> | null;
};

export interface AdminUser {
  id: string;
  email: string;
}

export type TeamMemberFileCategory =
  | 'contract'
  | 'invoice'
  | 'tax'
  | 'payment'
  | 'other';

export interface TeamMemberFile {
  id: string;
  team_member_id: string;
  file_name: string;
  storage_path: string;
  file_size: number;
  mime_type: string;
  label: string | null;
  category: TeamMemberFileCategory;
  notes: string | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      team_members: {
        Row: TeamMember;
        Insert: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>>;
      };
      portfolio_items: {
        Row: PortfolioItem;
        Insert: Omit<PortfolioItem, 'id' | 'created_at'>;
        Update: Partial<Omit<PortfolioItem, 'id' | 'created_at'>>;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>;
      };
      team_credentials: {
        Row: TeamCredential;
        Insert: Omit<TeamCredential, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TeamCredential, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_roles: {
        Row: UserRoleRow;
        Insert: Omit<UserRoleRow, 'created_at'>;
        Update: Partial<Omit<UserRoleRow, 'user_id' | 'created_at'>>;
      };
      team_member_files: {
        Row: TeamMemberFile;
        Insert: Omit<TeamMemberFile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TeamMemberFile, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};
