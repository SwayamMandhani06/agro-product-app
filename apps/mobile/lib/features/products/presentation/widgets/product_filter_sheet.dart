import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../../../core/widgets/app_button.dart';
import '../../domain/product.dart';
import '../providers/product_providers.dart';

/// Modal bottom sheet for configuring product catalogue filters.
///
/// Matches Google Stitch `AgriTrade Search Filters` visual specifications.
class ProductFilterSheet extends ConsumerStatefulWidget {
  const ProductFilterSheet({
    super.key,
    this.currentCategory,
  });

  final String? currentCategory;

  /// Helper to display this filter sheet as a modal bottom sheet.
  static Future<void> show(BuildContext context, {String? currentCategory}) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => ProductFilterSheet(currentCategory: currentCategory),
    );
  }

  @override
  ConsumerState<ProductFilterSheet> createState() => _ProductFilterSheetState();
}

class _ProductFilterSheetState extends ConsumerState<ProductFilterSheet> {
  late String? _selectedCategory;
  late PriceRangeFilter? _selectedPriceRange;
  late double? _selectedMinRating;
  late bool _inStockOnly;

  @override
  void initState() {
    super.initState();
    final current = ref.read(productFilterProvider);
    _selectedCategory = current.category ?? widget.currentCategory;
    _selectedPriceRange = current.priceRange;
    _selectedMinRating = current.minRating;
    _inStockOnly = current.inStockOnly;
  }

  void _resetFilters() {
    setState(() {
      _selectedCategory = widget.currentCategory;
      _selectedPriceRange = null;
      _selectedMinRating = null;
      _inStockOnly = false;
    });
  }

  void _applyFilters() {
    ref.read(productFilterProvider.notifier).state = ProductFilter(
      category: _selectedCategory,
      priceRange: _selectedPriceRange,
      minRating: _selectedMinRating,
      inStockOnly: _inStockOnly,
    );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final bottomInset = mediaQuery.viewInsets.bottom;
    final bottomPadding = mediaQuery.padding.bottom;

    return Container(
      constraints: BoxConstraints(
        maxHeight: mediaQuery.size.height * 0.85,
      ),
      margin: EdgeInsets.only(bottom: bottomInset),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(AppRadius.xxl),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0x1F000000),
            blurRadius: 24,
            offset: Offset(0, -6),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle & Header
          Padding(
            padding: const EdgeInsets.fromLTRB(
              AppSpacing.md,
              AppSpacing.sm,
              AppSpacing.md,
              AppSpacing.xs,
            ),
            child: Column(
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: AppColors.neutral300,
                      borderRadius: BorderRadius.circular(AppRadius.full),
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(
                          Icons.tune_rounded,
                          size: 20,
                          color: AppColors.textPrimary,
                        ),
                        SizedBox(width: AppSpacing.xs),
                        Text(
                          'Filters',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                    TextButton(
                      onPressed: _resetFilters,
                      style: TextButton.styleFrom(
                        foregroundColor: AppColors.stitchForestGreen,
                        textStyle: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      child: const Text('Reset'),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: AppColors.neutral200),

          // Scrollable Filter Sections
          Flexible(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.md,
                vertical: AppSpacing.md,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Category Section
                  _buildSectionHeader('CATEGORY'),
                  const SizedBox(height: AppSpacing.xs),
                  _buildCategoryChips(),
                  const SizedBox(height: AppSpacing.lg),

                  // Price Range Section
                  _buildSectionHeader('PRICE RANGE'),
                  const SizedBox(height: AppSpacing.xs),
                  _buildPriceRangeGrid(),
                  const SizedBox(height: AppSpacing.lg),

                  // Rating Section
                  _buildSectionHeader('RATING'),
                  const SizedBox(height: AppSpacing.xs),
                  _buildRatingChips(),
                  const SizedBox(height: AppSpacing.lg),

                  // In Stock Only Toggle
                  _buildInStockToggle(),
                  const SizedBox(height: AppSpacing.md),
                ],
              ),
            ),
          ),

          // Sticky Bottom CTA Bar
          Container(
            padding: EdgeInsets.fromLTRB(
              AppSpacing.md,
              AppSpacing.sm,
              AppSpacing.md,
              AppSpacing.md + bottomPadding,
            ),
            decoration: const BoxDecoration(
              color: AppColors.surface,
              border: Border(
                top: BorderSide(color: AppColors.neutral200),
              ),
            ),
            child: AppButton(
              label: 'Apply Filters',
              variant: AppButtonVariant.primary,
              size: AppButtonSize.large,
              trailingIcon: const Icon(Icons.arrow_forward_rounded, size: 18),
              onPressed: _applyFilters,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 11,
        fontWeight: FontWeight.w700,
        letterSpacing: 1.0,
        color: AppColors.textTertiary,
      ),
    );
  }

  Widget _buildCategoryChips() {
    const categories = [
      'All',
      'Seeds',
      'Fertilizers',
      'Crop Protection',
      'Farm Tools',
      'Irrigation',
      'Animal Care',
    ];

    return Wrap(
      spacing: AppSpacing.xs,
      runSpacing: AppSpacing.xs,
      children: categories.map((cat) {
        final isAll = cat == 'All';
        final isSelected = isAll
            ? (_selectedCategory == null || _selectedCategory!.isEmpty || _selectedCategory == 'All')
            : (_selectedCategory?.toLowerCase() == cat.toLowerCase());

        return ChoiceChip(
          label: Text(cat),
          selected: isSelected,
          avatar: isSelected
              ? const Icon(
                  Icons.check_rounded,
                  size: 16,
                  color: Colors.white,
                )
              : null,
          selectedColor: AppColors.stitchForestGreen,
          backgroundColor: AppColors.surface,
          labelStyle: TextStyle(
            fontSize: 13,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
            color: isSelected ? Colors.white : AppColors.textPrimary,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.full),
            side: BorderSide(
              color: isSelected ? AppColors.stitchForestGreen : AppColors.neutral200,
            ),
          ),
          onSelected: (selected) {
            setState(() {
              if (isAll) {
                _selectedCategory = null;
              } else {
                _selectedCategory = selected ? cat : null;
              }
            });
          },
        );
      }).toList(),
    );
  }

