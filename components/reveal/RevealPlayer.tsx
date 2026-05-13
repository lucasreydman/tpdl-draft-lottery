// components/reveal/RevealPlayer.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FocusTrap } from 'focus-trap-react';
import type { RevealPhase } from './types';
import type { DrawEvent } from '@/lib/lottery/types';
import QuickIterationsPodium from './QuickIterationsPodium';
import AutomaticPicksLane from './AutomaticPicksLane';
import TopPicksPodium from './TopPicksPodium';

type Props = {
  drawSequence: DrawEvent[];
  teamNames: string[];
  pickOwnership: string[][];
  onComplete: () => void;
};

export default function RevealPlayer({ drawSequence, teamNames, pickOwnership, onComplete }: Props) {
  const [phase, setPhase] = useState<RevealPhase>('quickIterations');

  // Inert other content while reveal modal is mounted so Tab and screen
  // readers cannot reach elements behind the fullscreen overlay.
  useEffect(() => {
    const main = document.querySelector('main') as HTMLElement | null;
    const nav = document.querySelector('nav') as HTMLElement | null;
    if (main) main.setAttribute('inert', '');
    if (nav) nav.setAttribute('inert', '');
    return () => {
      if (main) main.removeAttribute('inert');
      if (nav) nav.removeAttribute('inert');
    };
  }, []);

  return (
    <FocusTrap focusTrapOptions={{ initialFocus: false, fallbackFocus: '#reveal-root' }}>
      <div
        id="reveal-root"
        role="dialog"
        aria-modal="true"
        aria-label="Draft lottery reveal"
        tabIndex={-1}
        className="fixed inset-0 bg-black z-50 overflow-auto"
      >
        <AnimatePresence mode="wait">
          {phase === 'quickIterations' && (
            <motion.div key="quick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuickIterationsPodium teamNames={teamNames} onDone={() => setPhase('automaticPicks')} />
            </motion.div>
          )}
          {phase === 'automaticPicks' && (
            <motion.div key="auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AutomaticPicksLane
                events={drawSequence.filter((e) => e.kind !== 'lottery')}
                teamNames={teamNames}
                pickOwnership={pickOwnership}
                onDone={() => setPhase('topPodium')}
              />
            </motion.div>
          )}
          {phase === 'topPodium' && (
            <motion.div key="top" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TopPicksPodium
                events={drawSequence.filter((e) => e.kind === 'lottery')}
                teamNames={teamNames}
                pickOwnership={pickOwnership}
                onDone={() => setPhase('complete')}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {phase === 'complete' && (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-3xl font-bold mb-4">Lottery Complete</h2>
            <button onClick={onComplete} className="px-6 py-2 bg-blue-600 rounded">Save & Share</button>
          </div>
        )}
      </div>
    </FocusTrap>
  );
}
