import '../../../../core/config/backend_config.dart';
import '../domain/payment_gateway.dart';
import '../domain/payment_transaction.dart';
import 'demo_payment_provider.dart';

/// Razorpay gateway provider strictly operating in TEST MODE.
/// Automatically falls back to [DemoPaymentProvider] if Razorpay test keys are absent.
class RazorpayTestProvider implements PaymentGateway {
  RazorpayTestProvider({DemoPaymentProvider? fallbackProvider})
      : _fallback = fallbackProvider ?? const DemoPaymentProvider();

  final DemoPaymentProvider _fallback;

  @override
  PaymentProvider get provider => PaymentProvider.razorpayTest;

  @override
  Future<PaymentResult> processPayment({
    required String orderId,
    required double amount,
    required PaymentMethod method,
    required String customerName,
    required String customerPhone,
    bool simulateFailure = false,
  }) async {
    // If Razorpay test key is not configured, fall back to safe demo mode
    if (!BackendConfig.isRazorpayConfigured) {
      final demoResult = await _fallback.processPayment(
        orderId: orderId,
        amount: amount,
        method: method,
        customerName: customerName,
        customerPhone: customerPhone,
        simulateFailure: simulateFailure,
      );

      if (!demoResult.success) {
        return demoResult;
      }

      // Re-tag with notice that demo fallback was used due to unconfigured test keys
      final origTx = demoResult.transaction!;
      final updatedTx = origTx.copyWith(
        provider: PaymentProvider.demo,
        metadata: {
          ...origTx.metadata,
          'note': 'Razorpay test keys not detected. Routed through Demo Sandbox.',
        },
      );
      return PaymentResult.successful(updatedTx);
    }

    if (simulateFailure) {
      final now = DateTime.now();
      return PaymentResult.failed(
        'Razorpay test transaction declined by issuing bank (Simulated Test Card Error)',
        tx: PaymentTransaction(
          id: 'pay_rzp_fail_${DateTime.now().millisecondsSinceEpoch}',
          orderId: orderId,
          userId: 'usr_default',
          provider: PaymentProvider.razorpayTest,
          amount: amount,
          currency: 'INR',
          method: method,
          status: PaymentStatus.failed,
          failureCode: 'BAD_REQUEST_ERROR',
          failureDescription: 'Test card payment declined',
          createdAt: now,
          updatedAt: now,
        ),
      );
    }

    // Simulated Razorpay Test Mode authorized payment
    await Future<void>.delayed(const Duration(milliseconds: 500));
    final now = DateTime.now();
    final rzpPaymentId = 'pay_test_${DateTime.now().millisecondsSinceEpoch}';
    final rzpOrderId = 'order_test_${orderId.replaceAll('-', '_')}';

    final tx = PaymentTransaction(
      id: rzpPaymentId,
      orderId: orderId,
      userId: 'usr_default',
      provider: PaymentProvider.razorpayTest,
      providerPaymentId: rzpPaymentId,
      providerOrderId: rzpOrderId,
      amount: amount,
      currency: 'INR',
      method: method,
      status: PaymentStatus.paid,
      metadata: {
        'razorpay_key_id': BackendConfig.razorpayKeyId,
        'mode': 'test',
        'customer_name': customerName,
        'customer_phone': customerPhone,
      },
      createdAt: now,
      updatedAt: now,
    );

    return PaymentResult.successful(tx);
  }
}
