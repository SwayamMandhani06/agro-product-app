import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/cod_payment_provider.dart';
import '../../data/demo_payment_provider.dart';
import '../../data/razorpay_test_provider.dart';
import '../../domain/payment_gateway.dart';
import '../../domain/payment_transaction.dart';

/// Explicit lifecycle states during payment processing.
enum PaymentLifecycle {
  idle,
  validating,
  creatingPayment,
  awaitingGateway,
  verifying,
  success,
  failure,
  cancelled,
}

/// State representation for checkout payment handling.
class PaymentState {
  const PaymentState({
    this.lifecycle = PaymentLifecycle.idle,
    this.selectedMethod = PaymentMethod.cod,
    this.lastTransaction,
    this.errorMessage,
    this.simulateFailure = false,
    this.inFlightLocks = const {},
  });

  final PaymentLifecycle lifecycle;
  final PaymentMethod selectedMethod;
  final PaymentTransaction? lastTransaction;
  final String? errorMessage;
  final bool simulateFailure;
  final Set<String> inFlightLocks;

  bool get isProcessing =>
      lifecycle == PaymentLifecycle.validating ||
      lifecycle == PaymentLifecycle.creatingPayment ||
      lifecycle == PaymentLifecycle.awaitingGateway ||
      lifecycle == PaymentLifecycle.verifying;

  bool get isSuccess => lifecycle == PaymentLifecycle.success;
  bool get isFailure => lifecycle == PaymentLifecycle.failure;
  bool get isCancelled => lifecycle == PaymentLifecycle.cancelled;

  PaymentState copyWith({
    PaymentLifecycle? lifecycle,
    PaymentMethod? selectedMethod,
    PaymentTransaction? lastTransaction,
    String? errorMessage,
    bool? simulateFailure,
    Set<String>? inFlightLocks,
  }) {
    return PaymentState(
      lifecycle: lifecycle ?? this.lifecycle,
      selectedMethod: selectedMethod ?? this.selectedMethod,
      lastTransaction: lastTransaction ?? this.lastTransaction,
      errorMessage: errorMessage,
      simulateFailure: simulateFailure ?? this.simulateFailure,
      inFlightLocks: inFlightLocks ?? this.inFlightLocks,
    );
  }
}

/// Provider for available payment gateways based on chosen method.
final demoPaymentProvider = Provider<PaymentGateway>((ref) {
  return const DemoPaymentProvider();
});

final codPaymentProvider = Provider<PaymentGateway>((ref) {
  return const CodPaymentProvider();
});

final razorpayTestProvider = Provider<PaymentGateway>((ref) {
  return RazorpayTestProvider();
});

/// Notifier managing payment lifecycle, gateway execution, and duplicate submission locks.
class PaymentNotifier extends StateNotifier<PaymentState> {
  PaymentNotifier(this._ref) : super(const PaymentState());

  final Ref _ref;

  /// Changes the user-selected payment instrument.
  void selectMethod(PaymentMethod method) {
    state = state.copyWith(
      selectedMethod: method,
      errorMessage: null,
      lifecycle: PaymentLifecycle.idle,
    );
  }

  /// Sets simulation failure flag for educational sandbox testing.
  void setSimulateFailure(bool value) {
    state = state.copyWith(simulateFailure: value);
  }

  /// Resets state back to idle.
  void reset() {
    state = state.copyWith(
      lifecycle: PaymentLifecycle.idle,
      errorMessage: null,
    );
  }

  /// Executes payment through the appropriate gateway with idempotency protection.
  Future<PaymentResult> processPayment({
    required String orderId,
    required double amount,
    required String customerName,
    required String customerPhone,
  }) async {
    final lockKey = '${orderId}_${amount.toStringAsFixed(2)}_${state.selectedMethod.name}';

    // 1. Idempotency Check: Prevent duplicate submissions
    if (state.inFlightLocks.contains(lockKey) || state.isProcessing) {
      return const PaymentResult(
        success: false,
        errorMessage: 'A payment is already being processed for this order. Duplicate prevented.',
      );
    }

    final newLocks = Set<String>.from(state.inFlightLocks)..add(lockKey);
    state = state.copyWith(
      lifecycle: PaymentLifecycle.validating,
      errorMessage: null,
      inFlightLocks: newLocks,
    );

    try {
      // Step: Validating
      await Future<void>.delayed(const Duration(milliseconds: 100));

      // Step: Creating Payment Context
      state = state.copyWith(lifecycle: PaymentLifecycle.creatingPayment);
      await Future<void>.delayed(const Duration(milliseconds: 150));

      // Step: Awaiting Gateway
      state = state.copyWith(lifecycle: PaymentLifecycle.awaitingGateway);

      final PaymentGateway gateway = switch (state.selectedMethod) {
        PaymentMethod.cod => _ref.read(codPaymentProvider),
        PaymentMethod.demo => _ref.read(demoPaymentProvider),
        PaymentMethod.upi || PaymentMethod.card => _ref.read(razorpayTestProvider),
      };

      final result = await gateway.processPayment(
        orderId: orderId,
        amount: amount,
        method: state.selectedMethod,
        customerName: customerName,
        customerPhone: customerPhone,
        simulateFailure: state.simulateFailure,
      );

      // Step: Verifying
      state = state.copyWith(lifecycle: PaymentLifecycle.verifying);
      await Future<void>.delayed(const Duration(milliseconds: 150));

      final remainingLocks = Set<String>.from(state.inFlightLocks)..remove(lockKey);

      if (result.success && result.transaction != null) {
        state = state.copyWith(
          lifecycle: PaymentLifecycle.success,
          lastTransaction: result.transaction,
          inFlightLocks: remainingLocks,
        );
        return result;
      } else if (result.isCancelled) {
        state = state.copyWith(
          lifecycle: PaymentLifecycle.cancelled,
          errorMessage: result.errorMessage ?? 'Payment cancelled by user',
          inFlightLocks: remainingLocks,
        );
        return result;
      } else {
        state = state.copyWith(
          lifecycle: PaymentLifecycle.failure,
          errorMessage: result.errorMessage ?? 'Payment processing failed. Please retry.',
          lastTransaction: result.transaction,
          inFlightLocks: remainingLocks,
        );
        return result;
      }
    } catch (e) {
      final remainingLocks = Set<String>.from(state.inFlightLocks)..remove(lockKey);
      state = state.copyWith(
        lifecycle: PaymentLifecycle.failure,
        errorMessage: 'Unexpected payment error: $e',
        inFlightLocks: remainingLocks,
      );
      return PaymentResult.failed(e.toString());
    }
  }
}

/// Global payment state provider.
final paymentStateProvider =
    StateNotifierProvider<PaymentNotifier, PaymentState>((ref) {
  return PaymentNotifier(ref);
});
