import 'package:flutter/foundation.dart';

/// Supported payment methods across the AgriTrade commerce ecosystem.
enum PaymentMethod {
  upi,
  card,
  cod,
  demo;

  String get displayName => switch (this) {
        PaymentMethod.upi => 'UPI / QR Payment',
        PaymentMethod.card => 'Credit / Debit Card',
        PaymentMethod.cod => 'Cash on Delivery',
        PaymentMethod.demo => 'Demo Payment Sandbox',
      };

  String get subtitle => switch (this) {
        PaymentMethod.upi => 'Google Pay, PhonePe, Paytm, BHIM',
        PaymentMethod.card => 'Visa, Mastercard, RuPay (Test Mode)',
        PaymentMethod.cod => 'Pay in cash upon physical consignment delivery',
        PaymentMethod.demo => 'Educational simulated gateway (zero charges)',
      };
}

/// Canonical payment transaction states.
enum PaymentStatus {
  created,
  pending,
  processing,
  authorized,
  paid,
  failed,
  cancelled,
  refunded;

  String get displayName => switch (this) {
        PaymentStatus.created => 'Created',
        PaymentStatus.pending => 'Pending',
        PaymentStatus.processing => 'Processing',
        PaymentStatus.authorized => 'Authorized',
        PaymentStatus.paid => 'Paid',
        PaymentStatus.failed => 'Failed',
        PaymentStatus.cancelled => 'Cancelled',
        PaymentStatus.refunded => 'Refunded',
      };

  bool get isSuccessful => this == PaymentStatus.paid;
  bool get isTerminal =>
      this == PaymentStatus.paid ||
      this == PaymentStatus.failed ||
      this == PaymentStatus.cancelled ||
      this == PaymentStatus.refunded;
}

/// Supported payment providers.
enum PaymentProvider {
  razorpayTest,
  cod,
  demo;

  String get id => switch (this) {
        PaymentProvider.razorpayTest => 'razorpay_test',
        PaymentProvider.cod => 'cod',
        PaymentProvider.demo => 'demo',
      };

  String get displayName => switch (this) {
        PaymentProvider.razorpayTest => 'Razorpay Test Gateway',
        PaymentProvider.cod => 'Cash on Delivery',
        PaymentProvider.demo => 'Demo Payment Sandbox',
      };
}

/// Domain entity representing a payment transaction record.
@immutable
class PaymentTransaction {
  const PaymentTransaction({
    required this.id,
    required this.orderId,
    required this.userId,
    required this.provider,
    required this.amount,
    required this.currency,
    required this.method,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
    this.providerPaymentId,
    this.providerOrderId,
    this.failureCode,
    this.failureDescription,
    this.metadata = const {},
  });

  final String id;
  final String orderId;
  final String userId;
  final PaymentProvider provider;
  final double amount;
  final String currency;
  final PaymentMethod method;
  final PaymentStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String? providerPaymentId;
  final String? providerOrderId;
  final String? failureCode;
  final String? failureDescription;
  final Map<String, dynamic> metadata;

  PaymentTransaction copyWith({
    String? id,
    String? orderId,
    String? userId,
    PaymentProvider? provider,
    double? amount,
    String? currency,
    PaymentMethod? method,
    PaymentStatus? status,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? providerPaymentId,
    String? providerOrderId,
    String? failureCode,
    String? failureDescription,
    Map<String, dynamic>? metadata,
  }) {
    return PaymentTransaction(
      id: id ?? this.id,
      orderId: orderId ?? this.orderId,
      userId: userId ?? this.userId,
      provider: provider ?? this.provider,
      amount: amount ?? this.amount,
      currency: currency ?? this.currency,
      method: method ?? this.method,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      providerPaymentId: providerPaymentId ?? this.providerPaymentId,
      providerOrderId: providerOrderId ?? this.providerOrderId,
      failureCode: failureCode ?? this.failureCode,
      failureDescription: failureDescription ?? this.failureDescription,
      metadata: metadata ?? this.metadata,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'order_id': orderId,
      'user_id': userId,
      'provider': provider.id,
      'provider_payment_id': providerPaymentId,
      'provider_order_id': providerOrderId,
      'amount': amount,
      'currency': currency,
      'method': method.name,
      'status': status.name,
      'failure_code': failureCode,
      'failure_description': failureDescription,
      'metadata': metadata,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}

/// Result returned from payment processing attempt.
@immutable
class PaymentResult {
  const PaymentResult({
    required this.success,
    this.transaction,
    this.errorMessage,
    this.isCancelled = false,
  });

  final bool success;
  final PaymentTransaction? transaction;
  final String? errorMessage;
  final bool isCancelled;

  factory PaymentResult.successful(PaymentTransaction tx) {
    return PaymentResult(success: true, transaction: tx);
  }

  factory PaymentResult.failed(String message, {PaymentTransaction? tx}) {
    return PaymentResult(
      success: false,
      transaction: tx,
      errorMessage: message,
    );
  }

  factory PaymentResult.cancelled({String? message}) {
    return PaymentResult(
      success: false,
      isCancelled: true,
      errorMessage: message ?? 'Payment cancelled by user',
    );
  }
}
