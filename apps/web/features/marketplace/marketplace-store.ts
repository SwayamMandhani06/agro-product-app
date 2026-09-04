// ============================================================
// AGRITRADE MARKETPLACE STORE — Zustand
// Handles Seller operations, Inventory movements, Cooperative campaigns, Payouts
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserPlatformRole } from '@/types';
import type { SellerProfile } from './domain/seller';
import type { SellerInventoryItem, InventoryMovement, InventoryMovementType } from './domain/inventory';
import type { Cooperative, CooperativeCampaign, CooperativeParticipation } from './domain/cooperative';
import type { SellerPayout } from './domain/payout';
import {
  MOCK_SELLER_PROFILES,
  MOCK_SELLER_INVENTORY,
  MOCK_INVENTORY_MOVEMENTS,
  MOCK_COOPERATIVES,
  MOCK_COOPERATIVE_CAMPAIGNS,
  MOCK_COOPERATIVE_PARTICIPATIONS,
  MOCK_SELLER_PAYOUTS,
  MOCK_SELLER_ORDERS,
  type SellerOrder,
} from './data/mock-marketplace-data';

interface MarketplaceState {
  currentRole: UserPlatformRole;
  activeSellerId: string;
  activeCooperativeId: string;
  cooperatives: Cooperative[];
  sellerProfiles: SellerProfile[];
  inventory: SellerInventoryItem[];
  movements: InventoryMovement[];
  sellerOrders: SellerOrder[];
  campaigns: CooperativeCampaign[];
  participations: CooperativeParticipation[];
  payouts: SellerPayout[];

  // Role switching
  setRole: (role: UserPlatformRole) => void;
  setActiveSeller: (sellerId: string) => void;

  // Inventory & Product Management
  addInventoryItem: (item: Omit<SellerInventoryItem, 'id' | 'updatedAt'>) => SellerInventoryItem;
  updateInventoryItem: (id: string, updates: Partial<SellerInventoryItem>) => void;
  adjustStock: (inventoryId: string, delta: number, movementType: InventoryMovementType, notes?: string) => void;

  // Order Fulfillment
  updateOrderFulfillment: (orderId: string, status: SellerOrder['fulfillmentStatus']) => void;

  // Cooperative Campaigns
  createCampaign: (data: Omit<CooperativeCampaign, 'id' | 'currentQuantity' | 'participantsCount'>) => CooperativeCampaign;
  joinCampaign: (campaignId: string, farmerId: string, farmerName: string, quantity: number, village?: string) => void;
  leaveCampaign: (campaignId: string, farmerId: string) => void;

  // Payouts (Deterministic Simulation)
  requestPayoutSimulation: (sellerId: string) => SellerPayout | null;

