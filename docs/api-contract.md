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
  "id": "mandi_soybean_indore",
  "crop": "Soybean",
  "variety": "Yellow (JS-335)",
  "price": "₹4,320",
  "pricePerQuintal": 4320,
  "change": "+₹45",
  "trend": "up",
  "trendDiff": "+₹45",
  "market": "Indore Mandi",
  "state": "Madhya Pradesh",
  "modalPrice": 4320,
  "minPrice": 4180,
  "maxPrice": 4450,
  "arrivalsQuintals": 1420,
  "history": [4210, 4240, 4280, 4300, 4275, 4320],
  "updatedAt": "2026-03-04T12:00:00.000Z"
}
```
*Trend values: `"up"` | `"down"` | `"flat"`*

---

## 5. Notifications & Alerts

### 5.1 `NotificationItem`
```json
{
  "id": "notif_001",
  "userId": "usr_farmer_demo",
  "title": "Consignment Dispatched: Order #ORD-2026-001",
  "body": "Your order has been transferred to Delhivery Express for regional transit.",
  "type": "orders",
  "isRead": false,
  "actionRoute": "/orders/ORD-2026-001",
  "createdAt": "2026-03-04T10:15:00.000Z"
}
```

### 5.2 `NotificationType` Enum Values
- `orders`: Order dispatch, transit milestone, out for delivery, delivered
- `prices`: APMC mandi benchmark spike or dip
- `weather`: Adverse weather, frost, pest advisory alerts
- `products`: Wishlisted item back in stock or price drop
- `system`: Marketplace platform security or regulatory notices

---

## 6. Farmer Knowledge Exchange (Community)

### 6.1 `CommunityPost`
```json
{
  "id": "post_soybean_01",
  "userId": "usr_farmer_demo",
  "authorName": "Sunil Gaikwad",
  "category": "Crop Management",
  "title": "Yellow Mosaic mitigation protocol in JS-335 soybean lots",
  "content": "Observed whitefly vector infestation in early vegetative stage. Applied neem oil at 5ml/L followed by targeted systemic insecticide.",
  "likesCount": 24,
  "commentsCount": 6,
  "createdAt": "2026-03-04T08:00:00.000Z"
}
```

### 6.2 `CommunityComment`
```json
{
  "id": "comm_01",
  "postId": "post_soybean_01",
  "userId": "usr_expert_02",
  "authorName": "Dr. Pradeep Verma (Agronomist)",
  "content": "Recommend yellow sticky traps (15 traps/acre) alongside the foliar treatment for persistent vector control.",
  "createdAt": "2026-03-04T08:45:00.000Z"
}
```

---

## 7. Realtime Channels & WebSocket Events

| Supabase Channel | Publication Table | Event Type | Broadcast Schema |
| :--- | :--- | :--- | :--- |
| `realtime_mandi_ticks` | `mandi_prices` | `INSERT`, `UPDATE` | `{ crop, market, price, change, trend, modal_price, arrivals_volume }` |
| `realtime_orders_{userId}` | `orders` | `UPDATE` | `{ order_id, status, estimated_delivery, agent_name, agent_phone }` |
| `realtime_notifications_{userId}` | `notifications` | `INSERT`, `UPDATE` | `{ id, user_id, title, body, type, is_read, action_route }` |
| `realtime_community_feed` | `community_posts` | `INSERT` | `{ id, author_name, category, title, content, likes_count }` |
| `realtime_community_feed` | `community_comments` | `INSERT` | `{ id, post_id, author_name, content, created_at }` |
