import '../domain/governance_entities.dart';

abstract class AdminRepository {
  Future<List<AdminSellerVerification>> getSellerVerifications();
  Future<List<AdminProductModeration>> getProductModerations();
  Future<List<AdminDispute>> getDisputes();
  Future<List<AdminRiskSignal>> getRiskSignals();
  Future<List<AdminAuditLogEntry>> getAuditLogs();
  Future<AdminPlatformMetrics> getPlatformMetrics();
  Future<List<AdminOperationalAlert>> getOperationalAlerts();

  Future<AdminSellerVerification> updateVerificationStatus(
    String id,
    AdminVerificationStatus newStatus, {
    String? rejectionReason,
    String? internalNote,
  });

  Future<AdminProductModeration> updateModerationStatus(
    String id,
    AdminModerationStatus newStatus, {
    String? rejectionReason,
  });

  Future<AdminDispute> updateDisputeStatus(
    String id,
    AdminDisputeStatus newStatus, {
    String? resolution,
  });

  Future<AdminDisputeMessage> addDisputeMessage(
    String disputeId,
    String content,
    String authorId,
    String authorName,
    String authorRole,
  );

  Future<AdminRiskSignal> resolveRiskSignal(String id);
}

class InMemoryAdminRepository implements AdminRepository {
  final List<AdminSellerVerification> _verifications = [
    AdminSellerVerification(
      id: 'ver_001',
      sellerId: 'sel_krishi_kendra_01',
      businessName: 'Maharashtra Krishi Kendra',
      ownerName: 'Anand Rao',
      businessType: SellerBusinessType.company,
      gstNumber: '27AAAAA0000A1Z5',
      registrationId: 'REG-MH-PUN-2018-091',
      address: 'Market Yard, Gultekdi, Pune',
      district: 'Pune',
      state: 'Maharashtra',
      submittedAt: DateTime.now().subtract(const Duration(days: 12)),
      reviewedAt: DateTime.now().subtract(const Duration(days: 10)),
      reviewedBy: 'usr_admin_demo',
      status: AdminVerificationStatus.verified,
      riskFlags: const [],
      internalNotes: const [
        'GSTIN verified against central database',
        'Physical address cross-referenced with APMC registry'
      ],
      createdAt: DateTime.now().subtract(const Duration(days: 12)),
      updatedAt: DateTime.now().subtract(const Duration(days: 10)),
    ),
    AdminSellerVerification(
      id: 'ver_002',
      sellerId: 'sel_baramati_agro_02',
      businessName: 'Baramati Agro Chemical Hub',
      ownerName: 'Ganesh Kadam',
      businessType: SellerBusinessType.partnership,
      gstNumber: '27BAACD9910B1Z2',
      registrationId: 'REG-MH-BRM-2020-044',
      address: 'MIDC Industrial Area, Baramati',
      district: 'Pune',
      state: 'Maharashtra',
      submittedAt: DateTime.now().subtract(const Duration(days: 8)),
      reviewedAt: DateTime.now().subtract(const Duration(days: 6)),
      reviewedBy: 'usr_admin_demo',
      status: AdminVerificationStatus.verified,
      riskFlags: const [],
      internalNotes: const [
        'Authorized distributor for Coromandel & IFFCO',
        'Valid state fertilizer license'
      ],
      createdAt: DateTime.now().subtract(const Duration(days: 8)),
      updatedAt: DateTime.now().subtract(const Duration(days: 6)),
    ),
    AdminSellerVerification(
      id: 'ver_003',
      sellerId: 'sel_sahyadri_seeds_03',
      businessName: 'Sahyadri Certified Seeds & Biotech',
      ownerName: 'Nilesh More',
      businessType: SellerBusinessType.company,
      gstNumber: '27CCDEP8820C1Z8',
      registrationId: 'REG-MH-NAS-2022-118',
      address: 'Satpur MIDC, Nashik',
      district: 'Nashik',
      state: 'Maharashtra',
      submittedAt: DateTime.now().subtract(const Duration(days: 3)),
      status: AdminVerificationStatus.underReview,
      riskFlags: const ['high_initial_inventory'],
      internalNotes: const [
        'Pending physical warehouse inspection report',
        'Document check passed'
      ],
      createdAt: DateTime.now().subtract(const Duration(days: 3)),
      updatedAt: DateTime.now().subtract(const Duration(days: 3)),
    ),
    AdminSellerVerification(
      id: 'ver_004',
      sellerId: 'sel_deccan_organics_04',
      businessName: 'Deccan Organic Inputs Ltd',
      ownerName: 'Priya Deshmukh',
      businessType: SellerBusinessType.company,
      gstNumber: '27EEFGK7730D1Z1',
      registrationId: 'REG-MH-SAT-2023-059',
      address: 'Old MIDC, Satara',
      district: 'Satara',
      state: 'Maharashtra',
      submittedAt: DateTime.now().subtract(const Duration(days: 1)),
      status: AdminVerificationStatus.submitted,
      riskFlags: const [],
      internalNotes: const [
        'New applicant',
        'Seed & bio-fertilizer range'
      ],
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
      updatedAt: DateTime.now().subtract(const Duration(days: 1)),
    ),
    AdminSellerVerification(
      id: 'ver_005',
      sellerId: 'sel_vidarbha_traders_05',
      businessName: 'Vidarbha Agri Traders',
      ownerName: 'Ramesh Wankhede',
      businessType: SellerBusinessType.individual,
      gstNumber: '27GGHIJ6640E1Z4',
      registrationId: 'REG-MH-NGP-2024-012',
      address: 'Cotton Market, Nagpur',
      district: 'Nagpur',
      state: 'Maharashtra',
      submittedAt: DateTime.now().subtract(const Duration(days: 15)),
      reviewedAt: DateTime.now().subtract(const Duration(days: 13)),
      reviewedBy: 'usr_admin_demo',
      status: AdminVerificationStatus.rejected,
      rejectionReason: 'Incomplete pesticide dealer license; expired NOC from State Agriculture Department',
      riskFlags: const ['missing_license_docs', 'mismatched_gst'],
      internalNotes: const [
        'Failed document verification on 2026-08-22',
        'Notified via email'
      ],
      createdAt: DateTime.now().subtract(const Duration(days: 15)),
      updatedAt: DateTime.now().subtract(const Duration(days: 13)),
    ),
    AdminSellerVerification(
      id: 'ver_006',
      sellerId: 'sel_shree_krishna_06',
      businessName: 'Shree Krishna Agro Chemicals',
      ownerName: 'Sunil Pawar',
      businessType: SellerBusinessType.partnership,
      gstNumber: '27KKLLM5510F1Z7',
      registrationId: 'REG-MH-SOL-2021-073',
      address: 'Kurduvadi Road, Solapur',
      district: 'Solapur',
      state: 'Maharashtra',
      submittedAt: DateTime.now().subtract(const Duration(days: 45)),
      reviewedAt: DateTime.now().subtract(const Duration(days: 40)),
      reviewedBy: 'usr_admin_demo',
      status: AdminVerificationStatus.suspended,
      rejectionReason: 'Multiple farmer disputes regarding counterfeit seal on liquid bio-fertilizer batches',
      riskFlags: const ['counterfeit_suspect', 'high_dispute_rate'],
      internalNotes: const [
        'Suspended on 2026-08-28 following 3 farmer complaints',
        'Pending lab test report'
      ],
      createdAt: DateTime.now().subtract(const Duration(days: 45)),
      updatedAt: DateTime.now().subtract(const Duration(days: 40)),
    ),
  ];

