// components/history/ReplayLauncher.tsx
'use client';

import { useState } from 'react';
import RevealPlayer from '@/components/reveal/RevealPlayer';
import type { LotteryResult } from '@/lib/lottery/types';

export default function ReplayLauncher({ lottery }: { lottery: LotteryResult }) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <RevealPlayer
        drawSequence={lottery.drawSequence}
        teamNames={lottery.teams.map((t) => t.name)}
        pickOwnership={lottery.pickOwnership}
        onComplete={() => setPlaying(false)}
      />
    );
  }
  return (
    <button
      onClick={() => setPlaying(true)}
      className="px-6 py-3 bg-blue-600 rounded text-lg font-bold"
    >
      Watch the reveal
    </button>
  );
}
