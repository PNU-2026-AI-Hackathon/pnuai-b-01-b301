"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/projects", label: "프로젝트" },
  { href: "/invest", label: "투자 방식" },
  { href: "/dashboard", label: "투명성 대시보드" },
  { href: "/impact", label: "ESG 임팩트" },
  { href: "/contact", label: "문의" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-700 shadow-card">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 21c0-6 0-9 4.5-12C20 6.5 21 4 21 3c-3 0-6.5.5-9 3-2.2 2.2-3 5.5-3 9"
            stroke="#A7E3B8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 21c0-4-.8-6.4-3-8.5C7 10.5 4.8 10 3 10c.4 1.6 1.2 3.8 3 5.5 1.8 1.7 4 2.5 6 2.5"
            stroke="#4ADE80"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span
        className={`text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-ink-900"}`}
      >
        FarmFi
      </span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cream-100/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-forest-50 text-forest-700"
                    : "text-ink-500 hover:bg-cream-200 hover:text-ink-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/invest"
          className="rounded-full bg-forest-800 px-4 py-2 text-sm font-semibold text-white shadow-card transition-colors hover:bg-forest-700"
        >
          지금 신청
        </Link>
      </div>
    </header>
  );
}
