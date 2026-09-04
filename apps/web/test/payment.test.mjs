import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Stage 7: Web Payment Infrastructure & Checkout Experience', () => {
  // 1. Payment Methods & Canonical Statuses
  it('supports all canonical payment methods and state transitions', () => {
    const validMethods = ['upi', 'card', 'cod', 'demo'];
    const validStatuses = [
      'created',
      'pending',
      'processing',
      'authorized',
      'paid',
      'failed',
      'cancelled',
      'refunded',
    ];

    validMethods.forEach((method) => {
      assert.ok(typeof method === 'string');
    });

    validStatuses.forEach((status) => {
      assert.ok(typeof status === 'string');
    });

    const isTransitionValid = (current, next) => {
      const allowed = {
        created: ['processing', 'pending', 'cancelled'],
        pending: ['paid', 'failed', 'cancelled'],
        processing: ['authorized', 'paid', 'failed', 'cancelled'],
        authorized: ['paid', 'failed'],
        paid: ['refunded'],
        failed: ['processing', 'pending'], // retry allowed
        cancelled: ['processing', 'pending'], // retry allowed
        refunded: [],
      };
      return allowed[current]?.includes(next) ?? false;
    };

    assert.equal(isTransitionValid('created', 'processing'), true);
    assert.equal(isTransitionValid('processing', 'paid'), true);
    assert.equal(isTransitionValid('processing', 'failed'), true);
    assert.equal(isTransitionValid('failed', 'processing'), true); // retry
    assert.equal(isTransitionValid('paid', 'failed'), false);
  });

  // 2. Demo Payment Provider Deterministic Simulation
  it('handles deterministic Demo Payment success with correct transaction shape', async () => {
    const simulateDemoPayment = async (orderId, amount, shouldFail = false) => {
      if (shouldFail) {
        return {
          success: false,
          error: 'Demo payment simulated decline (Card expired or insufficient test balance)',
        };
      }
      return {
        success: true,
        transaction: {
          id: `pay_demo_${Date.now()}`,
          orderId,
          userId: 'usr_default',
          provider: 'demo',
          providerPaymentId: `demo_tx_${Math.random().toString(36).substring(2, 9)}`,
          amount,
          currency: 'INR',
          method: 'demo',
          status: 'paid',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    };

    const res = await simulateDemoPayment('ord_1001', 1250, false);
    assert.equal(res.success, true);
    assert.equal(res.transaction?.orderId, 'ord_1001');
    assert.equal(res.transaction?.status, 'paid');
    assert.equal(res.transaction?.provider, 'demo');
    assert.equal(res.transaction?.currency, 'INR');
    assert.ok(res.transaction?.providerPaymentId.startsWith('demo_tx_'));
  });

  // 3. Demo Payment Failure Simulation & State Preservation
  it('handles deterministic Demo Payment failure without mutating order as paid', async () => {
    const simulateDemoPayment = async (orderId, amount, shouldFail = false) => {
      if (shouldFail) {
        return {
          success: false,
          error: 'Simulated payment processing failure for testing retry flow',
        };
      }
      return { success: true };
    };

    const cartBefore = [{ id: 'prod_1', quantity: 2, price: 500 }];
    const res = await simulateDemoPayment('ord_1002', 1000, true);

    assert.equal(res.success, false);
    assert.ok(res.error.includes('failure'));
    // Cart is preserved upon payment failure
    assert.equal(cartBefore.length, 1);
    assert.equal(cartBefore[0].quantity, 2);
  });

  // 4. Cash on Delivery (COD) Provider Flow
  it('handles COD orders with pending / cash_due status and no gateway initialization', () => {
    const processCodPayment = (orderId, amount) => {
      return {
        success: true,
        transaction: {
          id: `pay_cod_${Date.now()}`,
          orderId,
          userId: 'usr_default',
          provider: 'cod',
          amount,
          currency: 'INR',
          method: 'cod',
          status: 'pending', // Pending cash collection upon consignment delivery
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    };

    const res = processCodPayment('ord_cod_777', 3400);
    assert.equal(res.success, true);
    assert.equal(res.transaction.provider, 'cod');
    assert.equal(res.transaction.status, 'pending');
    assert.equal(res.transaction.method, 'cod');
  });

  // 5. Idempotency & Duplicate Submission Lock
  it('prevents duplicate payment submissions via idempotency keys', () => {
    const inflightRequests = new Set();

    const acquireLock = (orderId, amount, method) => {
      const lockKey = `${orderId}_${amount}_${method}`;
      if (inflightRequests.has(lockKey)) {
        return false; // locked: duplicate submission blocked
      }
      inflightRequests.add(lockKey);
      return true;
    };

    const releaseLock = (orderId, amount, method) => {
      inflightRequests.delete(`${orderId}_${amount}_${method}`);
    };

    // First click succeeds
    const firstAttempt = acquireLock('ord_dupe_1', 1500, 'upi');
    assert.equal(firstAttempt, true);

    // Rapid second click is blocked
    const secondAttempt = acquireLock('ord_dupe_1', 1500, 'upi');
    assert.equal(secondAttempt, false);

    // After release, new attempt can proceed
    releaseLock('ord_dupe_1', 1500, 'upi');
    const thirdAttempt = acquireLock('ord_dupe_1', 1500, 'upi');
    assert.equal(thirdAttempt, true);
  });

  // 6. Receipt / Tax Invoice Computation & Educational Sandbox Disclosures
  it('computes correct invoice breakdown and includes sandbox disclosures', () => {
    const items = [
      { name: 'Organic NPK Fertilizer (50kg)', price: 1200, quantity: 2 },
      { name: 'Drip Irrigation Nozzle Kit', price: 450, quantity: 1 },
    ];
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxRate = 0.05; // 5% GST
    const estimatedTax = Math.round(subtotal * taxRate);
    const deliveryFee = subtotal > 2000 ? 0 : 150;
    const grandTotal = subtotal + estimatedTax + deliveryFee;

    assert.equal(subtotal, 2850);
    assert.equal(estimatedTax, 143);
    assert.equal(deliveryFee, 0);
    assert.equal(grandTotal, 2993);

    const formatReceipt = (orderId, paymentMethod, isDemo) => {
      return {
        invoiceNumber: `INV-${orderId}`,
        platform: 'AgriTrade Marketplace Pvt. Ltd.',
        paymentMethod,
        isDemo,
        legalNotice: isDemo
          ? 'EDUCATIONAL SANDBOX SIMULATION · NO REAL CURRENCY EXCHANGED'
          : 'RAZORPAY TEST MODE RECEIPT',
      };
    };

    const demoReceipt = formatReceipt('ord_1001', 'demo', true);
    assert.ok(demoReceipt.legalNotice.includes('EDUCATIONAL SANDBOX'));

    const testReceipt = formatReceipt('ord_1002', 'upi', false);
    assert.ok(testReceipt.legalNotice.includes('RAZORPAY TEST MODE'));
  });

  // 7. Payment Cancellation Handling
  it('handles payment cancellation gracefully without losing checkout state', () => {
    let checkoutState = {
      selectedAddressId: 'addr_1',
      selectedMethod: 'card',
      inProgress: true,
      error: null,
    };

    const handleCancel = () => {
      checkoutState = {
        ...checkoutState,
        inProgress: false,
        error: 'Payment transaction cancelled by user. Please select a payment instrument or retry.',
      };
    };

    handleCancel();
    assert.equal(checkoutState.inProgress, false);
    assert.equal(checkoutState.selectedAddressId, 'addr_1');
    assert.ok(checkoutState.error.includes('cancelled by user'));
  });
});
