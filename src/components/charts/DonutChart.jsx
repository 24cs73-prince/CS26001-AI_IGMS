/**
 * Donut chart in SVG with a center label.
 * @param {Array<Object>} data - array of {name, value, tone} objects
 */
export default function DonutChart({ data = [], size = 170, thickness = 22, centerLabel }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((d) => {
    const frac = d.value / total;
    const seg = { ...d, dash: frac * circ, offset };
    offset += frac * circ;
    return seg;
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#F1F5F9" strokeWidth={thickness} />
          {segments.map((s, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={s.tone}
              strokeWidth={thickness}
              strokeDasharray={`${s.dash} ${circ - s.dash}`}
              strokeDashoffset={-s.offset}
              strokeLinecap="round"
            >
              <title>{`${s.name}: ${s.value}`}</title>
            </circle>
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-ink">{total.toLocaleString('en-IN')}</span>
          <span className="text-[10px] uppercase tracking-wide text-slate-400">{centerLabel || 'Total'}</span>
        </div>
      </div>
      <ul className="space-y-2">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.tone }} />
            <span className="text-slate-600">{d.name}</span>
            <span className="ml-auto font-semibold text-ink">{d.value.toLocaleString('en-IN')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
