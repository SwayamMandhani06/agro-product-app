# AgriTrade Platform-Neutral API & Entity Contracts

This document establishes the canonical JSON data contracts shared by the **Flutter Mobile App** (`apps/mobile`) and **Next.js Web Application** (`apps/web`).

---

## 1. Authentication & Profiles

### 1.1 `UserProfile`
```json
{
  "id": "usr_farmer_demo",
  "name": "Ramesh Patel",
  "email": "farmer@agritrade.in",
  "phone": "+91 98765 43210",
  "role": "farmer",
  "avatarUrl": null,
  "createdAt": "2026-03-01T00:00:00.000Z"
}
```

### 1.2 `DeliveryAddress`
```json
{
  "id": "addr_1",
  "recipientName": "Ramesh Patel",
  "phone": "+91 98765 43210",
  "addressLine": "Survey No. 42, Farm House, Haveli Road",
  "city": "Pune",
  "state": "Maharashtra",
  "pincode": "412207",
  "isDefault": true,
  "tag": "Farm"
}
```

---

## 2. Product Catalog

### 2.1 `ProductCategory`
```json
{
  "id": "cat_seeds",
  "name": "Seeds",
  "icon": "sprout",
  "itemCount": 148
}
```

### 2.2 `Product`
```json
{
  "id": "prod_1",
  "title": "Premium Hybrid Soybean Seeds",
  "price": 1250,
  "originalPrice": 1450,
  "unit": "5 kg pack",
  "sellerName": "AgriGrow Official",
  "category": "Seeds",
  "rating": 4.7,
  "reviewCount": 124,
  "inStock": true,
  "isFavorite": false,
  "brand": "AgriGrow",
  "stockCount": 12,
  "sellerRating": 4.9,
  "deliveryLocation": "Pune, Maharashtra",
  "description": "High-yielding premium hybrid soybean seeds optimized for diverse soil conditions.",
  "highlights": [
    "High germination rate (>90%)",
    "Suitable for Indian climate conditions",
    "High disease resistance (Yellow Mosaic Virus)",
    "Maturity window: 95-100 days"
  ],
  "specifications": {
    "Crop": "Soybean",
    "Brand": "AgriGrow",
    "Pack Size": "5 kg",
    "Seed Type": "Certified Hybrid",
    "Suitable Soil": "Loamy & Black Soil"
  }
}
```

---

## 3. Cart & Orders

### 3.1 `CartItem`
```json
{
  "product": { /* Product Object */ },
  "quantity": 2
}
```

### 3.2 `Order`
```json
{
  "id": "ORD-2026-001",
  "createdAt": "2026-03-02T10:30:00.000Z",
  "status": "shipped",
  "items": [
    {
      "product": { /* Product Object */ },
      "quantity": 2
    }
  ],
  "address": { /* DeliveryAddress Object */ },
  "subtotal": 2500,
  "deliveryFee": 0,
  "discount": 0,
  "totalAmount": 2500,
  "paymentMethod": "UPI / Google Pay",
  "estimatedDelivery": "05 Mar 2026",
  "deliveryAgentName": "Vikram Singh",
  "deliveryAgentPhone": "+91 98111 22334"
}
```

### 3.3 `OrderStatus` Enum Values
- `placed`: Order received by the marketplace
- `confirmed`: Seller verified stock and packed
- `processing`: Dispatched from warehouse to regional hub
- `shipped`: In transit with logistics courier
- `outForDelivery`: Last mile delivery partner has item
- `delivered`: Successfully delivered to farm
- `cancelled`: Cancelled prior to delivery

---

## 4. Market Rates

### 4.1 `MandiPrice`
```json
{
  "crop": "Soybean",
  "price": "₹4,320",
  "change": "+₹45",
  "trend": "up",
  "market": "Indore Mandi"
}
```
*Trend values: `"up"` | `"down"` | `"flat"`*
