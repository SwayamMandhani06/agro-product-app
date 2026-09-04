import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/seller_repository.dart';
import '../../domain/seller_entities.dart';

// Inventory Notifier
class SellerInventoryNotifier extends StateNotifier<List<SellerInventoryItem>> {
  SellerInventoryNotifier() : super(SellerRepository.demoInventory);

  void adjustStock(String inventoryId, int delta) {
    state = [
      for (final item in state)
        if (item.id == inventoryId)
          item.copyWith(
            stockQuantity: (item.stockQuantity + delta).clamp(0, 999999),
            listingStatus: (item.stockQuantity + delta) <= 0
                ? ListingStatus.outOfStock
                : item.listingStatus == ListingStatus.outOfStock
                    ? ListingStatus.active
                    : item.listingStatus,
          )
        else
          item,
    ];
  }
}

final sellerInventoryProvider =
    StateNotifierProvider<SellerInventoryNotifier, List<SellerInventoryItem>>((ref) {
  return SellerInventoryNotifier();
});

// Orders Notifier
class SellerOrdersNotifier extends StateNotifier<List<SellerOrder>> {
  SellerOrdersNotifier() : super(SellerRepository.demoOrders);

  void updateOrderStatus(String orderId, FulfillmentStatus status) {
    state = [
      for (final ord in state)
        if (ord.id == orderId) ord.copyWith(fulfillmentStatus: status) else ord,
    ];
  }
}

final sellerOrdersProvider =
    StateNotifierProvider<SellerOrdersNotifier, List<SellerOrder>>((ref) {
  return SellerOrdersNotifier();
});

// Payouts Notifier
class SellerPayoutsNotifier extends StateNotifier<List<SellerPayout>> {
  SellerPayoutsNotifier() : super(SellerRepository.demoPayouts);

  SellerPayout? requestPayout(double amount) {
    if (amount <= 0) return null;

    final newPayout = SellerPayout(
      id: 'pay_${DateTime.now().millisecondsSinceEpoch}',
      sellerId: 'sel_krishi_kendra_01',
      amount: amount,
      orderCount: (amount / 3200).ceil(),
      periodStart: DateTime.now().subtract(const Duration(days: 7)),
      periodEnd: DateTime.now(),
      status: PayoutStatus.processing,
      utrReference: 'PENDING_CLEARANCE',
      bankAccountMasked: 'HDFC Bank •••• 4821',
      grossRevenue: (amount / (1 - 0.045)).roundToDouble(),
      commissionDeducted: ((amount / (1 - 0.045)) - amount).roundToDouble(),
      createdAt: DateTime.now(),
    );

    state = [newPayout, ...state];
    return newPayout;
  }
}

final sellerPayoutsProvider =
    StateNotifierProvider<SellerPayoutsNotifier, List<SellerPayout>>((ref) {
  return SellerPayoutsNotifier();
});

// Profile Notifier
class SellerProfileNotifier extends StateNotifier<SellerProfile> {
  SellerProfileNotifier() : super(SellerRepository.demoSeller);

  void deductBalanceAfterPayout(double amount) {
    state = state.copyWith(
      availableBalance: 0.0,
      pendingPayoutAmount: state.pendingPayoutAmount + amount,
    );
  }
}

final sellerProfileProvider =
    StateNotifierProvider<SellerProfileNotifier, SellerProfile>((ref) {
  return SellerProfileNotifier();
});

// Cooperative Campaigns Notifier
class CooperativeCampaignsNotifier extends StateNotifier<List<CooperativeCampaign>> {
  CooperativeCampaignsNotifier() : super(SellerRepository.demoCampaigns);

  void joinCampaign(String campaignId, int quantity) {
    state = [
      for (final camp in state)
        if (camp.id == campaignId)
          _updateCampaignVolume(camp, quantity)
        else
          camp,
    ];
  }

  CooperativeCampaign _updateCampaignVolume(CooperativeCampaign camp, int deltaQty) {
    final newQty = camp.currentQuantity + deltaQty;
    var newStatus = camp.status;
    if (newQty >= camp.targetQuantity) {
      newStatus = CampaignStatus.processing;
    } else if (newQty >= camp.minimumQuantity) {
      newStatus = CampaignStatus.thresholdReached;
    }

    return camp.copyWith(
      currentQuantity: newQty,
      participantsCount: camp.participantsCount + 1,
      status: newStatus,
    );
  }
}

final cooperativeCampaignsProvider =
    StateNotifierProvider<CooperativeCampaignsNotifier, List<CooperativeCampaign>>((ref) {
  return CooperativeCampaignsNotifier();
});
