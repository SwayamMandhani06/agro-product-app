import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

import 'app.dart';
import 'core/di/firebase_bootstrap.dart';
import 'core/di/providers.dart';
import 'core/di/remote_config_service.dart';
import 'core/localization/app_locales.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await dotenv.load(fileName: '.env');
  await initializeFirebase();
  await Hive.initFlutter();
  await EasyLocalization.ensureInitialized();
  await RemoteConfigService.initialize();

  runApp(
    ProviderScope(
      overrides: appProviderOverrides(),
      child: EasyLocalization(
        supportedLocales: AppLocales.supportedLocales,
        path: AppLocales.path,
        fallbackLocale: AppLocales.fallbackLocale,
        child: const AgroProductApp(),
      ),
    ),
  );
}
