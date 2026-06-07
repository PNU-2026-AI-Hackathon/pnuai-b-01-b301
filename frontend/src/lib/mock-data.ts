// DB 미연결 환경(데모/디자인 확인용) 폴백 데이터.
// API 호출이 실패하면 useApi 훅이 이 데이터를 대신 보여준다.
import type { DashboardData, Milestone, Project, Transaction } from "./types";

const MS = (
  projectId: string,
  seq: number,
  name: string,
  releasePct: number,
  releaseAmount: number,
  status: Milestone["status"],
  conditionText: string,
  requiredSignals: string[],
): Milestone => ({
  id: `${projectId}-ms${seq}`,
  projectId,
  seq,
  name,
  description: null,
  releasePct,
  releaseAmount,
  status,
  conditionText,
  requiredSignals,
  iotMinDays: 0,
  completedAt: status === "completed" ? "2026-05-28T10:00:00Z" : null,
});

export const MOCK_PROJECTS: Project[] = [
  {
    id: "demo-busandae",
    name: "부산대 앞 미니팜",
    description: "부산대학교 정문 인근 공실 1층을 수직형 스마트팜으로 전환",
    location: "부산 금정구 장전동",
    buildingType: "근린상가 1층 공실",
    areaSqm: 132,
    tokenSymbol: "FARM-BSD",
    tokenPrice: 5000,
    totalTokens: 470000,
    soldTokens: 315000,
    targetAmount: 2350000000,
    currentAmount: 1575000000,
    totalCapex: 2350000000,
    status: "funding",
    fundingStart: "2026-05-01T00:00:00Z",
    fundingEnd: "2026-06-30T23:59:59Z",
    imageUrl: null,
    contractAddress: null,
    fundingPercent: 67,
    investorCount: 412,
    escrow: {
      id: "demo-busandae-escrow",
      projectId: "demo-busandae",
      totalLocked: 1575000000,
      totalReleased: 770000000,
      remaining: 805000000,
      status: "active",
      contractAddress: null,
    },
    milestones: [
      MS("demo-busandae", 1, "임대차 계약", 1500, 352500000, "completed", "임대차 계약서 AI 검증 통과", ["contract"]),
      MS("demo-busandae", 2, "설비 반입", 2000, 470000000, "completed", "세금계산서·반입 사진 교차 검증", ["receipt", "photo"]),
      MS("demo-busandae", 3, "설비 설치", 3500, 822500000, "in_progress", "설치 사진 + 시공 영수증 검증", ["receipt", "photo"]),
      MS("demo-busandae", 4, "작물 정착", 2000, 470000000, "pending", "IoT 생육 데이터 14일 연속 정상", ["iot"]),
      MS("demo-busandae", 5, "운영 개시", 1000, 235000000, "pending", "첫 출하 정산서 검증", ["receipt"]),
    ],
  },
  {
    id: "demo-yeongdo",
    name: "영도 유휴상가 팜",
    description: "영도 봉래동 2층 유휴상가를 엽채류 재배 스마트팜으로 전환",
    location: "부산 영도구 봉래동",
    buildingType: "상가 2층 유휴공간",
    areaSqm: 99,
    tokenSymbol: "FARM-YDO",
    tokenPrice: 5000,
    totalTokens: 360000,
    soldTokens: 360000,
    targetAmount: 1800000000,
    currentAmount: 1800000000,
    totalCapex: 1800000000,
    status: "operating",
    fundingStart: "2026-03-01T00:00:00Z",
    fundingEnd: "2026-04-15T23:59:59Z",
    imageUrl: null,
    contractAddress: null,
    fundingPercent: 100,
    investorCount: 633,
    escrow: {
      id: "demo-yeongdo-escrow",
      projectId: "demo-yeongdo",
      totalLocked: 1800000000,
      totalReleased: 1620000000,
      remaining: 180000000,
      status: "active",
      contractAddress: null,
    },
    milestones: [
      MS("demo-yeongdo", 1, "임대차 계약", 1500, 270000000, "completed", "임대차 계약서 AI 검증 통과", ["contract"]),
      MS("demo-yeongdo", 2, "설비 반입", 2000, 360000000, "completed", "세금계산서·반입 사진 교차 검증", ["receipt", "photo"]),
      MS("demo-yeongdo", 3, "설비 설치", 3500, 630000000, "completed", "설치 사진 + 시공 영수증 검증", ["receipt", "photo"]),
      MS("demo-yeongdo", 4, "작물 정착", 2000, 360000000, "completed", "IoT 생육 데이터 14일 연속 정상", ["iot"]),
      MS("demo-yeongdo", 5, "운영 개시", 1000, 180000000, "in_progress", "첫 출하 정산서 검증", ["receipt"]),
    ],
  },
  {
    id: "demo-nampo",
    name: "남포동 루프탑 팜",
    description: "남포동 상업시설 옥상을 허브·특수작물 루프탑 팜으로 전환",
    location: "부산 중구 남포동",
    buildingType: "상업시설 옥상",
    areaSqm: 76,
    tokenSymbol: "FARM-NPO",
    tokenPrice: 5000,
    totalTokens: 280000,
    soldTokens: 70000,
    targetAmount: 1400000000,
    currentAmount: 350000000,
    totalCapex: 1400000000,
    status: "funding",
    fundingStart: "2026-05-20T00:00:00Z",
    fundingEnd: "2026-07-20T23:59:59Z",
    imageUrl: null,
    contractAddress: null,
    fundingPercent: 25,
    investorCount: 128,
    escrow: {
      id: "demo-nampo-escrow",
      projectId: "demo-nampo",
      totalLocked: 350000000,
      totalReleased: 0,
      remaining: 350000000,
      status: "active",
      contractAddress: null,
    },
    milestones: [
      MS("demo-nampo", 1, "임대차 계약", 1500, 210000000, "in_progress", "임대차 계약서 AI 검증 통과", ["contract"]),
      MS("demo-nampo", 2, "설비 반입", 2000, 280000000, "pending", "세금계산서·반입 사진 교차 검증", ["receipt", "photo"]),
      MS("demo-nampo", 3, "설비 설치", 3500, 490000000, "pending", "설치 사진 + 시공 영수증 검증", ["receipt", "photo"]),
      MS("demo-nampo", 4, "작물 정착", 2000, 280000000, "pending", "IoT 생육 데이터 14일 연속 정상", ["iot"]),
      MS("demo-nampo", 5, "운영 개시", 1000, 140000000, "pending", "첫 출하 정산서 검증", ["receipt"]),
    ],
  },
];

