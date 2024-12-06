import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      enabled: true, // Aktivuje Turbopack
    },
  },
  typescript: {
    ignoreBuildErrors: true, // Ignorování chyb TypeScriptu během build procesu
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignorování ESLint chyb během build procesu
  },
  env: {
    KINDE_SITE_URL:
      process.env.KINDE_SITE_URL ?? `https://${process.env.VERCEL_URL}`,
    KINDE_POST_LOGOUT_REDIRECT_URL:
      process.env.KINDE_POST_LOGOUT_REDIRECT_URL ??
      `https://${process.env.VERCEL_URL}`,
    KINDE_POST_LOGIN_REDIRECT_URL:
      process.env.KINDE_POST_LOGIN_REDIRECT_URL ??
      `https://${process.env.VERCEL_URL}/dashboard`,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: "rvltn-tl",
  project: "javascript-nextjs",
  sentryUrl: "https://sentry.io/",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
