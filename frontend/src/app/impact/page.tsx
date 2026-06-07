"use client";

import Link from "next/link";
import { MOCK_MONTHLY_HARVEST, MOCK_ESG_SUMMARY } from "@/lib/mock-data";
import { Card, SectionLabel, StatCard, Badge } from "@/components/ui";
import { BarChart, Donut } from "@/components/charts";

/* ── 파이프라인 단계 정의 ── */
const PIPELINE_STEPS = [
  {
    title: "IoT 센서 수집",
    desc: "온도·습도·CO₂·광량을 30분 간격으로 자동 기록",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M14 17.5h7M17.5 14v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "AI 이상 탐지",
    desc: "센서 이상값을 실시간 감지해 운영자에게 알림 발송",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3l9 16H3L12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="17" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "수확·출하 기록",
    desc: "수확량과 출하 내역을 자동 집계해 매출 데이터로 연동",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 6h16M4 10h16M4 14h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="17" cy="17" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 17l.8.8L18.5 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "배당 정산 반영",
    desc: "검증된 매출 데이터가 스마트컨트랙트 배당 계산에 자동 반영",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7v2.5M12 14.5V17M9.5 10.5C9.5 9.4 10.6 8.5 12 8.5s2.5.9 2.5 2-.9 1.8-2.5 2c-1.6.2-2.5 1-2.5 2s1.1 2 2.5 2 2.5-.9 2.5-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

/* ── 아이콘 정의 ── */
const HarvestIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 21c0-5 0-7.5 3.5-10C18.5 9 19.5 6.5 19.5 5c-2.5 0-5.5.5-7.5 2.5S9.5 12.5 9.5 16"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M12 21c0-3-.7-5-2.5-6.7C7.7 12.6 6 12.2 4.5 12.2c.3 1.3 1 3 2.4 4.4C8.3 18 10 18.8 12 18.8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const RevenueIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M12 7v2.5M12 14.5V17M9.5 10.5C9.5 9.4 10.6 8.5 12 8.5s2.5.9 2.5 2-.9 1.8-2.5 2c-1.6.2-2.5 1-2.5 2s1.1 2 2.5 2 2.5-.9 2.5-2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const FoodMileIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 3c0 0-4 4-4 9s4 9 4 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M3 12h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 3c0 0 4 4 4 9s-4 9-4 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const CO2Icon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 3C8.5 3 5 5.5 4 9c-1.5 1-2 2.5-2 4 0 3 2.5 5 5.5 5h9c2.5 0 4.5-2 4.5-4.5 0-2-1.3-3.7-3-4.3C17.5 5.5 15 3 12 3z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── 차트 데이터 변환 ── */
const chartData = MOCK_MONTHLY_HARVEST.map((d) => ({
  label: d.month,
  bar: d.harvestKg,
  line: d.revenueManwon,
}));

export default function ImpactPage() {
  const esg = MOCK_ESG_SUMMARY;

  return (
    <div className="bg-farm-section min-h-screen">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-14">

        {/* ── 상단 헤더 ── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <SectionLabel>운영 데이터 · ESG</SectionLabel>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.2] tracking-tight text-ink-900 md:text-5xl">
              수확 데이터와 ESG 임팩트를
              <br />
              함께 추적합니다.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-500">
              농산물 매출 같은 재무 수치와 CO₂ 절감·푸드마일 같은 환경 수치를
              같은 대시보드에서 확인하고, 투자 성과와 ESG 임팩트를 동시에 검증합니다.
            </p>
          </div>

          {/* 프로젝트 범위 셀렉트 */}
          <div className="mt-1 shrink-0">
            <select
              className="cursor-pointer appearance-none rounded-full border border-line bg-white py-2 pl-4 pr-8 text-sm font-semibold text-ink-700 shadow-card focus:outline-none focus:ring-2 focus:ring-forest-400"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7268' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
              }}
            >
              <option>부산 파일럿 전체 · 3개 팜</option>
            </select>
          </div>
        </div>

        {/* ── 통계 4카드 ── */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <StatCard
            icon={HarvestIcon}
            label="누적 수확량"
            value={`${esg.totalHarvestTon}t`}
            sub="엽채류·허브 기준"
          />
          <StatCard
            icon={RevenueIcon}
            label="누적 매출"
            value={`₩ ${esg.totalRevenueManwon.toLocaleString("ko-KR")}만`}
            sub="직거래·구독 채널 합산"
          />
          <StatCard
            icon={FoodMileIcon}
            label="푸드마일 절감"
            value={`${esg.foodMileKm.toLocaleString("ko-KR")}km`}
            sub="평균 유통거리 대비"
          />
          <StatCard
            icon={CO2Icon}
            label="CO₂ 절감"
            value={`${esg.co2ReductionTon}t`}
            sub="운송·콜드체인 감축분"
          />
        </div>

        {/* ── 월별 수확량과 매출 BarChart ── */}
        <div className="mt-6">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-extrabold text-ink-900">
                월별 수확량과 매출
              </h2>
              <Badge tone="gray">2026년 · 월별</Badge>
            </div>
            <div className="mt-5">
              <BarChart
                data={chartData}
                height={220}
                barColor="#2F7D4B"
                lineColor="#F59E0B"
                barLabel="수확량(kg)"
                lineLabel="매출(만원)"
              />
            </div>
          </Card>
        </div>

        {/* ── 2단 그리드: 파이프라인 + 운영비 도넛 ── */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">

          {/* 운영 데이터 파이프라인 */}
          <Card>
            <h2 className="text-base font-extrabold text-ink-900">
              운영 데이터 파이프라인
            </h2>
            <p className="mt-1 text-xs text-ink-400">
              IoT 수집부터 배당 정산까지 자동화된 4단계 흐름
            </p>

            {/* 모바일: 세로, 데스크톱: 가로 */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-0">
              {PIPELINE_STEPS.map((step, i) => (
                <div key={step.title} className="flex sm:flex-1 sm:flex-col sm:items-center">
                  {/* 단계 박스 */}
                  <div className="flex flex-1 items-start gap-3 rounded-2xl border border-line bg-cream-50 p-4 sm:flex-col sm:items-center sm:text-center">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-600">
                      {step.icon}
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-ink-900">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-400">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* 화살표 — 모바일: 아래, 데스크톱: 오른쪽 */}
                  {i < PIPELINE_STEPS.length - 1 && (
                    <>
                      {/* 모바일 화살표 (아래) */}
                      <div className="flex justify-start pl-5 py-1 sm:hidden">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path d="M8 2v10M4 8l4 4 4-4" stroke="#8B9088" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      {/* 데스크톱 화살표 (오른쪽) */}
                      <div className="hidden shrink-0 items-center justify-center px-1 pt-5 sm:flex">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path d="M2 8h10M8 4l4 4-4 4" stroke="#8B9088" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* 운영 효율 도넛 */}
          <Card>
            <h2 className="text-base font-extrabold text-ink-900">운영 효율</h2>
            <p className="mt-1 text-xs text-ink-400">매출 대비 운영비 비율</p>

            <div className="mt-6 flex flex-col items-center">
              <Donut
                percent={esg.opexRatioPct}
                size={140}
                color="#2F7D4B"
                track="#EFEDE2"
                label="운영비 비율"
              />
            </div>

            <div className="mt-5 space-y-2 text-sm text-ink-500 leading-relaxed">
              <p>
                매출 대비 운영비는{" "}
                <span className="font-extrabold text-ink-900">
                  {esg.opexRatioPct}%
                </span>
                 로 집계됩니다.
              </p>
              <p>
                나머지{" "}
                <span className="font-extrabold text-ink-900">
                  {100 - esg.opexRatioPct}%
                </span>
                는 임대료 회수와 토큰 홀더 배당의 재원이 됩니다.
              </p>
              <p className="text-xs text-ink-400">
                전기·인건비·소모품 포함 기준 (부산 파일럿 3개 팜 평균)
              </p>
            </div>

            {/* 범례 */}
            <div className="mt-4 flex gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-ink-500">
                <span className="h-2.5 w-2.5 rounded-sm bg-forest-500" />
                운영비 {esg.opexRatioPct}%
              </span>
              <span className="flex items-center gap-1.5 text-ink-500">
                <span className="h-2.5 w-2.5 rounded-sm bg-cream-200" />
                임대·배당 재원 {100 - esg.opexRatioPct}%
              </span>
            </div>
          </Card>
        </div>

        {/* ── 하단 투명성 배너 ── */}
        <div className="mt-6">
          <Card className="bg-forest-800 border-forest-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-forest-700 text-forest-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p className="text-sm leading-relaxed text-forest-100">
                  탄소크레딧 연계 수익은 파일럿 검증 후 회계 기준을 공개합니다.
                  현재 수치는 운송 거리 절감과 냉장 유통 최소화에 기반한 추정치입니다.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-forest-800 transition-colors hover:bg-cream-100"
              >
                투명성 대시보드 보기
              </Link>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
