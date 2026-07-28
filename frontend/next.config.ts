import type { NextConfig } from "next";

// 本番(Dockerビルド)では静的書き出し(output: "export")を行い、Nginxが配信 + /apiを
// バックエンドへリバースプロキシする。静的書き出しはrewrites()に対応していないため、
// ローカル開発時(next dev / next build)にのみrewrites()を有効にする。
const isStaticExport = process.env.NEXT_OUTPUT_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? { output: "export" }
    : {
        async rewrites() {
          return [
            {
              source: "/api/:path*",
              destination: "http://localhost:3001/api/:path*",
            },
          ];
        },
      }),
};

export default nextConfig;
