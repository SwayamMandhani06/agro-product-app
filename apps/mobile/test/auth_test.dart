import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:agro_product_app/core/routing/app_router.dart';
import 'package:agro_product_app/features/auth/data/mock_auth_repository.dart';
import 'package:agro_product_app/features/auth/domain/app_user.dart';
import 'package:agro_product_app/features/auth/presentation/providers/auth_providers.dart';
import 'package:agro_product_app/features/auth/presentation/sign_in_screen.dart';
import 'package:agro_product_app/features/auth/presentation/sign_up_screen.dart';
import 'package:agro_product_app/features/auth/presentation/splash_screen.dart';
import 'package:agro_product_app/features/auth/presentation/welcome_screen.dart';
import 'package:agro_product_app/features/home/presentation/home_screen.dart';
import 'package:agro_product_app/features/profile/presentation/profile_screen.dart';

AppUser _createSampleUser({
  String id = 'usr_test_1',
  String name = 'Rahul Sharma',
  String email = 'farmer@agritrade.in',
  String? phoneNumber = '+91 98765 43210',
  String role = 'farmer',
}) {
  return AppUser(
    id: id,
    name: name,
    email: email,
    phoneNumber: phoneNumber,
    role: role,
    createdAt: DateTime(2026, 1, 1),
  );
}

