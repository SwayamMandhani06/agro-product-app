import '../domain/payment_gateway.dart';
import '../domain/payment_transaction.dart';

/// Cash on Delivery provider.
/// Does not invoke an external payment gateway; marks the transaction status as pending/cash_due.
class CodPaymentProvider implements PaymentGateway {
  const CodPaymentProvider();

  @override
  PaymentProvider get provider => PaymentProvider.cod;

  @override
  Future<PaymentResult> processPayment({
    required String orderId,
    required double amount,
    required PaymentMethod method,
    required String customerName,
    required String customerPhone,
    bool simulateFailure = false,
  }) async {
    final now = DateTime.now();
    final tx = PaymentTransaction(
      id: 'pay_cod_${now.millisecondsSinceEpoch}',
      orderId: orderId,
      userId: 'usr_default',
      provider: PaymentProvider.cod,
      amount: amount,
      currency: 'INR',
      method: PaymentMethod.cod,
      status: PaymentStatus.pending, // Pending cash collection on delivery
      metadata: {
        'collection_type': 'cash_on_delivery',
        'customer_name': customerName,
        'customer_phone': customerPhone,
      },
      createdAt: now,
      updatedAt: now,
    );

    return PaymentResult.successful(tx);
  }
}
