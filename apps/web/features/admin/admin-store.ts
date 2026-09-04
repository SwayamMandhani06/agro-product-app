// ============================================================
// AGRITRADE ADMIN STORE — Zustand
// Manages seller verifications, product moderation, disputes,
// audit logging, risk signals, and platform metrics
// ============================================================

import { create } from 'zustand';
import type {
  SellerVerification,
  SellerVerificationStatus,
  ProductModeration,
  ProductModerationStatus,
  Dispute,
  DisputeStatus,
  DisputeMessage,
  AuditLogEntry,
  AuditAction,
  MarketplaceRiskSignal,
  OperationalAlert,
  PlatformMetrics,
} from './domain/governance';
import {
  canTransitionVerification,
  canTransitionModeration,
  canTransitionDispute,
} from './domain/governance';
import {
  MOCK_SELLER_VERIFICATIONS,
  MOCK_PRODUCT_MODERATIONS,
  MOCK_DISPUTES,
  MOCK_AUDIT_LOG,
  MOCK_RISK_SIGNALS,
  MOCK_OPERATIONAL_ALERTS,
  MOCK_PLATFORM_METRICS,
} from './data/mock-admin-data';

interface AdminState {
  verifications: SellerVerification[];
  moderations: ProductModeration[];
  disputes: Dispute[];
  auditLog: AuditLogEntry[];
  auditLogs: AuditLogEntry[]; // Alias for convenience
  riskSignals: MarketplaceRiskSignal[];
  alerts: OperationalAlert[];
  metrics: PlatformMetrics;

  // Seller Verification
  updateVerificationStatus: (
    verificationId: string,
    newStatus: SellerVerificationStatus,
    reason?: string
  ) => boolean;
  updateSellerVerification: (
    verificationId: string,
    newStatus: SellerVerificationStatus,
    options?: { reason?: string }
  ) => boolean;
  addVerificationNote: (verificationId: string, note: string) => void;
  addSellerInternalNote: (verificationId: string, note: string) => void;

  // Product Moderation
  updateModerationStatus: (
    moderationId: string,
    newStatus: ProductModerationStatus,
    reason?: string
  ) => boolean;
  updateProductModeration: (
    moderationId: string,
    newStatus: ProductModerationStatus,
    options?: { reason?: string }
  ) => boolean;

  // Disputes
  updateDisputeStatus: (
    disputeId: string,
    newStatus: DisputeStatus,
    optionsOrResolution?: string | { resolution?: string }
  ) => boolean;
  createDispute: (
    dispute: Omit<Dispute, 'id' | 'createdAt' | 'updatedAt' | 'messages' | 'status'>
  ) => Dispute;
  addDisputeMessage: (
    disputeId: string,
    messageOrContent: string | Omit<DisputeMessage, 'id' | 'disputeId' | 'createdAt'>,
    authorId?: string,
    authorName?: string,
    authorRole?: 'farmer' | 'seller' | 'admin'
  ) => void;

  // Audit
  appendAuditEntry: (entry: Omit<AuditLogEntry, 'id' | 'createdAt'>) => void;

  // Risk Signals
  resolveRiskSignal: (signalId: string) => void;
  createRiskSignal: (signal: Omit<MarketplaceRiskSignal, 'id' | 'createdAt' | 'isResolved'>) => void;
}

