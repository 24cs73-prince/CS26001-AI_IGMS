import { CHART_PALETTE } from '../../constants/theme';

/**
 * Simple area chart rendered as SVG polyline + filled polygon.
 * @param {Array<Object>} data - array of {label, value} objects
 * @param {number} height - SVG height in px
 * @param {string} color - fill/stroke color (hex)
 */
export default function SimpleAreaChart({ data = [], height = 160, color = CHART_PALETTE[0] }) {
  if (!data.length) return <div className="flex h-[160px] items-center justify-center text-sm text-slate-400">No data</div>;

  const w = 500;
  const h = height;
  const pad = { top: 10, right: 10, bottom: 22, left: 30 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;

  const max = Math.max(...data.map((d) => d.value), 1);
  const scaleX = (i) => pad.left + (i / Math.max(data.length - 1, 1)) * cw;
  const scaleY = (v) => pad.top + ch - (v / max) * ch;

  const points = data.map((d, i) => `${scaleX(i)},${scaleY(d.value)}`).join(' ');
  const areaPoints = `${scaleX(0)},${pad.top + ch} ${points} ${scaleX(data.length - 1)},${pad.top + ch}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" preserveAspectRatio="xMidYMid meet">
      {/* grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = pad.top + ch * (1 - frac);
        return (
          <g key={frac}>
            <line x1={pad.left} x2={w - pad.right} y1={y} y2={y} stroke="#E2E8F0" strokeWidth={0.5} />
            <text x={pad.left - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400">{Math.round(max * frac)}</text>
          </g>
        );
      })}
      {/* x-axis labels */}
      {data.map((d, i) => (
        <text key={i} x={scaleX(i)} y={h - 2} textAnchor="middle" className="text-[9px] fill-slate-400">{d.month ?? d.label ?? ''}</text>
      ))}
      {/* area fill */}
      <polygon points={areaPoints} fill={color} fillOpacity={0.08} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* dots */}
      {data.map((d, i) => (
        <circle key={i} cx={scaleX(i)} cy={scaleY(d.value)} r={3.5} fill="white" stroke={color} strokeWidth={2} />
      ))}
    </svg>
  );
}
