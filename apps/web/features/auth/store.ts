// ============================================================
// AUTH STORE — Zustand
// Mirrors apps/mobile/lib/features/auth/
// Demo account: farmer@agritrade.in / farmer123
// ============================================================

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppUser, UserPlatformRole } from '@/types';

// Mock credential store
export const DEMO_PERSONAS: Record<UserPlatformRole, { email: string; password: string; user: AppUser }> = {
  farmer: {
    email: 'farmer@agritrade.in',
    password: 'farmer123',
    user: {
      id: 'usr_001',
      name: 'Rahul Sharma',
      email: 'farmer@agritrade.in',
      phone: '9876543210',
      role: 'farmer',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  },
  seller: {
    email: 'seller@agritrade.in',
    password: 'seller123',
    user: {
      id: 'usr_seller_001',
      name: 'Maharashtra Krishi Kendra',
      email: 'seller@agritrade.in',
      phone: '9822012345',
      role: 'seller',
      createdAt: '2024-02-01T00:00:00.000Z',
    },
  },
  cooperative_manager: {
    email: 'coop@agritrade.in',
    password: 'coop123',
    user: {
      id: 'usr_coop_001',
      name: 'Suresh Patil',
      email: 'coop@agritrade.in',
      phone: '9822099887',
      role: 'cooperative_manager',
      createdAt: '2024-02-15T00:00:00.000Z',
    },
  },
  admin: {
    email: 'admin@agritrade.in',
    password: 'admin123',
    user: {
      id: 'usr_admin_001',
      name: 'Platform Admin',
      email: 'admin@agritrade.in',
      phone: '9800011223',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  },
};

// Mock credential store
const MOCK_CREDENTIALS: Record<string, { password: string; user: AppUser }> = {
  'farmer@agritrade.in': DEMO_PERSONAS.farmer,
  '9876543210': DEMO_PERSONAS.farmer,
  'seller@agritrade.in': DEMO_PERSONAS.seller,
  '9822012345': DEMO_PERSONAS.seller,
  'coop@agritrade.in': DEMO_PERSONAS.cooperative_manager,
  '9822099887': DEMO_PERSONAS.cooperative_manager,
  'admin@agritrade.in': DEMO_PERSONAS.admin,
  '9800011223': DEMO_PERSONAS.admin,
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
  switchDemoPersona: (role: UserPlatformRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      status: 'unauthenticated',
      user: null,
      error: null,

      switchDemoPersona: (role: UserPlatformRole) => {
        const persona = DEMO_PERSONAS[role];
        if (persona) {
          set({ status: 'authenticated', user: persona.user, error: null });
        }
      },

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
