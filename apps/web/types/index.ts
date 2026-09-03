// ============================================================
// AGRITRADE TYPE DEFINITIONS
// Mirrors apps/mobile/lib/features/*/domain/*.dart
// ============================================================

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  unit: string;
  sellerName?: string;
  category?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  isFavorite: boolean;
  description?: string;
  images?: string[];
  highlights?: string[];
  specifications?: Record<string, string>;
  sellerRating?: number;
  stockCount?: number;
  deliveryLocation?: string;
  brand?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  icon: string; // emoji or icon class
  itemCount?: number;
}

export type PriceRangeFilter =
  | { label: 'Under ₹500'; min?: undefined; max: 500 }
  | { label: '₹500 – ₹1,000'; min: 500; max: 1000 }
  | { label: '₹1,000 – ₹3,000'; min: 1000; max: 3000 }
  | { label: '₹3,000 & Above'; min: 3000; max?: undefined };

export type ProductSortKey = 'featured' | 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'newest';

export const PRODUCT_SORT_LABELS: Record<ProductSortKey, string> = {
  featured: 'Featured',
  priceAsc: 'Price: Low to High',
  priceDesc: 'Price: High to Low',
  ratingDesc: 'Highest Rated',
  newest: 'Newest Arrivals',
};

export interface ProductFilter {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  inStockOnly: boolean;
}

// ============================================================
// CART
// ============================================================

export interface CartItem {
  product: Product;
  quantity: number;
}

export function cartItemUnitPrice(item: CartItem): number {
  return item.product.price;
}

export function cartItemTotal(item: CartItem): number {
  return item.product.price * item.quantity;
}

export function cartItemSavings(item: CartItem): number {
  const orig = item.product.originalPrice ?? item.product.price;
  return (orig - item.product.price) * item.quantity;
}

// ============================================================
// DELIVERY
// ============================================================

export const FREE_DELIVERY_THRESHOLD = 1000; // ₹
export const DELIVERY_FEE = 99; // ₹

export function calculateDeliveryFee(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}

// ============================================================
// DELIVERY ADDRESS
// ============================================================

export interface DeliveryAddress {
  id: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  tag: string;
  isDefault: boolean;
}

export function formattedAddress(addr: DeliveryAddress): string {
  return `${addr.addressLine}, ${addr.city}, ${addr.state} ${addr.pincode}`;
}

// ============================================================
// ORDER
// ============================================================

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'outForDelivery'
  | 'delivered'
  | 'cancelled';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Packed',
  shipped: 'Shipped',
  outForDelivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_TIMELINE_STEPS: OrderStatus[] = [
  'placed',
  'confirmed',
  'processing',
  'shipped',
  'outForDelivery',
  'delivered',
];

export function orderStatusStep(status: OrderStatus): number {
  return ORDER_TIMELINE_STEPS.indexOf(status);
}

export function isOrderActive(status: OrderStatus): boolean {
  return ['placed', 'confirmed', 'processing', 'shipped', 'outForDelivery'].includes(status);
}

export interface Order {
  id: string;
  items: CartItem[];
  address: DeliveryAddress;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  createdAt: string; // ISO date string
  status: OrderStatus;
  estimatedDelivery: string;
  deliveryAgentName?: string;
  deliveryAgentPhone?: string;
}

export function orderTotalItemCount(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

// ============================================================
// AUTH
// ============================================================

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  userId?: string;
  name?: string;
  email?: string;
}

// ============================================================
// MANDI PRICES
// ============================================================

export interface MandiPrice {
  crop: string;
  price: string;
  change: string;
  trend: 'up' | 'down' | 'flat';
  market: string;
}

