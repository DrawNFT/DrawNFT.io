import { ethers } from 'ethers';
import create from 'zustand';
import DrawNFT from '../../contracts/abi/DrawNFT.json';
import DrawNFTAddress from '../../contracts/abi/DrawNFT-address.json';

interface NftContractState {
  nftContract?: ethers.Contract;
  setNftContract: () => void;
}

export const useNftContractStore = create<NftContractState>()((set) => ({
  nftContract: undefined,
  setNftContract: async () => {
    if (typeof window !== "undefined" && window?.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      set({
        nftContract: new ethers.Contract(
          DrawNFTAddress.address,
          DrawNFT.abi,
          signer
        ),
      });
    }
  },
}));
