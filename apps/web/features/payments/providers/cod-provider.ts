// ============================================================
// CASH ON DELIVERY (COD) PAYMENT PROVIDER (STAGE 7)
// Creates order with pending cash-due status for doorstep inspection
// ============================================================

import type { PaymentGatewayProvider, PaymentIntentRequest, PaymentResult, PaymentTransaction } from '../types';

export class CodPaymentProvider implements PaymentGatewayProvider {
  name = 'cod' as const;

  isAvailable(): boolean {
    return true;
  }

  async processPayment(request: PaymentIntentRequest): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const transaction: PaymentTransaction = {
      id: `cod_${Date.now()}`,
      orderId: request.orderId,
      userId: request.userId,
      provider: 'cod',
      amount: request.amount,
      currency: request.currency,
      method: 'cod',
      status: 'pending', // Cash due at farm delivery
      metadata: {
        paymentDueAt: 'delivery',
        instructions: 'Verify seed batch seals & germination certificate before paying delivery agent.',
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
