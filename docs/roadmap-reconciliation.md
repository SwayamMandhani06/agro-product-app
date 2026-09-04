# AgriTrade Roadmap Reconciliation & Implementation Matrix

**Date:** September 4, 2026  
**Audit Context:** Reconciles the original 17-stage mobile roadmap (`Agro_Product_App_Build_Roadmap.md`), web demo roadmap (`Agro_Product_App_Web_Roadmap.md`), architectural decisions (ADR-004 Supabase Backend), and the actual state of the codebase.

---

## 1. Architectural Pivot Summary

| Original Roadmap Spec | Architectural Reality (ADR-004 & Stage 4B) | Reason & Impact |
|:---|:---|:---|
| **Backend**: Firebase Auth, Firestore, Cloud Functions, FCM | **Backend**: Supabase (PostgreSQL 16) with PostgREST, RLS policies, and WebSocket subscriptions | PostgreSQL provides strict ACID guarantees for transactions, relational foreign keys for orders/products, and native JSONB flexibility for diverse agricultural input specifications. |
| **Mobile-First Prototype** | **Dual-Platform Synchronized Ecosystem** (`apps/mobile` + `apps/web`) | A responsive Next.js 16 web application serves as the primary desktop demonstration product, while Flutter mobile provides the farmer field companion. |
| **Staged Sequential Stubs** | **Feature-Complete Pre-implementations** (Stage 4E) | Features originally planned for Stages 8, 12, and 14 (Wishlist, Reviews, Weather, Mandi Prices, Forum, Notifications) have already been designed and built in Stage 4E with full dual-platform parity. |

---

## 2. Complete Roadmap Stage Reconciliation Matrix

| Stage & Feature Domain | Intended Original Scope | Current Implementation State | Web (`apps/web`) | Mobile (`apps/mobile`) | Backend (`supabase/`) | Parity & Status |
|:---|:---|:---|:---|:---|:---|:---|
| **Stage 0**: Monorepo Restructuring | Scaffold `apps/mobile/` and `apps/web/` | **COMPLETE** | Next.js 16 App Router | Flutter 3.44+ Material 3 | Centralized `supabase/` | ✅ 100% Complete |
| **Stage 1**: Core Infrastructure | Folder architecture, Failure models, DI | **COMPLETE** | Result/Failure types, Zustand | Clean Architecture, Riverpod | Environment config | ✅ 100% Complete |
| **Stage 2**: Design System | Tokens, Typography, Colors, Widgets | **COMPLETE** | Tailwind CSS 4, Lucide icons | `AppColors`, `AppRadius`, `AppTheme` | Design tokens docs | ✅ 100% Complete |
| **Stage 3B**: Farmer Home Dashboard | Greeting, KPI metrics, Mandi ticker, grid | **COMPLETE** | `/home` route | `HomeScreen` + widgets | `mandi_prices` seed | ✅ 100% Complete |
| **Stage 3C**: Product Discovery | Categories, search, filter sheet, details | **COMPLETE** | `/categories`, `/products`, `[id]` | `ProductsScreen`, details | `categories`, `products` | ✅ 100% Complete |
| **Stage 3D**: Cart & Checkout | Item stepper, address pick, COD/Mock pay | **COMPLETE** | `/cart`, `/checkout`, `/confirmed` | `CartScreen`, `CheckoutScreen` | `carts`, `cart_items` | ✅ 100% Complete |
| **Stage 3E**: Orders & Tracking | History list, status timeline, reorder | **COMPLETE** | `/orders`, `/orders/[id]` | `OrdersScreen`, tracking | `orders`, `order_items` | ✅ 100% Complete |
| **Stage 4A**: Authentication Flow | Welcome, Sign in, Sign up, Session | **COMPLETE** | `/welcome`, `/login`, `/signup` | `WelcomeScreen`, Auth router | `profiles` RLS | ✅ 100% Complete |
| **Stage 4B**: Premium Design & Contracts | Emoji removal, restrained tokens, ADR-004 | **COMPLETE** | Lucide SVGs, no emojis | Stitch tokens, Clean Arch | API Contract schemas | ✅ 100% Complete |
| **Stage 4C**: Motion System & Media | Easing curves, photo resolvers, layout | **COMPLETE** | Motion keyframes, Unsplash | `AppMotion` presets | Deterministic URLs | ✅ 100% Complete |
| **Stage 4D**: Backend Sync & SaaS Landing | Supabase schema, concrete repos, landing | **COMPLETE** | `/` SaaS showcase landing page | Dio PostgREST repositories | PostgreSQL 16 schema | ✅ 100% Complete |
| **Stage 4E**: Farmer Intelligence & Community | Wishlist, Reviews, Forum, Alerts, Weather | **COMPLETE** | `/saved`, `/community`, `/mandi`, `/weather`, `/notifications` | `WishlistScreen`, `ReviewsScreen`, `ForumScreen`, `NotificationsScreen` | `20260904000000` migration | ✅ 100% Complete |
| **Stage 5**: Backend Hardening & Data Integrity | Real PostgREST wiring, RLS audit, seam completion | **COMPLETE** | PostgREST repositories, hardened stores | Supabase conditional repositories | Strict RLS & foreign keys | ✅ 100% Complete |
| **Stage 6**: Real-Time Intelligence & Live Operations | Supabase Realtime WSS, APMC mandi terminal, order tracking | **COMPLETE** | Realtime client, live Mandi terminal, operational order timeline, popover alerts | `RealtimeService`, `LiveMandiPricesNotifier`, stream providers | `REPLICA IDENTITY FULL`, `supabase_realtime` pub | ✅ 100% Complete |
| **Stage 7**: Payment Infrastructure & Secure Checkout | Razorpay Test Mode, Demo fallback, COD, secure transactions | **COMPLETE** | Payment abstraction, Razorpay Test SDK, Demo provider, 2-column checkout, receipt | Native payment sheet, Demo provider, Riverpod checkout state, receipt sheet | `payments`, `payment_events`, strict RLS | ✅ 100% Complete |
| **Stage 8**: Logistics & Rural Delivery Integration | Pincode serviceability, tracking partner API, hub milestones | **PLANNED** | Delivery estimate calculator | Pincode availability chip | Address validation table | ⬜ Planned |
| **Stage 9**: Seller & Cooperative Marketplace | Multi-vendor inventory CRUD, fulfillment, payout tracking | **PLANNED** | `/seller/dashboard`, inventory table | Seller navigation shell | Seller role RLS | ⬜ Planned |
| **Stage 10**: Admin / Operations Governance | Platform moderation, dispute resolution, price controls | **PLANNED** | `/admin/dashboard`, verification queue | Admin monitoring views | Admin role RLS | ⬜ Planned |

