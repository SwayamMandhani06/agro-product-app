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
| **Stage 5**: Backend Hardening & Data Integrity | Real PostgREST wiring, RLS audit, seam completion | **IN PROGRESS** | Wire Web stores to PostgREST; harden error/loading states | Wire Riverpod providers to Supabase repositories conditionally | Verify RLS & foreign key cascading | 🔄 Active Next Stage |
| **Stage 6**: Payment Gateway (Razorpay/UPI) | Razorpay test mode, UPI intent flow | **PLANNED** | Razorpay Web SDK integration | `razorpay_flutter` integration | Transaction webhook table | ⬜ Planned |
| **Stage 7**: Logistics & Rural Delivery | Pincode serviceability, tracking partner API | **PLANNED** | Delivery estimate calculator | Pincode availability chip | Address validation table | ⬜ Planned |
| **Stage 8**: Seller Marketplace Portal | Inventory CRUD, order fulfillment, sales chart | **PLANNED** | `/seller/dashboard`, inventory table | Seller navigation shell | Seller role RLS | ⬜ Planned |
| **Stage 9**: Admin Governance & Price Moderation | User verification, product moderation | **PLANNED** | `/admin/dashboard`, verification queue | Admin monitoring views | Admin role RLS | ⬜ Planned |
| **Stage 10**: Voice Search & Multilingual i18n | Speech-to-text, en/hi/mr localization | **PLANNED** | `next-intl` (en/hi/mr) | `easy_localization` (en/hi/mr) | Localized strings | ⬜ Planned |

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

## 4. Recommended Next Implementation: STAGE 5

### Primary Focus: Backend Seam Hardening, Data Integrity & Premium Web Experience Polish

Based on this reconciliation, the next high-value engineering milestone is:
**Stage 5 — Backend Hardening, Data Integrity & Premium Web Experience Polish**

#### Core Deliverables for Stage 5:
1. **Dependency Injection Seam Completion (Mobile)**:
   - Wire `wishlistRepositoryProvider`, `reviewRepositoryProvider`, `notificationRepositoryProvider`, and `communityRepositoryProvider` to automatically resolve to their respective `Supabase*Repository` implementations when `BackendConfig.isConfigured` is true, with seamless fallback to Mock repositories.
2. **PostgREST Storage Sync (Web)**:
   - Implement Supabase sync for Web `useWishlistStore`, `useNotificationStore`, `communityRepository`, and `reviewRepository` when `isBackendConfigured()` is true, with robust offline fallback.
3. **Data Integrity & Edge-Case Protection**:
   - Cart item stock bounding (cannot increment past available inventory).
   - Atomic order submission guarantees with status validation.
   - Verified review submission validation (rating must be 1–5, title and comment non-empty).
4. **Web Homepage & Experience Elevation**:
   - Audit and refine [`apps/web/app/page.tsx`](file:///d:/Projects/agro-product-app/apps/web/app/page.tsx) to strictly follow the "Modern Agrarian Fintech + High-End Minimalist Commerce" design philosophy:
     - Crisp, professional navigation with subtle glass styling.
     - Strong editorial typography and authoritative hero statement.
     - Interactive product inspection preview.
     - Live Mandi rate terminal preview.
     - 4-step transparent supply chain workflow with Lucide icons (no emojis).
     - Cross-platform architecture showcase with tech specs.
5. **Route Audit & State Completeness**:
   - Verify that all 20 web routes and all mobile screens have graceful empty states, loading indicators, and error retry patterns with zero visual bugs or overflows.
