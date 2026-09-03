# AgriTrade Dual-Platform Design Parity Matrix

This document maps all design system primitives between the **Next.js Web Application** (`apps/web`) and the **Flutter Mobile Application** (`apps/mobile`).

---

## 1. Color Palette Tokens

| Semantic Token | Hex | Web CSS Variable | Flutter `AppColors` |
|---|---|---|---|
| **Primary Brand (Forest Green)** | `#0B3D2E` | `--color-forest` | `AppColors.stitchForestGreen` / `AppColors.brand700` |
| **Brand Dark / Interactive Deep** | `#012D1D` | `--color-brand-800` | `AppColors.brand800` / `AppColors.primaryDark` |
| **Brand Light Tint** | `#EAF6EF` | `--color-brand-50` | `AppColors.brand50` / `AppColors.primaryLight` |
| **Accent Amber** | `#D97706` | `--color-amber` | `AppColors.stitchAmber` / `AppColors.accentDark` |
| **Accent Tint** | `#FFF3E0` | `--color-amber-50` | `AppColors.amber50` |
| **Canvas Background** | `#F9F7F2` | `--color-canvas` | `AppColors.stitchCanvas` / `AppColors.background` |
| **Surface (Card / Sheet)** | `#FFFFFF` | `--color-surface` | `AppColors.surface` |
| **Surface Tint (Variant)** | `#E4E2DD` | `--color-surface-tint` | `AppColors.stitchSurfaceTint` |
| **Hairline Divider / Border** | `#EEE7E3` | `--color-divider` | `AppColors.surfaceSubtle` / `AppColors.neutral100` |
| **Text Primary** | `#1A1510` | `--color-text-primary` | `AppColors.textPrimary` / `AppColors.neutral900` |
| **Text Secondary** | `#60554C` | `--color-text-secondary` | `AppColors.textSecondary` / `AppColors.neutral600` |
| **Text Tertiary / Muted** | `#9E9289` | `--color-text-tertiary` | `AppColors.textTertiary` / `AppColors.neutral400` |
| **Semantic Success** | `#1A7A4A` | `--color-success` | `AppColors.success` |
| **Semantic Success Light** | `#D4EED0` | `--color-success-light` | `AppColors.successLight` |
| **Semantic Warning** | `#C17900` | `--color-warning` | `AppColors.warning` |
| **Semantic Warning Light** | `#FFF0C2` | `--color-warning-light` | `AppColors.warningLight` |
| **Semantic Error** | `#B72B2B` | `--color-error` | `AppColors.error` |
| **Semantic Error Light** | `#FFE8E8` | `--color-error-light` | `AppColors.errorLight` |

---

## 2. Typography Scale

| Hierarchy | Web CSS Class / Style | Flutter `AppTypography` | Web Font Size / Weight | Flutter Style |
|---|---|---|---|---|
| **Display** | `.text-display` | `AppTypography.displayLarge` | 36px / Bold (700) | 36px / w700 / letterSpacing -0.5 |
| **Header 1** | `.text-h1` | `AppTypography.headlineLarge` | 24px–28px / Bold (700) | 28px / w700 / letterSpacing -0.4 |
| **Header 2** | `.text-h2` | `AppTypography.headlineMedium` | 20px–22px / SemiBold (600) | 22px / w600 / letterSpacing -0.2 |
| **Header 3** | `.text-h3` | `AppTypography.titleLarge` | 16px–18px / SemiBold (600) | 18px / w600 / letterSpacing -0.1 |
| **Body 1** | `.text-body1` | `AppTypography.bodyLarge` | 15px–16px / Regular (400) | 16px / w400 / height 1.5 |
| **Body 2** | `.text-body2` | `AppTypography.bodyMedium` | 13px–14px / Regular (400) | 14px / w400 / height 1.45 |
| **Caption / Meta** | `.text-caption` | `AppTypography.labelSmall` | 11px–12px / Medium (500) | 11px / w500 / letterSpacing 0.3 |
| **Price Hero** | `.text-price` | `AppTypography.priceLarge` | 22px–28px / Bold (700/800) | 26px / w800 / letterSpacing -0.5 |

---

## 3. Spacing System

| Token | Size | Web Variable | Flutter `AppSpacing` |
|---|---|---|---|
| **`xs`** | 4px | `--space-xs` | `AppSpacing.xs` (4.0) |
| **`sm`** | 8px | `--space-sm` | `AppSpacing.sm` (8.0) |
| **`md` / `base`** | 16px | `--space-md` | `AppSpacing.base` (16.0) |
| **`lg`** | 24px | `--space-lg` | `AppSpacing.lg` (24.0) |
| **`xl`** | 32px | `--space-xl` | `AppSpacing.xl` (32.0) |
| **`2xl`** | 48px | `--space-2xl` | `AppSpacing.xxl` (48.0) |

---

## 4. Radius System

*Enforces restrained, non-cartoonish curvature across both codebases.*