  final List<AdminProductModeration> _moderations = [
    AdminProductModeration(
      id: 'mod_001',
      productId: 'prod_fertilizer_1',
      productTitle: 'IFFCO NPK 10:26:26 (50kg)',
      sellerId: 'sel_krishi_kendra_01',
      sellerName: 'Maharashtra Krishi Kendra',
      category: 'Fertilizers',
      price: 1250.0,
      mrp: 1500.0,
      stockQuantity: 240,
      status: AdminModerationStatus.approved,
      reviewedBy: 'usr_admin_demo',
      reviewedAt: DateTime.now().subtract(const Duration(days: 10)),
      submittedAt: DateTime.now().subtract(const Duration(days: 11)),
      createdAt: DateTime.now().subtract(const Duration(days: 11)),
    ),
    AdminProductModeration(
      id: 'mod_002',
      productId: 'prod_seeds_1',
      productTitle: 'Certified Soybean Seeds JS-335 (30kg)',
      sellerId: 'sel_krishi_kendra_01',
      sellerName: 'Maharashtra Krishi Kendra',
      category: 'Seeds',
      price: 2850.0,
      mrp: 3200.0,
      stockQuantity: 85,
      status: AdminModerationStatus.approved,
      reviewedBy: 'usr_admin_demo',
      reviewedAt: DateTime.now().subtract(const Duration(days: 10)),
      submittedAt: DateTime.now().subtract(const Duration(days: 11)),
      createdAt: DateTime.now().subtract(const Duration(days: 11)),
    ),
    AdminProductModeration(
      id: 'mod_003',
      productId: 'prod_pending_01',
      productTitle: 'Bio-Shield Organic Fungicide (1L)',
      sellerId: 'sel_sahyadri_seeds_03',
      sellerName: 'Sahyadri Certified Seeds & Biotech',
      category: 'Plant Protection',
      price: 890.0,
      mrp: 1100.0,
      stockQuantity: 150,
      status: AdminModerationStatus.pendingReview,
      submittedAt: DateTime.now().subtract(const Duration(days: 2)),
      createdAt: DateTime.now().subtract(const Duration(days: 2)),
    ),
    AdminProductModeration(
      id: 'mod_004',
      productId: 'prod_pending_02',
      productTitle: 'Solar Insect Trap Unit — Field Pro',
      sellerId: 'sel_deccan_organics_04',
      sellerName: 'Deccan Organic Inputs Ltd',
      category: 'Farm Machinery',
      price: 3450.0,
      mrp: 4200.0,
      stockQuantity: 30,
      status: AdminModerationStatus.pendingReview,
      submittedAt: DateTime.now().subtract(const Duration(days: 1)),
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
    ),
    AdminProductModeration(
      id: 'mod_005',
      productId: 'prod_rejected_01',
      productTitle: 'Non-Certified Growth Enhancer Formula X',
      sellerId: 'sel_vidarbha_traders_05',
      sellerName: 'Vidarbha Agri Traders',
      category: 'Fertilizers',
      price: 650.0,
      mrp: 900.0,
      stockQuantity: 500,
      status: AdminModerationStatus.rejected,
      reviewedBy: 'usr_admin_demo',
      reviewedAt: DateTime.now().subtract(const Duration(days: 13)),
      rejectionReason: 'Missing CIB&RC registration certificate and mandatory batch safety sheet',
      submittedAt: DateTime.now().subtract(const Duration(days: 14)),
      createdAt: DateTime.now().subtract(const Duration(days: 14)),
    ),
    AdminProductModeration(
      id: 'mod_006',
      productId: 'prod_archived_01',
      productTitle: 'Legacy Drip Emitters 4LPH (Pack of 500)',
      sellerId: 'sel_baramati_agro_02',
      sellerName: 'Baramati Agro Chemical Hub',
      category: 'Irrigation',
      price: 1100.0,
      mrp: 1350.0,
      stockQuantity: 0,
      status: AdminModerationStatus.archived,
      reviewedBy: 'usr_admin_demo',
      reviewedAt: DateTime.now().subtract(const Duration(days: 25)),
      submittedAt: DateTime.now().subtract(const Duration(days: 30)),
      createdAt: DateTime.now().subtract(const Duration(days: 30)),
    ),
  ];

