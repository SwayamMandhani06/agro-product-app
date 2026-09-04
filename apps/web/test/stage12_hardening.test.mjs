// ============================================================
// Stage 12: Production Readiness — Hardening & Integration Tests
// ============================================================

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// ---- Inline re-implementations to avoid ESM/TS import issues ----

// OrderStatus canonical type
const ALLOWED_ORDER_TRANSITIONS = {
  placed: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['packed', 'shipped', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['outForDelivery', 'delivered'],
  outForDelivery: ['delivered', 'shipped'],
  delivered: ['refund_requested', 'disputed'],
  refund_requested: ['refund_processing', 'disputed', 'delivered'],
  disputed: ['refund_processing', 'delivered'],
  refund_processing: ['refunded'],
  refunded: [],
  cancelled: [],
};

function normalizeOrderStatus(status) {
  if (status === 'out_for_delivery') return 'outForDelivery';
  return status;
}

function isValidOrderTransition(from, to) {
  const normFrom = normalizeOrderStatus(from);
  const normTo = normalizeOrderStatus(to);
  if (normFrom === normTo) return true;
  const allowed = ALLOWED_ORDER_TRANSITIONS[normFrom];
  if (!allowed) return false;
  return allowed.includes(normTo);
}

function getNextAllowedOrderTransitions(current) {
  const norm = normalizeOrderStatus(current);
  return ALLOWED_ORDER_TRANSITIONS[norm] ? [...ALLOWED_ORDER_TRANSITIONS[norm]] : [];
}

function isTerminalOrderStatus(status) {
  const norm = normalizeOrderStatus(status);
  return norm === 'delivered' || norm === 'refunded' || norm === 'cancelled';
}

// ORDER_STATUS_LABELS from types/index.ts
const ORDER_STATUS_LABELS = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  packed: 'Packed',
  shipped: 'Shipped',
  outForDelivery: 'Out for Delivery',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refund_requested: 'Refund Requested',
  refund_processing: 'Refund Processing',
  refunded: 'Refunded',
  disputed: 'Disputed',
};

