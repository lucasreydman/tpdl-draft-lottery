// components/lottery/LotteryRunner.tsx
'use client';

import { useEffect, useState } from 'react';
import { runDraw } from '@/lib/lottery/draw';
import { buildTeams } from '@/lib/league';
import type { LotteryResult, DrawResult } from '@/lib/lottery/types';
import OddsTable from './OddsTable';
import RevealPlayer from '@/components/reveal/RevealPlayer';
import ShareButton from '@/components/shared/ShareButton';

const LS_NAMES = 'tpdl.teamNames';
const LS_OWNERSHIP = 'tpdl.pickOwnership';

export default function LotteryRunner() {
  const [names, setNames] = useState<string[]>(Array(10).fill(''));
  const [ownership, setOwnership] = useState<string[][]>([[], [], []]);
  const [draw, setDraw] = useState<DrawResult | null>(null);
  const [saved, setSaved] = useState<LotteryResult | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const n = localStorage.getItem(LS_NAMES);
      const o = localStorage.getItem(LS_OWNERSHIP);
      if (n) setNames(JSON.parse(n));
      if (o) setOwnership(JSON.parse(o));
    } catch {
      // localStorage unavailable or corrupt — keep defaults.
    }
  }, []);

  const ready = names.every(Boolean) && new Set(names).size === 10;

  const run = () => {
    const teams = buildTeams(names);
    setDraw(runDraw({ teams }, Math.random));
  };

  const handleComplete = async () => {
    if (!draw) return;
    setSaving(true);
    const teams = buildTeams(names);
    const label = new Date().getFullYear() + ' Season';
    try {
      const res = await fetch('/api/lotteries', {
        method: 'POST',
        body: JSON.stringify({ ...draw, teams, pickOwnership: ownership, label }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`save failed: ${res.status}`);
      const json: LotteryResult = await res.json();
      setSaved(json);
    } catch (err) {
      console.error('save failed', err);
      // KV likely not configured yet (Phase 10) — show the draw but no share URL.
      setSaved({
        ...draw,
        id: 'local',
        createdAt: Date.now(),
        label,
        teams,
        pickOwnership: ownership,
      });
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    const isLocal = saved.id === 'local';
    const url = isLocal ? '#' : `/results/${saved.id}`;
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{isLocal ? 'Lottery complete (save failed — KV not configured)' : 'Saved!'}</h1>
        {!isLocal && (
          <>
            <a href={url} className="underline">{url}</a>
            <ShareButton url={`${window.location.origin}${url}`} />
          </>
        )}
      </div>
    );
  }

  if (draw) {
    return <RevealPlayer drawSequence={draw.drawSequence} teamNames={names} pickOwnership={ownership} onComplete={handleComplete} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Run Lottery</h1>
      {!ready && (
        <p className="text-amber-400 mb-4">
          Set 10 unique team names on the <a href="/admin" className="underline">Admin page</a> first.
        </p>
      )}
      <button
        disabled={!ready || saving}
        onClick={run}
        className="px-6 py-3 bg-blue-600 disabled:bg-neutral-800 rounded text-lg font-bold"
      >
        Run Lottery
      </button>
      <OddsTable />
    </div>
  );
}