  final List<AdminDispute> _disputes = [
    AdminDispute(
      id: 'dsp_001',
      orderId: 'ord_demo_01',
      orderNumber: 'ORD-2026-8812',
      farmerId: 'usr_farmer_demo',
      farmerName: 'Rahul Shinde',
      sellerId: 'sel_krishi_kendra_01',
      sellerName: 'Maharashtra Krishi Kendra',
      type: AdminDisputeType.damagedProduct,
      subject: 'Torn fertilizer bag with spillage during transit',
      description: 'The 50kg NPK bag arrived with a 15cm tear on the side seam. Approximately 8-10kg fertilizer was spilled inside the delivery truck.',
      status: AdminDisputeStatus.underReview,
      assignedTo: 'usr_admin_demo',
      messages: [
        AdminDisputeMessage(
          id: 'msg_001',
          disputeId: 'dsp_001',
          authorId: 'usr_farmer_demo',
          authorName: 'Rahul Shinde',
          authorRole: 'farmer',
          content: 'Bag arrived torn. Driver acknowledged spillage on delivery receipt. Photos attached.',
          createdAt: DateTime.now().subtract(const Duration(days: 2)),
        ),
        AdminDisputeMessage(
          id: 'msg_002',
          disputeId: 'dsp_001',
          authorId: 'usr_admin_demo',
          authorName: 'Platform Admin',
          authorRole: 'admin',
          content: 'Case opened. Requesting distributor response and transit damage credit confirmation.',
          createdAt: DateTime.now().subtract(const Duration(days: 1, hours: 20)),
        ),
        AdminDisputeMessage(
          id: 'msg_003',
          disputeId: 'dsp_001',
          authorId: 'sel_krishi_kendra_01',
          authorName: 'Maharashtra Krishi Kendra',
          authorRole: 'seller',
          content: 'We have reviewed photos. Logistics partner rough handling caused tear. We accept replacement or partial 20% credit.',
          createdAt: DateTime.now().subtract(const Duration(hours: 14)),
        ),
      ],
      createdAt: DateTime.now().subtract(const Duration(days: 2)),
      updatedAt: DateTime.now().subtract(const Duration(hours: 14)),
    ),
    AdminDispute(
      id: 'dsp_002',
      orderId: 'ord_demo_02',
      orderNumber: 'ORD-2026-7940',
      farmerId: 'usr_farmer_2',
      farmerName: 'Anil Deshmukh',
      sellerId: 'sel_shree_krishna_06',
      sellerName: 'Shree Krishna Agro Chemicals',
      type: AdminDisputeType.wrongProduct,
      subject: 'Wrong pesticide concentration delivered',
      description: 'Ordered 250ml 20% EC formulation, but package contained 10% WP powder. Cannot use for current crop infestation stage.',
      status: AdminDisputeStatus.awaitingUser,
      assignedTo: 'usr_admin_demo',
      messages: [
        AdminDisputeMessage(
          id: 'msg_004',
          disputeId: 'dsp_002',
          authorId: 'usr_farmer_2',
          authorName: 'Anil Deshmukh',
          authorRole: 'farmer',
          content: 'Received WP powder instead of EC liquid formulation. Batch number on bill does not match container.',
          createdAt: DateTime.now().subtract(const Duration(days: 3)),
        ),
        AdminDisputeMessage(
          id: 'msg_005',
          disputeId: 'dsp_002',
          authorId: 'usr_admin_demo',
          authorName: 'Platform Admin',
          authorRole: 'admin',
          content: 'Notified seller. Please confirm if return courier pickup has been scheduled.',
          createdAt: DateTime.now().subtract(const Duration(days: 2)),
        ),
      ],
      createdAt: DateTime.now().subtract(const Duration(days: 3)),
      updatedAt: DateTime.now().subtract(const Duration(days: 2)),
    ),
    AdminDispute(
      id: 'dsp_003',
      orderId: 'ord_demo_03',
      orderNumber: 'ORD-2026-6510',
      farmerId: 'usr_farmer_3',
      farmerName: 'Vikram Patil',
      sellerId: 'sel_baramati_agro_02',
      sellerName: 'Baramati Agro Chemical Hub',
      type: AdminDisputeType.deliveryIssue,
      subject: 'Delivery delayed past sowing window',
      description: 'Order took 9 days to arrive instead of committed 48-hour SLA. Farmer had to purchase alternative seeds locally.',
      status: AdminDisputeStatus.resolved,
      resolution: 'Full refund of Rs 2,850 processed to farmer wallet. Seller cautioned on SLA compliance.',
      assignedTo: 'usr_admin_demo',
      messages: [
        AdminDisputeMessage(
          id: 'msg_006',
          disputeId: 'dsp_003',
          authorId: 'usr_farmer_3',
          authorName: 'Vikram Patil',
          authorRole: 'farmer',
          content: 'Seed delivery SLA breached by 7 days. Had to buy local seed to avoid missing monsoon shower.',
          createdAt: DateTime.now().subtract(const Duration(days: 5)),
        ),
        AdminDisputeMessage(
          id: 'msg_007',
          disputeId: 'dsp_003',
          authorId: 'usr_admin_demo',
          authorName: 'Platform Admin',
          authorRole: 'admin',
          content: 'Logistics delay verified from dispatch timestamps. Refund authorized under Buyer Protection Policy.',
          createdAt: DateTime.now().subtract(const Duration(days: 4)),
        ),
      ],
      createdAt: DateTime.now().subtract(const Duration(days: 5)),
      updatedAt: DateTime.now().subtract(const Duration(days: 4)),
    ),
  ];