---

## 3. Detailed Audit of Completed vs Seamed Features

### Wishlist / Saved Items
- **Mobile**: Full Clean Architecture (`WishlistScreen`, `wishlistProvider`, `MockWishlistRepository`, `SupabaseWishlistRepository`).
- **Web**: `/saved` page with `useWishlistStore`.
- **Backend**: `public.wishlists` table with `(user_id, product_id)` unique constraint and RLS policies.
- **Seam to Harden**: Connect Web `useWishlistStore` to `SupabaseWishlistRepository` when backend credentials are present, falling back to localStorage. In Mobile, wire `wishlistRepositoryProvider` conditionally.

### Product Reviews & Ratings
- **Mobile**: `ReviewSummaryCard` (rating + 5-to-1 breakdown bars), `ReviewCard`, `WriteReviewSheet` modal, `MockReviewRepository`, `SupabaseReviewRepository`.
- **Web**: Rating summary card, verified farmer review list, write review modal on `/products/[id]`.
- **Backend**: `public.reviews` table with 1.0–5.0 range check and RLS policies.
- **Seam to Harden**: Ensure Web review repository submits directly to Supabase when configured, and wire Mobile `reviewRepositoryProvider` conditionally.

### Notification Center & Real-Time Alerts
- **Mobile**: `NotificationsScreen` with 5 category filters (`orders`, `prices`, `products`, `weather`, `system`), `MockNotificationRepository`, `SupabaseNotificationRepository`.
- **Web**: `/notifications` page with category tabs, unread indicators, mark-all-read action.
- **Backend**: `public.notifications` table with RLS policies and `is_read` index.
- **Seam to Harden**: Wire Web `useNotificationStore` to query Supabase `notifications` table, and wire Mobile `notificationRepositoryProvider` conditionally.

### Community Farmer Forum
- **Mobile**: `ForumScreen` with topic filters, upvoting, threaded replies, `MockCommunityRepository`, `SupabaseCommunityRepository`.
- **Web**: `/community` page with topic filters, upvote toggle, collapsible comment threads, new post modal.
- **Backend**: `public.community_posts` and `public.community_comments` with category check constraints and RLS.
- **Seam to Harden**: Ensure post submissions on Web and Mobile persist to Supabase when configured.

### Weather & Agronomic Spray Advisories
- **Mobile**: `WeatherScreen` with 5-day forecast, `WeatherHeroCard` on home dashboard, spray condition advisories.
- **Web**: `/weather` route with weather parameter cards, agro-advisories, and spray window indicators.
- **Backend**: Weather domain models and mock data repositories.

### Mandi APMC Price Discovery
- **Mobile**: `MandiPricesScreen` with 7-day sparkline charts, market distance comparisons, trend diff badges.
- **Web**: `/mandi` route with commodity search, price range filter, arrivals, and min/max/modal pricing.
- **Backend**: `public.mandi_prices` table with real Indian commodity rates (Soybean, Cotton, Wheat, Mustard, etc.).

