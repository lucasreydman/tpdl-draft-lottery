// components/shared/Nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'LOTTERY' },
  { href: '/history', label: 'HISTORY' },
  { href: '/admin', label: 'ADMIN' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center justify-between px-8 py-5"
      style={{ borderBottom: '1px solid var(--tpdl-border-strong)' }}
    >
      {/* Monogram */}
      <Link href="/" className="flex items-baseline gap-0" style={{ textDecoration: 'none' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: '26px',
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
            lineHeight: 1,
          }}
        >
          TPDL
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: '26px',
            letterSpacing: '-0.03em',
            color: 'var(--tpdl-accent)',
            lineHeight: 1,
          }}
        >
          .
        </span>
      </Link>

      {/* Section links */}
      <div className="flex items-center gap-8">
        {links.map(({ href, label }) => {
          const active =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: active ? 'var(--ink)' : 'var(--ink-muted)',
                textDecoration: 'none',
                borderBottom: active
                  ? '2px solid var(--tpdl-accent)'
                  : '2px solid transparent',
                paddingBottom: '2px',
                transition: 'color 150ms ease, border-color 150ms ease',
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
