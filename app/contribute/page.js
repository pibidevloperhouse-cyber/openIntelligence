'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ContributePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        // If already logged in, go directly to the submit page
        router.push('/submit');
      } else {
        setLoading(false);
      }
    });
  }, [router, supabase]);

  const handleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  if (loading) {
    return <div style={{ minHeight: 'calc(100vh - 68px)', background: '#ffffff' }}></div>;
  }

  return (
    <div className="animate-fade-up" style={{
      minHeight: 'calc(100vh - 68px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
      padding: '2rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #E7E5E4',
        padding: '3.5rem 2.5rem',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Plus Icon Container */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(31, 111, 178, 0.1)', padding: '1rem', borderRadius: '50%', border: '1px solid rgba(31, 111, 178, 0.2)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1f6fb2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#1C1917',
          marginBottom: '1rem',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em'
        }}>
          Sign in to contribute
        </h1>

        {/* Subtext */}
        <p style={{
          color: '#57534E',
          fontSize: '1rem',
          lineHeight: '1.6',
          marginBottom: '2.5rem',
          maxWidth: '400px',
          margin: '0 auto 2.5rem auto'
        }}>
          Contributions are attributed to your GitHub profile so the community can find and follow you.
        </p>

        {/* Continue with GitHub Button */}
        <button
          onClick={handleLogin}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            padding: '0.85rem 2.5rem',
            background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
            color: '#ffffff',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '1.5rem',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px rgba(31, 111, 178, 0.25)',
            width: '100%',
            maxWidth: '300px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(31, 111, 178, 0.35)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(31, 111, 178, 0.25)';
          }}
        >
          <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          Continue with GitHub
        </button>

        <div style={{ margin: 0 }}>
          <span style={{ color: '#78716C', fontSize: '0.95rem' }}>
            Or <Link href="/resources" style={{ color: '#1f6fb2', textDecoration: 'underline', fontWeight: 500 }}>browse resources</Link> first.
          </span>
        </div>
      </div>
    </div>
  );
}