import '../../../core/error/failure.dart';
import 'app_user.dart';

/// Abstract authentication repository contract.
///
/// Implementations (e.g. [MockAuthRepository], future [FirebaseAuthRepository])
/// must adhere to this interface without leaking implementation details.
abstract interface class AuthRepository {
  /// Signs in with email or mobile phone and password.
  Future<Result<AppUser>> signIn({
    required String emailOrPhone,
    required String password,
  });

  /// Creates a new user account with basic profile information.
  Future<Result<AppUser>> signUp({
    required String name,
    required String emailOrPhone,
    required String password,
  });

  /// Terminates the active session and clears persisted session tokens.
  Future<Result<void>> signOut();

  /// Restores session on application launch if valid credentials exist.
  Future<Result<AppUser?>> restoreSession();

  /// Returns the cached user synchronously if an active session exists.
  AppUser? getCurrentUser();
}
