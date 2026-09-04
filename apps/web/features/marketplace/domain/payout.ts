// ============================================================
// AGRITRADE MARKETPLACE — PAYOUT DOMAIN MODEL
// Mirrors supabase/migrations/20260905000000_stage_10_marketplace_cooperative.sql
// ============================================================

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed';

export interface SellerPayout {
  id: string;
  sellerId: string;
  amount: number; // Net payout after commission
  orderCount: number;
  periodStart: string;
  periodEnd: string;
  status: PayoutStatus;
  utrReference?: string;
  bankAccountMasked?: string;
  grossRevenue: number;
  commissionDeducted: number;
  createdAt: string;
  processedAt?: string;
  failureReason?: string;
}

export interface PayoutSummary {
  availableBalance: number;
  pendingPayout: number;
  paidThisMonth: number;
  lifetimePaid: number;
  nextScheduledCycle: string;
}
