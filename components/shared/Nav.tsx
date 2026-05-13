// components/shared/Nav.tsx
import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="border-b border-neutral-800 px-6 py-4 flex gap-6">
      <Link href="/" className="font-bold">TPDL Lottery</Link>
      <Link href="/history">History</Link>
      <Link href="/admin">Admin</Link>
    </nav>
  );
}
