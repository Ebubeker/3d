'use client';

import { useEffect, useMemo, useState } from 'react';
import { Mail, MailX, Search, Loader2, Download } from 'lucide-react';

interface Subscription {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  source: string;
  opted_in: boolean;
  created_at: string;
  updated_at: string;
  unsubscribed_at: string | null;
}

type Filter = 'all' | 'opted_in' | 'opted_out';

export default function SubscribersPage() {
  const [rows, setRows] = useState<Subscription[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.set('q', search.trim());
        if (filter === 'opted_in') params.set('optedIn', 'true');
        if (filter === 'opted_out') params.set('optedIn', 'false');
        params.set('limit', '500');

        const res = await fetch(
          `/api/admin/subscriptions?${params.toString()}`
        );
        const body = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setError(body.error || 'Failed to load subscribers');
          return;
        }
        setRows(body.rows || []);
        setTotal(body.total || 0);
      } catch {
        if (!cancelled) setError('Network error loading subscribers');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    // Debounce the search input so we don't refetch on every keystroke.
    const handle = setTimeout(load, 200);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [search, filter]);

  const counts = useMemo(() => {
    const optedIn = rows.filter((r) => r.opted_in).length;
    return {
      total: rows.length,
      optedIn,
      optedOut: rows.length - optedIn,
    };
  }, [rows]);

  const exportCsv = () => {
    if (rows.length === 0) return;
    const header = [
      'email',
      'name',
      'company',
      'source',
      'opted_in',
      'created_at',
      'unsubscribed_at',
    ];
    const escape = (v: string) =>
      /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
    const lines = [
      header.join(','),
      ...rows.map((r) =>
        [
          r.email,
          r.name || '',
          r.company || '',
          r.source,
          r.opted_in ? 'true' : 'false',
          r.created_at,
          r.unsubscribed_at || '',
        ]
          .map((v) => escape(String(v)))
          .join(',')
      ),
    ];
    const blob = new Blob([lines.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Email Subscribers</h1>
          <p className="text-sm text-gray-600 mt-1">
            Every visitor who completed the team-access gate. Marketing emails
            should only be sent to opted-in addresses.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={rows.length === 0}
          className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg font-medium text-sm text-gray-700 hover:border-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Total
          </div>
          <div className="text-2xl font-bold text-black mt-1">{total}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Opted in
          </div>
          <div className="text-2xl font-bold text-green-700 mt-1">
            {counts.optedIn}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Opted out
          </div>
          <div className="text-2xl font-bold text-gray-500 mt-1">
            {counts.optedOut}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email, name, or company"
            className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-black outline-none transition-colors"
          />
        </div>
        <div className="inline-flex rounded-lg border-2 border-gray-200 overflow-hidden self-start">
          {(
            [
              { v: 'all', l: 'All' },
              { v: 'opted_in', l: 'Opted in' },
              { v: 'opted_out', l: 'Opted out' },
            ] as { v: Filter; l: string }[]
          ).map((opt) => (
            <button
              key={opt.v}
              type="button"
              onClick={() => setFilter(opt.v)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filter === opt.v
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {opt.l}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading subscribers…
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            No subscribers yet. They&apos;ll appear here once visitors complete
            the team-access gate.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Company
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Source
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-mono text-gray-900 break-all">
                      {r.email}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{r.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {r.company || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 rounded">
                        {r.source}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.opted_in ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 rounded">
                          <Mail className="w-3 h-3" />
                          Opted in
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                          <MailX className="w-3 h-3" />
                          Opted out
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
