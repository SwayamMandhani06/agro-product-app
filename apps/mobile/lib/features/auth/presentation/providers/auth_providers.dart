import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/mock_auth_repository.dart';
import '../../domain/app_user.dart';
import '../../domain/auth_repository.dart';

/// Sealed hierarchy representing authentication states.
sealed class AuthState {
  const AuthState();
}

/// Initializing / checking persisted session on app launch.
final class AuthInitializing extends AuthState {
  const AuthInitializing();
}

/// Authenticated state with active user entity.
final class Authenticated extends AuthState {
  const Authenticated(this.user);
  final AppUser user;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Authenticated && runtimeType == other.runtimeType && user == other.user;

  @override
  int get hashCode => user.hashCode;
}

/// Unauthenticated state (no active session).
final class Unauthenticated extends AuthState {
  const Unauthenticated();
}

/// Transient loading state during sign in / sign up / sign out.
final class AuthLoading extends AuthState {
  const AuthLoading();
}

/// Authentication error state with descriptive failure message.
final class AuthError extends AuthState {
  const AuthError(this.message);
  final String message;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AuthError && runtimeType == other.runtimeType && message == other.message;

  @override
  int get hashCode => message.hashCode;
}

/// Provider for the abstract [AuthRepository].
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return MockAuthRepository(sessionStorage: HiveAuthSessionStorage());
});

/// StateNotifier managing [AuthState].
class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._repository) : super(const AuthInitializing()) {
    restoreSession();
  }

  final AuthRepository _repository;

  /// Restores session from persistence.
  Future<void> restoreSession() async {
    state = const AuthInitializing();
    final result = await _repository.restoreSession();
    result.fold(
      (failure) => state = const Unauthenticated(),
      (user) {
        if (user != null) {
          state = Authenticated(user);
        } else {
          state = const Unauthenticated();
        }
      },
    );
  }

  /// Signs in with credentials. Returns true on success.
  Future<bool> signIn({
    required String emailOrPhone,
    required String password,
  }) async {
    state = const AuthLoading();
    final result = await _repository.signIn(
      emailOrPhone: emailOrPhone,
      password: password,
    );
    return result.fold(
      (failure) {
        state = AuthError(failure.message);
        return false;
      },
      (user) {
        state = Authenticated(user);
        return true;
      },
    );
  }

  /// Registers a new account. Returns true on success.
  Future<bool> signUp({
    required String name,
    required String emailOrPhone,
    required String password,
  }) async {
    state = const AuthLoading();
    final result = await _repository.signUp(
      name: name,
      emailOrPhone: emailOrPhone,
      password: password,
    );
    return result.fold(
      (failure) {
        state = AuthError(failure.message);
        return false;
      },
      (user) {
        state = Authenticated(user);
        return true;
      },
    );
  }

  /// Terminates the current session.
  Future<void> signOut() async {
    state = const AuthLoading();
    await _repository.signOut();
    state = const Unauthenticated();
  }

  /// Clears any transient error state back to unauthenticated.
  void clearError() {
    if (state is AuthError) {
      state = const Unauthenticated();
    }
  }
}

/// Provider for [AuthNotifier].
final authNotifierProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final repo = ref.watch(authRepositoryProvider);
  return AuthNotifier(repo);
});

/// Read-only stream/provider for current [AuthState].
final authStateProvider = Provider<AuthState>((ref) {
  return ref.watch(authNotifierProvider);
});

/// Convenience provider for current [AppUser] if authenticated.
final currentUserProvider = Provider<AppUser?>((ref) {
  final state = ref.watch(authNotifierProvider);
  if (state is Authenticated) {
    return state.user;
  }
  return null;
});

/// Helper provider checking if session is active.
final isAuthenticatedProvider = Provider<bool>((ref) {
  return ref.watch(authNotifierProvider) is Authenticated;
});

/// Helper provider checking if initial session check is ongoing.
final isAuthInitializingProvider = Provider<bool>((ref) {
  return ref.watch(authNotifierProvider) is AuthInitializing;
});
