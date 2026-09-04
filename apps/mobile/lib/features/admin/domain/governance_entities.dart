import 'package:flutter/foundation.dart';

enum AdminVerificationStatus {
  draft,
  submitted,
  underReview,
  verified,
  rejected,
  suspended;

  String get label {
    switch (this) {
      case AdminVerificationStatus.draft:
        return 'Draft';
      case AdminVerificationStatus.submitted:
        return 'Submitted';
      case AdminVerificationStatus.underReview:
        return 'Under Review';
      case AdminVerificationStatus.verified:
        return 'Verified';
      case AdminVerificationStatus.rejected:
        return 'Rejected';
      case AdminVerificationStatus.suspended:
        return 'Suspended';
    }
  }

  bool canTransitionTo(AdminVerificationStatus target) {
    switch (this) {
      case AdminVerificationStatus.draft:
        return target == AdminVerificationStatus.submitted;
      case AdminVerificationStatus.submitted:
        return target == AdminVerificationStatus.underReview || target == AdminVerificationStatus.rejected;
      case AdminVerificationStatus.underReview:
        return target == AdminVerificationStatus.verified || target == AdminVerificationStatus.rejected;
      case AdminVerificationStatus.verified:
        return target == AdminVerificationStatus.suspended;
      case AdminVerificationStatus.rejected:
        return target == AdminVerificationStatus.submitted;
      case AdminVerificationStatus.suspended:
        return target == AdminVerificationStatus.underReview;
    }
  }
}

enum SellerBusinessType {
  individual,
  partnership,
  company,
  cooperative;

  String get label {
    switch (this) {
      case SellerBusinessType.individual:
        return 'Individual / Proprietary';
      case SellerBusinessType.partnership:
        return 'Partnership';
      case SellerBusinessType.company:
        return 'Pvt. Ltd. / Enterprise';
      case SellerBusinessType.cooperative:
        return 'Cooperative / FPO';
    }
  }
}

enum AdminModerationStatus {
  draft,
  pendingReview,
  approved,
  rejected,
  archived;

  String get label {
    switch (this) {
      case AdminModerationStatus.draft:
        return 'Draft';
      case AdminModerationStatus.pendingReview:
        return 'Pending Review';
      case AdminModerationStatus.approved:
        return 'Approved';
      case AdminModerationStatus.rejected:
        return 'Rejected';
      case AdminModerationStatus.archived:
        return 'Archived';
    }
  }

  bool canTransitionTo(AdminModerationStatus target) {
    switch (this) {
      case AdminModerationStatus.draft:
        return target == AdminModerationStatus.pendingReview;
      case AdminModerationStatus.pendingReview:
        return target == AdminModerationStatus.approved || target == AdminModerationStatus.rejected;
      case AdminModerationStatus.approved:
        return target == AdminModerationStatus.archived;
      case AdminModerationStatus.rejected:
        return target == AdminModerationStatus.pendingReview;
      case AdminModerationStatus.archived:
        return false;
    }
  }
}

enum AdminDisputeStatus {
  open,
  underReview,
  awaitingUser,
  resolved,
  closed;

  String get label {
    switch (this) {
      case AdminDisputeStatus.open:
        return 'Open';
      case AdminDisputeStatus.underReview:
        return 'Under Review';
      case AdminDisputeStatus.awaitingUser:
        return 'Awaiting User';
      case AdminDisputeStatus.resolved:
        return 'Resolved';
      case AdminDisputeStatus.closed:
        return 'Closed';
    }
  }

  bool canTransitionTo(AdminDisputeStatus target) {
    switch (this) {
      case AdminDisputeStatus.open:
        return target == AdminDisputeStatus.underReview;
      case AdminDisputeStatus.underReview:
        return target == AdminDisputeStatus.awaitingUser || target == AdminDisputeStatus.resolved;
      case AdminDisputeStatus.awaitingUser:
        return target == AdminDisputeStatus.underReview || target == AdminDisputeStatus.resolved;
      case AdminDisputeStatus.resolved:
        return target == AdminDisputeStatus.closed;
      case AdminDisputeStatus.closed:
        return false;
    }
  }
}

enum AdminDisputeType {
  damagedProduct,
  wrongProduct,
  missingItem,
  deliveryIssue,
  paymentIssue,
  sellerIssue,
  other;

  String get label {
    switch (this) {
      case AdminDisputeType.damagedProduct:
        return 'Damaged Product';
      case AdminDisputeType.wrongProduct:
        return 'Wrong Product';
      case AdminDisputeType.missingItem:
        return 'Missing Item';
      case AdminDisputeType.deliveryIssue:
        return 'Delivery Issue';
      case AdminDisputeType.paymentIssue:
        return 'Payment Issue';
      case AdminDisputeType.sellerIssue:
        return 'Seller Issue';
      case AdminDisputeType.other:
        return 'Other';
    }
  }
}

