import 'package:flutter/foundation.dart';

/// Immutable representation of an authenticated user in AgriTrade.
@immutable
class AppUser {
  const AppUser({
    required this.id,
    required this.name,
    required this.email,
    this.phoneNumber,
    this.role = 'farmer',
    required this.createdAt,
  });

  final String id;
  final String name;
  final String email;
  final String? phoneNumber;
  final String role;
  final DateTime createdAt;

  AppUser copyWith({
    String? id,
    String? name,
    String? email,
    String? phoneNumber,
    String? role,
    DateTime? createdAt,
  }) {
    return AppUser(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      role: role ?? this.role,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phoneNumber': phoneNumber,
      'role': role,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory AppUser.fromMap(Map<String, dynamic> map) {
    return AppUser(
      id: map['id'] as String? ?? '',
      name: map['name'] as String? ?? '',
      email: map['email'] as String? ?? '',
      phoneNumber: map['phoneNumber'] as String?,
      role: map['role'] as String? ?? 'farmer',
      createdAt: map['createdAt'] != null
          ? DateTime.tryParse(map['createdAt'] as String) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AppUser &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name &&
          email == other.email &&
          phoneNumber == other.phoneNumber &&
          role == other.role;

  @override
  int get hashCode =>
      id.hashCode ^
      name.hashCode ^
      email.hashCode ^
      phoneNumber.hashCode ^
      role.hashCode;

  @override
  String toString() =>
      'AppUser(id: $id, name: $name, email: $email, role: $role)';
}
