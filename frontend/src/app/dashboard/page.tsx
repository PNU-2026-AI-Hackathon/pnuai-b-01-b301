"use client";

import Link from "next/link";
import { useApi } from "@/lib/use-api";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { Badge } from "@/components/ui";
import type { Project } from "@/lib/types";
import { PROJECT_STATUS_LABEL } from "@/lib/types";

const STATUS_TONE: Record<Project["status"], "solid" | "green" | "amber" | "gray"> = {
  funding: "solid",
  operating: "green",
  funded: "amber",
  upcoming: "gray",
  completed: "gray",
};

export default function DashboardIndexPage() {
  const { data: projects } = useApi<Project[]>(
    "/api/projects",
    MOCK_PROJECTS,
    (json) => {
      const list = (json as { projects?: Project[] }).projects;
      return list && list.length > 0 ? list : null;
    },
  );

  return (
    <div className="bg-farm-section min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-14">
        {/* 헤더 */}
        <div className="mb-10">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold tracking-wide text-forest-600">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf-500" />
            에스크로 · 마일스톤 · IoT 실시간
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 md:text-4xl">
            투명성 대시보드
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-500">
            프로젝트를 선택하면 에스크로·마일스톤·IoT 데이터를 실시간으로
            확인할 수 있습니다.
          </p>
        </div>

        {/* 프로젝트 선택 카드 목록 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const fundingPct =
              project.fundingPercent ??
              (project.targetAmount
                ? Math.round(
                    (project.currentAmount / project.targetAmount) * 100,
                  )
                : 0);
            return (
              <Link
                key={project.id}
                href={`/dashboard/${project.id}`}
                className="group rounded-2.5xl border border-line bg-white p-6 shadow-card transition-all hover:border-forest-300 hover:shadow-hero"
              >
                {/* 썸네일 + 상태 */}
                <div className="flex items-start justify-between gap-3">
                  <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-forest-600 to-forest-800" />
                  <Badge tone={STATUS_TONE[project.status]}>
                    {PROJECT_STATUS_LABEL[project.status]}
                  </Badge>
                </div>

                {/* 이름·위치 */}
                <div className="mt-4">
                  <h2 className="text-base font-extrabold text-ink-900 group-hover:text-forest-700">
                    {project.name}
                  </h2>
                  <p className="mt-0.5 text-sm text-ink-400">
                    {project.location ?? "위치 미정"} &middot;{" "}
                    {project.buildingType ?? ""}
                  </p>
                </div>

                {/* 청약 진행률 */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-500">청약 진행률</span>
                    <span className="font-extrabold text-forest-600">
                      {fundingPct}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-forest-500 to-leaf-500"
                      style={{
                        width: `${Math.max(0, Math.min(100, fundingPct))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* 대시보드 진입 */}
                <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-forest-600 group-hover:text-forest-700">
                  대시보드 보기
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
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
