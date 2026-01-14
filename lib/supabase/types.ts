export interface TeamMember {
  id: string;
  name: string;
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
  image_url: string | null;
  category: string | null;
  created_at: string;
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
