// ============================================================
// AGRITRADE MOCK DATA
// Mirrors apps/mobile/lib/features/products/data/mock_product_repository.dart
// ============================================================

import type { Product, ProductCategory, DeliveryAddress, Order, MandiPrice } from '@/types';

export const MOCK_CATEGORIES: ProductCategory[] = [
  { id: 'cat_seeds',       name: 'Seeds',          icon: 'sprout',        itemCount: 148 },
  { id: 'cat_fertilizers', name: 'Fertilizers',    icon: 'flask',         itemCount: 92  },
  { id: 'cat_protection',  name: 'Crop Protection', icon: 'shield-check', itemCount: 76  },
  { id: 'cat_tools',       name: 'Farm Tools',      icon: 'wrench',       itemCount: 115 },
  { id: 'cat_irrigation',  name: 'Irrigation',      icon: 'droplets',     itemCount: 54  },
  { id: 'cat_animal',      name: 'Animal Care',     icon: 'beef',         itemCount: 38  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    title: 'Premium Hybrid Soybean Seeds',
    price: 1250,
    originalPrice: 1450,
    unit: '5 kg pack',
    sellerName: 'AgriGrow Official',
    category: 'Seeds',
    rating: 4.7,
    reviewCount: 124,
    inStock: true,
    isFavorite: false,
    brand: 'AgriGrow',
    stockCount: 12,
    sellerRating: 4.9,
    deliveryLocation: 'Pune, Maharashtra',
    description:
      'High-yielding premium hybrid soybean seeds optimized for diverse soil conditions. Ensures rapid germination and robust root development for maximum crop output.',
    highlights: [
      'High germination rate (>90%)',
      'Suitable for Indian climate conditions',
      'High disease resistance (Yellow Mosaic Virus)',
      'Maturity window: 95-100 days',
    ],
    specifications: {
      Crop: 'Soybean',
      Brand: 'AgriGrow',
      'Pack Size': '5 kg',
      'Seed Type': 'Certified Hybrid',
      'Suitable Soil': 'Loamy & Black Soil',
    },
  },
  {
    id: 'prod_2',
    title: 'IFFCO DAP Fertilizer (Di-Ammonium Phosphate)',
    price: 1350,
    originalPrice: 1500,
    unit: '50kg bag',
    sellerName: 'IFFCO Agro Center',
    category: 'Fertilizers',
    rating: 4.7,
    reviewCount: 98,
    inStock: true,
    isFavorite: false,
    brand: 'IFFCO',
    stockCount: 45,
    sellerRating: 4.8,
    deliveryLocation: 'Pune, Maharashtra',
    description:
      'High-grade phosphatic fertilizer essential for root establishment, vigorous early plant growth, and higher crop yields.',
    highlights: [
      '18% Nitrogen & 46% Phosphorus',
      '100% water soluble phosphate',
      'Boosts root development and tillering',
    ],
    specifications: {
      Type: 'Inorganic Fertilizer',
      Brand: 'IFFCO',
      'Pack Size': '50kg bag',
      Form: 'Granular',
    },
  },
  {
    id: 'prod_3',
    title: 'Neem Shield Bio-Pesticide Concentrate',
    price: 420,
    originalPrice: 500,
    unit: '1L bottle',
    sellerName: 'AgroPure Organics',
    category: 'Crop Protection',
    rating: 4.6,
    reviewCount: 67,
    inStock: true,
    isFavorite: true,
    brand: 'AgroPure Organics',
    stockCount: 30,
    sellerRating: 4.7,
    deliveryLocation: 'Pune, Maharashtra',
    description:
      'Cold-pressed pure neem oil bio-pesticide with 10,000 ppm azadirachtin. Effective against whiteflies, aphids, and bollworms.',
    highlights: [
      '100% Organic & Eco-friendly',
      'Broad spectrum pest repellant',
      'Safe for beneficial insects',
    ],
    specifications: {
      Type: 'Bio-Pesticide',
      Brand: 'AgroPure Organics',
      'Pack Size': '1L bottle',
      Application: 'Foliar Spray',
    },
  },
  {
    id: 'prod_4',
    title: 'Premium Drip Irrigation Starter Kit (1 Acre)',
    price: 4500,
    originalPrice: 5200,
    unit: '1 set',
    sellerName: 'Jain Irrigation Ltd',
    category: 'Irrigation',
    rating: 4.9,
    reviewCount: 215,
    inStock: true,
    isFavorite: false,
    brand: 'Jain Irrigation',
    stockCount: 8,
    sellerRating: 4.9,
    deliveryLocation: 'Pune, Maharashtra',
    description:
      'Complete micro-irrigation system designed for 1 acre agricultural farmland. Delivers uniform water and fertigation directly to roots.',
    highlights: [
      'Saves up to 60% irrigation water',
      'Clog-resistant emitters',
      'UV-stabilized virgin grade polyethylene',
    ],
    specifications: {
      Coverage: '1 Acre',
      Brand: 'Jain Irrigation Ltd',
      'Emitter Spacing': '40 cm',
      'Operating Pressure': '1.0 - 2.5 bar',
    },
  },
  {
    id: 'prod_5',
    title: 'Heavy-Duty Khurpi & Sickle Tool Set',
    price: 380,
    originalPrice: 450,
    unit: '1 set',
    sellerName: 'Kisan Forge Official',
    category: 'Farm Tools',
    rating: 4.5,
    reviewCount: 84,
    inStock: true,
    isFavorite: false,
    brand: 'Kisan Forge',
    stockCount: 50,
    sellerRating: 4.6,
    deliveryLocation: 'Pune, Maharashtra',
    description:
      'Hand-forged carbon steel weeding trowel (khurpi) and curved serrated harvesting sickle with ergonomic treated wooden grips.',
    highlights: [
      'Tempered high-carbon steel',
      'Rust-resistant protective coating',
      'Ergonomic moisture-resistant wooden handle',
    ],
    specifications: {
      Material: 'High Carbon Steel',
      Brand: 'Kisan Forge',
      Weight: '650g total',
    },
  },
  {
    id: 'prod_6',
    title: 'Kisan Premium Sharbati Wheat Seeds',
    price: 350,
    originalPrice: 420,
    unit: '1kg pack',
    sellerName: 'Kisan Seeds',
    category: 'Seeds',
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    isFavorite: false,
    brand: 'Kisan Seeds',
    stockCount: 85,
    sellerRating: 4.8,
    deliveryLocation: 'Pune, Maharashtra',
    description:
      'Authentic MP Sharbati golden wheat grains renowned for sweetness, high protein content, and superior chapati puffing quality.',
    highlights: [
      'Rich in golden luster and grain density',
      'Maturity duration: 115-120 days',
      'Drought tolerant variety',
    ],
    specifications: {
      Crop: 'Wheat',
      Brand: 'Kisan Seeds',
      'Pack Size': '1kg pack',
      Protein: '14.2%',
    },
  },
  {
    id: 'prod_7',
    title: 'EcoGrow Organic Liquid Fertilizer',
    price: 520,
    originalPrice: 600,
    unit: '1L bottle',
    sellerName: 'EcoGrow Solutions',
    category: 'Fertilizers',
    rating: 4.6,
    reviewCount: 92,
    inStock: true,
    isFavorite: false,
    brand: 'EcoGrow',
    stockCount: 22,
    sellerRating: 4.6,
    deliveryLocation: 'Pune, Maharashtra',
    description:
      'Fermented seaweed extract enriched with micronutrients, amino acids, and fulvic acid for vigorous vegetative growth.',
    highlights: [
      'Rapid nutrient absorption',
      'Enhances chlorophyll synthesis',
      'Improves soil biological activity',
    ],
    specifications: {
      Form: 'Liquid Concentrate',
      Brand: 'EcoGrow',
      'Pack Size': '1L bottle',
      Dosage: '2.5 ml / Litre',
    },
  },
  {
    id: 'prod_8',
    title: 'AgriGrow Hybrid Maize Seeds Gold',
    price: 890,
    originalPrice: 1050,
    unit: '5kg pack',
    sellerName: 'AgriGrow Official',
    category: 'Seeds',
    rating: 4.7,
    reviewCount: 110,
    inStock: true,
    isFavorite: false,
    brand: 'AgriGrow',
    stockCount: 16,
    sellerRating: 4.7,
    deliveryLocation: 'Pune, Maharashtra',
    description:
      'High-yield yellow hybrid corn seeds with strong stalk strength, stay-green foliage, and high shelling percentage.',
    highlights: [
      'Uniform cob placement and filling',
      'Tolerant to drought and leaf blight',
      'High test weight grain',
    ],
    specifications: {
      Crop: 'Maize / Corn',
      Brand: 'AgriGrow',
      'Pack Size': '5kg pack',
      'Yield Potential': '35-40 q/acre',
    },
  },
  {
    id: 'prod_9',
    title: 'Cattle Calcium Tonic & Mineral Mix',
    price: 650,
    originalPrice: 750,
    unit: '5L can',
    sellerName: 'VetCare India',
    category: 'Animal Care',
    rating: 4.8,
    reviewCount: 73,
    inStock: true,
    isFavorite: false,
    brand: 'VetCare India',
    stockCount: 19,
    sellerRating: 4.8,
    deliveryLocation: 'Pune, Maharashtra',
    description:
      'Chelated calcium, phosphorus, and vitamin D3 nutritional supplement to enhance milk yield and skeletal strength in dairy cattle.',
    highlights: [
      'High bioavailability chelated minerals',
      'Prevents milk fever in fresh cows',
      'Improves overall lactation peak',
    ],
    specifications: {
      Target: 'Dairy Cows & Buffaloes',
      Brand: 'VetCare India',
      Volume: '5L can',
      'Calcium Content': '43,000 mg/L',
    },
  },
];