  final List<AdminRiskSignal> _riskSignals = [
    AdminRiskSignal(
      id: 'rsk_001',
      entityType: AdminRiskEntityType.seller,
      entityId: 'sel_shree_krishna_06',
      entityLabel: 'Shree Krishna Agro Chemicals',
      severity: AdminRiskSeverity.critical,
      ruleTriggered: 'DISPUTE_SPIKE_DETECTED',
      description: 'Seller dispute rate exceeded 6.5% of total monthly dispatches over the last 14 days.',
      isResolved: false,
      createdAt: DateTime.now().subtract(const Duration(hours: 6)),
    ),
    AdminRiskSignal(
      id: 'rsk_002',
      entityType: AdminRiskEntityType.product,
      entityId: 'prod_rejected_01',
      entityLabel: 'Non-Certified Growth Enhancer',
      severity: AdminRiskSeverity.high,
      ruleTriggered: 'PROHIBITED_SUBSTANCE_FLAG',
      description: 'Keywords match unauthorized bio-stimulant formulation without CIB certification.',
      isResolved: false,
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
    ),
    AdminRiskSignal(
      id: 'rsk_003',
      entityType: AdminRiskEntityType.order,
      entityId: 'ord_risk_991',
      entityLabel: 'ORD-2026-9912 (Rs 85,000)',
      severity: AdminRiskSeverity.medium,
      ruleTriggered: 'HIGH_VALUE_FIRST_TIME_BUYER',
      description: 'First-time customer placed bulk fertilizer order over Rs 50,000 via Cash on Delivery.',
      isResolved: false,
      createdAt: DateTime.now().subtract(const Duration(hours: 18)),
    ),
    AdminRiskSignal(
      id: 'rsk_004',
      entityType: AdminRiskEntityType.seller,
      entityId: 'sel_vidarbha_traders_05',
      entityLabel: 'Vidarbha Agri Traders',
      severity: AdminRiskSeverity.medium,
      ruleTriggered: 'GSTIN_MISMATCH',
      description: 'Submitted GSTIN registered state differs from business physical address.',
      isResolved: true,
      resolvedAt: DateTime.now().subtract(const Duration(days: 2)),
      resolvedBy: 'usr_admin_demo',
      createdAt: DateTime.now().subtract(const Duration(days: 5)),
    ),
  ];

