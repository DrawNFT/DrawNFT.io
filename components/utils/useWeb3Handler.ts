import { useEffect } from 'react';
import { useAccountStore } from './useAccountStore';
import { useNftContractStore } from './useNftContractStore';

export const useWeb3Handler = () => {
  const account = useAccountStore((state) => state.account);
  const nftContract = useNftContractStore((state) => state.nftContract);

  const setAccunt = useAccountStore((state) => state.setAccunt);
  const setNftContract = useNftContractStore((state) => state.setNftContract);

  if (typeof window !== 'undefined' && window?.ethereum) {
    window.ethereum.on('accountsChanged', function () {
      setAccunt();
    });

    window.ethereum.on('chainChanged', function () {
      setAccunt();
    });
  }

  useEffect(() => {
    setAccunt();
    setNftContract();
  }, [setAccunt, setNftContract]);

  return { account, nftContract };
};
