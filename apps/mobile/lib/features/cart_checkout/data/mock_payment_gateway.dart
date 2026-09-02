import 'package:fpdart/fpdart.dart';

import '../../../core/error/failure.dart';
import '../domain/payment_gateway.dart';
import '../domain/payment_result.dart';

class MockPaymentGateway implements PaymentGateway {
  const MockPaymentGateway();

  @override
  Future<Result<PaymentResult>> pay(PaymentRequest request) async {
    await Future<void>.delayed(const Duration(milliseconds: 500));
    if (request.amountInPaise <= 0) {
      return const Left(UnknownFailure('Payment amount must be greater than zero.'));
    }
    return Right(
      PaymentResult(
        transactionId: 'mock_txn_${request.orderId}',
        status: PaymentStatus.success,
        amountInPaise: request.amountInPaise,
        currency: request.currency,
        message: 'Mock payment successful.',
      ),
    );
  }
}
