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
  | 'packed'
  | 'shipped'
  | 'outForDelivery'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refund_requested'
  | 'refund_processing'
  | 'refunded'
  | 'disputed';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  packed: 'Packed',
  shipped: 'Shipped',
  outForDelivery: 'Out for Delivery',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refund_requested: 'Refund Requested',
  refund_processing: 'Refund Processing',
  refunded: 'Refunded',
  disputed: 'Disputed',
};

export const ORDER_TIMELINE_STEPS: OrderStatus[] = [
  'placed',
  'confirmed',
  'processing',
  'packed',
  'shipped',
  'outForDelivery',
  'delivered',
];

export function orderStatusStep(status: OrderStatus): number {
  if (status === 'out_for_delivery') return ORDER_TIMELINE_STEPS.indexOf('outForDelivery');
  return ORDER_TIMELINE_STEPS.indexOf(status);
}

export function isOrderActive(status: OrderStatus): boolean {
  return [
    'placed',
    'confirmed',
    'processing',
    'packed',
    'shipped',
    'outForDelivery',
    'out_for_delivery',
  ].includes(status);
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

export type UserPlatformRole = 'farmer' | 'seller' | 'cooperative_manager' | 'admin';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: UserPlatformRole;
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

export interface MandiCommodityDetail {
  id: string;
  crop: string;
  variety: string;
  market: string;
  state: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  change: string;
  trend: 'up' | 'down' | 'flat';
  arrivalVolumeTonnes: number;
  updatedAt: string;
  sparkline: number[];
  marketComparisons: {
    marketName: string;
    modalPrice: number;
    difference: string;
  }[];
}

// ============================================================
// PRODUCT REVIEWS
// ============================================================

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// ============================================================
// WEATHER INTELLIGENCE
// ============================================================

export interface WeatherCondition {
  location: string;
  state: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeedKmH: number;
  visibilityKm: number;
  rainProbability: number;
  conditionText: string;
  uvIndex: number;
  updatedAt: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  rainProbability: number;
  windSpeedKmH: number;
  condition: 'sunny' | 'cloudy' | 'rain' | 'thunder';
}

export interface DailyForecast {
  day: string;
  date: string;
  tempHigh: number;
  tempLow: number;
  rainProbability: number;
  condition: 'sunny' | 'cloudy' | 'rain' | 'thunder';
}

export interface FarmAdvisory {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  advice: string;
  category: 'Irrigation' | 'Spraying' | 'Harvesting' | 'Field Prep';
}

// ============================================================
// NOTIFICATIONS
// ============================================================

export type NotificationType = 'orders' | 'prices' | 'products' | 'weather' | 'system';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  actionRoute?: string;
  createdAt: string;
}

// ============================================================
// COMMUNITY FORUM
// ============================================================

export type CommunityCategory =
  | 'Crop Management'
  | 'Market Discussion'
  | 'Irrigation'
  | 'Equipment'
  | 'Pest Management'
  | 'General Farming';

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  authorName: string;
  category: CommunityCategory;
  title: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  createdAt: string;
  comments?: CommunityComment[];
}


