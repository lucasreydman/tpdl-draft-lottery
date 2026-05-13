// app/not-found.tsx
import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Not found</h1>
      <Link href="/" className="underline">Back to home</Link>
    </div>
  );
}
