enum PaymentStatus { success, failed, cancelled }

class PaymentResult {
  const PaymentResult({
    required this.transactionId,
    required this.status,
    required this.amountInPaise,
    required this.currency,
    this.message,
  });

  final String transactionId;
  final PaymentStatus status;
  final int amountInPaise;
  final String currency;
  final String? message;
}

class PaymentRequest {
  const PaymentRequest({
    required this.orderId,
    required this.amountInPaise,
    required this.currency,
    required this.customerName,
    required this.customerEmail,
    required this.customerPhone,
  });

  final String orderId;
  final int amountInPaise;
  final String currency;
  final String customerName;
  final String customerEmail;
  final String customerPhone;
}
