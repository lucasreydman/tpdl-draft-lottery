// components/reveal/TopPicksPodium.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TIMINGS } from './timing';
import type { DrawEvent } from '@/lib/lottery/types';

type Props = {
  events: DrawEvent[];
  teamNames: string[];
  pickOwnership: string[][];
  onDone: () => void;
};

export default function TopPicksPodium({ events, teamNames, pickOwnership, onDone }: Props) {
  const sorted = [...events].sort((a, b) => b.pick - a.pick); // 4 → 1
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed >= sorted.length) {
      const t = setTimeout(onDone, TIMINGS.phaseTransitionMs);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setRevealed((n) => n + 1), TIMINGS.topPodiumPickDelayMs);
    return () => clearTimeout(t);
  }, [revealed, sorted.length, onDone]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <AnimatePresence>
        {sorted.slice(0, revealed).map((e) => {
          const owner = pickOwnership[0]?.[e.teamIndex];
          const winner = teamNames[e.teamIndex];
          const traded = owner && owner !== winner;
          return (
            <motion.div
              key={e.pick}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="my-3 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl px-10 py-6 text-3xl font-bold text-center"
            >
              <div className="text-sm text-yellow-200 mb-1">Pick {e.pick}</div>
              <div>{winner}</div>
              {traded && <div className="text-base text-yellow-100 mt-1">→ {owner}</div>}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
