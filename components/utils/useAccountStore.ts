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
    }
  },
}));
