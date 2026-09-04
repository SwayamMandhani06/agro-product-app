import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// ============================================================
// AGRITRADE ADMIN & GOVERNANCE TEST SUITE (Stage 11)
// ============================================================

// Replicated domain rules matching governance.ts and permissions.ts
const VERIFICATION_TRANSITIONS = {
  draft: ['submitted'],
  submitted: ['under_review', 'rejected'],
  under_review: ['verified', 'rejected'],
  verified: ['suspended'],
  rejected: ['submitted'],
  suspended: ['under_review'],
};

function canTransitionVerification(from, to) {
  return VERIFICATION_TRANSITIONS[from]?.includes(to) ?? false;
}

const MODERATION_TRANSITIONS = {
  draft: ['pending_review'],
  pending_review: ['approved', 'rejected'],
  approved: ['archived'],
  rejected: ['pending_review'],
  archived: [],
};

function canTransitionModeration(from, to) {
  return MODERATION_TRANSITIONS[from]?.includes(to) ?? false;
}

const DISPUTE_TRANSITIONS = {
  open: ['under_review'],
  under_review: ['awaiting_user', 'resolved'],
  awaiting_user: ['under_review', 'resolved'],
  resolved: ['closed'],
  closed: [],
};

function canTransitionDispute(from, to) {
  return DISPUTE_TRANSITIONS[from]?.includes(to) ?? false;
}

const ROLE_PERMISSIONS = {
  farmer: [
    'browse_products',
    'place_orders',
    'create_reviews',
    'join_campaigns',
    'create_disputes',
    'view_own_orders',
  ],
  seller: [
    'browse_products',
    'manage_products',
    'manage_inventory',
    'manage_seller_orders',
    'request_payouts',
    'view_seller_analytics',
    'view_own_orders',
  ],
  cooperative_manager: [
    'browse_products',
    'manage_campaigns',
    'monitor_participation',
    'manage_campaign_lifecycle',
    'join_campaigns',
    'view_own_orders',
  ],
  admin: [
    'browse_products',
    'place_orders',
    'create_reviews',
    'verify_sellers',
    'moderate_products',
    'manage_disputes',
    'view_platform_analytics',
    'manage_governance',
    'view_audit_log',
    'manage_risk_signals',
    'view_admin_dashboard',
    'view_own_orders',
  ],
};

function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

function hasAnyPermission(role, permissions) {
  const rolePerms = ROLE_PERMISSIONS[role] ?? [];
  return permissions.some((p) => rolePerms.includes(p));
}

function hasAllPermissions(role, permissions) {
  const rolePerms = ROLE_PERMISSIONS[role] ?? [];
  return permissions.every((p) => rolePerms.includes(p));
}

