import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/admin_repository.dart';
import '../../domain/governance_entities.dart';

// Repository singleton
final adminRepositoryProvider = Provider<AdminRepository>((ref) {
  return InMemoryAdminRepository();
});

// Seller Verifications StateNotifier
class SellerVerificationsNotifier extends StateNotifier<AsyncValue<List<AdminSellerVerification>>> {
  final AdminRepository _repository;

  SellerVerificationsNotifier(this._repository) : super(const AsyncValue.loading()) {
    loadVerifications();
  }

  Future<void> loadVerifications() async {
    state = const AsyncValue.loading();
    try {
      final list = await _repository.getSellerVerifications();
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> updateStatus(
    String id,
    AdminVerificationStatus newStatus, {
    String? rejectionReason,
    String? internalNote,
  }) async {
    try {
      await _repository.updateVerificationStatus(
        id,
        newStatus,
        rejectionReason: rejectionReason,
        internalNote: internalNote,
      );
      await loadVerifications();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final sellerVerificationsProvider =
    StateNotifierProvider<SellerVerificationsNotifier, AsyncValue<List<AdminSellerVerification>>>((ref) {
  final repo = ref.watch(adminRepositoryProvider);
  return SellerVerificationsNotifier(repo);
});

// Product Moderation StateNotifier
class ProductModerationNotifier extends StateNotifier<AsyncValue<List<AdminProductModeration>>> {
  final AdminRepository _repository;

  ProductModerationNotifier(this._repository) : super(const AsyncValue.loading()) {
    loadModerations();
  }

  Future<void> loadModerations() async {
    state = const AsyncValue.loading();
    try {
      final list = await _repository.getProductModerations();
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> updateStatus(
    String id,
    AdminModerationStatus newStatus, {
    String? rejectionReason,
  }) async {
    try {
      await _repository.updateModerationStatus(
        id,
        newStatus,
        rejectionReason: rejectionReason,
      );
      await loadModerations();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final productModerationProvider =
    StateNotifierProvider<ProductModerationNotifier, AsyncValue<List<AdminProductModeration>>>((ref) {
  final repo = ref.watch(adminRepositoryProvider);
  return ProductModerationNotifier(repo);
});

// Disputes StateNotifier
class DisputesNotifier extends StateNotifier<AsyncValue<List<AdminDispute>>> {
  final AdminRepository _repository;

  DisputesNotifier(this._repository) : super(const AsyncValue.loading()) {
    loadDisputes();
  }

  Future<void> loadDisputes() async {
    state = const AsyncValue.loading();
    try {
      final list = await _repository.getDisputes();
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> updateStatus(
    String id,
    AdminDisputeStatus newStatus, {
    String? resolution,
  }) async {
    try {
      await _repository.updateDisputeStatus(id, newStatus, resolution: resolution);
      await loadDisputes();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> addMessage(
    String disputeId,
    String content, {
    String authorId = 'usr_admin_demo',
    String authorName = 'Platform Admin',
    String authorRole = 'admin',
  }) async {
    try {
      await _repository.addDisputeMessage(
        disputeId,
        content,
        authorId,
        authorName,
        authorRole,
      );
      await loadDisputes();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final adminDisputesProvider =
    StateNotifierProvider<DisputesNotifier, AsyncValue<List<AdminDispute>>>((ref) {
  final repo = ref.watch(adminRepositoryProvider);
  return DisputesNotifier(repo);
});

// Risk Signals StateNotifier
class RiskSignalsNotifier extends StateNotifier<AsyncValue<List<AdminRiskSignal>>> {
  final AdminRepository _repository;

  RiskSignalsNotifier(this._repository) : super(const AsyncValue.loading()) {
    loadRiskSignals();
  }

  Future<void> loadRiskSignals() async {
    state = const AsyncValue.loading();
    try {
      final list = await _repository.getRiskSignals();
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> resolve(String id) async {
    try {
      await _repository.resolveRiskSignal(id);
      await loadRiskSignals();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final riskSignalsProvider =
    StateNotifierProvider<RiskSignalsNotifier, AsyncValue<List<AdminRiskSignal>>>((ref) {
  final repo = ref.watch(adminRepositoryProvider);
  return RiskSignalsNotifier(repo);
});

// Audit Logs FutureProvider
final auditLogsProvider = FutureProvider<List<AdminAuditLogEntry>>((ref) async {
  final repo = ref.watch(adminRepositoryProvider);
  return repo.getAuditLogs();
});

// Platform Metrics FutureProvider
final platformMetricsProvider = FutureProvider<AdminPlatformMetrics>((ref) async {
  final repo = ref.watch(adminRepositoryProvider);
  return repo.getPlatformMetrics();
});

// Operational Alerts FutureProvider
final operationalAlertsProvider = FutureProvider<List<AdminOperationalAlert>>((ref) async {
  final repo = ref.watch(adminRepositoryProvider);
  return repo.getOperationalAlerts();
});
