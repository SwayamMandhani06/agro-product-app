import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/design_system/app_colors.dart';
import '../../../core/design_system/app_radius.dart';
import '../../../core/design_system/app_spacing.dart';
import '../../../core/routing/routes.dart';
import 'providers/auth_providers.dart';

/// Splash & Session Restoration screen matching Google Stitch `6831455a4a284ef7b95f228fd20fbb27`.
class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  Timer? _sessionTimer;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat();

    // Trigger session restoration
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _checkSession();
    });
  }

  void _safeGo(String route) {
    if (!mounted) return;
    try {
      context.go(route);
    } catch (_) {
      // Safe fallback when running in tests without an ambient GoRouter
    }
  }

  void _checkSession() {
    _sessionTimer = Timer(const Duration(milliseconds: 600), () {
      final authState = ref.read(authStateProvider);
      if (authState is Authenticated) {
        _safeGo(AppRoutes.home);
      } else {
        _safeGo(AppRoutes.welcome);
      }
    });
  }

  @override
  void dispose() {
    _sessionTimer?.cancel();
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Listen for auth state transitions if session restoration finishes while on splash
    ref.listen<AuthState>(authStateProvider, (prev, next) {
      if (next is Authenticated) {
        _safeGo(AppRoutes.home);
      } else if (next is Unauthenticated) {
        _safeGo(AppRoutes.welcome);
      }
    });

    return Scaffold(
      backgroundColor: AppColors.stitchForestGreen,
      body: Stack(
        children: [
          // Subtle radial glow overlay
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment.topCenter,
                  radius: 1.2,
                  colors: [
                    Colors.white.withValues(alpha: 0.08),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          // Central Branding Content
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Logo Container with drop shadow
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(AppRadius.xl),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.25),
                          blurRadius: 24,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.eco_rounded,
                        size: 56,
                        color: AppColors.stitchForestGreen,
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // Display Title
                  const Text(
                    'AgriTrade',
                    style: TextStyle(
                      fontSize: 36,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xs),

                  // Subtitle
                  Text(
                    'Modern Agricultural Commerce',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: Colors.white.withValues(alpha: 0.8),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Bottom Pulsing Dots & Status Indicator
          Positioned(
            left: 0,
            right: 0,
            bottom: AppSpacing.xxl,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                AnimatedBuilder(
                  animation: _animController,
                  builder: (context, _) {
                    return Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(3, (index) {
                        final delay = index * 0.2;
                        final val = (_animController.value - delay) % 1.0;
                        final scale = 0.5 + 0.5 * (val < 0.5 ? val * 2 : (1.0 - val) * 2);
                        final opacity = 0.3 + 0.7 * (val < 0.5 ? val * 2 : (1.0 - val) * 2);

                        return Container(
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          width: 10,
                          height: 10,
                          transform: Matrix4.diagonal3Values(scale, scale, 1.0),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.brand100.withValues(alpha: opacity),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.brand100.withValues(alpha: 0.4),
                                blurRadius: 8,
                              ),
                            ],
                          ),
                        );
                      }),
                    );
                  },
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(
                  'INITIALIZING',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 2.0,
                    color: Colors.white.withValues(alpha: 0.5),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