  final List<AdminAuditLogEntry> _auditLogs = [
    AdminAuditLogEntry(
      id: 'aud_001',
      actorId: 'usr_admin_demo',
      actorName: 'Platform Admin',
      actorRole: 'admin',
      action: 'seller_verified',
      entityType: 'seller',
      entityId: 'sel_krishi_kendra_01',
      entityLabel: 'Maharashtra Krishi Kendra',
      metadata: const {'reason': 'APMC credentials and GST validated'},
      createdAt: DateTime.now().subtract(const Duration(days: 10)),
    ),
    AdminAuditLogEntry(
      id: 'aud_002',
      actorId: 'usr_admin_demo',
      actorName: 'Platform Admin',
      actorRole: 'admin',
      action: 'seller_suspended',
      entityType: 'seller',
      entityId: 'sel_shree_krishna_06',
      entityLabel: 'Shree Krishna Agro Chemicals',
      metadata: const {'reason': 'Product quality complaints & lab test pending'},
      createdAt: DateTime.now().subtract(const Duration(days: 7)),
    ),
    AdminAuditLogEntry(
      id: 'aud_003',
      actorId: 'usr_admin_demo',
      actorName: 'Platform Admin',
      actorRole: 'admin',
      action: 'product_approved',
      entityType: 'product',
      entityId: 'prod_fertilizer_1',
      entityLabel: 'IFFCO NPK 10:26:26',
      metadata: const {'category': 'Fertilizers', 'mrp': '1500'},
      createdAt: DateTime.now().subtract(const Duration(days: 5)),
    ),
    AdminAuditLogEntry(
      id: 'aud_004',
      actorId: 'usr_admin_demo',
      actorName: 'Platform Admin',
      actorRole: 'admin',
      action: 'dispute_resolved',
      entityType: 'dispute',
      entityId: 'dsp_003',
      entityLabel: 'ORD-2026-6510',
      metadata: const {'resolution': 'Full refund under Buyer Protection'},
      createdAt: DateTime.now().subtract(const Duration(days: 4)),
    ),
    AdminAuditLogEntry(
      id: 'aud_005',
      actorId: 'system_risk_engine',
      actorName: 'Risk Rule Engine',
      actorRole: 'system',
      action: 'risk_signal_created',
      entityType: 'risk_signal',
      entityId: 'rsk_001',
      entityLabel: 'Shree Krishna Agro Chemicals',
      metadata: const {'rule': 'DISPUTE_SPIKE_DETECTED'},
      createdAt: DateTime.now().subtract(const Duration(hours: 6)),
    ),
  ];

