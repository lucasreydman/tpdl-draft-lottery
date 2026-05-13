// app/history/page.tsx
import Link from 'next/link';
import { listLotteries } from '@/lib/kv';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  let items: Awaited<ReturnType<typeof listLotteries>> = [];
  let kvError: string | null = null;
  try {
    items = await listLotteries(50, 0);
  } catch (err) {
    kvError = err instanceof Error ? err.message : 'KV not configured';
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">History</h1>
      {kvError ? (
        <p className="text-neutral-400">History unavailable: {kvError}</p>
      ) : items.length === 0 ? (
        <p className="text-neutral-400">No lotteries yet. Run one on the home page.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => {
            const topPickTeam = it.teams[it.finalOrder[0]]?.name ?? '—';
            return (
              <li key={it.id} className="border border-neutral-800 rounded-lg p-4">
                <Link href={`/results/${it.id}`} className="font-bold underline">
                  {it.label}
                </Link>
                <div className="text-sm text-neutral-400">
                  Top pick: {topPickTeam} · {new Date(it.createdAt).toLocaleDateString()}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
