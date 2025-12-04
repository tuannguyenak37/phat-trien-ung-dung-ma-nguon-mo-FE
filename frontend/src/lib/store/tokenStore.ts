import { create } from "zustand";

// Định nghĩa kiểu User
interface User {
  user_id: string;
  role: string; // Quan trọng để check Admin
  firstName: string;
  lastName: string;
  url_avatar?: string | null;
  
  description?: string |null;
  url_bg?: string | null
  reputation_score: number
}

interface AuthState {
  accessToken: string | null;
  user: User | null; // Thêm cái này
  isAuthenticated: boolean;

  // Hàm này lưu cả 2 vào RAM cùng lúc
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  // Hàm logout xóa sạch RAM
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setAuth: (token, user) =>
    set({
      accessToken: token,
      user: user,
      isAuthenticated: true,
    }),
  setUser: (user) => set({ user }),

  logout: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    }),
}));
