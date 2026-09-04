// ============================================================
// AGRITRADE STAGE 11: MOBILE ADMIN & GOVERNANCE TESTS
// Unit tests for permissions, repository, and StateNotifiers
// ============================================================

import 'package:flutter_test/flutter_test.dart';
import 'package:agro_product_app/features/admin/domain/governance_entities.dart';
import 'package:agro_product_app/features/admin/domain/permissions.dart';
import 'package:agro_product_app/features/admin/data/admin_repository.dart';
import 'package:agro_product_app/features/admin/presentation/providers/admin_providers.dart';

void main() {
  group('Stage 11: Mobile Platform Role & Permission Evaluation', () {
    test('strictly validates role permissions for all platform roles', () {
      // Farmer
      expect(
        MobilePermissionMatrix.hasPermission(
          MobilePlatformRole.farmer,
          MobilePlatformPermission.browseProducts,
        ),
        isTrue,
      );
      expect(
        MobilePermissionMatrix.hasPermission(
          MobilePlatformRole.farmer,
          MobilePlatformPermission.createDisputes,
        ),
        isTrue,
      );
      expect(
        MobilePermissionMatrix.hasPermission(
          MobilePlatformRole.farmer,
          MobilePlatformPermission.verifySellers,
        ),
        isFalse,
      );
      expect(
        MobilePermissionMatrix.hasPermission(
          MobilePlatformRole.farmer,
          MobilePlatformPermission.moderateProducts,
        ),
        isFalse,
      );

      // Seller
      expect(
        MobilePermissionMatrix.hasPermission(
          MobilePlatformRole.seller,
          MobilePlatformPermission.manageProducts,
        ),
        isTrue,
      );
      expect(
        MobilePermissionMatrix.hasPermission(
          MobilePlatformRole.seller,
          MobilePlatformPermission.manageInventory,
        ),
        isTrue,
      );
      expect(
        MobilePermissionMatrix.hasPermission(
          MobilePlatformRole.seller,
          MobilePlatformPermission.verifySellers,
        ),
        isFalse,
      );

      // Cooperative Manager
      expect(
        MobilePermissionMatrix.hasPermission(
          MobilePlatformRole.cooperativeManager,
          MobilePlatformPermission.manageCampaigns,
        ),
        isTrue,
      );
      expect(
        MobilePermissionMatrix.hasPermission(
          MobilePlatformRole.cooperativeManager,
          MobilePlatformPermission.verifySellers,
        ),
        isFalse,
      );

      // Admin
      expect(
        MobilePermissionMatrix.hasPermission(
          MobilePlatformRole.admin,
          MobilePlatformPermission.verifySellers,
        ),
        isTrue,
      );
      expect(
        MobilePermissionMatrix.hasPermission(
          MobilePlatformRole.admin,
          MobilePlatformPermission.moderateProducts,
        ),
        isTrue,
      );
      expect(
        MobilePermissionMatrix.hasPermission(
          MobilePlatformRole.admin,
          MobilePlatformPermission.manageDisputes,
        ),
        isTrue,
      );
      expect(
        MobilePermissionMatrix.hasPermission(
          MobilePlatformRole.admin,
          MobilePlatformPermission.viewAuditLog,
        ),
        isTrue,
      );
    });

    test('validates hasAnyPermission and hasAllPermissions helpers', () {
      final adminActions = [
        MobilePlatformPermission.verifySellers,
        MobilePlatformPermission.moderateProducts,
      ];

      expect(
        MobilePermissionMatrix.hasAllPermissions(
          MobilePlatformRole.admin,
          adminActions,
        ),
        isTrue,
      );
      expect(
        MobilePermissionMatrix.hasAllPermissions(
          MobilePlatformRole.seller,
          adminActions,
        ),
        isFalse,
      );
      expect(
        MobilePermissionMatrix.hasAnyPermission(
          MobilePlatformRole.farmer,
          [MobilePlatformPermission.createDisputes, MobilePlatformPermission.verifySellers],
        ),
        isTrue,
      );
    });
  });

  group('Stage 11: Mobile Governance Lifecycle Transitions', () {
    test('enforces seller verification state transitions', () {
      expect(AdminVerificationStatus.draft.canTransitionTo(AdminVerificationStatus.submitted), isTrue);
      expect(AdminVerificationStatus.submitted.canTransitionTo(AdminVerificationStatus.underReview), isTrue);
      expect(AdminVerificationStatus.submitted.canTransitionTo(AdminVerificationStatus.rejected), isTrue);
      expect(AdminVerificationStatus.underReview.canTransitionTo(AdminVerificationStatus.verified), isTrue);
      expect(AdminVerificationStatus.verified.canTransitionTo(AdminVerificationStatus.suspended), isTrue);
      expect(AdminVerificationStatus.suspended.canTransitionTo(AdminVerificationStatus.underReview), isTrue);

      // Disallowed transitions
      expect(AdminVerificationStatus.draft.canTransitionTo(AdminVerificationStatus.verified), isFalse);
      expect(AdminVerificationStatus.submitted.canTransitionTo(AdminVerificationStatus.suspended), isFalse);
    });

    test('enforces product moderation state transitions', () {
      expect(AdminModerationStatus.draft.canTransitionTo(AdminModerationStatus.pendingReview), isTrue);
      expect(AdminModerationStatus.pendingReview.canTransitionTo(AdminModerationStatus.approved), isTrue);
      expect(AdminModerationStatus.pendingReview.canTransitionTo(AdminModerationStatus.rejected), isTrue);
      expect(AdminModerationStatus.approved.canTransitionTo(AdminModerationStatus.archived), isTrue);

      // Disallowed transitions
      expect(AdminModerationStatus.archived.canTransitionTo(AdminModerationStatus.approved), isFalse);
      expect(AdminModerationStatus.draft.canTransitionTo(AdminModerationStatus.approved), isFalse);
    });

    test('enforces dispute resolution state transitions', () {
      expect(AdminDisputeStatus.open.canTransitionTo(AdminDisputeStatus.underReview), isTrue);
      expect(AdminDisputeStatus.underReview.canTransitionTo(AdminDisputeStatus.awaitingUser), isTrue);
      expect(AdminDisputeStatus.underReview.canTransitionTo(AdminDisputeStatus.resolved), isTrue);
      expect(AdminDisputeStatus.resolved.canTransitionTo(AdminDisputeStatus.closed), isTrue);

      // Disallowed transitions
      expect(AdminDisputeStatus.open.canTransitionTo(AdminDisputeStatus.closed), isFalse);
      expect(AdminDisputeStatus.closed.canTransitionTo(AdminDisputeStatus.open), isFalse);
    });
  });

  group('Stage 11: InMemoryAdminRepository Operations', () {
    late InMemoryAdminRepository repository;

    setUp(() {
      repository = InMemoryAdminRepository();
    });

    test('loads deterministic seed data correctly', () async {
      final sellers = await repository.getSellerVerifications();
      final products = await repository.getProductModerations();
      final disputes = await repository.getDisputes();
      final risks = await repository.getRiskSignals();
      final audits = await repository.getAuditLogs();
      final metrics = await repository.getPlatformMetrics();

      expect(sellers.isNotEmpty, isTrue);
      expect(products.isNotEmpty, isTrue);
      expect(disputes.isNotEmpty, isTrue);
      expect(risks.isNotEmpty, isTrue);
      expect(audits.isNotEmpty, isTrue);
      expect(metrics.totalFarmers, 1240);
    });

    test('updates seller verification and generates audit log entry', () async {
      final updated = await repository.updateVerificationStatus(
        'ver_004',
        AdminVerificationStatus.verified,
      );

      expect(updated.status, AdminVerificationStatus.verified);
      expect(updated.reviewedBy, 'usr_admin_demo');

      final audits = await repository.getAuditLogs();
      expect(audits.first.action, 'seller_verified');
      expect(audits.first.entityId, updated.sellerId);
    });

    test('updates product moderation status and generates audit log', () async {
      final updated = await repository.updateModerationStatus(
        'mod_003',
        AdminModerationStatus.approved,
      );

      expect(updated.status, AdminModerationStatus.approved);

      final audits = await repository.getAuditLogs();
      expect(audits.first.action, 'product_approved');
    });

    test('updates dispute and appends communication timeline messages', () async {
      final msg = await repository.addDisputeMessage(
        'dsp_001',
        'Testing dispute notice',
        'usr_admin_demo',
        'Platform Admin',
        'admin',
      );

      expect(msg.content, 'Testing dispute notice');

      final updated = await repository.updateDisputeStatus(
        'dsp_001',
        AdminDisputeStatus.resolved,
        resolution: 'Full refund authorized',
      );

      expect(updated.status, AdminDisputeStatus.resolved);
      expect(updated.resolution, 'Full refund authorized');

      final audits = await repository.getAuditLogs();
      expect(audits.first.action, 'dispute_resolved');
    });

    test('resolves risk signal and records resolution audit', () async {
      final resolved = await repository.resolveRiskSignal('rsk_001');
      expect(resolved.isResolved, isTrue);
      expect(resolved.resolvedBy, 'usr_admin_demo');

      final audits = await repository.getAuditLogs();
      expect(audits.first.action, 'risk_signal_resolved');
    });
  });

  group('Stage 11: Admin Riverpod StateNotifiers', () {
    test('SellerVerificationsNotifier initializes and mutates state', () async {
      final repo = InMemoryAdminRepository();
      final notifier = SellerVerificationsNotifier(repo);

      await notifier.loadVerifications();
      expect(notifier.state.hasValue, isTrue);

      await notifier.updateStatus('ver_004', AdminVerificationStatus.verified);
      final list = notifier.state.value!;
      final verifiedSeller = list.firstWhere((s) => s.id == 'ver_004');
      expect(verifiedSeller.status, AdminVerificationStatus.verified);
    });
  });
}