---

## 4. Completed: STAGE 5 — Backend Hardening, Data Integrity & Premium Web Experience Polish

**Status**: ✅ COMPLETED (Branch: `stage-5-backend-hardening`)

### Deliverables Achieved in Stage 5:
1. **Canonical PostgreSQL Migration (`20260904120000_stage_5_backend_hardening.sql`)**:
   - Hardened Row Level Security policies across `wishlists`, `notifications`, `reviews`, `community_posts`, and `community_comments`.
   - Strict authenticated user isolation (`auth.uid()::text = user_id`) with graceful anonymous read/demo support.
   - Added production performance indexes: `idx_reviews_user_id`, `idx_notifications_user_unread`, `idx_community_posts_created`, `idx_community_comments_post_created`.
2. **Web Data Integration & PostgREST Layer**:
   - Created [`apps/web/features/wishlist/data/wishlist-repository.ts`](file:///d:/Projects/agro-product-app/apps/web/features/wishlist/data/wishlist-repository.ts) and connected [`apps/web/features/wishlist/wishlist-store.ts`](file:///d:/Projects/agro-product-app/apps/web/features/wishlist/wishlist-store.ts).
   - Created [`apps/web/features/notifications/data/notification-repository.ts`](file:///d:/Projects/agro-product-app/apps/web/features/notifications/data/notification-repository.ts) and connected [`apps/web/features/notifications/notifications-store.ts`](file:///d:/Projects/agro-product-app/apps/web/features/notifications/notifications-store.ts).
   - Implemented `SupabaseCommunityRepository` in [`apps/web/features/community/data/community-repository.ts`](file:///d:/Projects/agro-product-app/apps/web/features/community/data/community-repository.ts).
   - Added review input validation (1.0–5.0 star bounds, non-empty title and comment) in [`apps/web/features/reviews/data/review-repository.ts`](file:///d:/Projects/agro-product-app/apps/web/features/reviews/data/review-repository.ts).
3. **Data Integrity & State Transitions**:
   - Cart inventory bounding: prevented cart item quantity from exceeding product stock in [`apps/web/features/cart/store.ts`](file:///d:/Projects/agro-product-app/apps/web/features/cart/store.ts).
   - Order cancellation status safeguard: restricted cancellations to `['placed', 'confirmed', 'processing']` in [`apps/web/features/orders/store.ts`](file:///d:/Projects/agro-product-app/apps/web/features/orders/store.ts).
4. **Web Marketing Homepage Elevation (`apps/web/app/page.tsx`)**:
   - Strictly aligned with Part 8 ("Modern Agrarian Fintech + High-End Minimalist Commerce").
   - 0 emojis, 100% Lucide icons.
   - Live APMC Mandi commodity data visualization table with multi-crop filters.
   - 4-step transparent supply chain workflow (Quality Verification -> Mandi Intelligence -> Farm-Gate Ordering -> 48h Doorstep Logistics).
   - Backed trust metrics (24+ verified inputs, 8 APMC mandis, >90% germination standard, 0% middleman markups).
   - Dual-platform architecture showcase with Next.js 16 (20 routes), Flutter 3.24 (94 tests), and PostgreSQL 16.
5. **Full Dual-Platform Verification**:
   - Mobile: `flutter analyze` (0 issues), `flutter test` (94/94 passed, 100%).
   - Web: `npx tsc --noEmit` (0 errors), `npm run lint` (0 errors), `npm run build` (20/20 routes compiled).

---

## 5. Active & Reconciled Roadmap

### Current Roadmap Status

- **Completed Stages:**
  - Stage 1–4E: Core infrastructure, design system, catalog, cart, auth, motion, and farmer intelligence.
  - Stage 5: Backend hardening, PostgREST direct integration, and RLS data integrity.
  - Stage 6: Real-time intelligence, live Mandi terminal, operational order tracking, and notification synchronization.
- **Current Stage (Active):**
  - **Stage 7: Payment Infrastructure, Secure Checkout & Transaction Experience**
- **Next Stages:**
  - Stage 8: Logistics & Rural Delivery Integration (Hub telemetry, pincode serviceability).
  - Stage 9: Seller & Cooperative Marketplace Portal (Inventory CRUD, batch certificates, payouts).
  - Stage 10: Admin / Operations Governance (Disputes, price moderation, platform audit).

### Architecture Alignment Rules
- The canonical backend is **Supabase / PostgreSQL 16**. Firebase/Firestore are deprecated and not used.
- Web (`apps/web`) and Mobile (`apps/mobile`) share identical domain entities, payment states, and API contracts, but maintain platform-native UI layouts.
- Payment systems strictly utilize **Razorpay Test Mode** or deterministic **Demo Payment** fallbacks. Real financial transactions or paid cloud services are prohibited.
- Cash on Delivery (COD) remains a first-class supported payment option.
