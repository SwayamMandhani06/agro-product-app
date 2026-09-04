import 'payment_transaction.dart';

/// Contract for payment gateway implementations.
abstract interface class PaymentGateway {
  /// Provider identity.
  PaymentProvider get provider;

  /// Processes or initiates a payment transaction.
  Future<PaymentResult> processPayment({
    required String orderId,
    required double amount,
    required PaymentMethod method,
    required String customerName,
    required String customerPhone,
    bool simulateFailure = false,
  });
}
