"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApi } from "@/lib/use-api";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { won, pct, num } from "@/lib/format-num";
import {
  Badge,
  Card,
  MilestoneStepper,
  ProgressBar,
  SectionLabel,
} from "@/components/ui";
import type { Project } from "@/lib/types";
import { PROJECT_STATUS_LABEL } from "@/lib/types";

const FEATURES = [
  {
    title: "자금 보호",
    desc: "청약금은 에스크로에 잠기고, 검증된 마일스톤에서만 단계 집행됩니다.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "공실 전환",
    desc: "도심 유휴공간을 수직형 미니팜으로 바꿔 임대료와 매출을 만듭니다.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 21V8l8-5 8 5v13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "운영사 매칭",
    desc: "검증된 스마트팜 운영사가 시공·재배·출하를 맡고 실적을 공개합니다.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.5 19c.8-3 3-4.5 5.5-4.5S13.7 16 14.5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 14.6c2.4.2 4 1.6 4.6 4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "ESG 데이터",
    desc: "수확량·푸드마일·CO₂ 절감을 측정해 투자 성과와 함께 추적합니다.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 21c0-5 0-7.5 3.5-10C18.5 9 19.5 6.5 19.5 5c-2.5 0-5.5.5-7.5 2.5S9.5 12.5 9.5 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 21c0-3-.7-5-2.5-6.7C7.7 12.6 6 12.2 4.5 12.2c.3 1.3 1 3 2.4 4.4C8.3 18 10 18.8 12 18.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Home() {
  const { data: projects } = useApi<Project[]>(
    "/api/projects",
    MOCK_PROJECTS,
    (json) => {
      const list = (json as { projects?: Project[] }).projects;
      return list && list.length > 0 ? list : null;
    },
  );

  const featured =
    projects.find((p) => p.status === "funding") ?? projects[0];
  const milestones = featured.milestones ?? [];
  const fundingPercent =
    featured.fundingPercent ??
    (featured.targetAmount
      ? (featured.currentAmount / featured.targetAmount) * 100
      : 0);
  const remaining = featured.escrow?.remaining ?? 0;
  const activeMs = milestones.find(
    (m) => m.status === "in_progress" || m.status === "manual_review",
  );
  // 빌드 시점(SSR)과 열람 시점의 날짜가 달라도 hydration mismatch가 없도록
  // D-day는 마운트 후에만 계산한다.
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  useEffect(() => {
    if (!featured.fundingEnd) {
      setDaysLeft(null);
      return;
    }
    setDaysLeft(
      Math.max(
        0,
        Math.ceil(
          (new Date(featured.fundingEnd).getTime() - Date.now()) /
            (24 * 60 * 60 * 1000),
        ),
      ),
    );
  }, [featured.fundingEnd]);

  return (
    <div className="bg-farm-hero">
      {/* ── 히어로 ── */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-14 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <SectionLabel>도심 유휴공간 스마트팜 STO 플랫폼</SectionLabel>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.15] tracking-tight text-ink-900 md:text-5xl">
            공실을 미니팜으로,
            <br />
            자금 집행은 코드로.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-500">
            소액 STO 방식으로 도심 미니팜 프로젝트에 참여하세요. 청약금은
            에스크로에 잠기고, AI가 마일스톤을 검증한 단계에서만 풀립니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="rounded-full bg-forest-800 px-6 py-3 text-sm font-bold text-white shadow-card transition-colors hover:bg-forest-700"
            >
              프로젝트 보기
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-ink-900/15 bg-white px-6 py-3 text-sm font-bold text-ink-900 transition-colors hover:bg-cream-200"
            >
              대시보드 보기
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-400">
            <span>· 토큰 1주 5,000원부터</span>
            <span>· 온체인 집행 내역 공개</span>
            <span>· IoT 운영 데이터 실시간</span>
          </div>
        </div>

        {/* 대표 프로젝트 카드 */}
        <Card className="shadow-hero">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-ink-900">
                {featured.name}
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                {featured.location} · {featured.buildingType}
              </p>
            </div>
            <Badge tone="solid">{PROJECT_STATUS_LABEL[featured.status]}</Badge>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-cream-100 p-4">
              <p className="text-xs font-semibold text-ink-500">목표 금액</p>
              <p className="mt-1 text-lg font-extrabold tracking-tight text-ink-900">
                {won(featured.targetAmount)}
              </p>
            </div>
            <div className="rounded-2xl bg-forest-50 p-4">
              <p className="text-xs font-semibold text-forest-600">
                현재 에스크로 잔액
              </p>
              <p className="mt-1 text-lg font-extrabold tracking-tight text-forest-700">
                {won(featured.currentAmount)}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-ink-700">청약 진행률</span>
              <span className="font-extrabold text-forest-600">
                {pct(fundingPercent)}
              </span>
            </div>
            <ProgressBar percent={fundingPercent} className="mt-2" />
            <div className="mt-2 flex justify-between text-xs text-ink-400">
              <span>투자자 {num(featured.investorCount ?? 0)}명</span>
              {daysLeft !== null && <span>마감까지 {daysLeft}일</span>}
            </div>
          </div>

          <div className="mt-6 border-t border-line pt-5">
            <p className="mb-4 text-xs font-bold text-ink-500">
              마일스톤 진행 현황
            </p>
            <MilestoneStepper milestones={milestones} compact />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-line bg-cream-50 px-3 py-2.5">
              <p className="text-ink-400">미집행 잔액</p>
              <p className="mt-0.5 font-bold text-ink-900">{won(remaining)}</p>
            </div>
            <div className="rounded-xl border border-line bg-cream-50 px-3 py-2.5">
              <p className="text-ink-400">현재 단계</p>
              <p className="mt-0.5 font-bold text-ink-900">
                {activeMs ? `${activeMs.name} 검증중` : "전 단계 완료"}
              </p>
            </div>
          </div>

          <Link
            href={`/dashboard/${featured.id}`}
            className="mt-5 block rounded-2xl bg-forest-700 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-forest-600"
          >
            투명성 대시보드에서 검증하기
          </Link>
        </Card>
      </section>

      {/* ── 핵심 가치 4카드 ── */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-50 text-forest-600">
                {f.icon}
              </span>
              <h3 className="mt-4 text-base font-extrabold text-ink-900">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                {f.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
