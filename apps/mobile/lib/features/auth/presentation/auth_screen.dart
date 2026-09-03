import 'package:flutter/material.dart';
import 'welcome_screen.dart';

/// Legacy / convenience entry pointing to [WelcomeScreen].
class AuthScreen extends StatelessWidget {
  const AuthScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const WelcomeScreen();
  }
}
