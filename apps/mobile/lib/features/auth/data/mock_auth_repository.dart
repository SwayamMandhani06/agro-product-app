import 'dart:convert';
import 'package:fpdart/fpdart.dart';
import 'package:hive/hive.dart';

import '../../../core/error/failure.dart';
import '../domain/app_user.dart';
import '../domain/auth_repository.dart';

/// Pluggable session storage contract allowing seamless unit testing and
/// persistent device storage.
abstract interface class AuthSessionStorage {
  Future<void> saveUser(AppUser user);
  Future<AppUser?> getUser();
  Future<void> clear();
}

/// In-memory session store (ideal for unit and widget testing).
class InMemoryAuthSessionStorage implements AuthSessionStorage {
  AppUser? _persistedUser;

  @override
  Future<void> saveUser(AppUser user) async {
    _persistedUser = user;
  }

  @override
  Future<AppUser?> getUser() async {
    return _persistedUser;
  }

  @override
  Future<void> clear() async {
    _persistedUser = null;
  }
}

/// Device-persistent session storage backed by Hive.
class HiveAuthSessionStorage implements AuthSessionStorage {
  static const String boxName = 'agritrade_auth_session';
  static const String _userKey = 'current_user_json';

  Future<Box<String>?> _openBoxSafe() async {
    try {
      if (Hive.isBoxOpen(boxName)) {
        return Hive.box<String>(boxName);
      }
      return await Hive.openBox<String>(boxName);
    } catch (_) {
      // In test environments without Hive initialization, return null.
      return null;
    }
  }

  @override
  Future<void> saveUser(AppUser user) async {
    final box = await _openBoxSafe();
    if (box != null) {
      await box.put(_userKey, jsonEncode(user.toMap()));
    }
  }

