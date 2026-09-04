enum MobilePlatformRole {
  farmer,
  seller,
  cooperativeManager,
  admin;

  String get label {
    switch (this) {
      case MobilePlatformRole.farmer:
        return 'Farmer';
      case MobilePlatformRole.seller:
        return 'Seller';
      case MobilePlatformRole.cooperativeManager:
        return 'Cooperative Manager';
      case MobilePlatformRole.admin:
        return 'Admin';
    }
  }
}

enum MobilePlatformPermission {
  // Farmer
  browseProducts,
  placeOrders,
  createReviews,
  joinCampaigns,
  createDisputes,
  viewOwnOrders,

  // Seller
  manageProducts,
  manageInventory,
  manageSellerOrders,
  requestPayouts,
  viewSellerAnalytics,

  // Cooperative Manager
  manageCampaigns,
  monitorParticipation,
  manageCampaignLifecycle,

  // Admin
  verifySellers,
  moderateProducts,
  manageDisputes,
  viewPlatformAnalytics,
  manageGovernance,
  viewAuditLog,
  manageRiskSignals,
  viewAdminDashboard,
}

class MobilePermissionMatrix {
  static const Map<MobilePlatformRole, Set<MobilePlatformPermission>> _rolePermissions = {
    MobilePlatformRole.farmer: {
      MobilePlatformPermission.browseProducts,
      MobilePlatformPermission.placeOrders,
      MobilePlatformPermission.createReviews,
      MobilePlatformPermission.joinCampaigns,
      MobilePlatformPermission.createDisputes,
      MobilePlatformPermission.viewOwnOrders,
    },
    MobilePlatformRole.seller: {
      MobilePlatformPermission.browseProducts,
      MobilePlatformPermission.manageProducts,
      MobilePlatformPermission.manageInventory,
      MobilePlatformPermission.manageSellerOrders,
      MobilePlatformPermission.requestPayouts,
      MobilePlatformPermission.viewSellerAnalytics,
      MobilePlatformPermission.viewOwnOrders,
    },
    MobilePlatformRole.cooperativeManager: {
      MobilePlatformPermission.browseProducts,
      MobilePlatformPermission.manageCampaigns,
      MobilePlatformPermission.monitorParticipation,
      MobilePlatformPermission.manageCampaignLifecycle,
      MobilePlatformPermission.joinCampaigns,
      MobilePlatformPermission.viewOwnOrders,
    },
    MobilePlatformRole.admin: {
      MobilePlatformPermission.browseProducts,
      MobilePlatformPermission.placeOrders,
      MobilePlatformPermission.createReviews,
      MobilePlatformPermission.verifySellers,
      MobilePlatformPermission.moderateProducts,
      MobilePlatformPermission.manageDisputes,
      MobilePlatformPermission.viewPlatformAnalytics,
      MobilePlatformPermission.manageGovernance,
      MobilePlatformPermission.viewAuditLog,
      MobilePlatformPermission.manageRiskSignals,
      MobilePlatformPermission.viewAdminDashboard,
      MobilePlatformPermission.viewOwnOrders,
    },
  };

  static bool hasPermission(MobilePlatformRole role, MobilePlatformPermission permission) {
    return _rolePermissions[role]?.contains(permission) ?? false;
  }

  static bool hasAnyPermission(MobilePlatformRole role, List<MobilePlatformPermission> permissions) {
    final perms = _rolePermissions[role] ?? {};
    return permissions.any(perms.contains);
  }

  static bool hasAllPermissions(MobilePlatformRole role, List<MobilePlatformPermission> permissions) {
    final perms = _rolePermissions[role] ?? {};
    return permissions.every(perms.contains);
  }
}
