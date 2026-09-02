import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('app_title'.tr()),
      ),
      body: Center(
        child: Text(
          'home_placeholder'.tr(),
          style: Theme.of(context).textTheme.titleMedium,
        ),
      ),
    );
  }
}