const MOCK_TXS: Transaction[] = [
  {
    id: "tx-1",
    projectId: "demo-busandae",
    type: "tranche_release",
    amount: 470000000,
    tokenAmount: null,
    txHash: "0x8f2ac41b9d3e07c5a6b1f4e2d8c90a7b3f5e1d2c4a6b8e0f1a3c5e7d9b1f3a5c",
    memo: "설비 반입 트랜치 집행",
    createdAt: "2026-06-05T14:22:00Z",
  },
  {
    id: "tx-2",
    projectId: "demo-busandae",
    type: "subscription",
    amount: 25000000,
    tokenAmount: 5000,
    txHash: "0x3b7de92f1c5a08b4d6e2f9a1c3b5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1",
    memo: "토큰 청약 5,000 FARM",
    createdAt: "2026-06-05T11:08:00Z",
  },
  {
    id: "tx-3",
    projectId: "demo-busandae",
    type: "subscription",
    amount: 8000000,
    tokenAmount: 1600,
    txHash: "0x6c1fa83e2b4d09c7e5f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5",
    memo: "토큰 청약 1,600 FARM",
    createdAt: "2026-06-04T18:45:00Z",
  },
  {
    id: "tx-4",
    projectId: "demo-busandae",
    type: "revenue",
    amount: 12400000,
    tokenAmount: null,
    txHash: "0x9d4eb72c1f3a58b6d0e2f4a6c8b0d2e4f6a8c0b2d4e6f8a0c2b4d6e8f0a2c4b6",
    memo: "5월 4주차 출하 매출",
    createdAt: "2026-06-03T09:30:00Z",
  },
  {
    id: "tx-5",
    projectId: "demo-busandae",
    type: "dividend",
    amount: 31500000,
    tokenAmount: null,
    txHash: "0x2a5fc81d3b7e09a4c6e8f0b2d4a6c8e0f2b4d6a8c0e2f4b6d8a0c2e4f6b8d0a2",
    memo: "5월 정기 배당",
    createdAt: "2026-06-01T10:00:00Z",
  },
];

