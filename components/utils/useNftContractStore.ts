import { ethers } from 'ethers';
import create from 'zustand';
import DrawNFTGoerli from '../../hardhat/contracts/abi/goerli/DrawNFT.json';
import DrawNFTAddressGoerli from '../../hardhat/contracts/abi/goerli/DrawNFT-address.json';
import DrawNFTMain from '../../hardhat/contracts/abi/main/DrawNFT.json';
import DrawNFTAddressMain from '../../hardhat/contracts/abi/main/DrawNFT-address.json';
interface NftContractState {
  nftContract?: ethers.Contract;
  setNftContract: () => void;
}

export const useNftContractStore = create<NftContractState>()((set) => ({
  nftContract: undefined,
  setNftContract: async () => {
    if (typeof window !== 'undefined' && window?.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address =
        process.env.ENV && process.env.ENV == 'production'
          ? DrawNFTAddressMain.address
          : DrawNFTAddressGoerli.address;

      const abi =
        process.env.ENV && process.env.ENV == 'production'
          ? DrawNFTMain.abi
          : DrawNFTGoerli.abi;
      set({
        nftContract: new ethers.Contract(address, abi, signer),
      });
    }
  },
}));
