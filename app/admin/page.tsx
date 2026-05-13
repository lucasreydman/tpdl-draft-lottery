'use client';

import { useEffect, useState } from 'react';
import TeamSetup from '@/components/lottery/TeamSetup';
import PickOwnershipEditor from '@/components/lottery/PickOwnershipEditor';

const LS_NAMES = 'tpdl.teamNames';
const LS_OWNERSHIP = 'tpdl.pickOwnership';

const blankOwnership = (names: string[]): string[][] =>
  [0, 1, 2].map(() => names.map((n) => n || ''));

function safeParseJSON<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readNames(): string[] {
  try {
    return safeParseJSON<string[]>(localStorage.getItem(LS_NAMES), Array(10).fill(''));
  } catch {
    return Array(10).fill('');
  }
}

function readOwnership(names: string[]): string[][] {
  try {
    return safeParseJSON<string[][]>(localStorage.getItem(LS_OWNERSHIP), blankOwnership(names));
  } catch {
    return blankOwnership(names);
  }
}

export default function AdminPage() {
  const [names, setNames] = useState<string[]>(() => readNames());
  const [ownership, setOwnership] = useState<string[][]>(() => {
    const n = readNames();
    return readOwnership(n);
  });
  const [teamsLocked, setTeamsLocked] = useState(false);
  const [ownLocked, setOwnLocked] = useState(false);

  useEffect(() => { localStorage.setItem(LS_NAMES, JSON.stringify(names)); }, [names]);
  useEffect(() => { localStorage.setItem(LS_OWNERSHIP, JSON.stringify(ownership)); }, [ownership]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold p-6">Admin</h1>
      <TeamSetup
        names={names}
        onChange={setNames}
        locked={teamsLocked}
        onLockToggle={() => setTeamsLocked(v => !v)}
      />
      <PickOwnershipEditor
        ownership={ownership}
        teamNames={names}
        onChange={setOwnership}
        locked={ownLocked}
        onLockToggle={() => setOwnLocked(v => !v)}
      />
    </div>
  );
}
