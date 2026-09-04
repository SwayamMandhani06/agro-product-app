// ============================================================
// AGRITRADE ADMIN — GOVERNANCE DOMAIN MODELS
// Stage 11: Seller Verification, Product Moderation,
// Disputes, Audit Logging, Risk Signals
// ============================================================

// ---------------------------------------------------------------------------
// Seller Verification Lifecycle
// ---------------------------------------------------------------------------

export type SellerVerificationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'suspended';

export const VERIFICATION_STATUS_LABELS: Record<SellerVerificationStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  verified: 'Verified',
  rejected: 'Rejected',
  suspended: 'Suspended',
};

export const VERIFICATION_TRANSITIONS: Record<SellerVerificationStatus, SellerVerificationStatus[]> = {
  draft: ['submitted'],
  submitted: ['under_review', 'rejected'],
  under_review: ['verified', 'rejected'],
  verified: ['suspended'],
  rejected: ['submitted'],
  suspended: ['under_review'],
};

export function canTransitionVerification(
  from: SellerVerificationStatus,
  to: SellerVerificationStatus
): boolean {
  return VERIFICATION_TRANSITIONS[from]?.includes(to) ?? false;
}

export type SellerBusinessType = 'individual' | 'partnership' | 'company' | 'cooperative';

export interface SellerVerification {
  id: string;
  sellerId: string;
  businessName: string;
  ownerName: string;
  businessType: SellerBusinessType;
  gstNumber: string;
  registrationId?: string;
  address: string;
  district: string;
  state: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  status: SellerVerificationStatus;
  rejectionReason?: string;
  riskFlags: string[];
  internalNotes: string[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Product Moderation Lifecycle
// ---------------------------------------------------------------------------

export type ProductModerationStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'archived';

export const MODERATION_STATUS_LABELS: Record<ProductModerationStatus, string> = {
  draft: 'Draft',
  pending_review: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  archived: 'Archived',
};

export const MODERATION_TRANSITIONS: Record<ProductModerationStatus, ProductModerationStatus[]> = {
  draft: ['pending_review'],
  pending_review: ['approved', 'rejected'],
  approved: ['archived'],
  rejected: ['pending_review'],
  archived: [],
};

export function canTransitionModeration(
  from: ProductModerationStatus,
  to: ProductModerationStatus
): boolean {
  return MODERATION_TRANSITIONS[from]?.includes(to) ?? false;
}

export interface ProductModeration {
  id: string;
  productId: string;
  productTitle: string;
  sellerId: string;
  sellerName: string;
  category: string;
  price: number;
  mrp: number;
  stockQuantity: number;
  status: ProductModerationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  submittedAt: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Dispute Lifecycle
// ---------------------------------------------------------------------------

export type DisputeStatus =
  | 'open'
  | 'under_review'
  | 'awaiting_user'
  | 'resolved'
  | 'closed';

export const DISPUTE_STATUS_LABELS: Record<DisputeStatus, string> = {
  open: 'Open',
  under_review: 'Under Review',
  awaiting_user: 'Awaiting User',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const DISPUTE_TRANSITIONS: Record<DisputeStatus, DisputeStatus[]> = {
  open: ['under_review'],
  under_review: ['awaiting_user', 'resolved'],
  awaiting_user: ['under_review', 'resolved'],
  resolved: ['closed'],
  closed: [],
};

export function canTransitionDispute(from: DisputeStatus, to: DisputeStatus): boolean {
  return DISPUTE_TRANSITIONS[from]?.includes(to) ?? false;
}

export type DisputeType =
  | 'damaged_product'
  | 'wrong_product'
  | 'missing_item'
  | 'delivery_issue'
  | 'payment_issue'
  | 'seller_issue'
  | 'other';

export const DISPUTE_TYPE_LABELS: Record<DisputeType, string> = {
  damaged_product: 'Damaged Product',
  wrong_product: 'Wrong Product',
  missing_item: 'Missing Item',
  delivery_issue: 'Delivery Issue',
  payment_issue: 'Payment Issue',
  seller_issue: 'Seller Issue',
  other: 'Other',
};

export interface Dispute {
  id: string;
  orderId: string;
  orderNumber: string;
  farmerId: string;
  farmerName: string;
  sellerId: string;
  sellerName: string;
  type: DisputeType;
  subject: string;
  description: string;
  status: DisputeStatus;
  resolution?: string;
  assignedTo?: string;
  messages: DisputeMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface DisputeMessage {
  id: string;
  disputeId: string;
  authorId: string;
  authorName: string;
  authorRole: 'farmer' | 'seller' | 'admin';
  content: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Audit Logging
// ---------------------------------------------------------------------------

export type AuditAction =
  | 'seller_verified'
  | 'seller_rejected'
  | 'seller_suspended'
  | 'seller_submitted'
  | 'product_approved'
  | 'product_rejected'
  | 'product_archived'
  | 'dispute_opened'
  | 'dispute_status_changed'
  | 'dispute_resolved'
  | 'campaign_status_changed'
  | 'risk_signal_created'
  | 'risk_signal_resolved'
  | 'admin_action';

export type AuditEntityType = 'seller' | 'product' | 'order' | 'dispute' | 'campaign' | 'risk_signal';

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  entityLabel: string;
  metadata: Record<string, string>;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Risk Signals
// ---------------------------------------------------------------------------

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RiskEntityType = 'seller' | 'product' | 'order';

export const RISK_SEVERITY_LABELS: Record<RiskSeverity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export interface MarketplaceRiskSignal {
  id: string;
  entityType: RiskEntityType;
  entityId: string;
  entityLabel: string;
  severity: RiskSeverity;
  ruleTriggered: string;
  description: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Platform Metrics
// ---------------------------------------------------------------------------

export interface PlatformMetrics {
  totalFarmers: number;
  totalSellers: number;
  verifiedSellers: number;
  pendingVerification: number;
  activeProducts: number;
  pendingModeration: number;
  activeOrders: number;
  totalGmv: number;
  activeCampaigns: number;
  openDisputes: number;
  unresolvedRiskSignals: number;
}

export interface OperationalAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  context: string;
  actionRoute?: string;
  entityType: AuditEntityType;
  entityId: string;
  createdAt: string;
}
