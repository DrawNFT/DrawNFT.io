/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  reactStrictMode: true,
  swcMinify: true,
  env: {
    WITHDRAW_ACCOUNT: process.env.WITHDRAW_ACCOUNT,
    ENV: process.env.ENV,
  },
};

module.exports = nextConfig;
