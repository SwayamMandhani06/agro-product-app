import 'package:flutter/foundation.dart';

enum SellerVerificationStatus { pending, verified, suspended }

enum ListingStatus { draft, active, paused, outOfStock, archived }

enum StockHealth { healthy, lowStock, outOfStock }

enum InventoryMovementType { stockIn, stockOut, adjustment, orderReserved, orderReleased }

enum FulfillmentStatus { pending, packed, dispatched, delivered, cancelled }

enum PayoutStatus { pending, processing, paid, failed }

enum CampaignStatus { draft, active, thresholdReached, processing, completed, cancelled }

@immutable
class SellerProfile {
  final String id;
  final String userId;
  final String businessName;
  final String legalName;
  final String description;
  final SellerVerificationStatus verificationStatus;
  final double rating;
  final int totalReviews;
  final String location;
  final String state;
  final String district;
  final String gstNumber;
  final String contactPhone;
  final String contactEmail;
  final int dispatchSlaHours;
  final double commissionRate;
  final double totalRevenue;
  final int activeOrders;
  final int deliveredOrders;
  final double onTimeDispatchRate;
  final int lowStockCount;
  final double availableBalance;
  final double pendingPayoutAmount;

  const SellerProfile({
    required this.id,
    required this.userId,
    required this.businessName,
    required this.legalName,
    required this.description,
    required this.verificationStatus,
    required this.rating,
    required this.totalReviews,
    required this.location,
    required this.state,
    required this.district,
    required this.gstNumber,
    required this.contactPhone,
    required this.contactEmail,
    required this.dispatchSlaHours,
    required this.commissionRate,
    this.totalRevenue = 486250.0,
    this.activeOrders = 8,
    this.deliveredOrders = 142,
    this.onTimeDispatchRate = 98.6,
    this.lowStockCount = 2,
    this.availableBalance = 82400.0,
    this.pendingPayoutAmount = 42500.0,
  });

  SellerProfile copyWith({
    double? availableBalance,
    double? pendingPayoutAmount,
    int? activeOrders,
  }) {
    return SellerProfile(
      id: id,
      userId: userId,
      businessName: businessName,
      legalName: legalName,
      description: description,
      verificationStatus: verificationStatus,
      rating: rating,
      totalReviews: totalReviews,
      location: location,
      state: state,
      district: district,
      gstNumber: gstNumber,
      contactPhone: contactPhone,
      contactEmail: contactEmail,
      dispatchSlaHours: dispatchSlaHours,
      commissionRate: commissionRate,
      totalRevenue: totalRevenue,
      activeOrders: activeOrders ?? this.activeOrders,
      deliveredOrders: deliveredOrders,
      onTimeDispatchRate: onTimeDispatchRate,
      lowStockCount: lowStockCount,
      availableBalance: availableBalance ?? this.availableBalance,
      pendingPayoutAmount: pendingPayoutAmount ?? this.pendingPayoutAmount,
    );
  }
}

@immutable
class SellerInventoryItem {
  final String id;
  final String productId;
  final String productTitle;
  final String sellerId;
  final String sku;
  final String category;
  final int stockQuantity;
  final int reservedQuantity;
  final int reorderLevel;
  final int minimumOrderQuantity;
  final String unit;
  final ListingStatus listingStatus;
  final double price;
  final double mrp;
  final String imageUrl;

  const SellerInventoryItem({
    required this.id,
    required this.productId,
    required this.productTitle,
    required this.sellerId,
    required this.sku,
    required this.category,
    required this.stockQuantity,
    required this.reservedQuantity,
    required this.reorderLevel,
    required this.minimumOrderQuantity,
    required this.unit,
    required this.listingStatus,
    required this.price,
    required this.mrp,
    required this.imageUrl,
  });

  StockHealth get stockHealth {
    if (stockQuantity <= 0) return StockHealth.outOfStock;
    if (stockQuantity <= reorderLevel) return StockHealth.lowStock;
    return StockHealth.healthy;
  }

  int get availableStock => (stockQuantity - reservedQuantity).clamp(0, 999999);

  SellerInventoryItem copyWith({
    int? stockQuantity,
    int? reservedQuantity,
    ListingStatus? listingStatus,
    double? price,
  }) {
    return SellerInventoryItem(
      id: id,
      productId: productId,
      productTitle: productTitle,
      sellerId: sellerId,
      sku: sku,
      category: category,
      stockQuantity: stockQuantity ?? this.stockQuantity,
      reservedQuantity: reservedQuantity ?? this.reservedQuantity,
      reorderLevel: reorderLevel,
      minimumOrderQuantity: minimumOrderQuantity,
      unit: unit,
      listingStatus: listingStatus ?? this.listingStatus,
      price: price ?? this.price,
      mrp: mrp,
      imageUrl: imageUrl,
    );
  }
}

@immutable
class InventoryMovement {
  final String id;
  final String inventoryId;
  final String productTitle;
  final String sku;
  final InventoryMovementType movementType;
  final int quantity;
  final int previousStock;
  final int newStock;
  final String referenceId;
  final String notes;
  final DateTime createdAt;

