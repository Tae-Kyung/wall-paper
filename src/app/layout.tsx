import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "담벼락 - 포스트잇 메모 앱",
  description: "비밀번호로 보호되는 포스트잇 스타일 메모 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