  @override
  Future<AppUser?> getUser() async {
    final box = await _openBoxSafe();
    if (box == null) return null;
    final jsonString = box.get(_userKey);
    if (jsonString == null || jsonString.isEmpty) return null;
    try {
      final map = jsonDecode(jsonString) as Map<String, dynamic>;
      return AppUser.fromMap(map);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<void> clear() async {
    final box = await _openBoxSafe();
    if (box != null) {
      await box.delete(_userKey);
    }
  }
}

/// Deterministic mock authentication repository for Stage 4A.
class MockAuthRepository implements AuthRepository {
  MockAuthRepository({
    AuthSessionStorage? sessionStorage,
    AppUser? initialUser,
  })  : _storage = sessionStorage ?? InMemoryAuthSessionStorage(),
        _currentUser = initialUser {
    _initDefaultAccounts();
  }

  final AuthSessionStorage _storage;
  AppUser? _currentUser;

  // Registered credentials in memory: normalized identifier -> (user, password)
  final Map<String, ({AppUser user, String password})> _accounts = {};

  void _initDefaultAccounts() {
    final defaultFarmer = AppUser(
      id: 'usr_farmer_01',
      name: 'Rahul Sharma',
      email: 'farmer@agritrade.in',
      phoneNumber: '+91 98765 43210',
      role: 'farmer',
      createdAt: DateTime(2026, 1, 15),
    );

    _accounts['farmer@agritrade.in'] = (user: defaultFarmer, password: 'farmer123');
    _accounts['9876543210'] = (user: defaultFarmer, password: 'farmer123');

    final defaultSeller = AppUser(
      id: 'usr_seller_01',
      name: 'Maharashtra Krishi Kendra',
      email: 'seller@agritrade.in',
      phoneNumber: '+91 98220 12345',
      role: 'seller',
      createdAt: DateTime(2026, 2, 1),
    );

    _accounts['seller@agritrade.in'] = (user: defaultSeller, password: 'seller123');
    _accounts['9822012345'] = (user: defaultSeller, password: 'seller123');

    final defaultCoopManager = AppUser(
      id: 'usr_coop_01',
      name: 'Suresh Patil',
      email: 'coop@agritrade.in',
      phoneNumber: '+91 98220 99887',
      role: 'cooperative_manager',
      createdAt: DateTime(2026, 2, 15),
    );

    _accounts['coop@agritrade.in'] = (user: defaultCoopManager, password: 'coop123');
    _accounts['9822099887'] = (user: defaultCoopManager, password: 'coop123');

    final defaultAdmin = AppUser(
      id: 'usr_admin_01',
      name: 'Platform Admin',
      email: 'admin@agritrade.in',
      phoneNumber: '+91 98000 11223',
      role: 'admin',
      createdAt: DateTime(2026, 1, 1),
    );

    _accounts['admin@agritrade.in'] = (user: defaultAdmin, password: 'admin123');
    _accounts['9800011223'] = (user: defaultAdmin, password: 'admin123');
  }

  @override
  AppUser? getCurrentUser() => _currentUser;

  @override
  Future<Result<AppUser?>> restoreSession() async {
    try {
      // Check storage
      final user = await _storage.getUser();
      if (user != null) {
        _currentUser = user;
        return Right(user);
      }
      return const Right(null);
    } catch (e) {
      return Left(AuthFailure('Failed to restore session: $e'));
    }
  }

  @override
  Future<Result<AppUser>> signIn({
    required String emailOrPhone,
    required String password,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 200));

    final normalized = emailOrPhone.trim().toLowerCase();
    if (normalized.isEmpty) {
      return const Left(AuthFailure('Please enter your email or mobile number.'));
    }
    if (password.isEmpty || password.length < 6) {
      return const Left(AuthFailure('Password must be at least 6 characters.'));
    }

    // Check registered accounts
    final account = _accounts[normalized];
    if (account != null) {
      if (account.password != password) {
        return const Left(AuthFailure('Incorrect password. Please try again.'));
      }
      _currentUser = account.user;
      await _storage.saveUser(_currentUser!);
      return Right(_currentUser!);
    }

    // For flexible demo testing: if valid email format and matching password, create session
    if (normalized.contains('@') || RegExp(r'^\d{10}$').hasMatch(normalized)) {
      final nameFromEmail = normalized.contains('@')
          ? normalized.split('@').first.replaceAll('.', ' ')
          : 'Agri Farmer';
      final formattedName = nameFromEmail.isNotEmpty
          ? '${nameFromEmail[0].toUpperCase()}${nameFromEmail.substring(1)}'
          : 'Farmer User';

      final newUser = AppUser(
        id: 'usr_${DateTime.now().millisecondsSinceEpoch}',
        name: formattedName,
        email: normalized.contains('@') ? normalized : '$normalized@agritrade.in',
        phoneNumber: !normalized.contains('@') ? normalized : null,
        role: 'farmer',
        createdAt: DateTime.now(),
      );

      _accounts[normalized] = (user: newUser, password: password);
      _currentUser = newUser;
      await _storage.saveUser(newUser);
      return Right(newUser);
    }

    return const Left(AuthFailure('No account found with this credential.'));
  }

  @override
  Future<Result<AppUser>> signUp({
    required String name,
    required String emailOrPhone,
    required String password,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 200));

    final trimmedName = name.trim();
    final normalized = emailOrPhone.trim().toLowerCase();

    if (trimmedName.isEmpty) {
      return const Left(AuthFailure('Please enter your full name.'));
    }
    if (normalized.isEmpty) {
      return const Left(AuthFailure('Please enter a valid email or phone number.'));
    }
    if (password.length < 6) {
      return const Left(AuthFailure('Password must be at least 6 characters long.'));
    }

    if (_accounts.containsKey(normalized)) {
      return const Left(AuthFailure('An account with this email/phone already exists.'));
    }

    final newUser = AppUser(
      id: 'usr_${DateTime.now().millisecondsSinceEpoch}',
      name: trimmedName,
      email: normalized.contains('@') ? normalized : '$normalized@agritrade.in',
      phoneNumber: !normalized.contains('@') ? normalized : null,
      role: 'farmer',
      createdAt: DateTime.now(),
    );

    _accounts[normalized] = (user: newUser, password: password);
    _currentUser = newUser;
    await _storage.saveUser(newUser);
    return Right(newUser);
  }

  @override
  Future<Result<void>> signOut() async {
    await Future<void>.delayed(const Duration(milliseconds: 100));
    _currentUser = null;
    await _storage.clear();
    return const Right(null);
  }
}
