"use client";

import { useState, useRef } from "react";
import { Card, SectionLabel } from "@/components/ui";

/* ── 역할 탭 타입 ── */
type Role = "owner" | "operator" | "partner";

const ROLE_TABS: { key: Role; label: string }[] = [
  { key: "owner", label: "건물주" },
  { key: "operator", label: "운영자" },
  { key: "partner", label: "파트너·기관" },
];

const LOCATION_PLACEHOLDER: Record<Role, string> = {
  owner: "건물 주소 (예: 부산 금정구 ...)",
  operator: "소속/경력 (예: 스마트팜 재배 2년)",
  partner: "기관/회사명",
};

const LOCATION_LABEL: Record<Role, string> = {
  owner: "건물 주소",
  operator: "소속/경력",
  partner: "기관/회사명",
};

/* ── 온보딩 프로세스 5단계 ── */
const PROCESS_STEPS = [
  {
    num: 1,
    title: "공간 검토",
    desc: "위치·면적·전기/급수 조건 확인",
  },
  {
    num: 2,
    title: "수익 구조 설계",
    desc: "임대료 회수·배당 시뮬레이션",
  },
  {
    num: 3,
    title: "STO 프로젝트 개설",
    desc: "토큰 발행·에스크로 배포",
  },
  {
    num: 4,
    title: "운영 데이터 공개",
    desc: "IoT·검증 로그 대시보드 연동",
  },
  {
    num: 5,
    title: "정산·배당",
    desc: "월 매출 정산과 자동 분배",
  },
];

