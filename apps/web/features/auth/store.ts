// ============================================================
// AUTH STORE — Zustand
// Mirrors apps/mobile/lib/features/auth/
// Demo account: farmer@agritrade.in / farmer123
// ============================================================

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppUser } from '@/types';

// Mock credential store
const MOCK_CREDENTIALS: Record<string, { password: string; user: AppUser }> = {
  'farmer@agritrade.in': {
    password: 'farmer123',
    user: {
      id: 'usr_001',
      name: 'Rahul Sharma',
      email: 'farmer@agritrade.in',
      phone: '9876543210',
      createdAt: new Date('2024-01-01').toISOString(),
    },
  },
  '9876543210': {
    password: 'farmer123',
    user: {
      id: 'usr_001',
      name: 'Rahul Sharma',
      email: 'farmer@agritrade.in',
      phone: '9876543210',
      createdAt: new Date('2024-01-01').toISOString(),
    },
  },
};

// Dynamic registry for new sign-ups
const dynamicCredentials: Record<string, { password: string; user: AppUser }> = {};

export type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated' | 'loading';

interface AuthState {
  status: AuthStatus;
  user: AppUser | null;
  error: string | null;

  // Actions
  signIn: (identifier: string, password: string) => Promise<boolean>;
  signUp: (name: string, identifier: string, password: string) => Promise<boolean>;
  signOut: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      status: 'unauthenticated',
      user: null,
      error: null,

      signIn: async (identifier: string, password: string) => {
        set({ status: 'loading', error: null });
        await new Promise((r) => setTimeout(r, 600)); // simulate network

        const key = identifier.trim().toLowerCase();
        const entry = MOCK_CREDENTIALS[key] ?? dynamicCredentials[key];

        if (!entry) {
          set({ status: 'unauthenticated', error: 'Account not found. Please check your credentials.' });
          return false;
        }
        if (entry.password !== password) {
          set({ status: 'unauthenticated', error: 'Incorrect password. Please try again.' });
          return false;
        }

        set({ status: 'authenticated', user: entry.user, error: null });
        return true;
      },

      signUp: async (name: string, identifier: string, password: string) => {
        set({ status: 'loading', error: null });
        await new Promise((r) => setTimeout(r, 600));

        const key = identifier.trim().toLowerCase();
        if (MOCK_CREDENTIALS[key] || dynamicCredentials[key]) {
          set({ status: 'unauthenticated', error: 'An account with this email/phone already exists.' });
          return false;
        }

        const newUser: AppUser = {
          id: `usr_${Date.now()}`,
          name: name.trim(),
          email: identifier.includes('@') ? identifier.trim() : `${identifier}@agritrade.in`,
          phone: identifier.includes('@') ? undefined : identifier.trim(),
          createdAt: new Date().toISOString(),
        };

        dynamicCredentials[key] = { password, user: newUser };
        set({ status: 'authenticated', user: newUser, error: null });
        return true;
      },

      signOut: () => {
        set({ status: 'unauthenticated', user: null, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'agritrade-auth',
      partialize: (state) => ({ status: state.status, user: state.user }),
    }
  )
);