enum AdminRiskSeverity {
  low,
  medium,
  high,
  critical;

  String get label {
    switch (this) {
      case AdminRiskSeverity.low:
        return 'Low';
      case AdminRiskSeverity.medium:
        return 'Medium';
      case AdminRiskSeverity.high:
        return 'High';
      case AdminRiskSeverity.critical:
        return 'Critical';
    }
  }
}

enum AdminRiskEntityType { seller, product, order }

@immutable
class AdminSellerVerification {
  final String id;
  final String sellerId;
  final String businessName;
  final String ownerName;
  final SellerBusinessType businessType;
  final String gstNumber;
  final String? registrationId;
  final String address;
  final String district;
  final String state;
  final DateTime? submittedAt;
  final DateTime? reviewedAt;
  final String? reviewedBy;
  final AdminVerificationStatus status;
  final String? rejectionReason;
  final List<String> riskFlags;
  final List<String> internalNotes;
  final DateTime createdAt;
  final DateTime updatedAt;

  const AdminSellerVerification({
    required this.id,
    required this.sellerId,
    required this.businessName,
    required this.ownerName,
    required this.businessType,
    required this.gstNumber,
    this.registrationId,
    required this.address,
    required this.district,
    required this.state,
    this.submittedAt,
    this.reviewedAt,
    this.reviewedBy,
    required this.status,
    this.rejectionReason,
    this.riskFlags = const [],
    this.internalNotes = const [],
    required this.createdAt,
    required this.updatedAt,
  });

  AdminSellerVerification copyWith({
    AdminVerificationStatus? status,
    DateTime? reviewedAt,
    String? reviewedBy,
    String? rejectionReason,
    List<String>? riskFlags,
    List<String>? internalNotes,
  }) {
    return AdminSellerVerification(
      id: id,
      sellerId: sellerId,
      businessName: businessName,
      ownerName: ownerName,
      businessType: businessType,
      gstNumber: gstNumber,
      registrationId: registrationId,
      address: address,
      district: district,
      state: state,
      submittedAt: submittedAt,
      reviewedAt: reviewedAt ?? this.reviewedAt,
      reviewedBy: reviewedBy ?? this.reviewedBy,
      status: status ?? this.status,
      rejectionReason: rejectionReason ?? this.rejectionReason,
      riskFlags: riskFlags ?? this.riskFlags,
      internalNotes: internalNotes ?? this.internalNotes,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
    );
  }
}

@immutable
class AdminProductModeration {
  final String id;
  final String productId;
  final String productTitle;
  final String sellerId;
  final String sellerName;
  final String category;
  final double price;
  final double mrp;
  final int stockQuantity;
  final AdminModerationStatus status;
  final String? reviewedBy;
  final DateTime? reviewedAt;
  final String? rejectionReason;
  final DateTime submittedAt;
  final DateTime createdAt;

  const AdminProductModeration({
    required this.id,
    required this.productId,
    required this.productTitle,
    required this.sellerId,
    required this.sellerName,
    required this.category,
    required this.price,
    required this.mrp,
    required this.stockQuantity,
    required this.status,
    this.reviewedBy,
    this.reviewedAt,
    this.rejectionReason,
    required this.submittedAt,
    required this.createdAt,
  });

  AdminProductModeration copyWith({
    AdminModerationStatus? status,
    String? reviewedBy,
    DateTime? reviewedAt,
    String? rejectionReason,
  }) {
    return AdminProductModeration(
      id: id,
      productId: productId,
      productTitle: productTitle,
      sellerId: sellerId,
      sellerName: sellerName,
      category: category,
      price: price,
      mrp: mrp,
      stockQuantity: stockQuantity,
      status: status ?? this.status,
      reviewedBy: reviewedBy ?? this.reviewedBy,
      reviewedAt: reviewedAt ?? this.reviewedAt,
      rejectionReason: rejectionReason ?? this.rejectionReason,
      submittedAt: submittedAt,
      createdAt: createdAt,
    );
  }
}

@immutable
class AdminDisputeMessage {
  final String id;
  final String disputeId;
  final String authorId;
  final String authorName;
  final String authorRole; // 'farmer', 'seller', 'admin'
  final String content;
  final DateTime createdAt;

  const AdminDisputeMessage({
    required this.id,
    required this.disputeId,
    required this.authorId,
    required this.authorName,
    required this.authorRole,
    required this.content,
    required this.createdAt,
  });
}