export const MOCK_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr_1',
    recipientName: 'Rahul Sharma',
    phone: '9876543210',
    addressLine: 'Survey No. 45, Near Gram Panchayat',
    city: 'Ahmednagar',
    state: 'Maharashtra',
    pincode: '414001',
    tag: 'Farm',
    isDefault: true,
  },
  {
    id: 'addr_2',
    recipientName: 'Rahul Sharma',
    phone: '9876543210',
    addressLine: '12, Shivaji Nagar, Flat 3B',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411005',
    tag: 'Home',
    isDefault: false,
  },
];

export const MOCK_MANDI_PRICES: MandiPrice[] = [
  { crop: 'Soybean', price: '₹4,320', change: '+₹45', trend: 'up', market: 'Indore Mandi' },
  { crop: 'Wheat', price: '₹2,180', change: '-₹20', trend: 'down', market: 'Dewas Mandi' },
  { crop: 'Cotton', price: '₹6,450', change: '+₹120', trend: 'up', market: 'Akola Mandi' },
  { crop: 'Onion', price: '₹1,890', change: '+₹30', trend: 'up', market: 'Lasalgaon Mandi' },
  { crop: 'Tomato', price: '₹2,450', change: '-₹80', trend: 'down', market: 'Nashik Mandi' },
];

