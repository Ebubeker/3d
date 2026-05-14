'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

type Status = 'loading' | 'success' | 'error';

function UnsubscribeContent() {
  const params = useSearchParams();
  const token = params.get('token');

  // Set initial state from the token presence so we don't have to call
  // setState synchronously inside the effect (which lint flags).
  const [status, setStatus] = useState<Status>(token ? 'loading' : 'error');
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState(
    token ? '' : 'This unsubscribe link is missing its token.'
  );

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const body = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setStatus('error');
          setError(body.error || 'Could not process your unsubscribe request.');
          return;
        }
        setEmail(body.email || null);
        setStatus('success');
      } catch {
        if (cancelled) return;
        setStatus('error');
        setError('Network error. Please try the link again.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm max-w-lg w-full p-8 sm:p-10 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-black mb-2">
              Processing your request
            </h1>
            <p className="text-gray-600">One moment please…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-black mb-2">
              You&apos;ve been unsubscribed
            </h1>
            <p className="text-gray-700 mb-6">
              {email ? (
                <>
                  <span className="font-semibold">{email}</span> will no longer
                  receive marketing or update emails from Virtuality Fashion.
                </>
              ) : (
                <>
                  Your email will no longer receive marketing or update emails
                  from Virtuality Fashion.
                </>
              )}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You may still receive transactional emails (e.g. password
              resets) that we&apos;re required to send.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Back to virtuality.fashion
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-black mb-2">
              We couldn&apos;t complete that
            </h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <p className="text-sm text-gray-500 mb-6">
              If you keep seeing this, reply to any of our emails and we&apos;ll
              remove you manually.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 border-2 border-gray-200 text-black rounded-lg font-semibold hover:border-black transition-colors"
            >
              Back to virtuality.fashion
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        }
      >
        <UnsubscribeContent />
      </Suspense>
      <Footer />
    </>
  );
}
