import create from 'zustand';

interface AccountState {
  account?: string;
  setAccunt: () => void;
}

export const useAccountStore = create<AccountState>()((set) => ({
  account: undefined,
  setAccunt: async () => {
    if (typeof window !== 'undefined' && window?.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      set({ account: accounts[0] });
    } else {
      alert(
        'To interact with this application, it is necessary to have a web3 wallet such as MetaMask. This will enable you to securely connect to the decentralized network and interact with the app. Please ensure that you have a web3 wallet installed and configured before attempting to use this application.'
      );
    }
  },
}));
