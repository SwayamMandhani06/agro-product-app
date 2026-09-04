// ============================================================
// AGRITRADE MARKETPLACE — COOPERATIVE & BULK CAMPAIGN DOMAIN MODEL
// Mirrors supabase/migrations/20260905000000_stage_10_marketplace_cooperative.sql
// ============================================================

export type CooperativeCampaignStatus =
  | 'draft'
  | 'active'
  | 'threshold_reached'
  | 'processing'
  | 'completed'
  | 'cancelled';

export interface Cooperative {
  id: string;
  name: string;
  registrationNumber: string;
  state: string;
  district: string;
  managerId: string;
  managerName: string;
  memberCount: number;
  establishedYear: number;
  contactPhone: string;
  contactEmail: string;
}

export interface CooperativeCampaign {
  id: string;
  cooperativeId: string;
  cooperativeName: string;
  title: string;
  description: string;
  productId: string;
  productTitle: string;
  category: string;
  targetQuantity: number;
  minimumQuantity: number;
  currentQuantity: number;
  retailPrice: number;
  bulkPrice: number;
  unit: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  status: CooperativeCampaignStatus;
  participantsCount: number;
  specifications?: Record<string, string>;
  sellerId?: string;
  sellerName?: string;
}

export type ParticipationStatus = 'committed' | 'confirmed' | 'cancelled';

export interface CooperativeParticipation {
  id: string;
  campaignId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  village: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  potentialSavings: number;
  joinedAt: string;
  status: ParticipationStatus;
}

export function computeCampaignProgress(campaign: CooperativeCampaign): {
  progressPercentage: number;
  minimumThresholdReached: boolean;
  targetReached: boolean;
  remainingQuantityToTarget: number;
  collectiveSavingsGenerated: number;
} {
  const progressPercentage = campaign.targetQuantity > 0
    ? Math.min(100, Math.round((campaign.currentQuantity / campaign.targetQuantity) * 100))
    : 0;

  const minimumThresholdReached = campaign.currentQuantity >= campaign.minimumQuantity;
  const targetReached = campaign.currentQuantity >= campaign.targetQuantity;
  const remainingQuantityToTarget = Math.max(0, campaign.targetQuantity - campaign.currentQuantity);
  const collectiveSavingsGenerated = campaign.currentQuantity * (campaign.retailPrice - campaign.bulkPrice);

  return {
    progressPercentage,
    minimumThresholdReached,
    targetReached,
    remainingQuantityToTarget,
    collectiveSavingsGenerated,
  };
}
