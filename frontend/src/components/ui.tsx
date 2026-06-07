import type { ReactNode } from "react";
import type { Milestone } from "@/lib/types";

/* ── 기본 카드 ── */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2.5xl border border-line bg-white p-6 shadow-card ${className}`}
    >
      {children}
    </div>
  );
}

/* ── 섹션 상단 작은 라벨 (시안의 초록 캡션) ── */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold tracking-wide text-forest-600">
      <span className="h-1.5 w-1.5 rounded-full bg-leaf-500" />
      {children}
    </p>
  );
}

/* ── 배지 ── */
const BADGE_TONES = {
  green: "bg-forest-50 text-forest-700 border-forest-100",
  solid: "bg-forest-700 text-white border-forest-700",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  gray: "bg-cream-200 text-ink-500 border-line",
  red: "bg-red-50 text-red-600 border-red-100",
} as const;

export function Badge({
  children,
  tone = "green",
}: {
  children: ReactNode;
  tone?: keyof typeof BADGE_TONES;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${BADGE_TONES[tone]}`}
    >
      {children}
    </span>
  );
}

/* ── 진행률 바 ── */
export function ProgressBar({
  percent,
  className = "",
}: {
  percent: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-cream-200 ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-forest-500 to-leaf-500 transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/* ── 통계 카드 ── */
export function StatCard({
  icon,
  label,
  value,
  sub,
  className = "",
}: {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-ink-500">{label}</p>
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest-50 text-forest-600">
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-ink-400">{sub}</p>}
    </Card>
  );
}

/* ── 마일스톤 스테퍼 (시안 01/04의 가로 단계 표시) ── */
export function MilestoneStepper({
  milestones,
  compact = false,
}: {
  milestones: Pick<Milestone, "seq" | "name" | "status">[];
  compact?: boolean;
}) {
  const circle = compact ? "h-7 w-7" : "h-9 w-9";
  const lineTop = compact ? "top-3.5" : "top-[18px]";
  return (
    <ol className="flex items-start">
      {milestones.map((ms, i) => {
        const done = ms.status === "completed" || ms.status === "verified";
        const active = ms.status === "in_progress" || ms.status === "manual_review";
        const failed = ms.status === "failed";
        const prevDone =
          i > 0 &&
          (milestones[i - 1].status === "completed" ||
            milestones[i - 1].status === "verified");
        return (
          <li key={ms.seq} className="relative flex flex-1 flex-col items-center">
            {i > 0 && (
              <div
                aria-hidden
                className={`absolute ${lineTop} left-[-50%] right-1/2 mx-5 h-0.5 -translate-y-1/2 rounded-full ${
                  prevDone ? "bg-forest-400" : "bg-line"
                }`}
              />
            )}
            <div
              className={`relative z-10 flex shrink-0 items-center justify-center rounded-full text-xs font-bold ${circle} ${
                done
                  ? "bg-forest-600 text-white"
                  : active
                    ? "border-2 border-leaf-500 bg-white text-forest-700"
                    : failed
                      ? "bg-red-100 text-red-600"
                      : "border border-line bg-cream-100 text-ink-400"
              }`}
            >
              {done ? (
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                ms.seq
              )}
            </div>
            <p
              className={`mt-2 text-center font-medium leading-tight ${
                compact ? "text-[11px]" : "text-xs"
              } ${done || active ? "text-ink-900" : "text-ink-400"}`}
            >
              {ms.name}
            </p>
            {active && !compact && (
              <span className="mt-1 rounded-full bg-leaf-500/15 px-2 py-0.5 text-[10px] font-bold text-forest-600">
                진행중
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ── 데모 데이터 배지 (API 미연결 시) ── */
export function DemoBadge({ isLive }: { isLive: boolean }) {
  if (isLive) return null;
  return (
    <Badge tone="amber">
      데모 데이터 — DB 연결 시 실데이터로 전환
    </Badge>
  );
}
