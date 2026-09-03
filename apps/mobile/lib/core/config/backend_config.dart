import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Reads Supabase backend configuration from the loaded `.env` file.
///
/// Handles test-mode and uninitialized-dotenv safety guards so that
/// automated tests and offline environments automatically fall back to mocks.
class BackendConfig {
  BackendConfig._();

  /// Returns `true` when both [supabaseUrl] and [supabaseAnonKey] are
  /// non-empty, meaning the app can reach the Supabase PostgREST API.
  ///
  /// Always returns `false` during automated tests or if dotenv has not
  /// been initialized, ensuring complete test isolation and zero network calls.
  static bool get isConfigured {
    if (!kIsWeb) {
      try {
        if (Platform.environment.containsKey('FLUTTER_TEST')) return false;
      } catch (_) {
        // Ignored on platforms where Platform.environment is unsupported
      }
    }

    try {
      if (!dotenv.isInitialized) return false;
      return supabaseUrl.isNotEmpty && supabaseAnonKey.isNotEmpty;
    } catch (_) {
      return false;
    }
  }

  /// Supabase project URL (e.g. `https://xyzxyz.supabase.co`).
  static String get supabaseUrl {
    try {
      if (!dotenv.isInitialized) return '';
      return dotenv.maybeGet('SUPABASE_URL') ?? '';
    } catch (_) {
      return '';
    }
  }

  /// Supabase anonymous/public API key.
  static String get supabaseAnonKey {
    try {
      if (!dotenv.isInitialized) return '';
      return dotenv.maybeGet('SUPABASE_ANON_KEY') ?? '';
    } catch (_) {
      return '';
    }
  }

  /// Constructs the PostgREST base URL used by Dio-based repositories.
  static String get restBaseUrl => '$supabaseUrl/rest/v1';

  /// Standard Supabase request headers for anonymous-key authenticated calls.
  static Map<String, String> get headers => {
        'apikey': supabaseAnonKey,
        'Authorization': 'Bearer $supabaseAnonKey',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      };
}
