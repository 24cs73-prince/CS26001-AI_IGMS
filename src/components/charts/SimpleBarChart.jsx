import { CHART_PALETTE } from '../../constants/theme';

/**
 * Simple vertical bar chart in SVG.
 * @param {Array<Object>} data - array of {label, value} objects
 */
export default function SimpleBarChart({ data = [], height = 180, color = CHART_PALETTE[0] }) {
  if (!data.length) return <div className="flex h-[180px] items-center justify-center text-sm text-slate-400">No data</div>;

  const w = 500;
  const h = height;
  const pad = { top: 12, right: 10, bottom: 24, left: 30 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;

  const max = Math.max(...data.map((d) => d.value), 1);
  const gap = 12;
  const barW = (cw - gap * (data.length - 1)) / data.length;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" preserveAspectRatio="xMidYMid meet">
      {[0, 0.5, 1].map((frac) => {
        const y = pad.top + ch * (1 - frac);
        return (
          <g key={frac}>
            <line x1={pad.left} x2={w - pad.right} y1={y} y2={y} stroke="#E2E8F0" strokeWidth={0.5} />
            <text x={pad.left - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400">{Math.round(max * frac)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const barH = (d.value / max) * ch;
        const x = pad.left + i * (barW + gap);
        const y = pad.top + ch - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx={5} fill={color} fillOpacity={0.85}>
              <title>{`${d.label ?? d.className ?? ''}: ${d.value}`}</title>
            </rect>
            <text x={x + barW / 2} y={h - 4} textAnchor="middle" className="text-[9px] fill-slate-500">{d.className ?? d.label ?? d.grade ?? d.year ?? ''}</text>
          </g>
        );
      })}
    </svg>
  );
}
