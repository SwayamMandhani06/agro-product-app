import 'package:flutter/material.dart';

import '../../../core/design_system/app_colors.dart';
import '../../../core/design_system/app_radius.dart';
import '../../../core/design_system/app_spacing.dart';
import '../../../core/design_system/app_typography.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_chip.dart';
import '../../../core/widgets/app_dialog.dart';
import '../../../core/widgets/app_empty_state.dart';
import '../../../core/widgets/app_error_state.dart';
import '../../../core/widgets/app_glass.dart';
import '../../../core/widgets/app_icon.dart';
import '../../../core/widgets/app_loading.dart';
import '../../../core/widgets/app_text_field.dart';

/// Interactive Stage 2 design system showcase.
///
/// Organised into sections so reviewers can assess every component
/// variant at a glance. This is NOT a production screen.
class DesignSystemPreviewScreen extends StatefulWidget {
  const DesignSystemPreviewScreen({super.key});

  @override
  State<DesignSystemPreviewScreen> createState() =>
      _DesignSystemPreviewScreenState();
}

class _DesignSystemPreviewScreenState
    extends State<DesignSystemPreviewScreen> {
  bool _chipSelected1 = true;
  bool _chipSelected2 = false;
  bool _chipSelected3 = true;
  bool _buttonLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // ── Hero App Bar ────────────────────────────────────────────────
          const SliverAppBar(
            expandedHeight:     260,
            pinned:             true,
            backgroundColor:    AppColors.brand900,
            foregroundColor:    AppColors.onPrimary,
            surfaceTintColor:   Colors.transparent,
            scrolledUnderElevation: 0,
            flexibleSpace: FlexibleSpaceBar(
              collapseMode: CollapseMode.parallax,
              background:   _HeroBanner(),
            ),
            title: Text('Design System'),
            centerTitle: false,
          ),

          // ── Content ─────────────────────────────────────────────────────
          SliverPadding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.pagePadding,
              vertical:   AppSpacing.xl,
            ),
            sliver: SliverList.list(
              children: [
                _Section(title: 'Colour Palette',   child: _ColorPalette()),
                _Section(title: 'Typography',        child: _TypeScale()),
                _Section(title: 'Buttons',           child: _Buttons(
                  loading: _buttonLoading,
                  onToggleLoading: () =>
                      setState(() => _buttonLoading = !_buttonLoading),
                )),
                _Section(title: 'Input Fields',      child: _Inputs()),
                _Section(title: 'Cards',             child: _Cards()),
                _Section(title: 'Chips & Badges',    child: _Chips(
                  sel1: _chipSelected1,
                  sel2: _chipSelected2,
                  sel3: _chipSelected3,
                  onSel1: () => setState(() => _chipSelected1 = !_chipSelected1),
                  onSel2: () => setState(() => _chipSelected2 = !_chipSelected2),
                  onSel3: () => setState(() => _chipSelected3 = !_chipSelected3),
                )),
                _Section(title: 'Loading States',    child: _LoadingStates()),
                _Section(title: 'Empty States',      child: _EmptyStates()),
                _Section(title: 'Error States',      child: _ErrorStates()),
                _Section(title: 'Icons & Badges',    child: _Icons()),
                _Section(title: 'Dialogs & Sheets',  child: _Dialogs()),
                _Section(title: 'Glass Components',  child: _GlassSection()),
                const _DarkSection(),
                const SizedBox(height: AppSpacing.xxxl),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Hero Banner
// ═══════════════════════════════════════════════════════════════════════════

class _HeroBanner extends StatelessWidget {
  const _HeroBanner();

  @override
  Widget build(BuildContext context) => Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin:  Alignment.topLeft,
            end:    Alignment.bottomRight,
            colors: [AppColors.brand900, AppColors.brand700],
          ),
        ),
        child: SafeArea(
          bottom: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(
              AppSpacing.pagePadding,
              kToolbarHeight,
              AppSpacing.pagePadding,
              AppSpacing.base,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.md,
                    vertical:   AppSpacing.xs,
                  ),
                  decoration: BoxDecoration(
                    color:        AppColors.accent.withAlpha(40),
                    borderRadius: AppRadius.circleAll,
                    border: Border.all(
                      color: AppColors.accent.withAlpha(80),
                      width: 1,
                    ),
                  ),
                  child: Text(
                    'STAGE 2 · DESIGN SYSTEM',
                    style: AppTypography.overline.copyWith(
                      color:         AppColors.accent,
                      letterSpacing: 1.8,
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(
                  'Modern Agrarian\nVisual Language',
                  style: AppTypography.textTheme.headlineLarge?.copyWith(
                    color:      AppColors.onSurfaceDark,
                    fontWeight: FontWeight.w700,
                    height:     1.15,
                  ),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  'All tokens, components, and motion patterns.',
                  style: AppTypography.textTheme.bodyMedium?.copyWith(
                    color: AppColors.brand300,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// Section wrapper
// ═══════════════════════════════════════════════════════════════════════════

class _Section extends StatelessWidget {
  const _Section({required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: AppSpacing.xxl),
        child:   Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width:  3,
                  height: 18,
                  decoration: const BoxDecoration(
                    color:        AppColors.accent,
                    borderRadius: AppRadius.circleAll,
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Text(
                  title.toUpperCase(),
                  style: AppTypography.overline.copyWith(
                    color:         AppColors.textSecondary,
                    letterSpacing: 1.5,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.base),
            child,
          ],
        ),
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// Colour Palette
// ═══════════════════════════════════════════════════════════════════════════

class _ColorPalette extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final groups = [
      ('Brand', [
        AppColors.brand900, AppColors.brand800, AppColors.brand700,
        AppColors.brand500, AppColors.brand300, AppColors.brand100, AppColors.brand50,
      ]),
      ('Accent', [
        AppColors.amber600, AppColors.amber500, AppColors.amber400,
        AppColors.amber300, AppColors.amber100, AppColors.amber50,
      ]),
      ('Neutral', [
        AppColors.neutral900, AppColors.neutral700, AppColors.neutral500,
        AppColors.neutral300, AppColors.neutral100, AppColors.neutral50,
      ]),
      ('Semantic', [
        AppColors.success, AppColors.warning, AppColors.error, AppColors.info,
      ]),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: groups.map((g) {
        final (name, colors) = g;
        return Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.md),
          child:   Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                name,
                style: AppTypography.textTheme.labelSmall?.copyWith(
                  color: AppColors.textTertiary,
                ),
              ),
              const SizedBox(height: AppSpacing.xs),
              Row(
                children: colors.map((c) => Expanded(
                  child: AspectRatio(
                    aspectRatio: 1,
                    child: Container(
                      margin:     const EdgeInsets.only(right: 4),
                      decoration: BoxDecoration(
                        color:        c,
                        borderRadius: AppRadius.smAll,
                      ),
                    ),
                  ),
                )).toList(),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Type Scale
// ═══════════════════════════════════════════════════════════════════════════

class _TypeScale extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final tt = Theme.of(context).textTheme;
    final pairs = [
      ('displaySmall',  tt.displaySmall,  'Agro Product App'),
      ('headlineMedium', tt.headlineMedium, 'Premium Commerce'),
      ('titleLarge',    tt.titleLarge,    'Feature Title'),
      ('titleMedium',   tt.titleMedium,   'Section Label'),
      ('bodyLarge',     tt.bodyLarge,     'Body text for descriptions and details.'),
      ('bodyMedium',    tt.bodyMedium,    'Secondary body — helper text and metadata.'),
      ('labelLarge',    tt.labelLarge,    'Button Label'),
      ('labelSmall',    tt.labelSmall,    'OVERLINE · TAG'),
    ];
    return AppCard(
      variant: AppCardVariant.tonal,
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.base,
        vertical:   AppSpacing.md,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: pairs.expand((p) {
          final (name, style, sample) = p;
          return [
            Padding(
              padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
              child:   Row(
                crossAxisAlignment: CrossAxisAlignment.baseline,
                textBaseline:       TextBaseline.alphabetic,
                children: [
                  SizedBox(
                    width: 120,
                    child: Text(
                      name,
                      style: AppTypography.caption.copyWith(
                        color: AppColors.textTertiary,
                      ),
                    ),
                  ),
                  Expanded(
                    child: Text(
                      sample,
                      style: style?.copyWith(color: AppColors.textPrimary),
                    ),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
          ];
        }).toList()..removeLast(),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Buttons
// ═══════════════════════════════════════════════════════════════════════════

class _Buttons extends StatelessWidget {
  const _Buttons({required this.loading, required this.onToggleLoading});

  final bool loading;
  final VoidCallback onToggleLoading;

  @override
  Widget build(BuildContext context) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppButton(
            label:      'Primary — Buy Now',
            onPressed:  () {},
            leadingIcon: const Icon(Icons.shopping_bag_outlined,
              size: 18, color: AppColors.onPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          AppButton(
            label:      'Primary Loading',
            onPressed:  onToggleLoading,
            isLoading:  loading,
          ),
          const SizedBox(height: AppSpacing.md),
          AppButton(
            label:    'Secondary — View Details',
            onPressed: () {},
            variant:  AppButtonVariant.secondary,
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: [
              Expanded(
                child: AppButton(
                  label:   'Danger',
                  onPressed: () {},
                  variant: AppButtonVariant.danger,
                  size:    AppButtonSize.medium,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              const Expanded(
                child: AppButton(
                  label:    'Disabled',
                  onPressed: null,
                  size:     AppButtonSize.medium,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: [
              AppButton(
                label:       'Small',
                onPressed:   () {},
                size:        AppButtonSize.small,
                isFullWidth: false,
              ),
              const SizedBox(width: AppSpacing.sm),
              AppButton(
                label:       'Text',
                onPressed:   () {},
                variant:     AppButtonVariant.text,
                isFullWidth: false,
              ),
            ],
          ),
        ],
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// Inputs
// ═══════════════════════════════════════════════════════════════════════════

class _Inputs extends StatelessWidget {
  @override
  Widget build(BuildContext context) => const Column(
        children: [
          AppTextField(
            label: 'Search products',
            hint:  'Wheat seeds, NPK fertilizer…',
            prefixIcon: Icon(Icons.search_rounded, color: AppColors.textTertiary),
          ),
          SizedBox(height: AppSpacing.md),
          AppTextField(
            label:    'Email address',
            hint:     'you@example.com',
            keyboardType: TextInputType.emailAddress,
          ),
          SizedBox(height: AppSpacing.md),
          AppTextField(
            label:     'Mobile number',
            hint:      '+91 9876543210',
            errorText: 'Please enter a valid number',
            keyboardType: TextInputType.phone,
          ),
          SizedBox(height: AppSpacing.md),
          AppTextField(
            label:   'Disabled field',
            hint:    'Not editable',
            enabled: false,
          ),
        ],
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// Cards
// ═══════════════════════════════════════════════════════════════════════════

class _Cards extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final variants = [
      (AppCardVariant.elevated, 'Elevated'),
      (AppCardVariant.tonal,    'Tonal'),
      (AppCardVariant.outlined, 'Outlined'),
    ];

    return Column(
      children: [
        ...variants.map((v) {
          final (variant, label) = v;
          return Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.md),
            child:   AppCard(
              variant: variant,
              onTap:   () {},
              child:   Row(
                children: [
                  Container(
                    width:  48,
                    height: 48,
                    decoration: const BoxDecoration(
                      color:        AppColors.brand50,
                      borderRadius: AppRadius.mdAll,
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.spa_outlined,
                        color: AppColors.primary,
                        size:  24,
                      ),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '$label Card',
                          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Tap me to see press animation',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Icon(
                    Icons.arrow_forward_ios_rounded,
                    size:  14,
                    color: AppColors.textTertiary,
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Chips
// ═══════════════════════════════════════════════════════════════════════════

class _Chips extends StatelessWidget {
  const _Chips({
    required this.sel1, required this.sel2, required this.sel3,
    required this.onSel1, required this.onSel2, required this.onSel3,
  });

  final bool sel1, sel2, sel3;
  final VoidCallback onSel1, onSel2, onSel3;

  @override
  Widget build(BuildContext context) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Wrap(
            spacing:  AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: [
              AppChip(
                label:    'Seeds',
                variant:  AppChipVariant.primary,
                selected: sel1,
                onTap:    onSel1,
              ),
              AppChip(
                label:    'Fertilizers',
                variant:  AppChipVariant.primary,
                selected: sel2,
                onTap:    onSel2,
              ),
              AppChip(
                label:    'Pesticides',
                variant:  AppChipVariant.primary,
                selected: sel3,
                onTap:    onSel3,
              ),
              AppChip(
                label:     'Pesticides',
                variant:   AppChipVariant.neutral,
                onDeleted: () {},
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          const Wrap(
            spacing:  AppSpacing.sm,
            runSpacing: AppSpacing.sm,
            children: [
              AppChip(
                label:    'In Stock',
                variant:  AppChipVariant.success,
                leadingDot: true,
              ),
              AppChip(
                label:    'Low Stock',
                variant:  AppChipVariant.warning,
                leadingDot: true,
              ),
              AppChip(
                label:    'Out of Stock',
                variant:  AppChipVariant.error,
                leadingDot: true,
              ),
              AppChip(
                label:   'Info',
                variant: AppChipVariant.info,
                icon:    Icons.info_outline_rounded,
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          const Row(
            children: [
              AppIconContainer(
                icon:  Icons.notifications_none_rounded,
                color: AppColors.primary,
              ),
              SizedBox(width: AppSpacing.sm),
              AppIconContainer(
                icon:  Icons.warning_amber_rounded,
                color: AppColors.warning,
              ),
              SizedBox(width: AppSpacing.sm),
              Stack(
                clipBehavior: Clip.none,
                children: [
                  AppIconContainer(
                    icon:  Icons.shopping_cart_outlined,
                    color: AppColors.accent,
                  ),
                  Positioned(
                    top:   -4,
                    right: -4,
                    child: AppBadge(count: 3),
                  ),
                ],
              ),
              SizedBox(width: AppSpacing.sm),
              AppBadge(count: 12),
              SizedBox(width: AppSpacing.sm),
              AppBadge(count: 100),
            ],
          ),
        ],
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// Loading States
// ═══════════════════════════════════════════════════════════════════════════

class _LoadingStates extends StatelessWidget {
  @override
  Widget build(BuildContext context) => const Column(
        children: [
          AppCard(
            variant: AppCardVariant.tonal,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Simulated product card skeleton
                Row(
                  children: [
                    AppSkeleton(height: 72, width: 72, radius: AppRadius.mdAll),
                    SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          AppSkeletonLine(width: double.infinity, height: 16),
                          SizedBox(height: AppSpacing.sm),
                          AppSkeletonLine(height: 12),
                          SizedBox(height: AppSpacing.sm),
                          AppSkeletonLine(height: 12),
                        ],
                      ),
                    ),
                  ],
                ),
                SizedBox(height: AppSpacing.base),
                AppSkeletonParagraph(lines: 2),
                SizedBox(height: AppSpacing.base),
                Row(
                  children: [
                    Expanded(
                      child: AppSkeleton(height: AppSpacing.buttonHeightSm),
                    ),
                    SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: AppSkeleton(height: AppSpacing.buttonHeightSm),
                    ),
                  ],
                ),
              ],
            ),
          ),
          SizedBox(height: AppSpacing.base),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              AppSpinner(size: 20),
              AppSpinner(size: 28),
              AppSpinner(size: 36, color: AppColors.accent),
            ],
          ),
        ],
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// Empty States
// ═══════════════════════════════════════════════════════════════════════════

class _EmptyStates extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Column(
        children: [
          AppCard(
            variant: AppCardVariant.tonal,
            padding: EdgeInsets.zero,
            child: AppEmptyState(
              icon:        Icons.shopping_bag_outlined,
              title:       'Your cart is empty',
              message:     'Add products to your cart to proceed with checkout.',
              actionLabel: 'Browse products',
              onAction:    () {},
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          const AppCard(
            variant: AppCardVariant.tonal,
            padding: EdgeInsets.zero,
            child: AppEmptyState(
              icon:    Icons.search_off_rounded,
              title:   'No results found',
              message: 'Try adjusting your filters.',
              compact: true,
            ),
          ),
        ],
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// Error States
// ═══════════════════════════════════════════════════════════════════════════

class _ErrorStates extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Column(
        children: [
          AppCard(
            variant: AppCardVariant.tonal,
            padding: EdgeInsets.zero,
            child:   AppErrorState(
              title:    'Unable to load prices',
              message:  'Check your internet connection and try again.',
              onRetry:  () {},
              compact:  true,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          AppNetworkBanner(onRetry: () {}),
        ],
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// Icons
// ═══════════════════════════════════════════════════════════════════════════

class _Icons extends StatelessWidget {
  @override
  Widget build(BuildContext context) => const AppCard(
        variant: AppCardVariant.tonal,
        child:   Wrap(
          spacing:    AppSpacing.md,
          runSpacing: AppSpacing.md,
          children: [
            AppIconContainer(icon: Icons.spa_outlined,           color: AppColors.primary),
            AppIconContainer(icon: Icons.storefront_outlined,     color: AppColors.accent),
            AppIconContainer(icon: Icons.cloud_outlined,          color: AppColors.info),
            AppIconContainer(icon: Icons.trending_up_rounded,     color: AppColors.success),
            AppIconContainer(icon: Icons.notifications_outlined,  color: AppColors.warning),
            AppIconContainer(icon: Icons.lock_outline_rounded,    color: AppColors.error),
            AppIconContainer(icon: Icons.person_outline_rounded,  color: AppColors.neutral500),
            AppIconContainer(icon: Icons.settings_outlined,       color: AppColors.neutral500,
              backgroundColor: AppColors.surfaceSubtle, shape: BoxShape.rectangle,
            ),
          ],
        ),
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// Dialogs
// ═══════════════════════════════════════════════════════════════════════════

class _Dialogs extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppButton(
            label:       'Show dialog',
            onPressed:   () => showAppDialog(
              context: context,
              builder: (ctx) => AppDialogHelpers.confirm(
                context:      ctx,
                title:        'Remove from cart?',
                content:      const Text(
                  'This product will be removed from your cart. '
                  'You can add it back anytime.',
                ),
                icon:         Icons.delete_outline_rounded,
                iconColor:    AppColors.error,
                confirmLabel: 'Remove',
                cancelLabel:  'Keep',
                isDanger:     true,
                onConfirm:    () => Navigator.of(ctx).pop(),
              ),
            ),
            isFullWidth: false,
            variant:     AppButtonVariant.secondary,
          ),
          const SizedBox(height: AppSpacing.sm),
          AppButton(
            label:       'Show bottom sheet',
            onPressed:   () => showAppSheet(
              context: context,
              builder: (ctx) => const _SampleSheet(),
            ),
            isFullWidth: false,
            variant:     AppButtonVariant.secondary,
          ),
        ],
      );
}

class _SampleSheet extends StatelessWidget {
  const _SampleSheet();

  @override
  Widget build(BuildContext context) => SizedBox(
        height: 300,
        child:  Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const AppSheetHandle(),
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.xl, 0, AppSpacing.xl, AppSpacing.xl,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Sort by',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.base),
                  ...['Price: Low to High', 'Price: High to Low', 'Newest first'].map(
                    (item) => ListTile(
                      title:           Text(item),
                      trailing:        const Icon(Icons.chevron_right_rounded),
                      onTap:           () => Navigator.of(context).pop(),
                      contentPadding:  EdgeInsets.zero,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// Glass Section
// ═══════════════════════════════════════════════════════════════════════════

class _GlassSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Stack(
        children: [
          // Background gradient
          Container(
            height:     200,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin:  Alignment.topLeft,
                end:    Alignment.bottomRight,
                colors: [AppColors.brand600, AppColors.brand400],
              ),
              borderRadius: AppRadius.xlAll,
            ),
          ),
          // Glass card on top
          Positioned.fill(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.base),
              child:   AppGlass(
                blur:    12,
                opacity: 0.25,
                child:   Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment:  MainAxisAlignment.center,
                  children: [
                    Text(
                      'Glass Surface',
                      style: AppTypography.textTheme.titleMedium?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    Text(
                      'Backdrop blur, semi-transparent, soft border.',
                      style: AppTypography.textTheme.bodySmall?.copyWith(
                        color: Colors.white.withAlpha(200),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    AppButton(
                      label:       'Glass CTA',
                      onPressed:   () {},
                      isFullWidth: false,
                      size:        AppButtonSize.small,
                      variant:     AppButtonVariant.secondary,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// Dark Premium Section
// ═══════════════════════════════════════════════════════════════════════════

class _DarkSection extends StatelessWidget {
  const _DarkSection();

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(AppSpacing.cardPadding),
        decoration: BoxDecoration(
          color:        AppColors.brand900,
          borderRadius: AppRadius.xlAll,
          border:       Border.all(color: AppColors.border, width: 1),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'DARK PREMIUM',
              style: AppTypography.overline.copyWith(
                color:         AppColors.brand400,
                letterSpacing: 2,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Dark card surfaces for feature highlights and hero sections.',
              style: AppTypography.textTheme.bodyMedium?.copyWith(
                color: AppColors.brand200,
              ),
            ),
            const SizedBox(height: AppSpacing.xl),
            Row(
              children: [
                Expanded(
                  child: AppCard(
                    variant: AppCardVariant.dark,
                    child:   Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const AppIconContainer(
                          icon:            Icons.trending_up_rounded,
                          color:           AppColors.accent,
                          backgroundColor: Color(0x22FE932C),
                        ),
                        const SizedBox(height: AppSpacing.md),
                        Text(
                          'Mandi Price',
                          style: AppTypography.textTheme.labelMedium?.copyWith(
                            color: AppColors.brand300,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.xs),
                        Text(
                          '₹2,450',
                          style: AppTypography.price.copyWith(
                            color: AppColors.onSurfaceDark,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.xs),
                        Text(
                          '+3.2% today',
                          style: AppTypography.textTheme.labelSmall?.copyWith(
                            color: AppColors.success,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: AppCard(
                    variant: AppCardVariant.dark,
                    child:   Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const AppIconContainer(
                          icon:            Icons.cloud_outlined,
                          color:           AppColors.brand300,
                          backgroundColor: Color(0x225FBA86),
                        ),
                        const SizedBox(height: AppSpacing.md),
                        Text(
                          'Weather',
                          style: AppTypography.textTheme.labelMedium?.copyWith(
                            color: AppColors.brand300,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.xs),
                        Text(
                          '28°C',
                          style: AppTypography.price.copyWith(
                            color: AppColors.onSurfaceDark,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.xs),
                        Text(
                          'Partly cloudy',
                          style: AppTypography.textTheme.labelSmall?.copyWith(
                            color: AppColors.brand200,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      );
}
