# AgriTrade UI Quality Checklist

This checklist defines mandatory visual, architectural, and interaction standards for all components and views across **AgriTrade Web** and **AgriTrade Mobile**.

---

## 1. Prohibited Anti-Patterns (Forbidden)

| Rule | Severity | Rationale |
|---|---|---|
| ❌ **No Emojis as Interface Elements** | **CRITICAL** | Emojis (`🌱`, `📦`, `🌾`, `👨‍🌾`, etc.) look cartoonish, vary across operating systems, and degrade perceived brand trust. Use Lucide SVG icons (Web) or Material Symbols (Mobile). |
| ❌ **No Arbitrary / Giant Border Radii** | **HIGH** | Cards must not have `24px`–`32px` bubble radii. Limit card radius to `8px`–`12px` maximum. |
| ❌ **No Random Decorative Blobs** | **HIGH** | Floating colored blur circles or abstract opacity blobs look like AI template artifacts. Maintain clean, structured background planes. |
| ❌ **No Random Placeholder Imagery** | **HIGH** | Never use generic `picsum.photos` or unrelated stock photography. Use `ProductImageResolver` with curated, deterministic agricultural imagery. |
| ❌ **No Ad-Hoc Motion Durations** | **MEDIUM** | Never hardcode `432ms` or arbitrary timings. Use `--motion-fast` / `AppMotion.fast` or standard tokens. |
| ❌ **No Universal Glassmorphism Overuse** | **MEDIUM** | Glassmorphism must only be applied to floating layers (navigation bars, modal sheets, sticky control bars). Do NOT turn every product or data card into frosted glass. |
| ❌ **No Raw Text Unicode Arrows** | **LOW** | Do not write `→`, `←`, `↑`, `↓`, `★` in text spans. Use `<ArrowRight />`, `<ArrowLeft />`, `<TrendingUp />`, `<Star />`. |

---

## 2. Mandatory Production Standards (Required)

| Standard | Web (`apps/web`) | Mobile (`apps/mobile`) |
|---|---|---|
| ✓ **Semantic Typography** | Use designated text classes (`.text-h1`, `.text-body1`, `.text-caption`). | Use `AppTypography` text theme styles. |
| ✓ **Accessibility & Contrast** | WCAG AA compliant contrast ratio (minimum 4.5:1 for body copy). Visible focus rings (`:focus-visible`). | Scalable text units (`sp`), high-contrast state styling. |
| ✓ **Reduced Motion** | `@media (prefers-reduced-motion: reduce)` resets transitions and animations to instantaneous. | Honor `MediaQuery.disableAnimationsOf(context)` where applicable. |
| ✓ **State Completeness** | Every screen and section must explicitly implement: `Loading` (Skeleton), `Error` (with retry action), `Empty` (with clear CTA), and `Populated`. | Every Riverpod async provider uses `.when(data: ..., loading: ..., error: ...)`. |
| ✓ **Deterministic Image Resolution** | `ProductImageResolver.resolve(productId, category)` | `ProductImageResolver.resolve(productId, category)` |
| ✓ **Platform-Appropriate Layout** | Desktop multi-column dashboard with persistent top/side navigation; mobile-responsive collapse at breakpoints. | Touch-first ergonomics, bottom navigation, bottom sheets, safe area insets. |
| ✓ **Touch Targets** | Minimum interactive click target of 36px on desktop, 44px on mobile web. | Minimum touch target of 48x48dp according to Material guidelines. |
| ✓ **Clean Architecture** | UI consumes Zustand stores and repository interfaces; zero direct coupling to mock databases. | UI consumes Riverpod providers and Clean Architecture domain repositories. |
