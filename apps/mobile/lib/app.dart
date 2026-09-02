import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/design_system/app_theme.dart';
import 'core/routing/app_router.dart';

class AgroProductApp extends ConsumerWidget {
  const AgroProductApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(goRouterProvider);

    return MaterialApp.router(
      title:                    'Agro Product App',
      debugShowCheckedModeBanner: false,
      theme:                    AppTheme.light,
      localizationsDelegates:   context.localizationDelegates,
      supportedLocales:         context.supportedLocales,
      locale:                   context.locale,
      routerConfig:             router,
    );
  }
}
