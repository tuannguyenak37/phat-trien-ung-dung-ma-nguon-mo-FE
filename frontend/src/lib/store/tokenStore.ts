// store/tokenStore.ts
import { create } from 'zustand';

interface TokenState {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

export const useTokenStore = create<TokenState>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
}));