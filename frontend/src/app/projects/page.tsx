"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useApi } from "@/lib/use-api";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { won, pct, num } from "@/lib/format-num";
import {
  Badge,
  Card,
  ProgressBar,
  SectionLabel,
} from "@/components/ui";
import type { Project } from "@/lib/types";
import { PROJECT_STATUS_LABEL } from "@/lib/types";

/* ── 지역 필터 칩 ── */
const REGION_CHIPS = ["부산 전역", "금정구", "영도구", "중구"] as const;
type RegionChip = (typeof REGION_CHIPS)[number];

/* ── 상태 필터 칩 ── */
const STATUS_CHIPS = [
  { label: "전체", value: null },
  { label: "청약중", value: "funding" as Project["status"] },
  { label: "운영중", value: "operating" as Project["status"] },
] as const;
type StatusValue = (typeof STATUS_CHIPS)[number]["value"];

/* ── 마감일 포맷 ── */
function formatDeadline(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/* ── 체크리스트 아이콘 ── */
function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="mt-0.5 shrink-0 text-forest-600"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 8.3L7 10.5L11 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── 검색 아이콘 ── */
function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-ink-400"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16.5 16.5L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── 위치 아이콘 ── */
function LocationIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 text-ink-400"
    >
      <path
        d="M12 2C8.69 2 6 4.69 6 8c0 5 6 13 6 13s6-8 6-13c0-3.31-2.69-6-6-6z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/* ── 확인할 항목 데이터 ── */
const CHECKLIST_ITEMS = [
  {
    title: "에스크로 적립 현황",
    desc: "청약금 전액이 에스크로에 잠겨 있는지 확인하세요.",
  },
  {
    title: "다음 마일스톤 조건",
    desc: "AI 검증 통과 조건과 필요 서류를 미리 파악하세요.",
  },
  {
    title: "운영사 트랙레코드",
    desc: "이전 프로젝트 완료율과 마일스톤 이행 내역을 살펴보세요.",
  },
  {
    title: "예상 수확 품목·매출",
    desc: "재배 품목, 예상 수확량, 분기별 매출 예측을 검토하세요.",
  },
];

/* ── 프로젝트 카드 ── */
function ProjectCard({ project }: { project: Project }) {
  const fundingPercent =
    project.fundingPercent ??
    (project.targetAmount
      ? (project.currentAmount / project.targetAmount) * 100
      : 0);

  const badgeTone: "solid" | "green" | "amber" | "gray" =
    project.status === "funding"
      ? "solid"
      : project.status === "operating"
        ? "green"
        : project.status === "funded"
          ? "amber"
          : "gray";

  return (
    <Link
      href={`/dashboard/${project.id}`}
      className="group block rounded-2.5xl border border-line bg-white shadow-card transition-shadow hover:shadow-hero focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
    >
      {/* 썸네일 영역 */}
      <div className="relative overflow-hidden rounded-t-2.5xl bg-gradient-to-br from-forest-600 to-forest-800 px-5 py-6">
        <div className="flex items-end justify-between">
          <div>
            {project.areaSqm && (
              <p className="text-xs font-semibold text-forest-200">
                {project.areaSqm}m²
              </p>
            )}
            <p className="mt-1 text-lg font-extrabold tracking-tight text-white">
              {project.tokenSymbol}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-forest-300">토큰 단가</p>
            <p className="mt-0.5 text-sm font-bold text-white">
              {won(project.tokenPrice)}
            </p>
          </div>
        </div>
        {/* 장식용 원 */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/5"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-4 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-white/5"
        />
      </div>

      {/* 카드 본문 */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-extrabold leading-tight text-ink-900 group-hover:text-forest-700">
            {project.name}
          </h3>
          <Badge tone={badgeTone}>
            {PROJECT_STATUS_LABEL[project.status]}
          </Badge>
        </div>

        <div className="mt-1.5 flex items-center gap-1">
          <LocationIcon />
          <p className="text-xs text-ink-500">{project.location ?? "—"}</p>
        </div>

        {/* 청약 진행률 */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-ink-700">청약 진행률</span>
            <span className="font-extrabold text-forest-600">
              {pct(fundingPercent)}
            </span>
          </div>
          <ProgressBar percent={fundingPercent} className="mt-1.5" />
        </div>

        {/* 메타 정보 */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-cream-50 px-2 py-2.5">
            <p className="text-[10px] text-ink-400">목표 금액</p>
            <p className="mt-0.5 text-xs font-bold text-ink-900">
              {project.targetAmount >= 100_000_000
                ? `${(project.targetAmount / 100_000_000).toFixed(1).replace(/\.0$/, "")}억`
                : `${Math.round(project.targetAmount / 10_000).toLocaleString("ko-KR")}만`}
            </p>
          </div>
          <div className="rounded-xl bg-cream-50 px-2 py-2.5">
            <p className="text-[10px] text-ink-400">투자자</p>
            <p className="mt-0.5 text-xs font-bold text-ink-900">
              {num(project.investorCount ?? 0)}명
            </p>
          </div>
          <div className="rounded-xl bg-cream-50 px-2 py-2.5">
            <p className="text-[10px] text-ink-400">마감일</p>
            <p className="mt-0.5 text-xs font-bold text-ink-900">
              {project.fundingEnd ? formatDeadline(project.fundingEnd) : "—"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── 페이지 ── */
export default function ProjectsPage() {
  const { data: projects } = useApi<Project[]>(
    "/api/projects",
    MOCK_PROJECTS,
    (json) => {
      const l = (json as { projects?: Project[] }).projects;
      return l && l.length > 0 ? l : null;
    },
  );

  const [region, setRegion] = useState<RegionChip>("부산 전역");
  const [status, setStatus] = useState<StatusValue>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchRegion =
        region === "부산 전역" || (p.location ?? "").includes(region);
      const matchStatus = status === null || p.status === status;
      const matchSearch =
        search.trim() === "" ||
        p.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchRegion && matchStatus && matchSearch;
    });
  }, [projects, region, status, search]);

  return (
    <div className="bg-farm-section min-h-screen">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-14">
        {/* ── 상단 헤더 ── */}
        <div className="mb-8">
          <SectionLabel>프로젝트 둘러보기</SectionLabel>
          <h1 className="text-balance text-3xl font-extrabold leading-[1.2] tracking-tight text-ink-900 md:text-4xl">
            투자 가능한 미니팜을 비교하세요.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-500">
            공실 위치, 청약률, 마일스톤 상태, 예상 수확 품목을 기준으로
            살펴보세요.
          </p>
        </div>

        {/* ── 필터 바 ── */}
        <div className="mb-7 flex flex-wrap items-center gap-3">
          {/* 지역 칩 */}
          <div className="flex flex-wrap gap-1.5">
            {REGION_CHIPS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  region === r
                    ? "border-forest-700 bg-forest-700 text-white"
                    : "border-line bg-white text-ink-700 hover:border-forest-300 hover:text-forest-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* 구분선 */}
          <div className="hidden h-5 w-px bg-line sm:block" aria-hidden />

          {/* 상태 칩 */}
          <div className="flex flex-wrap gap-1.5">
            {STATUS_CHIPS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setStatus(s.value)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  status === s.value
                    ? "border-forest-700 bg-forest-700 text-white"
                    : "border-line bg-white text-ink-700 hover:border-forest-300 hover:text-forest-700"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* 검색 인풋 (오른쪽 정렬) */}
          <div className="relative ml-auto">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="프로젝트명 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-52 rounded-full border border-line bg-white py-2 pl-8 pr-4 text-xs text-ink-900 placeholder:text-ink-400 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200"
            />
          </div>
        </div>

        {/* ── 본문: 카드 그리드 + 사이드바 ── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* 좌측 카드 그리드 */}
          <div>
            {filtered.length === 0 ? (
              <div className="flex min-h-[280px] items-center justify-center rounded-2.5xl border border-dashed border-line bg-white text-sm text-ink-400">
                조건에 맞는 프로젝트가 없습니다.
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {filtered.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </div>

          {/* 우측 사이드바 */}
          <aside className="space-y-4">
            <Card className="p-5">
              <h2 className="mb-4 text-sm font-extrabold text-ink-900">
                확인할 항목
              </h2>
              <ul className="space-y-4">
                {CHECKLIST_ITEMS.map((item) => (
                  <li key={item.title} className="flex items-start gap-2.5">
                    <CheckIcon />
                    <div>
                      <p className="text-xs font-bold text-ink-900">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-500">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            {/* 간단 통계 */}
            <Card className="p-5">
              <h2 className="mb-3 text-sm font-extrabold text-ink-900">
                현황 요약
              </h2>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-500">총 프로젝트</span>
                  <span className="font-bold text-ink-900">
                    {projects.length}개
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-500">청약중</span>
                  <span className="font-bold text-forest-700">
                    {projects.filter((p) => p.status === "funding").length}개
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-500">운영중</span>
                  <span className="font-bold text-forest-700">
                    {projects.filter((p) => p.status === "operating").length}개
                  </span>
                </div>
                <div className="border-t border-line pt-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-500">총 투자자</span>
                    <span className="font-bold text-ink-900">
                      {num(
                        projects.reduce(
                          (acc, p) => acc + (p.investorCount ?? 0),
                          0,
                        ),
                      )}
                      명
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </aside>
        </div>

        {/* ── 하단 에스크로 배너 ── */}
        <Card className="mt-10 flex flex-col items-start justify-between gap-5 bg-forest-800 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            {/* 방패 아이콘 */}
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
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
            <div>
              <p className="text-sm font-extrabold text-white">
                마일스톤 기반 에스크로로 투자 자금을 안전하게 보호합니다.
              </p>
              <p className="mt-1 text-xs text-forest-300">
                AI가 마일스톤을 검증한 단계에서만 자금이 집행됩니다.
              </p>
            </div>
          </div>
          <Link
            href="/invest"
            className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-forest-800 transition-colors hover:bg-cream-100"
          >
            투자 방식 자세히 보기
          </Link>
        </Card>
      </div>
    </div>
  );
}
