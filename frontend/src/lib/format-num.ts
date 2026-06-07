// UI 표시용 숫자 포매터 (서버용 format.ts와 분리)

/** 2350000000 → "₩ 2,350,000,000" */
export function won(amount: number): string {
  return `₩ ${Math.round(amount).toLocaleString("ko-KR")}`;
}

/** 1575000000 → "15.7억" */
export function wonEok(amount: number): string {
  const eok = amount / 100_000_000;
  if (eok >= 1) return `${eok.toFixed(1).replace(/\.0$/, "")}억`;
  const man = amount / 10_000;
  return `${Math.round(man).toLocaleString("ko-KR")}만`;
}

export function num(value: number): string {
  return value.toLocaleString("ko-KR");
}

export function pct(value: number): string {
  return `${Math.round(value)}%`;
}

/** basis points → "35%" */
export function bp(value: number): string {
  return `${value / 100}%`;
}

export function shortHash(hash: string | null): string {
  if (!hash) return "온체인 대기";
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`;
}

export function shortDate(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function shortDateTime(date: string): string {
  const d = new Date(date);
  return `${shortDate(date)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