// Seed orders for demo
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2024-001',
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 2 },
      { product: MOCK_PRODUCTS[1], quantity: 1 },
    ],
    address: MOCK_ADDRESSES[0],
    paymentMethod: 'UPI',
    subtotal: 3850,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 3850,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'shipped',
    estimatedDelivery: 'Tomorrow – 2 days',
    deliveryAgentName: 'Rakesh Kumar',
    deliveryAgentPhone: '9999888877',
  },
  {
    id: 'ORD-2024-002',
    items: [{ product: MOCK_PRODUCTS[3], quantity: 1 }],
    address: MOCK_ADDRESSES[1],
    paymentMethod: 'Cash on Delivery',
    subtotal: 4500,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 4500,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
    estimatedDelivery: 'Delivered',
  },
  {
    id: 'ORD-2024-003',
    items: [
      { product: MOCK_PRODUCTS[2], quantity: 2 },
      { product: MOCK_PRODUCTS[4], quantity: 1 },
    ],
    address: MOCK_ADDRESSES[0],
    paymentMethod: 'UPI',
    subtotal: 1220,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 1220,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'cancelled',
    estimatedDelivery: 'Cancelled',
  },
];

// Product lookup helpers
export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (!category || category.toLowerCase() === 'all') return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter(
    (p) => p.category?.toLowerCase() === category.toLowerCase()
  );
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.sellerName?.toLowerCase().includes(q)
  );
}

export function getSimilarProducts(productId: string): Product[] {
  const current = MOCK_PRODUCTS.find((p) => p.id === productId);
  if (!current) return MOCK_PRODUCTS.slice(0, 4);
  const sameCategory = MOCK_PRODUCTS.filter(
    (p) => p.id !== productId && p.category === current.category
  );
  if (sameCategory.length > 0) return sameCategory;
  return MOCK_PRODUCTS.filter((p) => p.id !== productId).slice(0, 3);
}
