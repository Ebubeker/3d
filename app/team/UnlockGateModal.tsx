'use client';

import { useState } from 'react';
import { CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';

interface SubscriberInput {
  email: string;
  name: string;
  company: string;
}

interface Props {
  isOpen: boolean;
  subscriber: SubscriberInput;
  onComplete: () => void;
}

// Single-step gate shown after the /team unlock form passes the server-side
// spam check. Collapses the previous two-step flow (T&C then newsletter)
// into one popup with two explicit checkboxes:
//   1. Terms & Privacy (required, must be ticked to proceed)
//   2. Newsletter consent (optional, NOT pre-checked — GDPR-safe so we
//      never auto-subscribe an EU visitor by default)
// Both choices flow through /api/subscribe, which always stores the
// email plus the user's opt-in decision.
export default function UnlockGateModal({
  isOpen,
  subscriber,
  onComplete,
}: Props) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [wantsUpdates, setWantsUpdates] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFinish = async () => {
    if (!termsAccepted) return;
    setIsSaving(true);
    setError('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: subscriber.email,
          name: subscriber.name,
          company: subscriber.company,
          source: 'team-unlock',
          optedIn: wantsUpdates,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error || 'Could not save your preference. Please try again.');
        return;
      }
      onComplete();
    } catch {
      // Don't block the user from accessing the team just because the
      // subscription write failed. Surface the error but still let them
      // through; the admin can investigate from the server logs.
      console.error('[UnlockGateModal] subscribe failed');
      onComplete();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-black">
              One last step
            </h2>
          </div>

          <p className="text-sm sm:text-base text-gray-700 mb-5">
            Before we unlock the team marketplace, please confirm a couple of
            quick things below.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs sm:text-sm text-gray-700 space-y-2 mb-5 max-h-40 overflow-y-auto">
            <p>
              Your name, email, and project details will be used by
              virtuality.fashion to respond to your enquiry and to introduce
              you to relevant team members. We never sell or share your
              information with third parties.
            </p>
            <p>
              You can request deletion of your data at any time by replying
              to any email from us.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 shrink-0"
              />
              <span className="text-sm text-gray-800">
                <span className="block font-semibold text-black mb-0.5">
                  I agree to the Terms &amp; Privacy Policy
                  <span className="text-red-500"> *</span>
                </span>
                I&apos;ve read and accept the{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-black"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-black"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={wantsUpdates}
                onChange={(e) => setWantsUpdates(e.target.checked)}
                className="mt-1 w-4 h-4 shrink-0"
              />
              <span className="text-sm text-gray-800">
                <span className="block font-semibold text-black mb-0.5">
                  Send me virtuality.fashion updates
                </span>
                Roughly one email a month with new specialists, case studies,
                and platform updates. Unsubscribe in one click anytime.
              </span>
            </label>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleFinish}
            disabled={!termsAccepted || isSaving}
            className="w-full px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Continue and unlock
          </button>
        </div>
      </div>
    </div>
  );
}
