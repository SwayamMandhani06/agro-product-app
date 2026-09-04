'use client';

import React from 'react';
import { AlertCircle, RefreshCw, WifiOff, Inbox } from 'lucide-react';
import { Skeleton } from './Skeleton';

// ============================================================
// 1. UNIVERSAL LOADING SKELETON GRID
// ============================================================
export interface UniversalLoadingGridProps {
  count?: number;
  columns?: 2 | 3 | 4;
  type?: 'card' | 'row' | 'metric';
  className?: string;
}

export function UniversalLoadingGrid({
  count = 6,
  columns = 3,
  type = 'card',
  className = '',
}: UniversalLoadingGridProps) {
  const colClass =
    columns === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div
      role="status"
      aria-label="Loading content..."
      className={`grid gap-4 ${colClass} ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
        >
          {type === 'card' ? (
            <div className="space-y-3">
              <Skeleton height={140} borderRadius={8} />
              <Skeleton width="40%" height={12} />
              <Skeleton width="85%" height={16} />
              <div className="flex items-center justify-between pt-2">
                <Skeleton width="30%" height={18} />
                <Skeleton width="40%" height={32} borderRadius={6} />
              </div>
            </div>
          ) : type === 'metric' ? (
            <div className="space-y-2">
              <Skeleton width="45%" height={12} />
              <Skeleton width="70%" height={24} />
              <Skeleton width="35%" height={10} />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Skeleton width={48} height={48} borderRadius={8} />
              <div className="flex-1 space-y-2">
                <Skeleton width="60%" height={14} />
                <Skeleton width="35%" height={12} />
              </div>
            </div>
          )}
        </div>
      ))}
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}

// ============================================================
// 2. UNIVERSAL EMPTY STATE
// ============================================================
export interface UniversalEmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function UniversalEmptyState({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className = '',
}: UniversalEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900/30 ${className}`}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-1.5 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ============================================================
// 3. UNIVERSAL ERROR STATE
// ============================================================
export interface UniversalErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function UniversalErrorState({
  title = 'Unable to load content',
  message = 'A network or synchronization error occurred while fetching information.',
  onRetry,
  className = '',
}: UniversalErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center rounded-xl border border-rose-200/80 bg-rose-50/60 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20 ${className}`}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
        {title}
      </h3>
      <p className="mt-1 max-w-md text-xs text-rose-700 dark:text-rose-300/80">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 shadow-2xs transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
}

// ============================================================
// 4. UNIVERSAL OFFLINE BANNER
// ============================================================
export interface UniversalOfflineBannerProps {
  isOffline?: boolean;
  cachedAt?: string;
  onRefresh?: () => void;
  className?: string;
}

export function UniversalOfflineBanner({
  isOffline = false,
  cachedAt,
  onRefresh,
  className = '',
}: UniversalOfflineBannerProps) {
  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-300/70 bg-amber-50 px-3.5 py-2 text-xs text-amber-900 shadow-2xs dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-200 ${className}`}
    >
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          <strong>Offline Mode:</strong> Showing locally cached data
          {cachedAt ? ` (last synchronized ${cachedAt})` : ''}.
        </span>
      </div>
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1 rounded bg-amber-200/60 px-2 py-1 font-medium hover:bg-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-amber-900/60 dark:hover:bg-amber-800"
        >
          <RefreshCw className="h-3 w-3" />
          Reconnect
        </button>
      )}
    </div>
  );
}