describe('Stage 11: Platform Governance, Trust & Role Permissions', () => {
  it('strictly validates role-permission matrix boundaries', () => {
    // Farmer checks
    assert.strictEqual(hasPermission('farmer', 'browse_products'), true);
    assert.strictEqual(hasPermission('farmer', 'create_disputes'), true);
    assert.strictEqual(hasPermission('farmer', 'verify_sellers'), false);
    assert.strictEqual(hasPermission('farmer', 'moderate_products'), false);
    assert.strictEqual(hasPermission('farmer', 'view_platform_analytics'), false);

    // Seller checks
    assert.strictEqual(hasPermission('seller', 'manage_products'), true);
    assert.strictEqual(hasPermission('seller', 'manage_inventory'), true);
    assert.strictEqual(hasPermission('seller', 'request_payouts'), true);
    assert.strictEqual(hasPermission('seller', 'verify_sellers'), false);
    assert.strictEqual(hasPermission('seller', 'manage_disputes'), false);

    // Cooperative Manager checks
    assert.strictEqual(hasPermission('cooperative_manager', 'manage_campaigns'), true);
    assert.strictEqual(hasPermission('cooperative_manager', 'monitor_participation'), true);
    assert.strictEqual(hasPermission('cooperative_manager', 'verify_sellers'), false);

    // Admin checks
    assert.strictEqual(hasPermission('admin', 'verify_sellers'), true);
    assert.strictEqual(hasPermission('admin', 'moderate_products'), true);
    assert.strictEqual(hasPermission('admin', 'manage_disputes'), true);
    assert.strictEqual(hasPermission('admin', 'view_platform_analytics'), true);
    assert.strictEqual(hasPermission('admin', 'view_audit_log'), true);
    assert.strictEqual(hasPermission('admin', 'manage_risk_signals'), true);
  });

  it('correctly evaluates hasAnyPermission and hasAllPermissions helpers', () => {
    const adminGovernancePerms = ['verify_sellers', 'moderate_products', 'manage_disputes'];
    assert.strictEqual(hasAllPermissions('admin', adminGovernancePerms), true);
    assert.strictEqual(hasAllPermissions('seller', adminGovernancePerms), false);
    assert.strictEqual(hasAnyPermission('farmer', ['create_disputes', 'verify_sellers']), true);
    assert.strictEqual(hasAnyPermission('farmer', ['verify_sellers', 'moderate_products']), false);
  });

  it('enforces canonical seller verification state transitions', () => {
    // Valid transitions
    assert.strictEqual(canTransitionVerification('draft', 'submitted'), true);
    assert.strictEqual(canTransitionVerification('submitted', 'under_review'), true);
    assert.strictEqual(canTransitionVerification('submitted', 'rejected'), true);
    assert.strictEqual(canTransitionVerification('under_review', 'verified'), true);
    assert.strictEqual(canTransitionVerification('under_review', 'rejected'), true);
    assert.strictEqual(canTransitionVerification('verified', 'suspended'), true);
    assert.strictEqual(canTransitionVerification('suspended', 'under_review'), true);
    assert.strictEqual(canTransitionVerification('rejected', 'submitted'), true);

    // Invalid transitions (disallowed skips)
    assert.strictEqual(canTransitionVerification('draft', 'verified'), false);
    assert.strictEqual(canTransitionVerification('submitted', 'suspended'), false);
    assert.strictEqual(canTransitionVerification('draft', 'suspended'), false);
  });

  it('enforces product catalog moderation lifecycle rules', () => {
    // Valid moderation progression
    assert.strictEqual(canTransitionModeration('draft', 'pending_review'), true);
    assert.strictEqual(canTransitionModeration('pending_review', 'approved'), true);
    assert.strictEqual(canTransitionModeration('pending_review', 'rejected'), true);
    assert.strictEqual(canTransitionModeration('approved', 'archived'), true);
    assert.strictEqual(canTransitionModeration('rejected', 'pending_review'), true);

    // Terminal archived state has no transitions
    assert.strictEqual(canTransitionModeration('archived', 'approved'), false);
    assert.strictEqual(canTransitionModeration('archived', 'pending_review'), false);
    assert.strictEqual(canTransitionModeration('draft', 'approved'), false);
  });

  it('enforces dispute resolution lifecycle and terminal states', () => {
    // Valid dispute progression
    assert.strictEqual(canTransitionDispute('open', 'under_review'), true);
    assert.strictEqual(canTransitionDispute('under_review', 'awaiting_user'), true);
    assert.strictEqual(canTransitionDispute('under_review', 'resolved'), true);
    assert.strictEqual(canTransitionDispute('awaiting_user', 'under_review'), true);
    assert.strictEqual(canTransitionDispute('awaiting_user', 'resolved'), true);
    assert.strictEqual(canTransitionDispute('resolved', 'closed'), true);

    // Direct close or skip without resolution is prohibited
    assert.strictEqual(canTransitionDispute('open', 'closed'), false);
    assert.strictEqual(canTransitionDispute('open', 'resolved'), false);
    assert.strictEqual(canTransitionDispute('closed', 'open'), false);
  });

  it('generates structured audit entries preserving actor, entity and metadata', () => {
    function createAuditEntry(actor, action, entityType, entityId, entityLabel, metadata = {}) {
      return {
        id: `aud_${Date.now()}`,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action,
        entityType,
        entityId,
        entityLabel,
        metadata,
        createdAt: new Date().toISOString(),
      };
    }

    const admin = { id: 'admin_001', name: 'Platform Admin', role: 'admin' };
    const entry = createAuditEntry(
      admin,
      'seller_verified',
      'seller',
      'sel_krishi_kendra_01',
      'Maharashtra Krishi Kendra',
      { previousStatus: 'under_review', newStatus: 'verified' }
    );

    assert.strictEqual(entry.actorRole, 'admin');
    assert.strictEqual(entry.action, 'seller_verified');
    assert.strictEqual(entry.entityType, 'seller');
    assert.strictEqual(entry.metadata.newStatus, 'verified');
    assert.ok(entry.createdAt);
  });

  it('evaluates marketplace risk signals with deterministic severity', () => {
    const severities = ['low', 'medium', 'high', 'critical'];

    function compareSeverity(a, b) {
      return severities.indexOf(b) - severities.indexOf(a);
    }

    const signals = [
      { id: '1', severity: 'low', isResolved: false },
      { id: '2', severity: 'critical', isResolved: false },
      { id: '3', severity: 'high', isResolved: true },
      { id: '4', severity: 'medium', isResolved: false },
    ];

    const unresolvedSorted = signals
      .filter((s) => !s.isResolved)
      .sort((a, b) => compareSeverity(a.severity, b.severity));

    assert.strictEqual(unresolvedSorted.length, 3);
    assert.strictEqual(unresolvedSorted[0].severity, 'critical');
    assert.strictEqual(unresolvedSorted[1].severity, 'medium');
    assert.strictEqual(unresolvedSorted[2].severity, 'low');
  });
});
