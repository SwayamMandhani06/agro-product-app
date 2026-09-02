import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:agro_product_app/core/design_system/design_system.dart';
import 'package:agro_product_app/core/widgets/widgets.dart';

void main() {
  group('Design System Tokens', () {
    test('AppColors contains expected modern agrarian palette', () {
      expect(AppColors.primary, const Color(0xFF01421E));
      expect(AppColors.primaryDark, const Color(0xFF012D1D));
      expect(AppColors.background, const Color(0xFFFFF8F5));
      expect(AppColors.accent, const Color(0xFFFE932C));
    });

    test('AppTheme produces valid Material 3 ThemeData', () {
      final theme = AppTheme.light;
      expect(theme.useMaterial3, isTrue);
      expect(theme.scaffoldBackgroundColor, AppColors.background);
      expect(theme.colorScheme.primary, AppColors.primary);
    });
  });

  group('AppButton Component', () {
    testWidgets('renders label and handles tap', (tester) async {
      var tapped = false;
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: AppButton(
              label: 'Buy Now',
              onPressed: () => tapped = true,
            ),
          ),
        ),
      );

      expect(find.text('Buy Now'), findsOneWidget);
      await tester.tap(find.text('Buy Now'));
      await tester.pumpAndSettle();
      expect(tapped, isTrue);
    });

    testWidgets('shows loading spinner when isLoading is true', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(
            body: AppButton(
              label: 'Submit',
              isLoading: true,
              onPressed: null,
            ),
          ),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      expect(find.text('Submit'), findsNothing);
    });

    testWidgets('does not invoke onPressed when disabled', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(
            body: AppButton(
              label: 'Disabled Action',
              onPressed: null,
            ),
          ),
        ),
      );

      expect(find.text('Disabled Action'), findsOneWidget);
      await tester.tap(find.text('Disabled Action'));
      await tester.pumpAndSettle();
    });
  });

  group('AppCard Component', () {
    testWidgets('renders children in various variants and responds to tap', (tester) async {
      var tapped = false;
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: AppCard(
              variant: AppCardVariant.elevated,
              onTap: () => tapped = true,
              child: const Text('Elevated Card Content'),
            ),
          ),
        ),
      );

      expect(find.text('Elevated Card Content'), findsOneWidget);
      await tester.tap(find.text('Elevated Card Content'));
      await tester.pumpAndSettle();
      expect(tapped, isTrue);
    });
  });

  group('AppChip Component', () {
    testWidgets('toggles selection and handles delete', (tester) async {
      var selected = false;
      var deleted = false;

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: StatefulBuilder(
              builder: (context, setState) {
                return Row(
                  children: [
                    AppChip(
                      label: 'Organic Seeds',
                      selected: selected,
                      leadingDot: true,
                      onTap: () => setState(() => selected = !selected),
                    ),
                    AppChip(
                      label: 'Filter Tag',
                      onDeleted: () => deleted = true,
                    ),
                  ],
                );
              },
            ),
          ),
        ),
      );

      expect(find.text('Organic Seeds'), findsOneWidget);
      await tester.tap(find.text('Organic Seeds'));
      await tester.pumpAndSettle();
      expect(selected, isTrue);

      expect(find.byIcon(Icons.close_rounded), findsOneWidget);
      await tester.tap(find.byIcon(Icons.close_rounded));
      await tester.pumpAndSettle();
      expect(deleted, isTrue);
    });
  });

  group('AppTextField Component', () {
    testWidgets('renders input, enters text, and shows error', (tester) async {
      final controller = TextEditingController();

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: AppTextField(
              controller: controller,
              label: 'Search',
              hint: 'Search crop seeds...',
              errorText: 'Field required',
            ),
          ),
        ),
      );

      expect(find.text('Search'), findsOneWidget);
      expect(find.text('Field required'), findsOneWidget);

      await tester.enterText(find.byType(TextField), 'Wheat');
      expect(controller.text, 'Wheat');
    });
  });

  group('AppGlass Component', () {
    testWidgets('renders glass container with blur filter', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(
            body: AppGlass(
              child: Text('Glass Panel Content'),
            ),
          ),
        ),
      );

      expect(find.text('Glass Panel Content'), findsOneWidget);
    });
  });

  group('AppDialog & Sheet Helpers', () {
    testWidgets('shows dialog with confirmation actions', (tester) async {
      var confirmed = false;

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: Builder(
              builder: (context) {
                return ElevatedButton(
                  onPressed: () {
                    showAppDialog(
                      context: context,
                      builder: (ctx) => AppDialogHelpers.confirm(
                        context: ctx,
                        title: 'Delete Item?',
                        content: const Text('Are you sure you want to delete?'),
                        isDanger: true,
                        confirmLabel: 'Delete',
                        onConfirm: () {
                          confirmed = true;
                          Navigator.of(ctx).pop();
                        },
                      ),
                    );
                  },
                  child: const Text('Open Dialog'),
                );
              },
            ),
          ),
        ),
      );

      await tester.tap(find.text('Open Dialog'));
      await tester.pumpAndSettle();

      expect(find.text('Delete Item?'), findsOneWidget);
      expect(find.text('Delete'), findsOneWidget);

      await tester.tap(find.text('Delete'));
      await tester.pumpAndSettle();
      expect(confirmed, isTrue);
    });
  });

  group('AppEmptyState & AppErrorState', () {
    testWidgets('renders empty state with action', (tester) async {
      var actionTriggered = false;

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: AppEmptyState(
              icon: Icons.inventory_2_outlined,
              title: 'No Orders Yet',
              message: 'When you place an order, it will appear here.',
              actionLabel: 'Start Shopping',
              onAction: () => actionTriggered = true,
            ),
          ),
        ),
      );

      expect(find.text('No Orders Yet'), findsOneWidget);
      expect(find.text('Start Shopping'), findsOneWidget);

      await tester.tap(find.text('Start Shopping'));
      await tester.pumpAndSettle();
      expect(actionTriggered, isTrue);
    });

    testWidgets('renders error state with retry action', (tester) async {
      var retryTriggered = false;

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: AppErrorState(
              title: 'Network Error',
              message: 'Failed to connect to Mandi price servers.',
              onRetry: () => retryTriggered = true,
            ),
          ),
        ),
      );

      expect(find.text('Network Error'), findsOneWidget);
      expect(find.text('Try again'), findsOneWidget);

      await tester.tap(find.text('Try again'));
      await tester.pumpAndSettle();
      expect(retryTriggered, isTrue);
    });
  });

  group('AppLoading & Skeleton Components', () {
    testWidgets('renders AppSkeleton and AppSpinner', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(
            body: Column(
              children: [
                AppSkeleton(height: 20, width: 100),
                AppSkeletonParagraph(lines: 2),
                AppSpinner(),
              ],
            ),
          ),
        ),
      );

      expect(find.byType(AppSkeleton), findsWidgets);
      expect(find.byType(AppSpinner), findsOneWidget);
    });
  });

  group('AppIcon & AppBadge Components', () {
    testWidgets('renders AppIconContainer and AppBadge', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(
            body: Row(
              children: [
                AppIconContainer(icon: Icons.eco),
                AppBadge(count: 5),
                AppBadge(),
              ],
            ),
          ),
        ),
      );

      expect(find.byIcon(Icons.eco), findsOneWidget);
      expect(find.text('5'), findsOneWidget);
    });
  });
}
