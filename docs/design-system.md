# AgriTrade Design System Specification

## 1. Design Philosophy

AgriTrade is India's Farmer-First Agricultural Marketplace.
Its design reflects:
- **Precision**: Clear numerical data, units, mandi rates, and financial figures.
- **Trust & Craft**: Institutional stability, clean typography, editorial hierarchy, and calm confidence.
- **Utility**: Zero decorative noise, zero toy-like cartoon elements, zero emoji-based interfaces.
- **Clarity**: High-contrast information hierarchy designed for field use and mobile-responsive screens.

---

## 2. Color Palette & Semantic Tokens

### 2.1 Brand Tokens
| Token | Hex | Role |
|---|---|---|
| `--color-forest` / `stitchForestGreen` | `#0B3D2E` | Primary brand color, institutional headers, active buttons |
| `--color-brand-700` | `#01421E` | Primary interactive hover |
| `--color-brand-800` | `#012D1D` | Deep interactive active state / dark surface |
| `--color-brand-50` | `#EAF6EF` | Light brand tint for icon wraps and highlights |
| `--color-amber` / `stitchAmber` | `#D97706` | Accent color (ratings, special offers, order status) |
| `--color-amber-50` | `#FFF3E0` | Accent surface tint |
| `--color-canvas` / `stitchCanvas` | `#F9F7F2` | Warm neutral canvas background |
| `--color-surface` | `#FFFFFF` | Primary surface for cards, dialogs, sheets |
| `--color-surface-tint` | `#E4E2DD` | Subtle secondary surface tint |
| `--color-divider` | `#EEE7E3` | Hairline border separator |

### 2.2 Semantic Status Colors
| State | Text / Icon Color | Background Color | Use Case |
|---|---|---|---|
| **Success** | `#1A7A4A` | `#D4EED0` | Delivered, in-stock, free delivery |
| **Warning** | `#C17900` | `#FFF0C2` | Processing, low stock (<10 units) |
| **Error** | `#B72B2B` | `#FFE8E8` | Cancelled, form validation errors |
| **Info / Transit** | `#1B6BAA` | `#DCEEFD` | Placed, confirmed, transit information |
| **Dispatched** | `#914D00` | `#FFF3E0` | Shipped, out for delivery |

---

## 3. Typography Scale

AgriTrade uses **Plus Jakarta Sans** (web) and system-optimized sans-serif typography (mobile):

| Level | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| `display` | 36px | Bold (700) | 1.18 | -0.5px |
| `h1` | 24px - 28px | Bold (700) | 1.25 | -0.4px |
| `h2` | 20px - 22px | SemiBold (600) | 1.30 | -0.2px |
| `h3` | 16px - 18px | SemiBold (600) | 1.35 | -0.1px |
| `body1` | 15px - 16px | Regular (400) | 1.55 | +0.1px |
| `body2` | 13px - 14px | Regular (400) | 1.50 | +0.15px |
| `caption` | 11px - 12px | Medium (500) | 1.35 | +0.2px |
| `overline` | 10px | Bold (700) | 1.60 | +1.2px (UPPERCASE) |

---

## 4. Spacing & Radius System

### 4.1 Spacing Tokens
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

### 4.2 Restrained Border Radius System
*Note: Overly rounded cards (>16px) and cartoonish bubble shapes are prohibited.*
- `radius-xs` (3px - 4px): Status chips, category badges, inline pills
- `radius-sm` (6px): Compact buttons, inputs, category chips
- `radius-md` (8px - 10px): Primary cards, list row containers, icon badges
- `radius-lg` (12px): Modal dialogs, major feature containers, order summary panels
- `radius-full` (9999px): User avatars and circular progress only

---

## 5. Iconography Specification

- **Web Standard**: **Lucide React** SVG icons (`size={14-22}`, `strokeWidth={1.75-2.2}`)
- **Mobile Standard**: **Material Symbols Outlined**
- **Strict Rule**: No emojis as primary UI icons or data representations.

### Category Icon Mapping
| Category | Lucide Icon | Meaning |
|---|---|---|
| Seeds | `Sprout` | Certified agricultural seed varieties |
| Fertilizers | `FlaskConical` | Soil nutrition & chemicals |
| Crop Protection | `ShieldCheck` | Bio-pesticides and crop shields |
| Farm Tools | `Wrench` | Equipment, implements, and hardware |
| Irrigation | `Droplets` | Drip lines, sprinklers, pumps |
| Animal Care | `Beef` | Livestock feeds and supplements |
