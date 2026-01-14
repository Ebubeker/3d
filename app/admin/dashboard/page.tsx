'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Users, FolderOpen, Plus } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    teamMembers: 0,
    portfolioItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();

      const [teamResult, portfolioResult] = await Promise.all([
        supabase.from('team_members').select('id', { count: 'exact' }),
        supabase.from('portfolio_items').select('id', { count: 'exact' }),
      ]);

      setStats({
        teamMembers: teamResult.count || 0,
        portfolioItems: portfolioResult.count || 0,
      });
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {isLoading ? '-' : stats.teamMembers}
            </span>
          </div>
          <h3 className="text-gray-600 font-medium">Team Members</h3>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {isLoading ? '-' : stats.portfolioItems}
            </span>
          </div>
          <h3 className="text-gray-600 font-medium">Portfolio Items</h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/dashboard/team/new"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </Link>
          <Link
            href="/admin/dashboard/team"
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-black hover:text-black transition-colors"
          >
            <Users className="w-4 h-4" />
            Manage Team
          </Link>
        </div>
      </div>
    </div>
  );
}
