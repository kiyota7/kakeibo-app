import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "カケイボ",
  description: "収支の登録・カテゴリ分類・月別集計ができる家計簿アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <header className="app-header">
          <h1>カケイボ</h1>
          <nav className="app-nav">
            <Link href="/">ダッシュボード</Link>
            <Link href="/transactions">取引一覧</Link>
            <Link href="/categories">カテゴリ管理</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
