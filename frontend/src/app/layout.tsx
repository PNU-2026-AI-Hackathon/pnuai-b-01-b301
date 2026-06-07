import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FarmFi — 공실을 미니팜으로, 자금 집행은 코드로",
  description:
    "도심 유휴공간 스마트팜 STO 플랫폼. 마일스톤 기반 에스크로로 청약금을 보호하고, AI 검증으로 단계별 자금 집행을 투명하게 공개합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
