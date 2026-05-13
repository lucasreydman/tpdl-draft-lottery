// components/lottery/OddsTable.tsx
import { TPDL_ODDS } from '@/lib/lottery/odds';
import { TEAM_LABELS } from '@/lib/league';

export default function OddsTable() {
  return (
    <section className="p-6">
      <h2 className="text-xl font-semibold mb-3">Odds</h2>
      <table className="text-sm">
        <thead>
          <tr>
            <th></th>
            {Array.from({ length: 6 }, (_, i) => <th key={i}>Pick {i + 1}</th>)}
          </tr>
        </thead>
        <tbody>
          {TPDL_ODDS.map((row, i) => (
            <tr key={i}>
              <td className="pr-3 text-neutral-400">{TEAM_LABELS[i]}</td>
              {row.map((p, j) => <td key={j} className="px-2">{(p * 100).toFixed(1)}%</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
