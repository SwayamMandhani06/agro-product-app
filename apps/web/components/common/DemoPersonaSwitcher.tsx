'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, DEMO_PERSONAS } from '@/features/auth/store';
import { UserPlatformRole } from '@/types';
import { Users, ChevronDown, Check, ExternalLink } from 'lucide-react';

const PERSONA_CONFIG: Record<
  UserPlatformRole,
  { label: string; roleLabel: string; dashboardUrl: string; color: string }
> = {
  farmer: {
    label: 'Rahul Sharma',
    roleLabel: 'Farmer Persona',
    dashboardUrl: '/home',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  },
  seller: {
    label: 'Maha Krishi Kendra',
    roleLabel: 'Seller Persona',
    dashboardUrl: '/seller/dashboard',
    color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  },
  cooperative_manager: {
    label: 'Suresh Patil',
    roleLabel: 'Cooperative Persona',
    dashboardUrl: '/cooperative/campaigns',
    color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
  },
  admin: {
    label: 'Platform Admin',
    roleLabel: 'Admin Persona',
    dashboardUrl: '/admin/dashboard',
    color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  },
};

export function DemoPersonaSwitcher({ className = '' }: { className?: string }) {
  const router = useRouter();
  const { user, status, switchDemoPersona } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentRole: UserPlatformRole = user?.role || 'farmer';
  const currentConfig = PERSONA_CONFIG[currentRole] || PERSONA_CONFIG.farmer;

  const handleSelect = (role: UserPlatformRole) => {
    switchDemoPersona(role);
    setIsOpen(false);
    const targetUrl = PERSONA_CONFIG[role].dashboardUrl;
    router.push(targetUrl);
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        id="demo-persona-menu-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/90 px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-950" />
        <span className="text-slate-500 dark:text-slate-400">Demo Persona:</span>
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {status === 'authenticated' && user ? currentConfig.roleLabel : 'Select Role'}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="demo-persona-menu-button"
            className="absolute right-0 z-50 mt-1.5 w-72 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 focus:outline-none dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Users className="h-3.5 w-3.5" />
                Switch Demonstration Role
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                Instantly switch user permissions and routes without logging out.
              </p>
            </div>

            <div className="py-1 space-y-1">
              {(Object.keys(PERSONA_CONFIG) as UserPlatformRole[]).map((role) => {
                const isSelected = user?.role === role;
                const persona = PERSONA_CONFIG[role];
                const demoData = DEMO_PERSONAS[role];

                return (
                  <button
                    key={role}
                    role="menuitem"
                    type="button"
                    onClick={() => handleSelect(role)}
                    className={`flex w-full items-start justify-between rounded-lg p-2 text-left transition ${
                      isSelected
                        ? 'bg-slate-100 dark:bg-slate-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {persona.roleLabel}
                        </span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {demoData.user.name} ({demoData.email})
                      </p>
                      <div className="pt-0.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium border ${persona.color}`}
                        >
                          Target: {persona.dashboardUrl}
                          <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