/* ── 하단 3카드 ── */
const BOTTOM_CARDS = [
  {
    title: "건물 등록",
    desc: "공실·옥상·지하 공간을 등록하면 수익화 가능성을 진단해드립니다.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
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
        <path
          d="M12 3v2M12 5l3 2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "운영자 지원",
    desc: "청년 창농인을 위한 시공·재배 교육과 보증 매출 구조를 제공합니다.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    ),
  },
  {
    title: "파트너십 제안",
    desc: "증권사·지자체·유통사와 파일럿 제휴를 논의합니다.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M17 8C17 5.24 14.76 3 12 3S7 5.24 7 8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M5 8h14l-1.5 9H6.5L5 8z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M10 12h4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

/* ── 공통 인풋 클래스 ── */
const INPUT_CLS =
  "w-full rounded-xl border border-line bg-cream-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-300 transition-colors";

export default function ContactPage() {
  const [role, setRole] = useState<Role>("owner");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  function handleRoleChange(r: Role) {
    setRole(r);
    setLocation("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("이름을 입력해 주세요.");
      return;
    }
    if (!contact.trim()) {
      setError("연락처(이메일 또는 전화번호)를 입력해 주세요.");
      return;
    }
    if (!agreed) {
      setError("개인정보 수집·이용 동의가 필요합니다.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  function handleReset() {
    setName("");
    setContact("");
    setLocation("");
    setMessage("");
    setAgreed(false);
    setError("");
    setSubmitted(false);
  }

  return (
    <div className="bg-farm-section min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-14">
        {/* ── 상단 헤더 ── */}
        <div className="mb-10">
          <SectionLabel>파일럿 참여 문의</SectionLabel>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.15] tracking-tight text-ink-900 md:text-5xl">
            공실, 운영자, 파트너를
            <br />
            FarmFi 파일럿으로 연결합니다.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-500">
            건물 공실, 청년 운영자 지원, STO 제휴, 지자체·기업 파일럿 문의를
            한 곳에서 받습니다.
          </p>
        </div>

        {/* ── 역할 선택 세그먼트 (모바일용 상단 배치) ── */}
        <div className="mb-8 flex gap-2 lg:hidden">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleRoleChange(tab.key)}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                role === tab.key
                  ? "bg-forest-700 text-white shadow-card"
                  : "border border-line bg-white text-ink-700 hover:bg-cream-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── 본문 2단 그리드 ── */}
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* 좌측 — 문의 폼 */}
          <div ref={formRef} id="form">
            <Card className="p-7">
              {submitted ? (
                /* 성공 상태 */
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-forest-50">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      aria-hidden
                    >
                      <circle
                        cx="16"
                        cy="16"
                        r="15"
                        stroke="#1B5731"
                        strokeWidth="2"
                      />
                      <path
                        d="M9 16.5L13.5 21L23 11"
                        stroke="#1B5731"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h2 className="text-xl font-extrabold text-ink-900">
                    문의가 접수되었습니다.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">
                    2영업일 내 회신드립니다.
                    <br />
                    추가 문의는 contact@farmfi.kr로 보내주세요.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-8 rounded-2xl border border-line bg-cream-50 px-6 py-2.5 text-sm font-bold text-ink-700 transition-colors hover:bg-cream-200"
                  >
                    다시 작성하기
                  </button>
                </div>
              ) : (
                /* 폼 상태 */
                <form onSubmit={handleSubmit} noValidate>
                  {/* 역할 세그먼트 탭 (데스크탑) */}
                  <div className="mb-6 hidden gap-2 lg:flex">
                    {ROLE_TABS.map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => handleRoleChange(tab.key)}
                        className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                          role === tab.key
                            ? "bg-forest-700 text-white shadow-card"
                            : "border border-line bg-white text-ink-700 hover:bg-cream-100"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* 이름 */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-ink-700">
                        이름
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="홍길동"
                        className={INPUT_CLS}
                      />
                    </div>

                    {/* 연락처 */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-ink-700">
                        연락처
                      </label>
                      <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="이메일 또는 전화번호"
                        className={INPUT_CLS}
                      />
                    </div>

                    {/* 소속/건물 위치 (탭별 변경) */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-ink-700">
                        {LOCATION_LABEL[role]}
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder={LOCATION_PLACEHOLDER[role]}
                        className={INPUT_CLS}
                      />
                    </div>

                    {/* 문의 내용 */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-ink-700">
                        문의 내용
                      </label>
                      <textarea
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="문의하실 내용을 자유롭게 작성해 주세요."
                        className={INPUT_CLS + " resize-none"}
                      />
                    </div>

                    {/* 개인정보 동의 */}
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-line accent-forest-700"
                      />
                      <span className="text-xs leading-relaxed text-ink-500">
                        파일럿 안내 목적의 개인정보 수집·이용에 동의합니다.
                      </span>
                    </label>

                    {/* 에러 메시지 */}
                    {error && (
                      <p className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600">
                        {error}
                      </p>
                    )}

                    {/* 제출 버튼 */}
                    <button
                      type="submit"
                      className="mt-1 w-full rounded-2xl bg-forest-800 py-3.5 text-sm font-bold text-white shadow-card transition-colors hover:bg-forest-700 active:bg-forest-900"
                    >
                      파일럿 문의 보내기
                    </button>
                  </div>
                </form>
              )}
            </Card>
          </div>

          {/* 우측 — 온보딩 프로세스 */}
          <div>
            <Card className="p-6">
              <h2 className="mb-6 text-base font-extrabold text-ink-900">
                FarmFi 파일럿 온보딩 프로세스
              </h2>
              <ol className="flex flex-col gap-5">
                {PROCESS_STEPS.map((step, i) => (
                  <li key={step.num} className="flex items-start gap-4">
                    {/* 번호 원 + 세로선 */}
                    <div className="flex flex-col items-center">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-700 text-xs font-extrabold text-white">
                        {step.num}
                      </span>
                      {i < PROCESS_STEPS.length - 1 && (
                        <div className="mt-1 h-6 w-px bg-line" aria-hidden />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className="text-sm font-extrabold text-ink-900">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-500">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </div>

        {/* ── 하단 3카드 그리드 ── */}
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {BOTTOM_CARDS.map((card) => (
            <Card key={card.title} className="p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-50 text-forest-600">
                {card.icon}
              </span>
              <h3 className="mt-4 text-base font-extrabold text-ink-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                {card.desc}
              </p>
              <a
                href="#form"
                onClick={(e) => {
                  e.preventDefault();
                  formRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-forest-600 transition-colors hover:text-forest-800"
              >
                문의하기
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