  @override
  Future<List<AdminSellerVerification>> getSellerVerifications() async {
    return List.unmodifiable(_verifications);
  }

  @override
  Future<List<AdminProductModeration>> getProductModerations() async {
    return List.unmodifiable(_moderations);
  }

  @override
  Future<List<AdminDispute>> getDisputes() async {
    return List.unmodifiable(_disputes);
  }

  @override
  Future<List<AdminRiskSignal>> getRiskSignals() async {
    return List.unmodifiable(_riskSignals);
  }

  @override
  Future<List<AdminAuditLogEntry>> getAuditLogs() async {
    return List.unmodifiable(_auditLogs);
  }

  @override
  Future<AdminPlatformMetrics> getPlatformMetrics() async {
    final verified = _verifications.where((v) => v.status == AdminVerificationStatus.verified).length;
    final pendingVer = _verifications.where((v) => v.status == AdminVerificationStatus.submitted || v.status == AdminVerificationStatus.underReview).length;
    final activeProd = _moderations.where((m) => m.status == AdminModerationStatus.approved).length;
    final pendingMod = _moderations.where((m) => m.status == AdminModerationStatus.pendingReview).length;
    final openDisp = _disputes.where((d) => d.status == AdminDisputeStatus.open || d.status == AdminDisputeStatus.underReview || d.status == AdminDisputeStatus.awaitingUser).length;
    final unresolvedRisk = _riskSignals.where((r) => !r.isResolved).length;

    return AdminPlatformMetrics(
      totalFarmers: 1240,
      totalSellers: _verifications.length,
      verifiedSellers: verified,
      pendingVerification: pendingVer,
      activeProducts: activeProd,
      pendingModeration: pendingMod,
      activeOrders: 89,
      totalGmv: 1845000.0,
      activeCampaigns: 8,
      openDisputes: openDisp,
      unresolvedRiskSignals: unresolvedRisk,
    );
  }

