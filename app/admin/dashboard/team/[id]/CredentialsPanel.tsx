'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, KeyRound, Loader2, RefreshCw, Copy, Check } from 'lucide-react';

interface Credential {
  team_member_id: string;
  email: string;
  password_plaintext: string;
  updated_at: string;
}

interface Props {
  teamMemberId: string;
  teamMemberEmail: string | null;
}

export default function CredentialsPanel({
  teamMemberId,
  teamMemberEmail,
}: Props) {
  const [credential, setCredential] = useState<Credential | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const fetchCredential = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/admin/credentials?teamMemberId=${encodeURIComponent(teamMemberId)}`
      );
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || 'Failed to load credentials');
      } else {
        setCredential(body.credential);
      }
    } catch {
      setError('Network error loading credentials');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredential();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamMemberId]);

  const provision = async (isReset: boolean) => {
    if (
      isReset &&
      !confirm(
        'Reset this team member\u2019s password? They will be signed out and will need the new password to log in again.'
      )
    ) {
      return;
    }

    setIsProvisioning(true);
    setError('');
    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamMemberId }),
      });
      let body: { error?: string; email?: string; password?: string } = {};
      try {
        body = await res.json();
      } catch {
        // Server returned non-JSON (likely a crashed handler). Surface the
        // HTTP status so the admin can debug rather than seeing a vague
        // "network error".
        setError(
          `Server returned ${res.status} ${res.statusText || 'error'} with no JSON body. Check the server logs.`
        );
        return;
      }
      if (!res.ok) {
        setError(body.error || 'Failed to provision credentials');
        return;
      }
      setCredential({
        team_member_id: teamMemberId,
        email: body.email || '',
        password_plaintext: body.password || '',
        updated_at: new Date().toISOString(),
      });
      setShowPassword(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Network error: ${err.message}`
          : 'Network error provisioning credentials'
      );
    } finally {
      setIsProvisioning(false);
    }
  };

  const copyPassword = async () => {
    if (!credential) return;
    try {
      await navigator.clipboard.writeText(credential.password_plaintext);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <KeyRound className="w-5 h-5" />
          Author Login
        </h2>
        {credential && (
          <span className="text-xs text-gray-500">
            Updated {new Date(credential.updated_at).toLocaleString()}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600">
        These credentials let the team member sign in to{' '}
        <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">/author</code>{' '}
        and submit blog posts for review. Stored in plaintext so you can share
        them directly.
      </p>

      {!teamMemberEmail && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          Add an email to this team member before provisioning a login.
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading credentials...
        </div>
      ) : credential ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Email
            </label>
            <input
              type="text"
              value={credential.email}
              readOnly
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={credential.password_plaintext}
                readOnly
                className="w-full pl-3 pr-24 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="p-1.5 text-gray-500 hover:text-black rounded"
                  title={showPassword ? 'Hide' : 'Reveal'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={copyPassword}
                  className="p-1.5 text-gray-500 hover:text-black rounded"
                  title="Copy"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => provision(true)}
            disabled={isProvisioning || !teamMemberEmail}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProvisioning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Reset Password
          </button>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-600 mb-3">
            No login has been generated for this team member yet.
          </p>
          <button
            type="button"
            onClick={() => provision(false)}
            disabled={isProvisioning || !teamMemberEmail}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProvisioning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <KeyRound className="w-4 h-4" />
            )}
            Generate Login
          </button>
        </div>
      )}
    </div>
  );
}
