import 'package:fpdart/fpdart.dart';

/// Base type for all domain/repository errors returned as [Either.left].
sealed class Failure {
  const Failure(this.message);

  final String message;

  @override
  String toString() => '$runtimeType: $message';
}

final class NetworkFailure extends Failure {
  const NetworkFailure([super.message = 'No internet connection.']);
}

final class ServerFailure extends Failure {
  const ServerFailure([super.message = 'Server error. Please try again.']);
}

final class AuthFailure extends Failure {
  const AuthFailure([super.message = 'Authentication failed.']);
}

final class NotFoundFailure extends Failure {
  const NotFoundFailure([super.message = 'Requested resource was not found.']);
}

final class UnknownFailure extends Failure {
  const UnknownFailure([super.message = 'Something went wrong.']);
}

/// Convenience alias used by every repository method.
typedef Result<T> = Either<Failure, T>;