  @override
  Future<List<AdminOperationalAlert>> getOperationalAlerts() async {
    return [
      AdminOperationalAlert(
        id: 'alt_001',
        severity: 'critical',
        title: 'Dispute Rate Spike',
        context: 'Shree Krishna Agro Chemicals exceeded 6.5% dispute rate',
        entityType: 'seller',
        entityId: 'sel_shree_krishna_06',
        createdAt: DateTime.now().subtract(const Duration(hours: 6)),
      ),
      AdminOperationalAlert(
        id: 'alt_002',
        severity: 'warning',
        title: 'New Seller Applications',
        context: '2 sellers awaiting verification review in Maharashtra',
        entityType: 'seller',
        entityId: 'ver_004',
        createdAt: DateTime.now().subtract(const Duration(days: 1)),
      ),
      AdminOperationalAlert(
        id: 'alt_003',
        severity: 'info',
        title: 'Moderation Queue',
        context: '2 new catalog items pending quality and regulatory check',
        entityType: 'product',
        entityId: 'mod_003',
        createdAt: DateTime.now().subtract(const Duration(days: 2)),
      ),
    ];
  }

  @override
  Future<AdminSellerVerification> updateVerificationStatus(
    String id,
    AdminVerificationStatus newStatus, {
    String? rejectionReason,
    String? internalNote,
  }) async {
    final index = _verifications.indexWhere((v) => v.id == id);
    if (index == -1) throw Exception('Verification record not found: $id');

    final current = _verifications[index];
    final updatedNotes = List<String>.from(current.internalNotes);
    if (internalNote != null && internalNote.isNotEmpty) {
      updatedNotes.add(internalNote);
    }

    final updated = current.copyWith(
      status: newStatus,
      reviewedAt: DateTime.now(),
      reviewedBy: 'usr_admin_demo',
      rejectionReason: rejectionReason,
      internalNotes: updatedNotes,
    );

    _verifications[index] = updated;

    _auditLogs.insert(
      0,
      AdminAuditLogEntry(
        id: 'aud_${DateTime.now().millisecondsSinceEpoch}',
        actorId: 'usr_admin_demo',
        actorName: 'Platform Admin',
        actorRole: 'admin',
        action: newStatus == AdminVerificationStatus.verified
            ? 'seller_verified'
            : newStatus == AdminVerificationStatus.rejected
                ? 'seller_rejected'
                : 'seller_suspended',
        entityType: 'seller',
        entityId: current.sellerId,
        entityLabel: current.businessName,
        metadata: {'status': newStatus.name, if (rejectionReason != null) 'reason': rejectionReason},
        createdAt: DateTime.now(),
      ),
    );

    return updated;
  }

