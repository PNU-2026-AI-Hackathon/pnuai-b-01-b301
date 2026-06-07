// API 응답 타입 (BigInt는 API에서 number로 직렬화됨)

export interface Escrow {
  id: string;
  projectId: string;
  totalLocked: number;
  totalReleased: number;
  remaining: number;
  status: string;
  contractAddress: string | null;
}

export interface Milestone {
  id: string;
  projectId: string;
  seq: number;
  name: string;
  description: string | null;
  releasePct: number; // basis points: 3500 = 35%
  releaseAmount: number;
  status:
    | "pending"
    | "in_progress"
    | "verified"
    | "completed"
    | "failed"
    | "manual_review";
  conditionText: string | null;
  requiredSignals: string[];
  iotMinDays: number;
  completedAt: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  buildingType: string | null;
  areaSqm: number | null;
  tokenSymbol: string;
  tokenPrice: number;
  totalTokens: number;
  soldTokens: number;
  targetAmount: number;
  currentAmount: number;
  totalCapex: number;
  status: "upcoming" | "funding" | "funded" | "operating" | "completed";
  fundingStart: string | null;
  fundingEnd: string | null;
  imageUrl: string | null;
  contractAddress: string | null;
  escrow?: Escrow | null;
  milestones?: Milestone[];
  fundingPercent?: number;
  investorCount?: number;
}

export interface Transaction {
  id: string;
  projectId: string;
  type: "subscription" | "tranche_release" | "dividend" | "revenue";
  amount: number;
  tokenAmount: number | null;
  txHash: string | null;
  memo: string | null;
  createdAt: string;
}

export interface IotRecord {
  id: string;
  temperature: number;
  humidity: number;
  co2Level: number;
  lightIntensity: number;
  phLevel: number;
  growthRate: number;
  anomalyScore: number;
  isAnomaly: boolean;
  recordedAt: string;
}

export interface DashboardData {
  project: Project;
  escrow: Escrow | null;
  milestones: Milestone[];
  transactions: Transaction[];
  tokenHoldersCount: number;
  dividends: {
    id: string;
    totalRevenue: number;
    totalDividend: number;
    perToken: number;
    period: string;
    createdAt: string;
  }[];
  iot: { latest: IotRecord | null; history: IotRecord[] };
  nav: number | null;
  esg: { co2Reduction: number; foodMileReduction: number };
}

export const MILESTONE_STATUS_LABEL: Record<Milestone["status"], string> = {
  pending: "대기",
  in_progress: "진행중",
  verified: "검증 완료",
  completed: "집행 완료",
  failed: "검증 실패",
  manual_review: "수동 검토",
};

export const PROJECT_STATUS_LABEL: Record<Project["status"], string> = {
  upcoming: "오픈 예정",
  funding: "청약중",
  funded: "청약 완료",
  operating: "운영중",
  completed: "완료",
};

export const TX_TYPE_LABEL: Record<Transaction["type"], string> = {
  subscription: "청약 입금",
  tranche_release: "트랜치 집행",
  dividend: "배당 지급",
  revenue: "매출 입금",
};
