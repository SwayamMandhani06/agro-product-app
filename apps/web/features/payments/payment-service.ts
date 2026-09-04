// ============================================================
// AGRITRADE UNIFIED PAYMENT SERVICE (STAGE 7)
// ============================================================

import type { PaymentGatewayProvider, PaymentIntentRequest, PaymentProvider, PaymentResult, PaymentTransaction } from './types';
import { RazorpayTestProvider } from './providers/razorpay-provider';
import { DemoPaymentProvider } from './providers/demo-provider';
import { CodPaymentProvider } from './providers/cod-provider';
import { getSupabaseClient } from '@/lib/supabase/client';

class PaymentService {
  private providers: Map<PaymentProvider, PaymentGatewayProvider> = new Map();
  private inFlightTransactions: Set<string> = new Set();
  private storageKey = 'agritrade_payment_transactions';

  constructor() {
    this.registerProvider(new RazorpayTestProvider());
    this.registerProvider(new DemoPaymentProvider());
    this.registerProvider(new CodPaymentProvider());
  }

  registerProvider(provider: PaymentGatewayProvider) {
    this.providers.set(provider.name, provider);
  }

  isRazorpayAvailable(): boolean {
    const rzp = this.providers.get('razorpay_test');
    return rzp ? rzp.isAvailable() : false;
  }

  async executePayment(request: PaymentIntentRequest): Promise<PaymentResult> {
    // 1. Idempotency & Duplicate Submission Lock
    const idempotencyKey = `${request.orderId}_${request.amount}_${request.method}`;
    if (this.inFlightTransactions.has(idempotencyKey)) {
      return {
        success: false,
        failureReason: 'Transaction already in progress. Please wait for confirmation.',
      };
    }

    this.inFlightTransactions.add(idempotencyKey);

    try {
      // 2. Select appropriate provider
      let activeProviderName: PaymentProvider = request.provider;
      if (request.method === 'cod') {
        activeProviderName = 'cod';
      } else if (activeProviderName === 'razorpay_test' && !this.isRazorpayAvailable()) {
        // Graceful automatic fallback to demo sandbox if Razorpay key is absent
        activeProviderName = 'demo';
      }

      const provider = this.providers.get(activeProviderName) ?? this.providers.get('demo')!;
      const result = await provider.processPayment(request);

      if (result.success && result.transaction) {
        await this.persistTransaction(result.transaction);
      }

      return result;
    } finally {
      this.inFlightTransactions.delete(idempotencyKey);
    }
  }

  private async persistTransaction(txn: PaymentTransaction): Promise<void> {
    // 1. Local Persistence
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        stored.unshift(txn);
        localStorage.setItem(this.storageKey, JSON.stringify(stored));
      } catch (e) {
        console.warn('Could not save transaction to local storage', e);
      }
    }

    // 2. Supabase PostgREST Persistence (if configured)
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('payments').insert({
          id: txn.id,
          order_id: txn.orderId,
          user_id: txn.userId,
          provider: txn.provider,
          provider_payment_id: txn.providerPaymentId,
          provider_order_id: txn.providerOrderId,
          amount: txn.amount,
          currency: txn.currency,
          method: txn.method,
          status: txn.status,
          metadata: txn.metadata ?? {},
          created_at: txn.createdAt,
          updated_at: txn.updatedAt,
        });

        await client.from('payment_events').insert({
          payment_id: txn.id,
          event_type: `payment_${txn.status}`,
          payload: {
            method: txn.method,
            provider: txn.provider,
            amount: txn.amount,
          },
          created_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Failed to push payment record to Supabase (continuing in resilient offline mode)', err);
      }
    }
  }

  getTransactionByOrderId(orderId: string): PaymentTransaction | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored: PaymentTransaction[] = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return stored.find((t) => t.orderId === orderId) || null;
    } catch {
      return null;
    }
  }
}

export const paymentService = new PaymentService();
