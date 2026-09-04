# AgriTrade — Multi-Persona Demonstration & Evaluation Guide

**Version:** 1.0 (Stage 12 Production Readiness)  
**Target Platforms:** Web Application (`apps/web` Next.js 16) & Mobile Application (`apps/mobile` Flutter 3.44+)  
**Backend:** Supabase PostgreSQL 16 with Row-Level Security (RLS) & Realtime WebSockets

---

## 1. Overview

AgriTrade is an agricultural commerce and rural intelligence platform serving the complete agri-supply chain in India. The application supports four distinct user personas, each with dedicated workflows, role permissions, and interface layouts across both Web and Mobile platforms.

This guide provides end-to-end instructions for evaluators, stakeholders, and developers to experience the full functional capabilities of the platform using pre-seeded, deterministic demo accounts with zero external credential dependencies.

---

## 2. Canonical Demo Personas

| Role | Name | Email | Password | Primary Interface / Capabilities |
|:---|:---|:---|:---|:---|
| **Farmer** (Buyer) | Rahul Sharma | `farmer@agritrade.in` | `farmer123` | Catalog browsing, Mandi prices, weather alerts, checkout, live order tracking, community |
| **Commercial Seller** | Maharashtra Krishi Kendra | `seller@agritrade.in` | `seller123` | Product catalog, inventory ledger, order dispatch, payout reconciliation |
| **Cooperative Manager** | Suresh Patil | `coop@agritrade.in` | `coop123` | Group procurement campaigns, bulk discounts, member commitment tracking |
| **Platform Admin** | Platform Admin | `admin@agritrade.in` | `admin123` | Seller verification, product moderation, dispute resolution, audit logs, risk signals |

---

## 3. Instant Persona Switching

### Web Application (`apps/web`)
1. **Interactive Demo Persona Switcher (Global)**:
   - A floating pill appears in the top navigation shell on every page.
   - Click the persona dropdown to switch between **Farmer**, **Seller**, **Cooperative Manager**, and **Platform Admin** with one click.
   - The session updates instantly via Zustand, re-evaluating route permissions and dynamic navigation items without page reload.
2. **Login Screen Quick-Fill Grid (`/login`)**:
   - The login page features a 4-persona quick-card grid.
   - Clicking any persona auto-populates credentials and signs in immediately.

### Mobile Application (`apps/mobile`)
1. **Sign-In Screen Quick-Action**:
   - Tap "Demo Sign In" or select any of the preconfigured persona tiles on the sign-in screen to authenticate instantly.
2. **Dynamic Bottom Navigation**:
   - When authenticated as `seller`, the Seller Portal tab is activated.
   - When authenticated as `admin`, the Admin Governance Console tab is activated.

---

## 4. Persona User Journeys

### Journey 1: Farmer — Crop Input Purchasing & Live Tracking

1. **Discovery & Mandi Intelligence**:
   - Navigate to `/home` or `/products`.
   - Review live Mandi ticker rates (Soybean, Cotton, Wheat) with daily delta indicators.
   - Inspect the hyperlocal weather card showing humidity, rainfall probability, and pesticide spray suitability advisories.
2. **Product Details & Cart**:
   - Select **"Mahyco Hybrid Cotton Seeds (MRC 7351)"** or **"IFFCO Nano Urea (Liquid)"**.
   - Review technical specifications: Active ingredients, recommended dosage per acre, suitable crops, expiry date.
   - Add 2 units to the cart and proceed to `/cart`.
3. **Checkout & Educational Sandbox Payment**:
   - At `/checkout`, choose a saved delivery address (e.g., *Nashik Rural Hub*).
   - Select **Demo UPI** (or Credit Card / NetBanking / Cash on Delivery).
   - Complete checkout. A sandbox tax invoice is generated with GST breakdowns (CGST + SGST) and educational notices.
4. **Order Tracking & Lifecycle**:
   - View `/orders` to inspect the newly created order in `placed` status.
   - Open the order details to view the step-by-step visual timeline (`placed` → `confirmed` → `processing` → `packed` → `shipped` → `out_for_delivery` → `delivered`).

---

### Journey 2: Seller — Inventory Control & Order Fulfillment

1. **Switch Role**: Select **Seller (Maharashtra Krishi Kendra)** via the persona switcher.
2. **Seller Dashboard (`/seller/dashboard`)**:
   - Inspect revenue KPIs, active product listings, low-stock warnings, and pending dispatches.
