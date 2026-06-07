"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useApi } from "@/lib/use-api";
import { MOCK_DASHBOARD } from "@/lib/mock-data";
import {
  Badge,
  Card,
  SectionLabel,
  StatCard,
  MilestoneStepper,
  DemoBadge,
} from "@/components/ui";
import { LineChart } from "@/components/charts";
import {
  won,
  wonEok,
  pct,
  shortHash,
  shortDateTime,
} from "@/lib/format-num";
import type { DashboardData } from "@/lib/types";
import { TX_TYPE_LABEL } from "@/lib/types";

const SIGNAL_LABEL: Record<string, string> = {
  contract: "계약서",
  receipt: "영수증",
  photo: "사진",
  iot: "IoT",
};

const TX_TONE: Record<
  keyof typeof TX_TYPE_LABEL,
  "solid" | "green" | "amber" | "gray"
> = {
  tranche_release: "solid",
  subscription: "green",
  dividend: "amber",
  revenue: "gray",
};

export default function DashboardDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, isLive } = useApi<DashboardData>(
    `/api/dashboard/${projectId}`,
    MOCK_DASHBOARD,
  );

  const { project, escrow, milestones, transactions, iot } = data;

  const totalLocked = escrow?.totalLocked ?? 0;
  const totalReleased = escrow?.totalReleased ?? 0;
  const remaining = escrow?.remaining ?? 0;
  const releasePct = totalLocked > 0 ? (totalReleased / totalLocked) * 100 : 0;

  // IoT 차트 — API가 desc로 줄 수 있으므로 오름차순 정렬
  const iotSorted = [...iot.history].sort(
    (a, b) =>
      new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
  );
  const iotLabels = iotSorted.map((r) => {
    const d = new Date(r.recordedAt);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  });
  const iotSeries = [
    {
      name: "온도 (°C)",
      color: "#2F7D4B",
      values: iotSorted.map((r) => r.temperature),
    },
    {
      name: "습도 (%)",
      color: "#F59E0B",
      values: iotSorted.map((r) => r.humidity),
    },
  ];

  const activeMs = milestones.find(
    (m) => m.status === "in_progress" || m.status === "manual_review",
  );

  return (
    <div className="bg-farm-section min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-12">

        {/* ── 헤더 ── */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {/* 그라디언트 썸네일 */}
            <div className="h-16 w-16 flex-shrink-0 rounded-2xl bg-gradient-to-br from-forest-600 to-forest-800" />
            <div>
              <SectionLabel>실시간 검증 공개</SectionLabel>
              <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 md:text-3xl">
                {project.name} 투명성 대시보드
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                {project.location ?? "위치 미정"} &middot;{" "}
                {project.buildingType ?? ""}
              </p>
              <div className="mt-2">
                <DemoBadge isLive={isLive} />
              </div>
            </div>
          </div>
          <Link
            href="/projects"
            className="self-start rounded-full border border-ink-900/15 bg-white px-4 py-2 text-xs font-bold text-ink-700 transition-colors hover:bg-cream-200"
          >
            프로젝트 보기
          </Link>
        </div>

        {/* ── 통계 4카드 ── */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <StatCard
            label="에스크로 잔액"
            value={wonEok(totalLocked)}
            sub={won(totalLocked)}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <StatCard
            label="집행 누계"
            value={wonEok(totalReleased)}
            sub={won(totalReleased)}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <StatCard
            label="미집행 잔액"
            value={wonEok(remaining)}
            sub={won(remaining)}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect
                  x="3"
                  y="6"
                  width="18"
                  height="13"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M3 10h18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="8" cy="15" r="1.2" fill="currentColor" />
              </svg>
            }
          />
          <StatCard
            label="집행률"
            value={pct(releasePct)}
            sub="마일스톤 검증 시 자동 집행"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M3 17l5-5 4 4 5-6 4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </div>

        {/* ── 마일스톤 진행 현황 ── */}
        <Card className="mb-6">
          <h2 className="mb-5 text-sm font-extrabold text-ink-900">
            마일스톤 진행 현황
          </h2>
          <MilestoneStepper milestones={milestones} />
          {activeMs && (
            <div className="mt-6 border-t border-line pt-5">
              <p className="mb-2 text-xs font-bold text-ink-500">
                현재 검증 조건 — {activeMs.name}
              </p>
              {activeMs.conditionText && (
                <p className="mb-3 text-sm text-ink-700">
                  {activeMs.conditionText}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {activeMs.requiredSignals.map((sig) => (
                  <Badge key={sig} tone="gray">
                    {SIGNAL_LABEL[sig] ?? sig}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* ── 온체인 자금 흐름 ── */}
        <Card className="mb-6">
          <h2 className="mb-6 text-sm font-extrabold text-ink-900">
            온체인 자금 흐름
          </h2>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {/* 투자자 노드 */}
            <div className="flex flex-col items-center rounded-2xl border border-line bg-cream-50 px-5 py-4 text-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="mb-1 text-ink-500">
                <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M3.5 19c.8-3 3-4.5 5.5-4.5S13.7 16 14.5 19"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M16 14.6c2.4.2 4 1.6 4.6 4.4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-xs font-bold text-ink-700">
                투자자 {data.tokenHoldersCount}명
              </p>
              <p className="mt-0.5 text-xs text-ink-400">{wonEok(totalLocked)}</p>
            </div>

            {/* 화살표 */}
            <svg width="24" height="16" viewBox="0 0 24 16" fill="none" aria-hidden className="rotate-90 sm:rotate-0 flex-shrink-0">
              <path
                d="M2 8h18M16 3l6 5-6 5"
                stroke="#9CAA97"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Escrow 노드 */}
            <div className="flex flex-col items-center rounded-2xl border-2 border-forest-300 bg-forest-50 px-5 py-4 text-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="mb-1 text-forest-600">
                <path
                  d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-xs font-bold text-forest-700">Escrow</p>
              <p className="mt-0.5 text-xs font-bold text-forest-600">
                {wonEok(remaining)} 잠금
              </p>
              <p className="mt-1 text-[10px] text-ink-400 font-mono">
                {escrow?.contractAddress
                  ? shortHash(escrow.contractAddress)
                  : "Amoy 배포 예정"}
              </p>
            </div>

            {/* 화살표 */}
            <svg width="24" height="16" viewBox="0 0 24 16" fill="none" aria-hidden className="rotate-90 sm:rotate-0 flex-shrink-0">
              <path
                d="M2 8h18M16 3l6 5-6 5"
                stroke="#9CAA97"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* 트랜치 집행 노드 */}
            <div className="flex flex-col items-center rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="mb-1 text-amber-600">
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-xs font-bold text-amber-700">트랜치 집행</p>
              <p className="mt-0.5 text-xs text-amber-600">
                {wonEok(totalReleased)} 집행 누계
              </p>
            </div>

            {/* 화살표 */}
            <svg width="24" height="16" viewBox="0 0 24 16" fill="none" aria-hidden className="rotate-90 sm:rotate-0 flex-shrink-0">
              <path
                d="M2 8h18M16 3l6 5-6 5"
                stroke="#9CAA97"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* 시공·운영사 노드 */}
            <div className="flex flex-col items-center rounded-2xl border border-line bg-cream-50 px-5 py-4 text-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="mb-1 text-ink-500">
                <path
                  d="M4 21V8l8-5 8 5v13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 21v-6h6v6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-xs font-bold text-ink-700">시공·운영사</p>
              <p className="mt-0.5 text-xs text-ink-400">검증 후 수령</p>
            </div>
          </div>
        </Card>

        {/* ── 2단 그리드: IoT + 거래 로그 ── */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">

          {/* IoT 운영 데이터 */}
          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-extrabold text-ink-900">
                IoT 운영 데이터
              </h2>
              {iot.latest && (
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-cream-100 px-2.5 py-0.5 text-xs font-semibold text-ink-700">
                    온도 {iot.latest.temperature}°C
                  </span>
                  <span className="rounded-full bg-cream-100 px-2.5 py-0.5 text-xs font-semibold text-ink-700">
                    습도 {iot.latest.humidity}%
                  </span>
                  <span className="rounded-full bg-cream-100 px-2.5 py-0.5 text-xs font-semibold text-ink-700">
                    CO₂ {iot.latest.co2Level}ppm
                  </span>
                  <span className="rounded-full bg-cream-100 px-2.5 py-0.5 text-xs font-semibold text-ink-700">
                    pH {iot.latest.phLevel}
                  </span>
                </div>
              )}
            </div>
            {iotSorted.length > 0 ? (
              <LineChart
                series={iotSeries}
                labels={iotLabels}
                height={180}
              />
            ) : (
              <div className="flex h-44 items-center justify-center rounded-2xl bg-cream-50 text-sm text-ink-400">
                IoT 데이터 없음
              </div>
            )}
          </Card>

          {/* 최근 검증 로그 */}
          <Card>
            <h2 className="mb-4 text-sm font-extrabold text-ink-900">
              최근 검증 로그
            </h2>
            <div className="space-y-3">
              {transactions.slice(0, 8).map((tx) => (
                <div
                  key={tx.id}
                  className="flex flex-col gap-1 border-b border-line pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone={TX_TONE[tx.type]}>
                      {TX_TYPE_LABEL[tx.type]}
                    </Badge>
                    <span className="text-xs font-bold text-ink-900">
                      {won(tx.amount)}
                    </span>
                  </div>
                  {tx.memo && (
                    <p className="text-xs text-ink-600">{tx.memo}</p>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-ink-400">
                      {shortHash(tx.txHash)}
                    </span>
                    {/* 서버(UTC)와 브라우저(KST) 타임존 차이로 인한 hydration 경고 방지 */}
                    <span className="text-[11px] text-ink-400" suppressHydrationWarning>
                      {shortDateTime(tx.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="py-8 text-center text-sm text-ink-400">
                  거래 내역 없음
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
