// ============================================================
// DEMO PAYMENT FALLBACK PROVIDER (STAGE 7)
// Deterministic zero-cost sandbox provider for local/offline testing
// ============================================================

import type { PaymentGatewayProvider, PaymentIntentRequest, PaymentResult, PaymentTransaction } from '../types';

export class DemoPaymentProvider implements PaymentGatewayProvider {
  name = 'demo' as const;

  isAvailable(): boolean {
    return true; // Always available as free-tier demonstration fallback
  }

  async processPayment(request: PaymentIntentRequest): Promise<PaymentResult> {
    // Simulate real bank/gateway processing latency
    await new Promise((resolve) => setTimeout(resolve, 1100));

    if (request.simulateFailure) {
      return {
        success: false,
        failureReason: 'Simulated Gateway Error: Card Issuer / UPI VPA Declined Transaction.',
      };
    }

    const transaction: PaymentTransaction = {
      id: `demo_pay_${Date.now()}`,
      orderId: request.orderId,
      userId: request.userId,
      provider: 'demo',
      providerPaymentId: `demo_txn_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      amount: request.amount,
      currency: request.currency,
      method: request.method,
      status: 'paid',
      metadata: {
        sandboxMode: true,
        simulationType: 'instant_demo_settlement',
        disclaimer: 'Demonstration simulation. Zero financial charges incurred.',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      transaction,
    };
  }
}
