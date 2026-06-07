"use client";

import { useState, useMemo } from "react";
import { useApi } from "@/lib/use-api";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { won, num } from "@/lib/format-num";
import { Badge, Card, SectionLabel } from "@/components/ui";
import type { Project } from "@/lib/types";

/* ── 프로세스 5단계 ── */
const STEPS = [
  {
    num: 1,
    title: "프로젝트 선택",
    desc: "위치·운영사·예상 품목을 확인하고 투자할 미니팜을 고릅니다.",
  },
  {
    num: 2,
    title: "토큰 청약",
    desc: "1주 5,000원부터 원하는 금액만큼 소액으로 참여합니다.",
  },
  {
    num: 3,
    title: "에스크로 적립",
    desc: "청약금 전액이 스마트컨트랙트에 자동으로 잠깁니다.",
  },
  {
    num: 4,
    title: "마일스톤 검증",
    desc: "AI가 계약서·영수증·사진·IoT 데이터를 교차 검증합니다.",
  },
  {
    num: 5,
    title: "수익 분배",
    desc: "출하 매출 정산 후 보유 토큰 비율로 배당금이 지급됩니다.",
  },
];

/* ── 스마트컨트랙트 3카드 ── */
const CONTRACTS = [
  {
    title: "FarmToken",
    desc: "프로젝트별로 발행되는 수익 분배 토큰입니다. 보유 비율에 따라 배당과 청산 매출을 받습니다.",
    tags: ["ERC-20", "Polygon Amoy", "온체인 공개"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M9 8h4.5a2 2 0 0 1 0 4H9m0 0h5a2 2 0 0 1 0 4H9m0-8v8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Escrow",
    desc: "마일스톤 검증 전까지 자금을 잠그는 금고입니다. 각 단계가 검증되면 트랜치 단위로 집행됩니다.",
    tags: ["트랜치 집행", "Polygon Amoy", "감사 가능"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="3"
          y="11"
          width="18"
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M7 11V7a5 5 0 0 1 10 0v4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Vesting",
    desc: "운영사 보수를 성과 달성에 따라 분할 지급합니다. 마일스톤 미달성 시 보수가 자동 동결됩니다.",
    tags: ["성과 연동", "Polygon Amoy", "온체인 공개"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3v1m0 16v1M4.22 4.22l.7.7m13.16 13.16.7.7M3 12h1m16 0h1M4.92 19.78l.7-.7M18.38 5.62l.7-.7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
];

/* ── 청약 결과 타입 ── */
interface SubscribeResult {
  simulated: boolean;
  tokenAmount: number;
  amount: number;
  projectName: string;
}

export default function InvestPage() {
  /* 프로젝트 목록 */
  const { data: projects } = useApi<Project[]>(
    "/api/projects",
    MOCK_PROJECTS,
    (json) => {
      const list = (json as { projects?: Project[] }).projects;
      return list && list.length > 0 ? list : null;
    },
  );

  /* 시뮬레이터 상태 */
  const [selectedId, setSelectedId] = useState<string>(
    MOCK_PROJECTS[0]?.id ?? "",
  );
  const [amount, setAmount] = useState<number>(250000);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubscribeResult | null>(null);

  const selectedProject =
    projects.find((p) => p.id === selectedId) ?? projects[0];

  const tokenPrice = selectedProject?.tokenPrice ?? 5000;
  const estimatedTokens = Math.floor(amount / tokenPrice);

  /* 프로젝트 select 변경 시 결과 초기화 */
  function handleProjectChange(id: string) {
    setSelectedId(id);
    setResult(null);
  }

  /* 금액 입력 변경 시 결과 초기화 */
  function handleAmountChange(val: number) {
    setAmount(val);
    setResult(null);
  }

  /* 청약 신청 */
  async function handleSubscribe() {
    if (!selectedProject || estimatedTokens <= 0) return;
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo-user",
          projectId: selectedProject.id,
          tokenAmount: estimatedTokens,
        }),
      });

      if (res.ok) {
        setResult({
          simulated: false,
          tokenAmount: estimatedTokens,
          amount,
          projectName: selectedProject.name,
        });
      } else {
        throw new Error("api_error");
      }
    } catch {
      /* graceful fallback — 데모 모드 */
      setResult({
        simulated: true,
        tokenAmount: estimatedTokens,
        amount,
        projectName: selectedProject.name,
      });
    } finally {
      setSubmitting(false);
    }
  }

  /* 에스크로 잠금 예정액 = amount (전액 잠김) */
  const escrowAmount = useMemo(() => amount, [amount]);

  return (
    <div className="bg-farm-section">
      {/* ── 상단 헤더 ── */}
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-14">
        <SectionLabel>소액 청약과 자금 보호</SectionLabel>
        <h1 className="mt-1 text-balance text-4xl font-extrabold leading-[1.18] tracking-tight text-ink-900 md:text-5xl">
          청약금은 먼저 잠기고,
          <br />
          검증된 단계에서만 풀립니다.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-500">
          VC가 단계별로 집행하는 방식을 코드로 자동화했습니다.
          <br />
          AI 검증을 통과한 마일스톤에서만 자금이 풀려 운영사에 전달됩니다.
        </p>
      </section>

      {/* ── 본문 2단 ── */}
      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 lg:grid-cols-[1fr_420px]">
        {/* 좌측: 프로세스 5단계 */}
        <div>
          <h2 className="mb-8 text-xl font-extrabold text-ink-900">
            청약부터 수익까지 5단계
          </h2>
          <ol className="relative space-y-0">
            {STEPS.map((step, i) => (
              <li key={step.num} className="relative flex gap-5 pb-8 last:pb-0">
                {/* 세로 연결선 */}
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 bg-line"
                  />
                )}
                {/* 번호 원형 배지 */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-800 text-sm font-extrabold text-white shadow-card">
                  {step.num}
                </div>
                {/* 텍스트 */}
                <div className="pt-1.5">
                  <p className="text-base font-extrabold text-ink-900">
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* 우측: 청약 시뮬레이터 */}
        <Card className="h-fit">
          <h2 className="mb-5 text-lg font-extrabold text-ink-900">
            청약 시뮬레이터
          </h2>

          {/* 프로젝트 선택 */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold text-ink-500">
              프로젝트
            </label>
            <select
              value={selectedId}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="w-full rounded-xl border border-line bg-cream-50 px-3 py-2.5 text-sm font-semibold text-ink-900 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* 선택된 프로젝트 요약 */}
          {selectedProject && (
            <div className="mb-4 flex items-center justify-between rounded-xl bg-cream-100 px-4 py-3 text-xs">
              <div>
                <p className="font-bold text-ink-900">{selectedProject.name}</p>
                <p className="mt-0.5 text-ink-500">
                  {selectedProject.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-ink-400">토큰 단가</p>
                <p className="mt-0.5 font-extrabold text-forest-700">
                  {won(tokenPrice)} / 주
                </p>
              </div>
            </div>
          )}

          {/* 청약 금액 입력 */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold text-ink-500">
              청약 금액 (원)
            </label>
            <div className="relative">
              <input
                type="number"
                min={tokenPrice}
                step={tokenPrice}
                value={amount}
                onChange={(e) =>
                  handleAmountChange(Math.max(0, Number(e.target.value)))
                }
                className="w-full rounded-xl border border-line bg-white px-3 py-2.5 pr-24 text-sm font-semibold text-ink-900 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-forest-600">
                {estimatedTokens > 0 ? `≈ ${num(estimatedTokens)} FARM` : "—"}
              </span>
            </div>
          </div>

          {/* 읽기 전용 요약 행 */}
          <div className="mb-5 space-y-2 rounded-xl border border-line bg-cream-50 px-4 py-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-ink-500">예상 토큰 수량</span>
              <span className="font-extrabold text-ink-900">
                {num(estimatedTokens)} FARM
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-2">
              <span className="text-ink-500">연결 지갑</span>
              <span className="font-semibold text-ink-700">
                0x12…9F{" "}
                <span className="font-normal text-ink-400">(데모 지갑)</span>
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-2">
              <span className="text-ink-500">에스크로 잠금 예정액</span>
              <span className="font-extrabold text-forest-700">
                {won(escrowAmount)}
              </span>
            </div>
          </div>

          {/* 청약 신청 버튼 */}
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={submitting || estimatedTokens <= 0}
            className="w-full rounded-2xl bg-forest-800 py-3.5 text-sm font-extrabold text-white shadow-card transition-colors hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "처리 중…" : "청약 신청하기"}
          </button>

          {/* 결과 박스 */}
          {result && (
            <div className="mt-4 rounded-xl border border-forest-100 bg-forest-50 px-4 py-3 text-sm">
              {result.simulated ? (
                <>
                  <p className="font-extrabold text-forest-700">
                    데모 모드: 청약이 시뮬레이션되었습니다
                  </p>
                  <p className="mt-1 text-xs text-forest-600">
                    {result.projectName}에 {won(result.amount)} 청약 /{" "}
                    {num(result.tokenAmount)} FARM 예정
                  </p>
                </>
              ) : (
                <>
                  <p className="font-extrabold text-forest-700">
                    청약이 완료되었습니다
                  </p>
                  <p className="mt-1 text-xs text-forest-600">
                    {result.projectName}에 {won(result.amount)} /{" "}
                    {num(result.tokenAmount)} FARM 청약
                  </p>
                </>
              )}
            </div>
          )}

          {/* 안내문 */}
          <p className="mt-4 text-[11px] leading-relaxed text-ink-400">
            이 화면은 해커톤 데모용으로, 실제 증권 청약이나 금융 투자 권유가
            아닙니다. 온체인 트랜잭션은 Polygon Amoy 테스트넷 배포 후 활성화될
            예정입니다.
          </p>
        </Card>
      </section>

      {/* ── 스마트컨트랙트 3카드 ── */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="mb-6 text-xl font-extrabold text-ink-900">
          온체인 컨트랙트 구조
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {CONTRACTS.map((c) => (
            <Card key={c.title} className="p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-50 text-forest-600">
                {c.icon}
              </div>
              <h3 className="text-base font-extrabold text-ink-900">
                {c.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                {c.desc}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.tags.map((tag) => (
                  <Badge key={tag} tone="gray">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
