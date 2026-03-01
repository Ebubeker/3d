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
  created_at: string;
  updated_at: string;
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

export interface AdminUser {
  id: string;
  email: string;
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
    };
  };
};
