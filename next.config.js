/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  reactStrictMode: true,
  swcMinify: true,
  env: {
    SIGNER_MNEMONIC: process.env.SIGNER_MNEMONIC,
    WITHDRAW_ACCOUNT: process.env.WITHDRAW_ACCOUNT,
    NFT_STORAGE_KEY: process.env.NFT_STORAGE_KEY,
    ENV: process.env.ENV,
  },
};

module.exports = nextConfig;
