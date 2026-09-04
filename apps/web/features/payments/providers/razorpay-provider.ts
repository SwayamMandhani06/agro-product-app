// ============================================================
// RAZORPAY TEST MODE PAYMENT PROVIDER (STAGE 7)
// STRICTLY TEST MODE ONLY — NEVER COMMITS OR EXPOSES SECRETS
// ============================================================

import type { PaymentGatewayProvider, PaymentIntentRequest, PaymentResult, PaymentTransaction } from '../types';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export class RazorpayTestProvider implements PaymentGatewayProvider {
  name = 'razorpay_test' as const;

  private loadScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if (window.Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  isAvailable(): boolean {
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    return Boolean(key && key.startsWith('rzp_test_'));
  }

  async processPayment(request: PaymentIntentRequest): Promise<PaymentResult> {
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!key) {
      return {
        success: false,
        failureReason: 'Razorpay Test Mode key is not configured. Falling back to Demo Sandbox.',
      };
    }

    const scriptLoaded = await this.loadScript();
    if (!scriptLoaded) {
      return {
        success: false,
        failureReason: 'Failed to load Razorpay Test Checkout script. Please check your network connection.',
      };
    }

    return new Promise((resolve) => {
      const options = {
        key: key,
        amount: Math.round(request.amount * 100), // Amount in paise
        currency: request.currency || 'INR',
        name: 'AgriTrade Marketplace',
        description: 'Certified Farm Inputs Purchase (Test Mode)',
        image: '/icon-192.png',
        prefill: {
          name: request.customerName,
          email: request.customerEmail,
          contact: request.customerPhone,
        },
        theme: {
          color: '#145A43', // AgriTrade forest green
        },
        modal: {
          ondismiss: () => {
            resolve({
              success: false,
              cancelled: true,
              failureReason: 'Payment window was closed by the user.',
            });
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: (response: any) => {
          const transaction: PaymentTransaction = {
            id: `pay_rzp_${Date.now()}`,
            orderId: request.orderId,
            userId: request.userId,
            provider: 'razorpay_test',
            providerPaymentId: response.razorpay_payment_id,
            providerOrderId: response.razorpay_order_id,
            amount: request.amount,
            currency: request.currency,
            method: request.method,
            status: 'paid',
            metadata: {
              razorpay_signature: response.razorpay_signature,
              mode: 'test_sandbox',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          resolve({
            success: true,
            transaction,
          });
        },
      };

      try {
        const rzp = new window.Razorpay(options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rzp.on('payment.failed', (resp: any) => {
          resolve({
            success: false,
            failureReason: resp.error?.description || 'Payment rejected by test gateway.',
          });
        });
        rzp.open();
      } catch (err) {
        resolve({
          success: false,
          failureReason: err instanceof Error ? err.message : 'Error initiating Razorpay checkout.',
        });
      }
    });
  }
}