  const InventoryMovement({
    required this.id,
    required this.inventoryId,
    required this.productTitle,
    required this.sku,
    required this.movementType,
    required this.quantity,
    required this.previousStock,
    required this.newStock,
    required this.referenceId,
    required this.notes,
    required this.createdAt,
  });
}

@immutable
class SellerOrderItem {
  final String productId;
  final String title;
  final int quantity;
  final double unitPrice;

  const SellerOrderItem({
    required this.productId,
    required this.title,
    required this.quantity,
    required this.unitPrice,
  });
}

@immutable
class SellerOrder {
  final String id;
  final String orderNumber;
  final String customerName;
  final String customerPhone;
  final String customerVillage;
  final List<SellerOrderItem> items;
  final double totalAmount;
  final String paymentMethod;
  final FulfillmentStatus fulfillmentStatus;
  final DateTime createdAt;
  final DateTime dispatchDeadline;

  const SellerOrder({
    required this.id,
    required this.orderNumber,
    required this.customerName,
    required this.customerPhone,
    required this.customerVillage,
    required this.items,
    required this.totalAmount,
    required this.paymentMethod,
    required this.fulfillmentStatus,
    required this.createdAt,
    required this.dispatchDeadline,
  });

  SellerOrder copyWith({
    FulfillmentStatus? fulfillmentStatus,
  }) {
    return SellerOrder(
      id: id,
      orderNumber: orderNumber,
      customerName: customerName,
      customerPhone: customerPhone,
      customerVillage: customerVillage,
      items: items,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      fulfillmentStatus: fulfillmentStatus ?? this.fulfillmentStatus,
      createdAt: createdAt,
      dispatchDeadline: dispatchDeadline,
    );
  }
}

@immutable
class SellerPayout {
  final String id;
  final String sellerId;
  final double amount;
  final int orderCount;
  final DateTime periodStart;
  final DateTime periodEnd;
  final PayoutStatus status;
  final String utrReference;
  final String bankAccountMasked;
  final double grossRevenue;
  final double commissionDeducted;
  final DateTime createdAt;

  const SellerPayout({
    required this.id,
    required this.sellerId,
    required this.amount,
    required this.orderCount,
    required this.periodStart,
    required this.periodEnd,
    required this.status,
    required this.utrReference,
    required this.bankAccountMasked,
    required this.grossRevenue,
    required this.commissionDeducted,
    required this.createdAt,
  });
}

@immutable
class CooperativeCampaign {
  final String id;
  final String cooperativeId;
  final String cooperativeName;
  final String title;
  final String description;
  final String productId;
  final String productTitle;
  final String category;
  final int targetQuantity;
  final int minimumQuantity;
  final int currentQuantity;
  final double retailPrice;
  final double bulkPrice;
  final String unit;
  final double discountPercent;
  final CampaignStatus status;
  final int participantsCount;
  final String sellerName;

  const CooperativeCampaign({
    required this.id,
    required this.cooperativeId,
    required this.cooperativeName,
    required this.title,
    required this.description,
    required this.productId,
    required this.productTitle,
    required this.category,
    required this.targetQuantity,
    required this.minimumQuantity,
    required this.currentQuantity,
    required this.retailPrice,
    required this.bulkPrice,
    required this.unit,
    required this.discountPercent,
    required this.status,
    required this.participantsCount,
    required this.sellerName,
  });

  int get progressPercentage => targetQuantity > 0
      ? ((currentQuantity / targetQuantity) * 100).clamp(0, 100).round()
      : 0;

  bool get minimumThresholdReached => currentQuantity >= minimumQuantity;
  bool get targetReached => currentQuantity >= targetQuantity;
  double get collectiveSavings => currentQuantity * (retailPrice - bulkPrice);

  CooperativeCampaign copyWith({
    int? currentQuantity,
    int? participantsCount,
    CampaignStatus? status,
  }) {
    return CooperativeCampaign(
      id: id,
      cooperativeId: cooperativeId,
      cooperativeName: cooperativeName,
      title: title,
      description: description,
      productId: productId,
      productTitle: productTitle,
      category: category,
      targetQuantity: targetQuantity,
      minimumQuantity: minimumQuantity,
      currentQuantity: currentQuantity ?? this.currentQuantity,
      retailPrice: retailPrice,
      bulkPrice: bulkPrice,
      unit: unit,
      discountPercent: discountPercent,
      status: status ?? this.status,
      participantsCount: participantsCount ?? this.participantsCount,
      sellerName: sellerName,
    );
  }
}

@immutable
class CooperativeParticipation {
  final String id;
  final String campaignId;
  final String farmerId;
  final String farmerName;
  final int quantity;
  final double unitPrice;
  final double totalPrice;
  final double potentialSavings;
  final DateTime joinedAt;

  const CooperativeParticipation({
    required this.id,
    required this.campaignId,
    required this.farmerId,
    required this.farmerName,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
    required this.potentialSavings,
    required this.joinedAt,
  });
}
