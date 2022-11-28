/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NFT_STORAGE_KEY: process.env.NFT_STORAGE_KEY,
    SIGNER_MNEMONIC: process.env.SIGNER_MNEMONIC,
    WITHDRAW_ACCOUNT: process.env.WITHDRAW_ACCOUNT
  },
};

module.exports = nextConfig;
