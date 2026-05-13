'use client';

import { TEAM_LABELS, TEAM_NAME_OPTIONS } from '@/lib/league';

type Props = {
  names: string[];
  onChange: (names: string[]) => void;
  locked: boolean;
  onLockToggle: () => void;
};

export default function TeamSetup({ names, onChange, locked, onLockToggle }: Props) {
  return (
    <section className="p-6">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Teams</h2>
        <button onClick={onLockToggle} className="text-sm">{locked ? 'Unlock' : 'Lock'}</button>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TEAM_LABELS.map((label, i) => (
          <label key={i} className="flex flex-col gap-1">
            <span className="text-xs text-neutral-400">{label}</span>
            <select
              disabled={locked}
              value={names[i] ?? ''}
              onChange={(e) => {
                const next = [...names];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
            >
              <option value="">—</option>
              {TEAM_NAME_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        ))}
      </div>
    </section>
  );
}
