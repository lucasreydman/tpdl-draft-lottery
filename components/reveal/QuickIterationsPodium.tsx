// components/reveal/QuickIterationsPodium.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, LayoutGroup } from 'motion/react';
import { TIMINGS } from './timing';

const shuffle = <T,>(arr: T[]): T[] =>
  arr.map((v) => [Math.random(), v] as const).sort((a, b) => a[0] - b[0]).map(([, v]) => v);

export default function QuickIterationsPodium({ teamNames, onDone }: { teamNames: string[]; onDone: () => void }) {
  // Sample three teams from the lottery-eligible pool (originalIndex 0-5).
  // teamNames[0..5] are the worst 6 seeds — the lottery-eligible ones.
  const lotteryPool = teamNames.slice(0, 6);
  const [order, setOrder] = useState<string[]>(() => shuffle(lotteryPool).slice(0, 3));
  const [iter, setIter] = useState(0);

  useEffect(() => {
    if (iter >= TIMINGS.quickIterationsCount) { onDone(); return; }
    const t = setTimeout(() => {
      setOrder(shuffle(lotteryPool).slice(0, 3));
      setIter((n) => n + 1);
    }, TIMINGS.quickIterationDurationMs);
    return () => clearTimeout(t);
  }, [iter, lotteryPool, onDone]);

  return (
    <div className="flex items-end justify-center gap-6 min-h-screen pb-32">
      <LayoutGroup>
        {order.map((name, i) => (
          <motion.div
            key={name}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`bg-neutral-800 rounded-t-lg flex items-end justify-center text-center text-white font-bold w-32 ${
              i === 0 ? 'h-64' : i === 1 ? 'h-80' : 'h-48'
            }`}
          >
            <span className="pb-4">{name}</span>
          </motion.div>
        ))}
      </LayoutGroup>
    </div>
  );
}
