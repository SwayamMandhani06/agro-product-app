import '../../../core/error/failure.dart';
import 'payment_result.dart';

abstract interface class PaymentGateway {
  Future<Result<PaymentResult>> pay(PaymentRequest request);
}