export const useAdminStore = create<AdminState>()((set, get) => ({
  verifications: MOCK_SELLER_VERIFICATIONS,
  moderations: MOCK_PRODUCT_MODERATIONS,
  disputes: MOCK_DISPUTES,
  auditLog: MOCK_AUDIT_LOG,
  auditLogs: MOCK_AUDIT_LOG,
  riskSignals: MOCK_RISK_SIGNALS,
  alerts: MOCK_OPERATIONAL_ALERTS,
  metrics: MOCK_PLATFORM_METRICS,

  updateVerificationStatus: (verificationId, newStatus, reason) => {
    const verification = get().verifications.find((v) => v.id === verificationId);
    if (!verification || !canTransitionVerification(verification.status, newStatus)) {
      return false;
    }

    const auditAction: AuditAction =
      newStatus === 'verified'
        ? 'seller_verified'
        : newStatus === 'rejected'
          ? 'seller_rejected'
          : newStatus === 'suspended'
            ? 'seller_suspended'
            : 'seller_submitted';

    set((state) => ({
      verifications: state.verifications.map((v) =>
        v.id === verificationId
          ? {
              ...v,
              status: newStatus,
              rejectionReason: reason ?? v.rejectionReason,
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'admin_001',
              updatedAt: new Date().toISOString(),
            }
          : v
      ),
    }));

    get().appendAuditEntry({
      actorId: 'admin_001',
      actorName: 'Platform Admin',
      actorRole: 'admin',
      action: auditAction,
      entityType: 'seller',
      entityId: verification.sellerId,
      entityLabel: verification.businessName,
      metadata: {
        previousStatus: verification.status,
        newStatus,
        ...(reason ? { reason } : {}),
      },
    });

    return true;
  },

  updateSellerVerification: (verificationId, newStatus, options) => {
    return get().updateVerificationStatus(verificationId, newStatus, options?.reason);
  },

  addVerificationNote: (verificationId, note) => {
    set((state) => ({
      verifications: state.verifications.map((v) =>
        v.id === verificationId
          ? { ...v, internalNotes: [...v.internalNotes, note], updatedAt: new Date().toISOString() }
          : v
      ),
    }));
  },

  addSellerInternalNote: (verificationId, note) => {
    get().addVerificationNote(verificationId, note);
  },

  updateModerationStatus: (moderationId, newStatus, reason) => {
    const moderation = get().moderations.find((m) => m.id === moderationId);
    if (!moderation || !canTransitionModeration(moderation.status, newStatus)) {
      return false;
    }

    const auditAction: AuditAction =
      newStatus === 'approved'
        ? 'product_approved'
        : newStatus === 'rejected'
          ? 'product_rejected'
          : 'product_archived';

    set((state) => ({
      moderations: state.moderations.map((m) =>
        m.id === moderationId
          ? {
              ...m,
              status: newStatus,
              rejectionReason: reason ?? m.rejectionReason,
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'admin_001',
            }
          : m
      ),
    }));

    get().appendAuditEntry({
      actorId: 'admin_001',
      actorName: 'Platform Admin',
      actorRole: 'admin',
      action: auditAction,
      entityType: 'product',
      entityId: moderation.productId,
      entityLabel: moderation.productTitle,
      metadata: {
        previousStatus: moderation.status,
        newStatus,
        ...(reason ? { reason } : {}),
      },
    });

    return true;
  },

  updateProductModeration: (moderationId, newStatus, options) => {
    return get().updateModerationStatus(moderationId, newStatus, options?.reason);
  },

  updateDisputeStatus: (disputeId, newStatus, optionsOrResolution) => {
    const dispute = get().disputes.find((d) => d.id === disputeId);
    if (!dispute || !canTransitionDispute(dispute.status, newStatus)) {
      return false;
    }

    const resolution =
      typeof optionsOrResolution === 'string'
        ? optionsOrResolution
        : optionsOrResolution?.resolution;

    set((state) => ({
      disputes: state.disputes.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: newStatus,
              resolution: resolution ?? d.resolution,
              updatedAt: new Date().toISOString(),
            }
          : d
      ),
    }));

    get().appendAuditEntry({
      actorId: 'admin_001',
      actorName: 'Platform Admin',
      actorRole: 'admin',
      action: newStatus === 'resolved' ? 'dispute_resolved' : 'dispute_status_changed',
      entityType: 'dispute',
      entityId: disputeId,
      entityLabel: `${dispute.orderNumber} — ${dispute.subject}`,
      metadata: {
        previousStatus: dispute.status,
        newStatus,
        ...(resolution ? { resolution } : {}),
      },
    });

    return true;
  },

  createDispute: (disputeData) => {
    const newDispute: Dispute = {
      id: `dsp_${Date.now()}`,
      ...disputeData,
      status: 'open',
      messages: [
        {
          id: `dm_${Date.now()}`,
          disputeId: `dsp_${Date.now()}`,
          authorId: disputeData.farmerId,
          authorName: disputeData.farmerName,
          authorRole: 'farmer',
          content: disputeData.description,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      disputes: [newDispute, ...state.disputes],
    }));

    get().appendAuditEntry({
      actorId: disputeData.farmerId,
      actorName: disputeData.farmerName,
      actorRole: 'farmer',
      action: 'dispute_opened',
      entityType: 'dispute',
      entityId: newDispute.id,
      entityLabel: `${newDispute.orderNumber} — ${newDispute.subject}`,
      metadata: { type: newDispute.type, sellerId: newDispute.sellerId },
    });

    return newDispute;
  },

  addDisputeMessage: (disputeId, messageOrContent, authorId, authorName, authorRole) => {
    let msg: DisputeMessage;

    if (typeof messageOrContent === 'string') {
      msg = {
        id: `dm_${Date.now()}`,
        disputeId,
        authorId: authorId ?? 'admin_001',
        authorName: authorName ?? 'Platform Admin',
        authorRole: authorRole ?? 'admin',
        content: messageOrContent,
        createdAt: new Date().toISOString(),
      };
    } else {
      msg = {
        id: `dm_${Date.now()}`,
        disputeId,
        ...messageOrContent,
        createdAt: new Date().toISOString(),
      };
    }

    set((state) => ({
      disputes: state.disputes.map((d) =>
        d.id === disputeId
          ? { ...d, messages: [...d.messages, msg], updatedAt: new Date().toISOString() }
          : d
      ),
    }));
  },

  appendAuditEntry: (entry) => {
    const newEntry: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      ...entry,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      auditLog: [newEntry, ...state.auditLog],
      auditLogs: [newEntry, ...state.auditLog],
    }));
  },

  resolveRiskSignal: (signalId) => {
    const signal = get().riskSignals.find((s) => s.id === signalId);
    if (!signal || signal.isResolved) return;

    set((state) => ({
      riskSignals: state.riskSignals.map((s) =>
        s.id === signalId
          ? { ...s, isResolved: true, resolvedAt: new Date().toISOString(), resolvedBy: 'admin_001' }
          : s
      ),
    }));

    get().appendAuditEntry({
      actorId: 'admin_001',
      actorName: 'Platform Admin',
      actorRole: 'admin',
      action: 'risk_signal_resolved',
      entityType: 'risk_signal',
      entityId: signalId,
      entityLabel: signal.entityLabel,
      metadata: { ruleTriggered: signal.ruleTriggered, severity: signal.severity },
    });
  },

  createRiskSignal: (signal) => {
    const newSignal: MarketplaceRiskSignal = {
      id: `risk_${Date.now()}`,
      ...signal,
      isResolved: false,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      riskSignals: [newSignal, ...state.riskSignals],
    }));

    get().appendAuditEntry({
      actorId: 'system',
      actorName: 'Automated Rule Engine',
      actorRole: 'system',
      action: 'risk_signal_created',
      entityType: 'risk_signal',
      entityId: newSignal.id,
      entityLabel: newSignal.entityLabel,
      metadata: { ruleTriggered: newSignal.ruleTriggered, severity: newSignal.severity },
    });
  },
}));
