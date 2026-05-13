// app/results/[id]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLottery } from '@/lib/kv';
import ReplayLauncher from '@/components/history/ReplayLauncher';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const lot = await getLottery(id);
    if (!lot) return { title: 'Not found' };
    const top = lot.teams[lot.finalOrder[0]]?.name ?? '—';
    return {
      title: `${lot.label} — TPDL Lottery`,
      description: `Top pick: ${top}`,
      openGraph: {
        title: `${lot.label} — TPDL Lottery`,
        description: `Top pick: ${top}. Watch the full reveal.`,
      },
    };
  } catch {
    return { title: 'TPDL Lottery' };
  }
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  let lot;
  try {
    lot = await getLottery(id);
  } catch (err) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Result unavailable</h1>
        <p className="text-neutral-400">{err instanceof Error ? err.message : 'Unknown error'}</p>
      </div>
    );
  }
  if (!lot) notFound();

  const lockedEvents = lot.drawSequence.filter((e) => e.kind === 'locked').sort((a, b) => b.pick - a.pick);
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{lot.label}</h1>
      <p className="text-sm text-neutral-400 mb-6">{new Date(lot.createdAt).toLocaleDateString()}</p>
      <h2 className="text-lg font-semibold mb-3">Locked picks</h2>
      <ul className="space-y-1 mb-8">
        {lockedEvents.map((e) => (
          <li key={e.pick}>
            <strong>Pick {e.pick}:</strong> {lot.teams[e.teamIndex].name}
          </li>
        ))}
      </ul>
      <ReplayLauncher lottery={lot} />
    </div>
  );
}