| Token | Value | Web Variable | Flutter `AppRadius` |
|---|---|---|---|
| **Extra Small** | 3px–4px | `--radius-xs` / `--radius-sm` | `AppRadius.xs` (4.0) |
| **Medium** | 8px–10px | `--radius-md` | `AppRadius.md` (8.0) / `AppRadius.card` (10.0) |
| **Large** | 12px | `--radius-lg` | `AppRadius.lg` (12.0) |
| **Extra Large** | 16px | `--radius-xl` | `AppRadius.xl` (16.0) |
| **Full / Circle** | 9999px | `--radius-full` | `AppRadius.full` (CircleBorder) |

---

## 5. Motion Durations & Curves

| Token | Duration | Web CSS Variable | Flutter `AppMotion` |
|---|---|---|---|
| **Micro** | 100ms | `--motion-micro: 100ms` | `AppMotion.micro` (100ms) |
| **Fast** | 150ms | `--motion-fast: 150ms` | `AppMotion.fast` (150ms) |
| **Base** | 200ms | `--motion-base: 200ms` | `AppMotion.base` (200ms) |
| **Normal** | 250ms–300ms | `--motion-normal: 250ms`| `AppMotion.normal` (300ms) |
| **Page Transition** | 350ms | `--motion-slow: 350ms` | `AppMotion.page` (350ms) |
| **Standard Easing** | Decelerate curve | `--ease-decelerate` | `Curves.easeOutCubic` |

---

## 6. Glassmorphism Parity

| Property | Web CSS (`.glass-surface`) | Flutter (`AppGlass`) |
|---|---|---|
| **Surface Color** | `rgba(255, 255, 255, 0.82)` | `AppColors.glassSurface` (80% opacity) |
| **Dark Surface** | `rgba(11, 61, 46, 0.88)` | `AppColors.glassDark` (80% opacity) |
| **Blur Strength** | `backdrop-filter: blur(12px)` | `ImageFilter.blur(sigmaX: 16.0, sigmaY: 16.0)` |
| **Border** | `1px solid rgba(1, 45, 29, 0.08)` | `Border.all(color: AppColors.glassBorder, width: 1)` |
| **Shadow** | `0 4px 16px rgba(1, 45, 29, 0.08)` | `AppShadows.floating` |

---

## 7. Iconography Parity

| Semantic Icon | Web (Lucide React) | Flutter (Material Symbols Outlined) |
|---|---|---|
| Seeds Category | `<Sprout />` | `Icons.eco_outlined` / `Icons.grass` |
| Fertilizers Category | `<FlaskConical />` | `Icons.science_outlined` |
| Crop Protection | `<ShieldCheck />` | `Icons.verified_user_outlined` |
| Farm Tools | `<Wrench />` | `Icons.build_outlined` |
| Irrigation | `<Droplets />` | `Icons.water_drop_outlined` |
| Animal Care | `<Beef />` | `Icons.pets_outlined` |
| Cart | `<ShoppingCart />` | `Icons.shopping_cart_outlined` |
| Orders / Packages | `<Package />` | `Icons.local_shipping_outlined` / `Icons.inventory_2_outlined` |
| Search | `<Search />` | `Icons.search` |
| Mandi Trend Up | `<TrendingUp />` | `Icons.trending_up` |
| Mandi Trend Down | `<TrendingDown />` | `Icons.trending_down` |

---

## 8. Stage 4D Shared Backend & Data Synchronization Parity

| Layer / Feature | Web (`apps/web`) | Mobile (`apps/mobile`) | Parity Status |
|---|---|---|---|
| **Backend Client** | `@supabase/supabase-js` (`lib/supabase/client.ts`) | `Dio` PostgREST (`core/config/backend_config.dart`) | Verified 100% |
| **Config Guard** | `isBackendConfigured()` | `BackendConfig.isConfigured` | Verified 100% |
| **Environment Keys** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `SUPABASE_URL`, `SUPABASE_ANON_KEY` | Verified 100% |
| **Products Repository** | `SupabaseProductRepository` (`features/products/data/product-repository.ts`) | `SupabaseProductRepository` (`features/products/data/supabase_product_repository.dart`) | Verified 100% |
| **Orders Repository** | `SupabaseOrderRepository` (`features/orders/data/order-repository.ts`) | `SupabaseOrderRepository` (`features/cart_checkout/data/supabase_order_repository.dart`) | Verified 100% |
| **Mandi Price Feed** | `SupabaseMandiRepository` (`features/mandi/data/mandi-repository.ts`) | APMC REST endpoint + seed data | Verified 100% |
| **Offline/Mock Fallback** | Instant fallback to `MOCK_PRODUCTS`, `MOCK_CATEGORIES` | Instant fallback to `MockProductRepository`, `MockOrderRepository` | Verified 100% |
| **Delivery Threshold** | `subtotal >= 1000 ? 0 : 99` | `subtotal >= 1000 ? 0 : 99` | Verified 100% |
| **Image Resolution** | Deterministic Unsplash (`lib/product-image-resolver.ts`) | Deterministic Unsplash (`core/utils/product_image_resolver.dart`) | Verified 100% |
| **Database Schema** | Canonical PostgreSQL 16 schema (`supabase/migrations/20260903000000_stage_4d_canonical_schema.sql`) | Same canonical schema | Verified 100% |

