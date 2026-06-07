/* 의존성 없는 경량 SVG 차트 — 시안 04(IoT 라인), 05(월별 막대, 도넛) */

type Series = { name: string; color: string; values: number[] };

function scale(values: number[], min: number, max: number, size: number) {
  const range = max - min || 1;
  return values.map((v) => size - ((v - min) / range) * size);
}

export function LineChart({
  series,
  labels,
  height = 180,
}: {
  series: Series[];
  labels?: string[];
  height?: number;
}) {
  const width = 640;
  const pad = 8;
  const n = Math.max(...series.map((s) => s.values.length));
  const stepX = (width - pad * 2) / Math.max(1, n - 1);

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label="라인 차트"
      >
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={pad}
            x2={width - pad}
            y1={height * t}
            y2={height * t}
            stroke="#E6E3D6"
            strokeDasharray="3 5"
          />
        ))}
        {series.map((s) => {
          // 단위가 다른 시리즈(온도/습도 등)를 겹쳐 보이도록 시리즈별 정규화
          const ys = scale(
            s.values,
            Math.min(...s.values),
            Math.max(...s.values),
            height - pad * 2,
          );
          const d = ys
            .map(
              (y, i) => `${i === 0 ? "M" : "L"}${pad + i * stepX},${pad + y}`,
            )
            .join(" ");
          return (
            <path
              key={s.name}
              d={d}
              fill="none"
              stroke={s.color}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-1.5 text-xs text-ink-500">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
        {labels && labels.length > 0 && (
          <span className="ml-auto text-[11px] text-ink-400">
            {labels[0]} ~ {labels[labels.length - 1]}
          </span>
        )}
      </div>
    </div>
  );
}

export function BarChart({
  data,
  height = 200,
  barColor = "#2F7D4B",
  lineColor = "#F59E0B",
  barLabel,
  lineLabel,
}: {
  data: { label: string; bar: number; line?: number }[];
  height?: number;
  barColor?: string;
  lineColor?: string;
  barLabel?: string;
  lineLabel?: string;
}) {
  const width = 640;
  const padB = 24;
  const chartH = height - padB;
  const maxBar = Math.max(...data.map((d) => d.bar)) || 1;
  const hasLine = data.some((d) => d.line !== undefined);
  const maxLine = hasLine
    ? Math.max(...data.map((d) => d.line ?? 0)) || 1
    : 1;
  const slot = width / data.length;
  const barW = Math.min(28, slot * 0.45);

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label="막대 차트"
      >
        {data.map((d, i) => {
          const h = (d.bar / maxBar) * (chartH - 12);
          const x = slot * i + (slot - barW) / 2;
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={chartH - h}
                width={barW}
                height={h}
                rx={6}
                fill={barColor}
                opacity={0.92}
              />
              <text
                x={slot * i + slot / 2}
                y={height - 8}
                textAnchor="middle"
                fontSize="11"
                fill="#8B9088"
              >
                {d.label}
              </text>
            </g>
          );
        })}
        {hasLine && (
          <path
            d={data
              .map((d, i) => {
                const y = chartH - ((d.line ?? 0) / maxLine) * (chartH - 12);
                return `${i === 0 ? "M" : "L"}${slot * i + slot / 2},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke={lineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      {(barLabel || lineLabel) && (
        <div className="mt-2 flex items-center gap-4 text-xs text-ink-500">
          {barLabel && (
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm" style={{ background: barColor }} />
              {barLabel}
            </span>
          )}
          {lineLabel && (
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-3 rounded-full" style={{ background: lineColor }} />
              {lineLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function Donut({
  percent,
  size = 120,
  color = "#2F7D4B",
  track = "#EFEDE2",
  label,
}: {
  percent: number;
  size?: number;
  color?: string;
  track?: string;
  label?: string;
}) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox="0 0 110 110" role="img" aria-label={label ?? "도넛 차트"}>
        <circle cx="55" cy="55" r={r} fill="none" stroke={track} strokeWidth="12" />
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(clamped / 100) * c} ${c}`}
          transform="rotate(-90 55 55)"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-xl font-extrabold text-ink-900">{Math.round(clamped)}%</p>
        {label && <p className="text-[10px] text-ink-400">{label}</p>}
      </div>
    </div>
  );
}
