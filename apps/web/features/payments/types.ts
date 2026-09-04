// ============================================================
// AGRITRADE PAYMENT DOMAIN TYPES & INTERFACES (STAGE 7)
// ============================================================

import type { CartItem } from '@/types';
import type { DeliveryAddress } from '@/types';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod' | 'demo';

export type PaymentStatus =
  | 'created'
  | 'pending'
  | 'processing'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type PaymentProvider = 'razorpay_test' | 'cod' | 'demo';

export interface PaymentTransaction {
  id: string;
  orderId: string;
  userId: string;
  provider: PaymentProvider;
  providerPaymentId?: string;
  providerOrderId?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  metadata?: Record<string, unknown>;
  failureCode?: string;
  failureDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntentRequest {
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  provider: PaymentProvider;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: DeliveryAddress;
  items: CartItem[];
  notes?: Record<string, string>;
  simulateFailure?: boolean;
}

export interface PaymentResult {
  success: boolean;
  transaction?: PaymentTransaction;
  failureReason?: string;
  cancelled?: boolean;
}

export interface PaymentGatewayProvider {
  name: PaymentProvider;
  isAvailable(): boolean;
  processPayment(request: PaymentIntentRequest): Promise<PaymentResult>;
}