  @override
  Future<AdminProductModeration> updateModerationStatus(
    String id,
    AdminModerationStatus newStatus, {
    String? rejectionReason,
  }) async {
    final index = _moderations.indexWhere((m) => m.id == id);
    if (index == -1) throw Exception('Product moderation record not found: $id');

    final current = _moderations[index];
    final updated = current.copyWith(
      status: newStatus,
      reviewedBy: 'usr_admin_demo',
      reviewedAt: DateTime.now(),
      rejectionReason: rejectionReason,
    );

    _moderations[index] = updated;

    _auditLogs.insert(
      0,
      AdminAuditLogEntry(
        id: 'aud_${DateTime.now().millisecondsSinceEpoch}',
        actorId: 'usr_admin_demo',
        actorName: 'Platform Admin',
        actorRole: 'admin',
        action: newStatus == AdminModerationStatus.approved
            ? 'product_approved'
            : newStatus == AdminModerationStatus.rejected
                ? 'product_rejected'
                : 'product_archived',
        entityType: 'product',
        entityId: current.productId,
        entityLabel: current.productTitle,
        metadata: {'status': newStatus.name, if (rejectionReason != null) 'reason': rejectionReason},
        createdAt: DateTime.now(),
      ),
    );

    return updated;
  }

  @override
  Future<AdminDispute> updateDisputeStatus(
    String id,
    AdminDisputeStatus newStatus, {
    String? resolution,
  }) async {
    final index = _disputes.indexWhere((d) => d.id == id);
    if (index == -1) throw Exception('Dispute record not found: $id');

    final current = _disputes[index];
    final updated = current.copyWith(
      status: newStatus,
      resolution: resolution,
    );

    _disputes[index] = updated;

    _auditLogs.insert(
      0,
      AdminAuditLogEntry(
        id: 'aud_${DateTime.now().millisecondsSinceEpoch}',
        actorId: 'usr_admin_demo',
        actorName: 'Platform Admin',
        actorRole: 'admin',
        action: newStatus == AdminDisputeStatus.resolved ? 'dispute_resolved' : 'dispute_status_changed',
        entityType: 'dispute',
        entityId: current.id,
        entityLabel: current.orderNumber,
        metadata: {'status': newStatus.name, if (resolution != null) 'resolution': resolution},
        createdAt: DateTime.now(),
      ),
    );

    return updated;
  }

  @override
  Future<AdminDisputeMessage> addDisputeMessage(
    String disputeId,
    String content,
    String authorId,
    String authorName,
    String authorRole,
  ) async {
    final index = _disputes.indexWhere((d) => d.id == disputeId);
    if (index == -1) throw Exception('Dispute not found: $disputeId');

    final message = AdminDisputeMessage(
      id: 'msg_${DateTime.now().millisecondsSinceEpoch}',
      disputeId: disputeId,
      authorId: authorId,
      authorName: authorName,
      authorRole: authorRole,
      content: content,
      createdAt: DateTime.now(),
    );

    final current = _disputes[index];
    final updatedMessages = List<AdminDisputeMessage>.from(current.messages)..add(message);
    _disputes[index] = current.copyWith(messages: updatedMessages);

    return message;
  }

  @override
  Future<AdminRiskSignal> resolveRiskSignal(String id) async {
    final index = _riskSignals.indexWhere((r) => r.id == id);
    if (index == -1) throw Exception('Risk signal not found: $id');

    final current = _riskSignals[index];
    final updated = current.copyWith(
      isResolved: true,
      resolvedAt: DateTime.now(),
      resolvedBy: 'usr_admin_demo',
    );

    _riskSignals[index] = updated;

    _auditLogs.insert(
      0,
      AdminAuditLogEntry(
        id: 'aud_${DateTime.now().millisecondsSinceEpoch}',
        actorId: 'usr_admin_demo',
        actorName: 'Platform Admin',
        actorRole: 'admin',
        action: 'risk_signal_resolved',
        entityType: 'risk_signal',
        entityId: current.id,
        entityLabel: current.entityLabel,
        metadata: {'rule': current.ruleTriggered},
        createdAt: DateTime.now(),
      ),
    );

    return updated;
  }
}
