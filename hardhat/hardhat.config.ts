import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

require('dotenv').config();
const { GOERLI_TEST_PRIVATE_KEY, ALCHEMY_GOERLI_API_KEY, ETH_MAIN_PRIVATE_KEY, ALCHEMY_MAIN_API_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    development: {
      url: 'http://127.0.0.1:8545/',
      gas: 2100000,
      gasPrice: 8000000000,
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_GOERLI_API_KEY}`,
      accounts: [GOERLI_TEST_PRIVATE_KEY || ''],
      chainId: 5,
    },
    main: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_MAIN_API_KEY}`,
      accounts: [ETH_MAIN_PRIVATE_KEY || ''],
      chainId: 1,
    },
  },
};

export default config;
