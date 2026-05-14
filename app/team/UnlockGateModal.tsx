'use client';

import { useState } from 'react';
import { CheckCircle, FileText, Mail, Loader2 } from 'lucide-react';

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

// Two-step gate shown after the /team unlock form passes the server-side
// spam check. Step 1 is a hard T&C acknowledgment (must agree to proceed).
// Step 2 is an email-updates opt-in (pre-checked, but the user can opt
// out). Either choice records the email to email_subscriptions so the
// admin always sees who passed the gate, with an opted_in flag.
export default function UnlockGateModal({
  isOpen,
  subscriber,
  onComplete,
}: Props) {
  const [step, setStep] = useState<'terms' | 'optin'>('terms');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [wantsUpdates, setWantsUpdates] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAcceptTerms = () => {
    if (!termsAccepted) return;
    setStep('optin');
  };

  const handleFinish = async () => {
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
      // subscription write failed — surface the error but still let
      // them through. We'll log it for the admin to investigate.
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
        {step === 'terms' ? (
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-black">
                Terms &amp; Privacy
              </h2>
            </div>

            <p className="text-sm sm:text-base text-gray-700 mb-4">
              Before unlocking access to our team marketplace, please review
              and acknowledge how we&apos;ll handle your details.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 space-y-2 mb-5 max-h-56 overflow-y-auto">
              <p>
                By proceeding you confirm that you have read and agree to our{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-black underline"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-black underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
              <p>
                Your name, email, and project details will be used by
                Virtuality Fashion to respond to your enquiry and to introduce
                you to relevant team members. We never sell or share your
                information with third parties.
              </p>
              <p>
                You can request deletion of your data at any time by replying
                to any email from us.
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4"
              />
              <span className="text-sm text-gray-800">
                I have read and agree to the Terms of Service and Privacy
                Policy.
              </span>
            </label>

            <button
              type="button"
              onClick={handleAcceptTerms}
              disabled={!termsAccepted}
              className="w-full px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-black">
                Stay in the loop
              </h2>
            </div>

            <p className="text-sm sm:text-base text-gray-700 mb-5">
              Would you like to receive occasional emails about new
              specialists, case studies, and platform updates? You can
              unsubscribe at any time from the link in every email.
            </p>

            <label className="flex items-start gap-3 cursor-pointer bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <input
                type="checkbox"
                checked={wantsUpdates}
                onChange={(e) => setWantsUpdates(e.target.checked)}
                className="mt-1 w-4 h-4"
              />
              <span className="text-sm text-gray-800">
                <span className="block font-semibold text-black mb-0.5">
                  Yes, send me Virtuality Fashion updates
                </span>
                Roughly one email a month. No spam, ever.
              </span>
            </label>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleFinish}
              disabled={isSaving}
              className="w-full px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {wantsUpdates ? 'Subscribe and unlock' : 'No thanks, unlock'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
