// components/reveal/RevealPlayer.tsx
'use client';

import type { DrawEvent } from '@/lib/lottery/types';

type Props = {
  drawSequence: DrawEvent[];
  teamNames: string[];
  pickOwnership: string[][];
  onComplete: () => void;
};

export default function RevealPlayer({ drawSequence, teamNames, onComplete }: Props) {
  const sorted = [...drawSequence].sort((a, b) => a.pick - b.pick);
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-8 overflow-auto">
      <h2 className="text-3xl font-bold mb-6">Draft Order</h2>
      <ol className="space-y-2">
        {sorted.map((e) => (
          <li key={e.pick} className="text-xl">
            <strong>Pick {e.pick}:</strong> {teamNames[e.teamIndex]}
          </li>
        ))}
      </ol>
      <button onClick={onComplete} className="mt-8 px-4 py-2 bg-neutral-800 rounded">Done</button>
    </div>
  );
}