@immutable
class AdminDispute {
  final String id;
  final String orderId;
  final String orderNumber;
  final String farmerId;
  final String farmerName;
  final String sellerId;
  final String sellerName;
  final AdminDisputeType type;
  final String subject;
  final String description;
  final AdminDisputeStatus status;
  final String? resolution;
  final String? assignedTo;
  final List<AdminDisputeMessage> messages;
  final DateTime createdAt;
  final DateTime updatedAt;

  const AdminDispute({
    required this.id,
    required this.orderId,
    required this.orderNumber,
    required this.farmerId,
    required this.farmerName,
    required this.sellerId,
    required this.sellerName,
    required this.type,
    required this.subject,
    required this.description,
    required this.status,
    this.resolution,
    this.assignedTo,
    this.messages = const [],
    required this.createdAt,
    required this.updatedAt,
  });

  AdminDispute copyWith({
    AdminDisputeStatus? status,
    String? resolution,
    String? assignedTo,
    List<AdminDisputeMessage>? messages,
  }) {
    return AdminDispute(
      id: id,
      orderId: orderId,
      orderNumber: orderNumber,
      farmerId: farmerId,
      farmerName: farmerName,
      sellerId: sellerId,
      sellerName: sellerName,
      type: type,
      subject: subject,
      description: description,
      status: status ?? this.status,
      resolution: resolution ?? this.resolution,
      assignedTo: assignedTo ?? this.assignedTo,
      messages: messages ?? this.messages,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
    );
  }
}

@immutable
class AdminRiskSignal {
  final String id;
  final AdminRiskEntityType entityType;
  final String entityId;
  final String entityLabel;
  final AdminRiskSeverity severity;
  final String ruleTriggered;
  final String description;
  final bool isResolved;
  final DateTime? resolvedAt;
  final String? resolvedBy;
  final DateTime createdAt;

  const AdminRiskSignal({
    required this.id,
    required this.entityType,
    required this.entityId,
    required this.entityLabel,
    required this.severity,
    required this.ruleTriggered,
    required this.description,
    this.isResolved = false,
    this.resolvedAt,
    this.resolvedBy,
    required this.createdAt,
  });

  AdminRiskSignal copyWith({
    bool? isResolved,
    DateTime? resolvedAt,
    String? resolvedBy,
  }) {
    return AdminRiskSignal(
      id: id,
      entityType: entityType,
      entityId: entityId,
      entityLabel: entityLabel,
      severity: severity,
      ruleTriggered: ruleTriggered,
      description: description,
      isResolved: isResolved ?? this.isResolved,
      resolvedAt: resolvedAt ?? this.resolvedAt,
      resolvedBy: resolvedBy ?? this.resolvedBy,
      createdAt: createdAt,
    );
  }
}

@immutable
class AdminAuditLogEntry {
  final String id;
  final String actorId;
  final String actorName;
  final String actorRole;
  final String action;
  final String entityType;
  final String entityId;
  final String entityLabel;
  final Map<String, dynamic> metadata;
  final DateTime createdAt;

  const AdminAuditLogEntry({
    required this.id,
    required this.actorId,
    required this.actorName,
    required this.actorRole,
    required this.action,
    required this.entityType,
    required this.entityId,
    required this.entityLabel,
    this.metadata = const {},
    required this.createdAt,
  });
}

@immutable
class AdminPlatformMetrics {
  final int totalFarmers;
  final int totalSellers;
  final int verifiedSellers;
  final int pendingVerification;
  final int activeProducts;
  final int pendingModeration;
  final int activeOrders;
  final double totalGmv;
  final int activeCampaigns;
  final int openDisputes;
  final int unresolvedRiskSignals;

  const AdminPlatformMetrics({
    this.totalFarmers = 1240,
    this.totalSellers = 84,
    this.verifiedSellers = 72,
    this.pendingVerification = 6,
    this.activeProducts = 412,
    this.pendingModeration = 14,
    this.activeOrders = 89,
    this.totalGmv = 1845000.0,
    this.activeCampaigns = 8,
    this.openDisputes = 5,
    this.unresolvedRiskSignals = 3,
  });
}

@immutable
class AdminOperationalAlert {
  final String id;
  final String severity; // 'info', 'warning', 'critical'
  final String title;
  final String context;
  final String? actionRoute;
  final String entityType;
  final String entityId;
  final DateTime createdAt;

  const AdminOperationalAlert({
    required this.id,
    required this.severity,
    required this.title,
    required this.context,
    this.actionRoute,
    required this.entityType,
    required this.entityId,
    required this.createdAt,
  });
}