void main() {
  group('AppUser Domain Entity Tests', () {
    test('AppUser creates, supports value equality, copyWith, and serialization', () {
      final user1 = _createSampleUser();
      final user2 = _createSampleUser();
      final user3 = _createSampleUser(id: 'usr_different', email: 'other@agritrade.in');

      expect(user1, equals(user2));
      expect(user1 == user3, isFalse);
      expect(user1.hashCode, equals(user2.hashCode));

      final updated = user1.copyWith(name: 'Rahul P. Sharma', phoneNumber: '+91 99999 88888');
      expect(updated.name, 'Rahul P. Sharma');
      expect(updated.phoneNumber, '+91 99999 88888');
      expect(updated.email, user1.email);

      // Serialization
      final map = user1.toMap();
      final fromMap = AppUser.fromMap(map);
      expect(fromMap.id, user1.id);
      expect(fromMap.name, user1.name);
      expect(fromMap.email, user1.email);
      expect(fromMap.phoneNumber, user1.phoneNumber);
      expect(fromMap.role, user1.role);
    });
  });

  group('MockAuthRepository Tests', () {
    test('Initial repository has no active user and restoreSession returns null by default', () async {
      final storage = InMemoryAuthSessionStorage();
      final repo = MockAuthRepository(sessionStorage: storage);

      expect(repo.getCurrentUser(), isNull);
      final sessionResult = await repo.restoreSession();
      expect(sessionResult.isRight(), isTrue);
      expect(sessionResult.getOrElse((_) => throw Exception()), isNull);
    });

    test('signIn succeeds with default demo credentials and populates currentUser', () async {
      final storage = InMemoryAuthSessionStorage();
      final repo = MockAuthRepository(sessionStorage: storage);

      final result = await repo.signIn(
        emailOrPhone: 'farmer@agritrade.in',
        password: 'farmer123',
      );

      expect(result.isRight(), isTrue);
      final user = result.getOrElse((_) => throw Exception());
      expect(user.email, 'farmer@agritrade.in');
      expect(repo.getCurrentUser(), equals(user));

      // Persisted in storage
      final storedUser = await storage.getUser();
      expect(storedUser, equals(user));
    });

    test('signIn succeeds with mobile number identifier', () async {
      final repo = MockAuthRepository(sessionStorage: InMemoryAuthSessionStorage());

      final result = await repo.signIn(
        emailOrPhone: '9876543210',
        password: 'farmer123',
      );

      expect(result.isRight(), isTrue);
      expect(result.getOrElse((_) => throw Exception()).id, 'usr_farmer_01');
    });

    test('signIn fails with invalid password or empty identifier', () async {
      final repo = MockAuthRepository(sessionStorage: InMemoryAuthSessionStorage());

      final badPass = await repo.signIn(
        emailOrPhone: 'farmer@agritrade.in',
        password: 'wrong_password',
      );
      expect(badPass.isLeft(), isTrue);

      final emptyId = await repo.signIn(
        emailOrPhone: '',
        password: 'farmer123',
      );
      expect(emptyId.isLeft(), isTrue);
    });

    test('signUp creates account, establishes session, and allows subsequent sign-in', () async {
      final storage = InMemoryAuthSessionStorage();
      final repo = MockAuthRepository(sessionStorage: storage);

      final signUpResult = await repo.signUp(
        name: 'Suresh Patel',
        emailOrPhone: 'suresh@farm.in',
        password: 'secretPassword123',
      );

      expect(signUpResult.isRight(), isTrue);
      final user = signUpResult.getOrElse((_) => throw Exception());
      expect(user.name, 'Suresh Patel');
      expect(user.email, 'suresh@farm.in');
      expect(repo.getCurrentUser(), equals(user));

      // Duplicate sign up fails
      final duplicateResult = await repo.signUp(
        name: 'Another Suresh',
        emailOrPhone: 'suresh@farm.in',
        password: 'anotherPassword',
      );
      expect(duplicateResult.isLeft(), isTrue);

      // Sign out and sign back in with newly created account
      await repo.signOut();
      expect(repo.getCurrentUser(), isNull);

      final signInResult = await repo.signIn(
        emailOrPhone: 'suresh@farm.in',
        password: 'secretPassword123',
      );
      expect(signInResult.isRight(), isTrue);
      expect(signInResult.getOrElse((_) => throw Exception()).name, 'Suresh Patel');
    });

    test('restoreSession recovers persisted session on restart', () async {
      final storage = InMemoryAuthSessionStorage();
      final sampleUser = _createSampleUser();
      await storage.saveUser(sampleUser);

      // New repository instance mimicking application restart
      final newRepo = MockAuthRepository(sessionStorage: storage);
      expect(newRepo.getCurrentUser(), isNull);

      final restoredResult = await newRepo.restoreSession();
      expect(restoredResult.isRight(), isTrue);
      expect(restoredResult.getOrElse((_) => throw Exception()), equals(sampleUser));
      expect(newRepo.getCurrentUser(), equals(sampleUser));
    });

    test('signOut clears active user and deletes persisted session', () async {
      final storage = InMemoryAuthSessionStorage();
      final repo = MockAuthRepository(sessionStorage: storage);

      await repo.signIn(emailOrPhone: 'farmer@agritrade.in', password: 'farmer123');
      expect(repo.getCurrentUser(), isNotNull);
      expect(await storage.getUser(), isNotNull);

      final signOutResult = await repo.signOut();
      expect(signOutResult.isRight(), isTrue);
      expect(repo.getCurrentUser(), isNull);
      expect(await storage.getUser(), isNull);

      final restoreAfterSignOut = await repo.restoreSession();
      expect(restoreAfterSignOut.getOrElse((_) => throw Exception()), isNull);
    });
  });

  group('Auth Providers & Notifier Tests', () {
    test('AuthNotifier initializes, restores session, and updates state reactively', () async {
      final sampleUser = _createSampleUser();
      final storage = InMemoryAuthSessionStorage();
      await storage.saveUser(sampleUser);

      final repo = MockAuthRepository(sessionStorage: storage);
      final container = ProviderContainer(
        overrides: [
          authRepositoryProvider.overrideWithValue(repo),
        ],
      );
      addTearDown(container.dispose);

      // Initially restoring
      expect(container.read(isAuthInitializingProvider), isTrue);

      // Wait for session check
      await container.read(authNotifierProvider.notifier).restoreSession();

      expect(container.read(authStateProvider), equals(Authenticated(sampleUser)));
      expect(container.read(isAuthenticatedProvider), isTrue);
      expect(container.read(currentUserProvider), equals(sampleUser));

      // Sign out
      await container.read(authNotifierProvider.notifier).signOut();
      expect(container.read(authStateProvider), equals(const Unauthenticated()));
      expect(container.read(isAuthenticatedProvider), isFalse);
      expect(container.read(currentUserProvider), isNull);
    });

    test('AuthNotifier signIn updates state to Authenticated on success or AuthError on failure', () async {
      final repo = MockAuthRepository(sessionStorage: InMemoryAuthSessionStorage());
      final container = ProviderContainer(
        overrides: [
          authRepositoryProvider.overrideWithValue(repo),
        ],
      );
      addTearDown(container.dispose);

      // Failed login
      final failed = await container.read(authNotifierProvider.notifier).signIn(
            emailOrPhone: 'farmer@agritrade.in',
            password: 'wrong',
          );
      expect(failed, isFalse);
      expect(container.read(authStateProvider), isA<AuthError>());

      // Clear error
      container.read(authNotifierProvider.notifier).clearError();
      expect(container.read(authStateProvider), equals(const Unauthenticated()));

      // Successful login
      final success = await container.read(authNotifierProvider.notifier).signIn(
            emailOrPhone: 'farmer@agritrade.in',
            password: 'farmer123',
          );
      expect(success, isTrue);
      expect(container.read(authStateProvider), isA<Authenticated>());
    });
  });

  group('Authentication Presentation Widget Tests', () {
    testWidgets('SplashScreen renders branding and pulsing dots', (tester) async {
      final repo = MockAuthRepository(sessionStorage: InMemoryAuthSessionStorage());
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            authRepositoryProvider.overrideWithValue(repo),
          ],
          child: const MaterialApp(
            home: SplashScreen(),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.text('AgriTrade'), findsOneWidget);
      expect(find.text('Modern Agricultural Commerce'), findsOneWidget);
      expect(find.text('INITIALIZING'), findsOneWidget);
      expect(find.byIcon(Icons.eco_rounded), findsOneWidget);
    });

    testWidgets('WelcomeScreen renders logo, value propositions, and navigation buttons', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: WelcomeScreen(),
        ),
      );

      expect(find.text('AgriTrade'), findsOneWidget);
      expect(find.text('Smarter farming. Better decisions.'), findsOneWidget);
      expect(find.text('Certified Farm Inputs'), findsOneWidget);
      expect(find.text('Transparent Pricing'), findsOneWidget);
      expect(find.text('Doorstep Farm Delivery'), findsOneWidget);
      expect(find.text('Sign In'), findsOneWidget);
      expect(find.text('Create Account'), findsOneWidget);
    });

    testWidgets('SignInScreen validates empty fields and supports quick demo fill', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      final repo = MockAuthRepository(sessionStorage: InMemoryAuthSessionStorage());
      final container = ProviderContainer(
        overrides: [
          authRepositoryProvider.overrideWithValue(repo),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const MaterialApp(
            home: SignInScreen(),
          ),
        ),
      );

      expect(find.text('Welcome to AgriTrade'), findsOneWidget);
      expect(find.text('Mobile Number or Email'), findsOneWidget);
      expect(find.text('Password'), findsOneWidget);

      // Tap Sign In without filling
      await tester.tap(find.widgetWithText(ElevatedButton, 'Sign In'));
      await tester.pumpAndSettle();

      expect(find.text('Please enter your email or mobile number.'), findsOneWidget);

      // Tap quick fill demo
      await tester.tap(find.textContaining('Tap to use demo farmer account'));
      await tester.pumpAndSettle();

      expect(find.text('farmer@agritrade.in'), findsOneWidget);
    });

    testWidgets('SignUpScreen validates password match and creates account', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      final repo = MockAuthRepository(sessionStorage: InMemoryAuthSessionStorage());
      final container = ProviderContainer(
        overrides: [
          authRepositoryProvider.overrideWithValue(repo),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const MaterialApp(
            home: SignUpScreen(),
          ),
        ),
      );

      expect(find.text('Create Your Account'), findsOneWidget);
      expect(find.text('Full Name'), findsOneWidget);

      // Tap Create Account when empty
      await tester.tap(find.widgetWithText(ElevatedButton, 'Create Account'));
      await tester.pumpAndSettle();

      expect(find.text('Please enter your full name.'), findsOneWidget);
    });

    testWidgets('ProfileScreen renders authenticated user info and triggers Sign Out', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      final sampleUser = _createSampleUser();
      final storage = InMemoryAuthSessionStorage();
      await storage.saveUser(sampleUser);
      final repo = MockAuthRepository(sessionStorage: storage, initialUser: sampleUser);

      final container = ProviderContainer(
        overrides: [
          authRepositoryProvider.overrideWithValue(repo),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const MaterialApp(
            home: ProfileScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('My Profile'), findsOneWidget);
      expect(find.text('Rahul Sharma'), findsOneWidget);
      expect(find.text('farmer@agritrade.in'), findsOneWidget);
      expect(find.text('FARMER • VERIFIED'), findsOneWidget);
      expect(find.text('Sign Out'), findsOneWidget);

      // Tap Sign Out to show dialog
      await tester.tap(find.text('Sign Out'));
      await tester.pumpAndSettle();

      expect(find.text('Are you sure you want to sign out of AgriTrade?'), findsOneWidget);

      // Confirm Sign Out
      await tester.tap(find.widgetWithText(TextButton, 'Sign Out'));
      await tester.pumpAndSettle();

      expect(container.read(isAuthenticatedProvider), isFalse);
      expect(container.read(currentUserProvider), isNull);
    });
  });

  group('Router Authentication Protection Tests', () {
    testWidgets('Unauthenticated user attempting to access home redirects to /welcome', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      final emptyRepo = MockAuthRepository(sessionStorage: InMemoryAuthSessionStorage());

      final container = ProviderContainer(
        overrides: [
          authRepositoryProvider.overrideWithValue(emptyRepo),
        ],
      );
      addTearDown(container.dispose);

      // Complete session check
      await container.read(authNotifierProvider.notifier).restoreSession();

      final router = container.read(goRouterProvider);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: MaterialApp.router(
            routerConfig: router,
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Should be redirected to Welcome
      expect(find.text('Welcome to AgriTrade'), findsNothing); // that's sign-in
      expect(find.text('Certified Farm Inputs'), findsOneWidget); // that's welcome
    });

    testWidgets('Authenticated user accessing app is directed to home screen', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      final sampleUser = _createSampleUser();
      final storage = InMemoryAuthSessionStorage();
      await storage.saveUser(sampleUser);
      final repo = MockAuthRepository(sessionStorage: storage, initialUser: sampleUser);

      final container = ProviderContainer(
        overrides: [
          authRepositoryProvider.overrideWithValue(repo),
        ],
      );
      addTearDown(container.dispose);

      // Complete session check
      await container.read(authNotifierProvider.notifier).restoreSession();

      final router = container.read(goRouterProvider);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: MaterialApp.router(
            routerConfig: router,
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Authenticated user should see home
      expect(find.byType(HomeScreen), findsOneWidget);
      expect(find.text('Sign In'), findsNothing);
    });
  });
}
