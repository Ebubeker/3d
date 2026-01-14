import { createClient } from '@/lib/supabase/client';

export interface TeamMemberDisplay {
  id: string;
  name: string;
  role: string;
  location: string;
  languages: string[];
  specialties: string[];
  tools: string[];
  bio: string;
  portrait: string | null;
  portfolio: {
    id: string;
    title: string;
    image_url: string | null;
  }[];
}

// Static fallback data in case Supabase is not configured
const staticTeamMembers: TeamMemberDisplay[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: '3D Fashion Designer',
    location: 'United States',
    languages: ['English', 'Mandarin'],
    specialties: ['Womenswear', 'Sportswear', 'Activewear'],
    tools: ['CLO3D', 'Browzwear', 'Adobe Illustrator'],
    bio: 'Senior 3D fashion designer with 5+ years of experience in virtual prototyping and digital sampling. Specialized in sportswear and activewear categories with expertise in fit simulation and materials visualization.',
    portrait: '/images/team/sarah-chen.jpg',
    portfolio: [
      { id: 'p1', title: 'Summer Collection 2024', image_url: '/placeholder.jpg' },
      { id: 'p2', title: 'Athleisure Line', image_url: '/placeholder.jpg' },
      { id: 'p3', title: 'Activewear Range', image_url: '/placeholder.jpg' }
    ]
  },
  {
    id: '2',
    name: 'Marco Rossi',
    role: 'Technical Designer',
    location: 'Italy',
    languages: ['English', 'Italian'],
    specialties: ['Menswear', 'Tailoring', 'Outerwear'],
    tools: ['Optitex', 'Adobe Illustrator', 'Gerber'],
    bio: 'Technical designer specialized in menswear and tailoring. Expert in creating production-ready tech packs with precise measurements and construction details for high-end fashion brands.',
    portrait: '/images/team/marco-rossi.jpg',
    portfolio: [
      { id: 'p4', title: 'Outerwear Tech Packs', image_url: '/placeholder.jpg' },
      { id: 'p5', title: 'Tailored Suiting Line', image_url: '/placeholder.jpg' },
      { id: 'p6', title: 'Formal Wear Patterns', image_url: '/placeholder.jpg' }
    ]
  },
  {
    id: '3',
    name: 'Aisha Kumar',
    role: '3D Visualization Specialist',
    location: 'India',
    languages: ['English', 'Hindi'],
    specialties: ['Womenswear', 'Lingerie', 'Swimwear'],
    tools: ['Browzwear', 'Style3D', 'Adobe Photoshop'],
    bio: 'Visualization specialist focused on creating photorealistic renders and e-commerce visuals. Expertise in materials simulation and virtual model imagery for product pages.',
    portrait: '/images/team/aisha-kumar.jpg',
    portfolio: [
      { id: 'p7', title: 'Luxury Brand Renders', image_url: '/placeholder.jpg' },
      { id: 'p8', title: 'E-commerce Visuals', image_url: '/placeholder.jpg' },
      { id: 'p9', title: 'Material Studies', image_url: '/placeholder.jpg' }
    ]
  }
];

export async function getTeamMembers(): Promise<TeamMemberDisplay[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('team_members')
      .select('*, portfolio_items(*)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Return static data as fallback
      return staticTeamMembers;
    }

    // Transform Supabase data to display format
    return data.map((member) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      location: member.location,
      languages: member.languages || [],
      specialties: member.specialties || [],
      tools: member.tools || [],
      bio: member.bio,
      portrait: member.portrait,
      portfolio: (member.portfolio_items || []).map((item: { id: string; title: string; image_url: string | null }) => ({
        id: item.id,
        title: item.title,
        image_url: item.image_url
      }))
    }));
  } catch (err) {
    console.error('Error fetching team members:', err);
    return staticTeamMembers;
  }
}

export async function getTeamMember(id: string): Promise<TeamMemberDisplay | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('team_members')
      .select('*, portfolio_items(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      // Try static data
      const staticMember = staticTeamMembers.find(m => m.id === id);
      return staticMember || null;
    }

    return {
      id: data.id,
      name: data.name,
      role: data.role,
      location: data.location,
      languages: data.languages || [],
      specialties: data.specialties || [],
      tools: data.tools || [],
      bio: data.bio,
      portrait: data.portrait,
      portfolio: (data.portfolio_items || []).map((item: { id: string; title: string; image_url: string | null }) => ({
        id: item.id,
        title: item.title,
        image_url: item.image_url
      }))
    };
  } catch (err) {
    console.error('Error fetching team member:', err);
    const staticMember = staticTeamMembers.find(m => m.id === id);
    return staticMember || null;
  }
}

export { staticTeamMembers };
