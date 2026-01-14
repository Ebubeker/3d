import { useEffect, useState } from 'react';
import { createClient } from './client';
import { TeamMember, PortfolioItem } from './types';

export interface TeamMemberWithPortfolio extends TeamMember {
  portfolio_items: PortfolioItem[];
}

export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithPortfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('team_members')
          .select('*, portfolio_items(*)')
          .order('created_at', { ascending: false });

        if (error) {
          setError(error.message);
          return;
        }

        setTeamMembers(data || []);
      } catch (err) {
        setError('Failed to fetch team members');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return { teamMembers, isLoading, error };
}

export function useTeamMember(id: string) {
  const [member, setMember] = useState<TeamMemberWithPortfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('team_members')
          .select('*, portfolio_items(*)')
          .eq('id', id)
          .single();

        if (error) {
          setError(error.message);
          return;
        }

        setMember(data);
      } catch (err) {
        setError('Failed to fetch team member');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMember();
    }
  }, [id]);

  return { member, isLoading, error };
}
