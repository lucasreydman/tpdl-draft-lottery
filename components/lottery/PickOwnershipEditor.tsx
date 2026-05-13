// components/lottery/PickOwnershipEditor.tsx
'use client';

import { TEAM_LABELS } from '@/lib/league';

type Props = {
  ownership: string[][]; // [round][teamIndex] = ownerName
  teamNames: string[];
  onChange: (ownership: string[][]) => void;
  locked: boolean;
  onLockToggle: () => void;
};

export default function PickOwnershipEditor({ ownership, teamNames, onChange, locked, onLockToggle }: Props) {
  const setCell = (round: number, team: number, value: string) => {
    const next = ownership.map((row) => [...row]);
    next[round][team] = value;
    onChange(next);
  };

  return (
    <section className="p-6">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Pick Ownership</h2>
        <button onClick={onLockToggle} className="text-sm">{locked ? 'Unlock' : 'Lock'}</button>
      </header>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">Round</th>
            {TEAM_LABELS.map((label) => <th key={label}>{label}</th>)}
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2].map((round) => (
            <tr key={round}>
              <td>Round {round + 1}</td>
              {ownership[round].map((owner, team) => (
                <td key={team}>
                  <select
                    disabled={locked}
                    value={owner}
                    onChange={(e) => setCell(round, team, e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 rounded px-1"
                  >
                    {teamNames.filter(Boolean).map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
