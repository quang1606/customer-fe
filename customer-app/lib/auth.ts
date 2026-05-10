"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "./types";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  userId: string | null;
  customerId: string | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setUserId: (userId: string) => void;
  setCustomerId: (customerId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      userId: null,
      customerId: null,
      isAuthenticated: false,
      setTokens: (accessToken, refreshToken) => {
        document.cookie = `auth_token=${accessToken}; path=/; max-age=86400`;
        set({ accessToken, refreshToken, isAuthenticated: true });
      },
      setUser: (user) => set({ user }),
      setUserId: (userId) => set({ userId }),
      setCustomerId: (customerId) => set({ customerId }),
      logout: () => {
        document.cookie = "auth_token=; path=/; max-age=0";
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          userId: null,
          customerId: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
