import 'package:dio/dio.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'failure.dart';

Failure mapExceptionToFailure(Object error, [StackTrace? stackTrace]) {
  return switch (error) {
  DioException(:final type) => switch (type) {
      DioExceptionType.connectionTimeout ||
      DioExceptionType.sendTimeout ||
      DioExceptionType.receiveTimeout ||
      DioExceptionType.connectionError =>
        const NetworkFailure('Connection timed out.'),
      DioExceptionType.badResponse => ServerFailure(
          'Server responded with status ${error.response?.statusCode}.',
        ),
      _ => const NetworkFailure(),
    },
  FirebaseAuthException(:final code) => AuthFailure(_authMessage(code)),
  FirebaseException(:final code) => switch (code) {
      'permission-denied' => const AuthFailure('Permission denied.'),
      'not-found' => const NotFoundFailure(),
      _ => ServerFailure('Firebase error: $code'),
    },
  FormatException() => const UnknownFailure('Invalid data format.'),
  _ => UnknownFailure(error.toString()),
  };
}

String _authMessage(String code) => switch (code) {
      'user-not-found' => 'No account found with this email.',
      'wrong-password' => 'Incorrect password.',
      'email-already-in-use' => 'An account already exists for this email.',
      'invalid-email' => 'Invalid email address.',
      'user-disabled' => 'This account has been disabled.',
      'too-many-requests' => 'Too many attempts. Try again later.',
      _ => 'Authentication error: $code',
    };