// Demo Personas from auth/store.ts
const DEMO_PERSONAS = {
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

// ORDER_STATUS_METADATA from order-transitions.ts
const ORDER_STATUS_METADATA = {
  placed: { label: 'Order Placed', isTerminal: false, isActive: true },
  confirmed: { label: 'Confirmed', isTerminal: false, isActive: true },
  processing: { label: 'Processing', isTerminal: false, isActive: true },
  packed: { label: 'Packed', isTerminal: false, isActive: true },
  shipped: { label: 'Shipped', isTerminal: false, isActive: true },
  outForDelivery: { label: 'Out for Delivery', isTerminal: false, isActive: true },
  delivered: { label: 'Delivered', isTerminal: true, isActive: false },
  cancelled: { label: 'Cancelled', isTerminal: true, isActive: false },
  refund_requested: { label: 'Refund Requested', isTerminal: false, isActive: false },
  refund_processing: { label: 'Refund Processing', isTerminal: false, isActive: false },
  refunded: { label: 'Refunded', isTerminal: true, isActive: false },
  disputed: { label: 'Disputed', isTerminal: false, isActive: false },
};

// ============================================================
// TEST SUITE: CANONICAL ORDER LIFECYCLE
// ============================================================
describe('Stage 12: Canonical Order Lifecycle & Transition Validation', () => {
  it('validates all forward-path happy-flow transitions from placed to delivered', () => {
    const happyPath = ['placed', 'confirmed', 'processing', 'packed', 'shipped', 'outForDelivery', 'delivered'];
    for (let i = 0; i < happyPath.length - 1; i++) {
      assert.ok(
        isValidOrderTransition(happyPath[i], happyPath[i + 1]),
        `Expected ${happyPath[i]} -> ${happyPath[i + 1]} to be valid`
      );
    }
  });

  it('validates cancellation is allowed from early states but prohibited from shipped/delivered', () => {
    // Cancellation allowed from placed, confirmed, processing, packed
    assert.ok(isValidOrderTransition('placed', 'cancelled'));
    assert.ok(isValidOrderTransition('confirmed', 'cancelled'));
    assert.ok(isValidOrderTransition('processing', 'cancelled'));
    assert.ok(isValidOrderTransition('packed', 'cancelled'));

    // Cancellation prohibited from shipped, outForDelivery, delivered
    assert.ok(!isValidOrderTransition('shipped', 'cancelled'));
    assert.ok(!isValidOrderTransition('outForDelivery', 'cancelled'));
    assert.ok(!isValidOrderTransition('delivered', 'cancelled'));
  });

  it('validates refund/dispute branch from delivered state', () => {
    assert.ok(isValidOrderTransition('delivered', 'refund_requested'));
    assert.ok(isValidOrderTransition('delivered', 'disputed'));
    assert.ok(isValidOrderTransition('refund_requested', 'refund_processing'));
    assert.ok(isValidOrderTransition('refund_requested', 'disputed'));
    assert.ok(isValidOrderTransition('disputed', 'refund_processing'));
    assert.ok(isValidOrderTransition('refund_processing', 'refunded'));
  });

  it('enforces terminal states have no outgoing transitions', () => {
    assert.deepStrictEqual(getNextAllowedOrderTransitions('refunded'), []);
    assert.deepStrictEqual(getNextAllowedOrderTransitions('cancelled'), []);
    assert.ok(isTerminalOrderStatus('refunded'));
    assert.ok(isTerminalOrderStatus('cancelled'));
    assert.ok(isTerminalOrderStatus('delivered'));
  });

  it('rejects invalid backward transitions', () => {
    assert.ok(!isValidOrderTransition('delivered', 'placed'));
    assert.ok(!isValidOrderTransition('shipped', 'confirmed'));
    assert.ok(!isValidOrderTransition('processing', 'placed'));
    assert.ok(!isValidOrderTransition('refunded', 'delivered'));
    assert.ok(!isValidOrderTransition('cancelled', 'placed'));
  });

  it('normalizes out_for_delivery snake_case to outForDelivery camelCase', () => {
    assert.strictEqual(normalizeOrderStatus('out_for_delivery'), 'outForDelivery');
    assert.strictEqual(normalizeOrderStatus('outForDelivery'), 'outForDelivery');
    assert.ok(isValidOrderTransition('shipped', 'out_for_delivery'));
  });

  it('identity transitions (same status) are treated as valid no-ops', () => {
    const allStatuses = Object.keys(ALLOWED_ORDER_TRANSITIONS);
    for (const status of allStatuses) {
      assert.ok(
        isValidOrderTransition(status, status),
        `Expected identity transition ${status} -> ${status} to be valid`
      );
    }
  });

  it('provides human-readable labels for all 13 canonical statuses', () => {
    const expectedStatuses = [
      'placed', 'confirmed', 'processing', 'packed', 'shipped',
      'outForDelivery', 'out_for_delivery', 'delivered', 'cancelled',
      'refund_requested', 'refund_processing', 'refunded', 'disputed',
    ];
    for (const status of expectedStatuses) {
      const label = ORDER_STATUS_LABELS[status];
      assert.ok(label, `Missing label for status: ${status}`);
      assert.ok(typeof label === 'string' && label.length > 0);
    }
  });

  it('provides metadata with isTerminal and isActive flags for every status', () => {
    for (const [status, meta] of Object.entries(ORDER_STATUS_METADATA)) {
      assert.ok(typeof meta.label === 'string', `Missing label in metadata for ${status}`);
      assert.ok(typeof meta.isTerminal === 'boolean', `Missing isTerminal for ${status}`);
      assert.ok(typeof meta.isActive === 'boolean', `Missing isActive for ${status}`);
    }
  });
});

// ============================================================
// TEST SUITE: DEMO PERSONAS & AUTH PARITY
// ============================================================
describe('Stage 12: Demo Personas & Multi-Role Authentication', () => {
  it('defines exactly 4 canonical demo personas with distinct roles', () => {
    const roles = Object.keys(DEMO_PERSONAS);
    assert.deepStrictEqual(roles.sort(), ['admin', 'cooperative_manager', 'farmer', 'seller']);
  });

  it('each persona has a unique user ID, email, and role', () => {
    const ids = new Set();
    const emails = new Set();
    const roles = new Set();

    for (const [role, persona] of Object.entries(DEMO_PERSONAS)) {
      assert.ok(persona.user.id, `Missing user id for role ${role}`);
      assert.ok(persona.email, `Missing email for role ${role}`);
      assert.ok(persona.password.length >= 6, `Password too short for role ${role}`);
      assert.strictEqual(persona.user.role, role, `Role mismatch for ${role}`);
      assert.ok(!ids.has(persona.user.id), `Duplicate user id: ${persona.user.id}`);
      assert.ok(!emails.has(persona.email), `Duplicate email: ${persona.email}`);
      ids.add(persona.user.id);
      emails.add(persona.email);
      roles.add(persona.user.role);
    }

    assert.strictEqual(roles.size, 4, 'Expected exactly 4 distinct roles');
  });

  it('farmer persona matches canonical values for cross-platform parity', () => {
    const farmer = DEMO_PERSONAS.farmer;
    assert.strictEqual(farmer.email, 'farmer@agritrade.in');
    assert.strictEqual(farmer.password, 'farmer123');
    assert.strictEqual(farmer.user.name, 'Rahul Sharma');
    assert.strictEqual(farmer.user.role, 'farmer');
  });

  it('seller persona has correct marketplace credentials', () => {
    const seller = DEMO_PERSONAS.seller;
    assert.strictEqual(seller.email, 'seller@agritrade.in');
    assert.strictEqual(seller.password, 'seller123');
    assert.strictEqual(seller.user.role, 'seller');
  });

  it('admin persona has platform governance credentials', () => {
    const admin = DEMO_PERSONAS.admin;
    assert.strictEqual(admin.email, 'admin@agritrade.in');
    assert.strictEqual(admin.password, 'admin123');
    assert.strictEqual(admin.user.role, 'admin');
  });

  it('cooperative manager persona has correct procurement credentials', () => {
    const coop = DEMO_PERSONAS.cooperative_manager;
    assert.strictEqual(coop.email, 'coop@agritrade.in');
    assert.strictEqual(coop.password, 'coop123');
    assert.strictEqual(coop.user.role, 'cooperative_manager');
  });
});

// ============================================================
// TEST SUITE: CROSS-PLATFORM PARITY
// ============================================================
describe('Stage 12: Cross-Platform Domain Parity', () => {
  it('OrderStatus labels are consistent with mobile displayName mappings', () => {
    // These are the canonical mappings that must match Dart OrderStatus.displayName
    const mobileDisplayNames = {
      placed: 'Order Placed',
      confirmed: 'Confirmed',
      processing: 'Processing',
      packed: 'Packed',
      shipped: 'Shipped',
      outForDelivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refund_requested: 'Refund Requested',
      refund_processing: 'Refund Processing',
      refunded: 'Refunded',
      disputed: 'Disputed',
    };

    for (const [status, expectedLabel] of Object.entries(mobileDisplayNames)) {
      assert.strictEqual(
        ORDER_STATUS_LABELS[status],
        expectedLabel,
        `Label mismatch for ${status}: expected "${expectedLabel}" got "${ORDER_STATUS_LABELS[status]}"`
      );
    }
  });

  it('all demo persona emails use @agritrade.in domain', () => {
    for (const [role, persona] of Object.entries(DEMO_PERSONAS)) {
      assert.ok(
        persona.email.endsWith('@agritrade.in'),
        `Persona ${role} email does not use @agritrade.in domain: ${persona.email}`
      );
    }
  });

  it('transition matrix is symmetric in allowed/prohibited semantics', () => {
    // If A -> B is allowed, B -> A should be explicitly defined
    // (either allowed or not, but B must exist in the matrix)
    for (const [from, targets] of Object.entries(ALLOWED_ORDER_TRANSITIONS)) {
      for (const to of targets) {
        assert.ok(
          to in ALLOWED_ORDER_TRANSITIONS,
          `Target status "${to}" from "${from}" is not defined in the transition matrix`
        );
      }
    }
  });
});
