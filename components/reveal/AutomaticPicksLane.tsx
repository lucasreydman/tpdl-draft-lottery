// components/reveal/AutomaticPicksLane.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TIMINGS } from './timing';
import type { DrawEvent } from '@/lib/lottery/types';

type Props = {
  events: DrawEvent[];
  teamNames: string[];
  pickOwnership: string[][];
  onDone: () => void;
};

export default function AutomaticPicksLane({ events, teamNames, pickOwnership, onDone }: Props) {
  const sorted = [...events].sort((a, b) => b.pick - a.pick); // 10 → 5
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed >= sorted.length) {
      const t = setTimeout(onDone, TIMINGS.phaseTransitionMs);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setRevealed((n) => n + 1), TIMINGS.automaticPickDelayMs);
    return () => clearTimeout(t);
  }, [revealed, sorted.length, onDone]);

  return (
    <div className="flex flex-col items-center justify-end min-h-screen p-8 gap-3">
      {sorted.slice(0, revealed).map((e) => {
        const owner = pickOwnership[0]?.[e.teamIndex];
        const winner = teamNames[e.teamIndex];
        const traded = owner && owner !== winner;
        return (
          <motion.div
            key={e.pick}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-neutral-800 rounded-lg px-6 py-3 text-xl flex items-center gap-3"
          >
            <span className="text-neutral-500">Pick {e.pick}</span>
            <span className="font-bold">{winner}</span>
            {traded && <span className="text-xs bg-amber-700 rounded px-2 py-0.5">→ {owner}</span>}
          </motion.div>
        );
      })}
    </div>
  );
}
