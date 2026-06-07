import Link from "next/link";
import { Logo } from "./Header";

export default function Footer() {
  return (
    <footer className="mt-20 bg-forest-900 text-forest-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-sm text-sm leading-relaxed text-forest-200">
            도심 유휴공간을 스마트팜으로 전환하고, 자금 집행을 마일스톤 기반
            에스크로로 투명하게 관리하는 STO 플랫폼.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-semibold text-white">서비스</p>
          <ul className="space-y-2 text-forest-200">
            <li><Link href="/projects" className="hover:text-white">프로젝트 둘러보기</Link></li>
            <li><Link href="/invest" className="hover:text-white">투자 방식</Link></li>
            <li><Link href="/dashboard" className="hover:text-white">투명성 대시보드</Link></li>
            <li><Link href="/impact" className="hover:text-white">ESG 임팩트</Link></li>
          </ul>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-semibold text-white">파일럿</p>
          <ul className="space-y-2 text-forest-200">
            <li><Link href="/contact" className="hover:text-white">건물주 공간 등록</Link></li>
            <li><Link href="/contact" className="hover:text-white">운영자 지원</Link></li>
            <li><Link href="/contact" className="hover:text-white">파트너십 제안</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-forest-800">
        <div className="mx-auto max-w-6xl px-5 py-5 text-xs leading-relaxed text-forest-300">
          본 서비스는 PNU 창의융합AI해커톤 2026 데모입니다. 표시되는 금액·수익률·토큰은
          모의 데이터이며 실제 증권 청약 권유가 아닙니다.
          <span className="ml-2">© 2026 FarmFi (Team B301)</span>
        </div>
      </div>
    </footer>
  );
}