// 48포인트(24시간, 30분 간격) IoT 시계열 — 결정적 생성(빌드 안정성)
function buildIotHistory() {
  const base = new Date("2026-06-06T00:00:00Z").getTime();
  return Array.from({ length: 48 }, (_, i) => {
    const t = i / 48;
    const wave = Math.sin(t * Math.PI * 2);
    const noise = Math.sin(i * 7.3) * 0.5 + Math.cos(i * 3.1) * 0.3;
    return {
      id: `iot-${i}`,
      temperature: +(22.5 + wave * 1.8 + noise * 0.4).toFixed(1),
      humidity: +(65 - wave * 6 + noise).toFixed(1),
      co2Level: +(820 + wave * 90 + noise * 25).toFixed(0),
      lightIntensity: +(14000 + Math.max(0, wave) * 6000).toFixed(0),
      phLevel: +(6.1 + noise * 0.08).toFixed(2),
      growthRate: +(2.1 + t * 0.3).toFixed(2),
      anomalyScore: +Math.abs(noise * 0.12).toFixed(3),
      isAnomaly: false,
      recordedAt: new Date(base + i * 30 * 60 * 1000).toISOString(),
    };
  });
}

export const MOCK_DASHBOARD: DashboardData = {
  project: MOCK_PROJECTS[0],
  escrow: MOCK_PROJECTS[0].escrow!,
  milestones: MOCK_PROJECTS[0].milestones!,
  transactions: MOCK_TXS,
  tokenHoldersCount: 412,
  dividends: [
    {
      id: "div-1",
      totalRevenue: 48200000,
      totalDividend: 31500000,
      perToken: 100,
      period: "2026-05",
      createdAt: "2026-06-01T10:00:00Z",
    },
  ],
  iot: (() => {
    const history = buildIotHistory();
    return { latest: history[history.length - 1], history };
  })(),
  nav: 1.042,
  esg: { co2Reduction: 330, foodMileReduction: 1980 },
};

// ESG 페이지용 월별 수확량(kg)·매출(만원) — 시안 05의 막대 차트 데이터
export const MOCK_MONTHLY_HARVEST = [
  { month: "1월", harvestKg: 1850, revenueManwon: 290 },
  { month: "2월", harvestKg: 2100, revenueManwon: 335 },
  { month: "3월", harvestKg: 2480, revenueManwon: 402 },
  { month: "4월", harvestKg: 2750, revenueManwon: 448 },
  { month: "5월", harvestKg: 3120, revenueManwon: 512 },
  { month: "6월", harvestKg: 3380, revenueManwon: 561 },
  { month: "7월", harvestKg: 3540, revenueManwon: 588 },
  { month: "8월", harvestKg: 3410, revenueManwon: 570 },
  { month: "9월", harvestKg: 3200, revenueManwon: 530 },
  { month: "10월", harvestKg: 2890, revenueManwon: 477 },
  { month: "11월", harvestKg: 2540, revenueManwon: 415 },
  { month: "12월", harvestKg: 2230, revenueManwon: 362 },
];

export const MOCK_ESG_SUMMARY = {
  totalHarvestTon: 28.4,
  totalRevenueManwon: 4820,
  foodMileKm: 24350,
  co2ReductionTon: 128.6,
  opexRatioPct: 37,
};