3. **Inventory Management (`/seller/inventory`)**:
   - View warehouse stock levels and stock health status (`In Stock`, `Low Stock`, `Critical`).
   - Adjust stock buffers and inspect the immutable stock movement audit ledger.
4. **Order Fulfillment (`/seller/orders`)**:
   - Locate pending orders.
   - Advance the order status:
     - `placed` → `confirmed` (accept order)
     - `confirmed` → `processing` (allocate stock)
     - `processing` → `packed` (package prepared)
     - `packed` → `shipped` (handed to rural logistics provider)
5. **Payout Reconciliation (`/seller/payouts`)**:
   - Review gross sales, platform commission deduction (5%), and net available payout balance.
   - Submit a test payout request.

---

### Journey 3: Cooperative Manager — Group Procurement Campaigns

1. **Switch Role**: Select **Cooperative Manager (Suresh Patil)** via the persona switcher.
2. **Campaign Portal (`/cooperative/campaigns`)**:
   - View ongoing collective procurement campaigns (e.g., *Monsoon DAP Fertilizer Bulk Pool*).
   - Review target commitment progress bars (e.g., 420/500 bags pledged, 84% to next discount threshold).
   - Monitor participating farmers and their collective cost savings.
   - View closed campaigns and final delivery dispatch schedules.

---

### Journey 4: Platform Admin — Trust, Governance & Dispute Resolution

1. **Switch Role**: Select **Platform Admin** via the persona switcher.
2. **Operations Dashboard (`/admin/dashboard`)**:
   - Inspect platform-wide GMV, active seller counts, open dispute metrics, and catalog health.
3. **Seller Verification Desk (`/admin/sellers`)**:
   - Filter sellers by verification status (`draft`, `submitted`, `under_review`, `verified`, `rejected`, `suspended`).
   - Open a submitted seller application (e.g., *Vidarbha Agro Chemicals*).
   - Inspect GSTIN, seed trade license, bank IFSC verification, and business premises geotag.
   - Click **"Verify Seller"** or **"Request Additional Documents"**.
4. **Product Moderation Queue (`/admin/moderation`)**:
   - Review new products submitted by third-party sellers.
   - Inspect pesticide toxicity labels (Green, Blue, Yellow, Red triangle), Central Insecticides Board (CIB) registration number, and batch manufacturing dates.
   - Approve compliant listings or reject with structured violation tags.
5. **Dispute Resolution Desk (`/admin/disputes`)**:
   - Inspect escalated buyer-seller disputes (e.g., damaged pesticide container during transit).
   - Review buyer photo evidence, seller defense notes, and courier delivery scan logs.
   - Issue deterministic resolutions: Full Refund, Partial Refund, or Dismissal with immutable resolution notes.
6. **Immutable Audit Log (`/admin/audit`)**:
   - Inspect the chronologically ordered, tamper-evident audit ledger capturing every administrative action, actor ID, affected entity, and before/after metadata.

---

## 5. Offline & Resilience Testing

1. **Web Offline Behavior**:
   - Open Developer Tools → Network tab → Select **Offline**.
   - Navigate between previously loaded catalog pages.
   - Observe the **Universal Offline Notice Banner** indicating cached data state with a one-click "Reconnect" trigger.
2. **Mobile Offline Behavior**:
   - Toggle Airplane Mode on the mobile test device or Android emulator.
   - Observe the top offline status bar displaying the exact time of last cache synchronization.
   - Cached products and orders remain fully browseable. Actions requiring network display clear, non-destructive user guidance.

---

## 6. Verification Summary Matrix

| Verification Aspect | Web (`apps/web`) | Mobile (`apps/mobile`) | Status |
|:---|:---|:---|:---|
| **Test Suites** | 9 suites, 56 tests passing | 15 suites, 151 tests passing | ✅ 100% Passed |
| **Static Analysis** | TypeScript strict + Next.js build clean | Flutter analyze 0 issues found | ✅ 100% Clean |
| **Role Permissions** | 4-role matrix with `RoleGuard` | Riverpod role providers + GoRouter gates | ✅ Enforced |
| **Order Lifecycle** | 13 canonical states + validation matrix | 13 canonical states + Dart validator | ✅ Symmetric |
| **State Views** | Skeletons, Empty, Error, Offline | Skeletons, Empty, Error, Offline | ✅ Identical |