  Widget _buildPriceRangeGrid() {
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: AppSpacing.xs,
      mainAxisSpacing: AppSpacing.xs,
      childAspectRatio: 2.8,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: PriceRangeFilter.values.map((range) {
        final isSelected = _selectedPriceRange == range;
        return Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: () {
              setState(() {
                _selectedPriceRange = isSelected ? null : range;
              });
            },
            borderRadius: BorderRadius.circular(AppRadius.md),
            child: Container(
              alignment: Alignment.center,
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
              decoration: BoxDecoration(
                color: isSelected
                    ? AppColors.stitchForestGreen.withValues(alpha: 0.1)
                    : AppColors.surface,
                borderRadius: BorderRadius.circular(AppRadius.md),
                border: Border.all(
                  color: isSelected
                      ? AppColors.stitchForestGreen
                      : AppColors.neutral200,
                  width: isSelected ? 1.5 : 1.0,
                ),
              ),
              child: Text(
                range.label,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                  color: isSelected
                      ? AppColors.stitchForestGreen
                      : AppColors.textPrimary,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildRatingChips() {
    final ratings = [
      (4.0, '4★ & above'),
      (3.0, '3★ & above'),
    ];

    return Wrap(
      spacing: AppSpacing.xs,
      runSpacing: AppSpacing.xs,
      children: ratings.map((r) {
        final isSelected = _selectedMinRating == r.$1;
        return ChoiceChip(
          label: Text(r.$2),
          selected: isSelected,
          avatar: Icon(
            Icons.star_rounded,
            size: 16,
            color: isSelected ? AppColors.stitchAmber : AppColors.stitchAmber,
          ),
          selectedColor: AppColors.stitchForestGreen,
          backgroundColor: AppColors.surface,
          labelStyle: TextStyle(
            fontSize: 13,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
            color: isSelected ? Colors.white : AppColors.textPrimary,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.full),
            side: BorderSide(
              color: isSelected ? AppColors.stitchForestGreen : AppColors.neutral200,
            ),
          ),
          onSelected: (selected) {
            setState(() {
              _selectedMinRating = selected ? r.$1 : null;
            });
          },
        );
      }).toList(),
    );
  }

  Widget _buildInStockToggle() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.sm),
      decoration: BoxDecoration(
        color: AppColors.stitchCanvas,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.neutral200),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'In Stock Only',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              SizedBox(height: 2),
              Text(
                'Show items ready for immediate dispatch',
                style: TextStyle(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
          Switch(
            value: _inStockOnly,
            activeThumbColor: Colors.white,
            activeTrackColor: AppColors.stitchForestGreen,
            onChanged: (val) {
              setState(() {
                _inStockOnly = val;
              });
            },
          ),
        ],
      ),
    );
  }
}
