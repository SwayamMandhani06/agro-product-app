// Stage 1 smoke test.
//
// Verifies that the FeaturePlaceholderScreen widget — the shared Stage 1
// scaffold used by every feature entry screen — renders correctly.
//
// The full application root (AgroProductApp) requires Firebase to be
// initialised before it can be pumped; that initialisation is performed
// in main() and cannot run inside the test environment at Stage 1.
// Integration tests that boot the full app are deferred to Stage 15.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:agro_product_app/core/widgets/feature_placeholder_screen.dart';

void main() {
  testWidgets(
    'FeaturePlaceholderScreen renders title and placeholder text',
    (WidgetTester tester) async {
      const testTitle = 'Stage 1 Test Feature';

      await tester.pumpWidget(
        const MaterialApp(
          home: FeaturePlaceholderScreen(title: testTitle),
        ),
      );

      // AppBar title is present.
      expect(find.text(testTitle), findsWidgets);

      // Body placeholder text contains the feature name.
      expect(
        find.textContaining('$testTitle — placeholder (Stage 1)'),
        findsOneWidget,
      );
    },
  );
}
