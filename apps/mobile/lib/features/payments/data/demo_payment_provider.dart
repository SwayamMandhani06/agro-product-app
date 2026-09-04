import '../domain/payment_gateway.dart';
import '../domain/payment_transaction.dart';

/// Deterministic, zero-cost mock payment gateway for demonstrations and educational tests.
class DemoPaymentProvider implements PaymentGateway {
  const DemoPaymentProvider({this.simulatedLatencyMs = 600});

  final int simulatedLatencyMs;

  @override
  PaymentProvider get provider => PaymentProvider.demo;

  @override
  Future<PaymentResult> processPayment({
    required String orderId,
    required double amount,
    required PaymentMethod method,
    required String customerName,
    required String customerPhone,
    bool simulateFailure = false,
  }) async {
    if (simulatedLatencyMs > 0) {
      await Future<void>.delayed(Duration(milliseconds: simulatedLatencyMs));
    }

    if (simulateFailure) {
      final now = DateTime.now();
      return PaymentResult.failed(
        'Simulated payment failure (Insufficient sandbox balance or user decline). Checkout state is preserved.',
        tx: PaymentTransaction(
          id: 'pay_fail_${DateTime.now().millisecondsSinceEpoch}',
          orderId: orderId,
          userId: 'usr_default',
          provider: PaymentProvider.demo,
          amount: amount,
          currency: 'INR',
          method: method,
          status: PaymentStatus.failed,
          failureCode: 'SIMULATED_DECLINE',
          failureDescription: 'User initiated simulated test failure',
          createdAt: now,
          updatedAt: now,
        ),
      );
    }

    final now = DateTime.now();
    final txId = 'pay_demo_${now.millisecondsSinceEpoch}';
    final tx = PaymentTransaction(
      id: txId,
      orderId: orderId,
      userId: 'usr_default',
      provider: PaymentProvider.demo,
      providerPaymentId: 'demo_tx_${orderId.replaceAll('-', '_')}',
      amount: amount,
      currency: 'INR',
      method: method,
      status: PaymentStatus.paid,
      metadata: {
        'environment': 'sandbox_simulation',
        'is_demo': true,
        'customer_name': customerName,
      },
      createdAt: now,
      updatedAt: now,
    );

    return PaymentResult.successful(tx);
  }
}
