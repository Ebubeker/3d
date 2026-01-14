'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { TeamMember, PortfolioItem } from '@/lib/supabase/types';
import { FolderOpen, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface PortfolioWithMember extends PortfolioItem {
  team_members: TeamMember;
}

export default function AllPortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioWithMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*, team_members(*)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPortfolioItems(data as PortfolioWithMember[]);
      }
      setIsLoading(false);
    };

    fetchPortfolio();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Portfolio Items</h1>
        <p className="text-gray-600 mt-1">View all portfolio items across team members</p>
      </div>

      {portfolioItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No portfolio items yet.</p>
          <Link
            href="/admin/dashboard/team"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Manage Team Members
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-gray-100 relative">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                {item.category && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-black text-white text-xs rounded">
                    {item.category}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      {item.team_members?.portrait ? (
                        <img
                          src={item.team_members.portrait}
                          alt={item.team_members.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-gray-500">
                          {item.team_members?.name?.split(' ').map((n) => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{item.team_members?.name}</span>
                  </div>
                  <Link
                    href={`/admin/dashboard/team/${item.team_member_id}/portfolio`}
                    className="text-gray-400 hover:text-black transition-colors"
                    title="View all portfolio"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
