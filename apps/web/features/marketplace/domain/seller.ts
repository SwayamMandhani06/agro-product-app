// ============================================================
// AGRITRADE MARKETPLACE — SELLER DOMAIN MODEL
// Mirrors supabase/migrations/20260905000000_stage_10_marketplace_cooperative.sql
// ============================================================

export type SellerVerificationStatus = 'pending' | 'verified' | 'suspended';

export interface SellerProfile {
  id: string;
  userId: string;
  businessName: string;
  legalName?: string;
  description: string;
  verificationStatus: SellerVerificationStatus;
  rating: number;
  totalReviews: number;
  location: string;
  state: string;
  district: string;
  gstNumber?: string;
  contactPhone: string;
  contactEmail: string;
  dispatchSlaHours: number;
  commissionRate: number; // e.g. 4.50%
  createdAt: string;
  updatedAt?: string;
  metrics?: SellerPerformanceMetrics;
}

export interface SellerPerformanceMetrics {
  totalRevenue: number;
  activeOrders: number;
  deliveredOrders: number;
  onTimeDispatchRate: number; // percentage (e.g. 98.4)
  lowStockItemsCount: number;
  availableBalance: number;
  pendingPayoutAmount: number;
}
