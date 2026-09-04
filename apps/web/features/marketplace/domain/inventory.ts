// ============================================================
// AGRITRADE MARKETPLACE — INVENTORY & MOVEMENT DOMAIN MODEL
// Mirrors supabase/migrations/20260905000000_stage_10_marketplace_cooperative.sql
// ============================================================

export type ListingStatus = 'draft' | 'active' | 'paused' | 'out_of_stock' | 'archived';

export type InventoryMovementType =
  | 'stock_in'
  | 'stock_out'
  | 'adjustment'
  | 'order_reserved'
  | 'order_released';

export interface SellerInventoryItem {
  id: string;
  productId: string;
  productTitle: string;
  sellerId: string;
  sku: string;
  category: string;
  stockQuantity: number;
  reservedQuantity: number;
  reorderLevel: number;
  minimumOrderQuantity: number;
  unit: string;
  listingStatus: ListingStatus;
  price: number;
  mrp: number;
  imageUrl?: string;
  highlights?: string[];
  specifications?: Record<string, string>;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  inventoryId: string;
  productId: string;
  sellerId: string;
  movementType: InventoryMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceId?: string;
  notes?: string;
  createdAt: string;
}

export function computeStockHealth(item: SellerInventoryItem): 'healthy' | 'low_stock' | 'out_of_stock' {
  if (item.stockQuantity <= 0) return 'out_of_stock';
  if (item.stockQuantity <= item.reorderLevel) return 'low_stock';
  return 'healthy';
}

export function computeAvailableStock(item: SellerInventoryItem): number {
  return Math.max(0, item.stockQuantity - item.reservedQuantity);
}