  // Realtime handlers
  syncRealtimeInventory: (inventoryId: string, newStock: number) => void;
  syncRealtimeCampaign: (campaignId: string, currentQuantity: number, status?: CooperativeCampaign['status']) => void;
}

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      currentRole: 'seller', // Default to seller for instant portal demonstration
      activeSellerId: 'sel_krishi_kendra_01',
      activeCooperativeId: 'coop_baramati_fpo_01',
      cooperatives: MOCK_COOPERATIVES,
      sellerProfiles: MOCK_SELLER_PROFILES,
      inventory: MOCK_SELLER_INVENTORY,
      movements: MOCK_INVENTORY_MOVEMENTS,
      sellerOrders: MOCK_SELLER_ORDERS,
      campaigns: MOCK_COOPERATIVE_CAMPAIGNS,
      participations: MOCK_COOPERATIVE_PARTICIPATIONS,
      payouts: MOCK_SELLER_PAYOUTS,

      setRole: (role) => set({ currentRole: role }),

      setActiveSeller: (sellerId) => set({ activeSellerId: sellerId }),

      addInventoryItem: (item) => {
        const id = `inv_${Date.now()}`;
        const newItem: SellerInventoryItem = {
          ...item,
          id,
          updatedAt: new Date().toISOString(),
        };
        const movement: InventoryMovement = {
          id: `mov_${Date.now()}`,
          inventoryId: id,
          productId: item.productId,
          sellerId: item.sellerId,
          movementType: 'stock_in',
          quantity: item.stockQuantity,
          previousStock: 0,
          newStock: item.stockQuantity,
          referenceId: `NEW-LIST-${item.sku}`,
          notes: 'Initial listing stock provisioning',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          inventory: [newItem, ...state.inventory],
          movements: [movement, ...state.movements],
        }));

        return newItem;
      },

      updateInventoryItem: (id, updates) => {
        set((state) => ({
          inventory: state.inventory.map((inv) =>
            inv.id === id ? { ...inv, ...updates, updatedAt: new Date().toISOString() } : inv
          ),
        }));
      },

      adjustStock: (inventoryId, delta, movementType, notes) => {
        const state = get();
        const item = state.inventory.find((i) => i.id === inventoryId);
        if (!item) return;

        const previousStock = item.stockQuantity;
        const newStock = Math.max(0, previousStock + delta);
        const newListingStatus = newStock === 0 ? 'out_of_stock' : item.listingStatus === 'out_of_stock' ? 'active' : item.listingStatus;

        const movement: InventoryMovement = {
          id: `mov_${Date.now()}`,
          inventoryId,
          productId: item.productId,
          sellerId: item.sellerId,
          movementType,
          quantity: delta,
          previousStock,
          newStock,
          referenceId: `MANUAL-${Date.now().toString().slice(-6)}`,
          notes: notes || `Manual stock adjustment (${movementType})`,
          createdAt: new Date().toISOString(),
        };

        set({
          inventory: state.inventory.map((i) =>
            i.id === inventoryId
              ? { ...i, stockQuantity: newStock, listingStatus: newListingStatus, updatedAt: new Date().toISOString() }
              : i
          ),
          movements: [movement, ...state.movements],
        });
      },

      updateOrderFulfillment: (orderId, status) => {
        set((state) => ({
          sellerOrders: state.sellerOrders.map((ord) =>
            ord.id === orderId ? { ...ord, fulfillmentStatus: status } : ord
          ),
        }));
      },

      createCampaign: (data) => {
        const id = `cmp_${Date.now()}`;
        const newCampaign: CooperativeCampaign = {
          ...data,
          id,
          currentQuantity: 0,
          participantsCount: 0,
          status: 'active',
        };

        set((state) => ({
          campaigns: [newCampaign, ...state.campaigns],
        }));

        return newCampaign;
      },

      joinCampaign: (campaignId, farmerId, farmerName, quantity, village = 'Baramati Cluster') => {
        const state = get();
        const campaign = state.campaigns.find((c) => c.id === campaignId);
        if (!campaign) return;

        const existingPtc = state.participations.find(
          (p) => p.campaignId === campaignId && p.farmerId === farmerId
        );

        const unitSavings = campaign.retailPrice - campaign.bulkPrice;
        const potentialSavings = quantity * unitSavings;
        const totalPrice = quantity * campaign.bulkPrice;

        let updatedParticipations: CooperativeParticipation[];
        let qtyDelta = quantity;

        if (existingPtc) {
          qtyDelta = quantity - existingPtc.quantity;
          updatedParticipations = state.participations.map((p) =>
            p.id === existingPtc.id
              ? { ...p, quantity, totalPrice, potentialSavings, status: 'confirmed' as const }
              : p
          );
        } else {
          const newPtc: CooperativeParticipation = {
            id: `ptc_${Date.now()}`,
            campaignId,
            farmerId,
            farmerName,
            farmerPhone: '+91 98765 43210',
            village,
            quantity,
            unitPrice: campaign.bulkPrice,
            totalPrice,
            potentialSavings,
            joinedAt: new Date().toISOString(),
            status: 'confirmed',
          };
          updatedParticipations = [newPtc, ...state.participations];
        }

        const newCurrentQty = campaign.currentQuantity + qtyDelta;
        let newStatus = campaign.status;
        if (newCurrentQty >= campaign.targetQuantity) {
          newStatus = 'processing';
        } else if (newCurrentQty >= campaign.minimumQuantity) {
          newStatus = 'threshold_reached';
        }

        const newParticipantsCount = existingPtc
          ? campaign.participantsCount
          : campaign.participantsCount + 1;

        set({
          participations: updatedParticipations,
          campaigns: state.campaigns.map((c) =>
            c.id === campaignId
              ? {
                  ...c,
                  currentQuantity: newCurrentQty,
                  participantsCount: newParticipantsCount,
                  status: newStatus,
                }
              : c
          ),
        });
      },

      leaveCampaign: (campaignId, farmerId) => {
        const state = get();
        const ptc = state.participations.find(
          (p) => p.campaignId === campaignId && p.farmerId === farmerId
        );
        if (!ptc) return;

        const campaign = state.campaigns.find((c) => c.id === campaignId);
        if (!campaign) return;

        const newCurrentQty = Math.max(0, campaign.currentQuantity - ptc.quantity);
        let newStatus = campaign.status;
        if (newCurrentQty < campaign.minimumQuantity && newStatus === 'threshold_reached') {
          newStatus = 'active';
        }

        set({
          participations: state.participations.filter((p) => p.id !== ptc.id),
          campaigns: state.campaigns.map((c) =>
            c.id === campaignId
              ? {
                  ...c,
                  currentQuantity: newCurrentQty,
                  participantsCount: Math.max(0, c.participantsCount - 1),
                  status: newStatus,
                }
              : c
          ),
        });
      },

      requestPayoutSimulation: (sellerId) => {
        const state = get();
        const seller = state.sellerProfiles.find((s) => s.id === sellerId);
        if (!seller || !seller.metrics || seller.metrics.availableBalance <= 0) return null;

        const amount = seller.metrics.availableBalance;
        const commissionRate = seller.commissionRate / 100;
        const grossRevenue = Math.round(amount / (1 - commissionRate));
        const commissionDeducted = grossRevenue - amount;

        const newPayout: SellerPayout = {
          id: `pay_${Date.now()}`,
          sellerId,
          amount,
          orderCount: Math.ceil(amount / 3200),
          periodStart: new Date(Date.now() - 7 * 86400000).toISOString(),
          periodEnd: new Date().toISOString(),
          status: 'processing',
          bankAccountMasked: 'HDFC Bank •••• 4821',
          grossRevenue,
          commissionDeducted,
          createdAt: new Date().toISOString(),
        };

        const updatedProfiles = state.sellerProfiles.map((s) =>
          s.id === sellerId && s.metrics
            ? {
                ...s,
                metrics: {
                  ...s.metrics,
                  availableBalance: 0,
                  pendingPayoutAmount: s.metrics.pendingPayoutAmount + amount,
                },
              }
            : s
        );

        set({
          payouts: [newPayout, ...state.payouts],
          sellerProfiles: updatedProfiles,
        });

        return newPayout;
      },

      syncRealtimeInventory: (inventoryId, newStock) => {
        set((state) => ({
          inventory: state.inventory.map((item) =>
            item.id === inventoryId
              ? {
                  ...item,
                  stockQuantity: newStock,
                  listingStatus: newStock === 0 ? 'out_of_stock' : item.listingStatus,
                  updatedAt: new Date().toISOString(),
                }
              : item
          ),
        }));
      },

      syncRealtimeCampaign: (campaignId, currentQuantity, status) => {
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === campaignId
              ? {
                  ...c,
                  currentQuantity,
                  ...(status ? { status } : {}),
                }
              : c
          ),
        }));
      },
    }),
    {
      name: 'agritrade-marketplace-storage',
      partialize: (state) => ({
        currentRole: state.currentRole,
        activeSellerId: state.activeSellerId,
        activeCooperativeId: state.activeCooperativeId,
        inventory: state.inventory,
        movements: state.movements,
        sellerOrders: state.sellerOrders,
        campaigns: state.campaigns,
        participations: state.participations,
        payouts: state.payouts,
      }),
    }
  )
);
