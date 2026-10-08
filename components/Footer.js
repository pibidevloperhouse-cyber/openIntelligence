'use client';

import Link from 'next/link';

const footerLinks = {
  Topic: [
    { href: '/#learn', label: 'Learn AI' },
    { href: '/#contribute', label: 'Contribute' },
    { href: '/#empower', label: 'Empower' },
    { href: '/#apply', label: 'Apply' },
  ],
  Resources: [
    { href: '/open-intelligence', label: 'AI & Machine Learning' },
    { href: '/open-intelligence', label: 'Data Engineering' },
    { href: '/open-intelligence', label: 'Infrastructure & Cloud' },
    { href: '/open-intelligence', label: 'Digital Transformation' },
    { href: '/open-intelligence', label: 'Product & Growth' },
    { href: '/open-intelligence', label: 'Security & Governance' },
  ],
  Company: [
    { href: '/#about', label: 'About Us' },
    { href: '/contact-us', label: 'Contact Us' },
  ],
};

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: '#f4f5f7',
    }}>
      <div className="container" style={{ padding: '3rem 1.5rem 2rem' }}>

        {/* Top section */}
        <style>{`
          .footer-top-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            margin-bottom: 2.5rem;
          }
          .footer-brand {
            grid-column: span 2;
          }
          @media (min-width: 640px) {
            .footer-top-grid {
              grid-template-columns: 2fr 1fr 1fr 1fr;
            }
            .footer-brand {
              grid-column: span 1;
            }
          }
          .footer-bottom-bar {
            border-top: 1px solid var(--border);
            padding-top: 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            text-align: center;
          }
          .footer-bottom-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
          }
          @media (min-width: 640px) {
            .footer-bottom-bar {
              flex-direction: row;
              justify-content: space-between;
              text-align: left;
            }
            .footer-bottom-info {
              flex-direction: row;
              gap: 1rem;
            }
          }
          .footer-link {
            color: #000000;
            text-decoration: none;
            font-size: 0.85rem;
            transition: all 0.2s;
          }
          .footer-link:hover {
            background: linear-gradient(135deg, #1f6fb2, #2ec4b6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}</style>
        <div className="footer-top-grid">

          {/* Brand */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem', marginTop: '12px' }}>
              <img
                src="/final-logo.webp"
                alt="OpenIntelligence Logo"
                style={{
                  width: 40,
                  height: 40,
                  objectFit: 'contain',
                }}
              />
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.15rem',
                color: '#000000'
              }}>
                OpenIntelligence
              </span>
            </div>
            <p style={{ color: '#000000', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '350px' }}>
              Pi Bi Open Intelligence is a community-led initiative from the{' '}
              <span style={{
                background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600
              }}>Pi Bi Foundation</span> and Madurai AI Community, bringing people together to learn, explore and build with AI and emerging technologies.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 style={{ color: '#000000', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {group}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {links.map(({ href, label, external }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="footer-link"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom-bar">
          <p style={{ color: '#000000', fontSize: '0.8rem', margin: 0 }}>
            © {new Date().getFullYear()} <span style={{
              background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600
            }}>PiBi</span> Open Intelligence
          </p>
        </div>
      </div>
    </footer>
  );
}
