import 'dart:async';
import 'dart:math';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'realtime_connection_state.dart';
import 'subscriptions/mandi_subscription.dart';
import 'subscriptions/notification_subscription.dart';
import 'subscriptions/order_subscription.dart';
import '../../features/cart_checkout/domain/order.dart';
import '../../features/notifications/domain/notification_item.dart';

class RealtimeService {
  RealtimeService({
    Connectivity? connectivity,
    bool enableSimulation = true,
    bool listenConnectivity = true,
  })  : _connectivity = connectivity ?? Connectivity(),
        _enableSimulation = enableSimulation,
        _listenConnectivity = listenConnectivity {
    _init();
  }

  final Connectivity _connectivity;
  final bool _enableSimulation;
  final bool _listenConnectivity;

  RealtimeConnectionState _state = RealtimeConnectionState.connected;
  final _stateController = StreamController<RealtimeConnectionState>.broadcast();
  StreamSubscription<List<ConnectivityResult>>? _connectivitySub;
  Timer? _simulationTimer;
  final _random = Random();

  RealtimeConnectionState get currentState => _state;
  Stream<RealtimeConnectionState> get connectionStateStream => _stateController.stream;

  void _init() {
    if (_listenConnectivity) {
      _connectivitySub = _connectivity.onConnectivityChanged.listen((results) {
        if (results.contains(ConnectivityResult.none) && results.length == 1) {
          _updateState(RealtimeConnectionState.offline);
        } else {
          if (_state == RealtimeConnectionState.offline) {
            _updateState(RealtimeConnectionState.reconnecting);
            Future.delayed(const Duration(milliseconds: 600), () {
              _updateState(RealtimeConnectionState.connected);
            });
          }
        }
      });
    }

    if (_enableSimulation) {
      _startSimulation();
    }
  }

  void _updateState(RealtimeConnectionState newState) {
    if (_state != newState) {
      _state = newState;
      if (!_stateController.isClosed) {
        _stateController.add(_state);
      }
    }
  }

  /// Manually force a connection state (useful for tests or demo modes).
  void setConnectionState(RealtimeConnectionState newState) {
    _updateState(newState);
  }

  void _startSimulation() {
    _simulationTimer?.cancel();
    _simulationTimer = Timer.periodic(const Duration(seconds: 14), (timer) {
      if (_state != RealtimeConnectionState.connected) return;

      // Simulate a small market price movement
      final commodities = [
        {'crop': 'Soybean', 'market': 'Indore APMC', 'base': 4320.0},
        {'crop': 'Cotton', 'market': 'Rajkot APMC', 'base': 7100.0},
        {'crop': 'Wheat', 'market': 'Khandwa APMC', 'base': 2850.0},
        {'crop': 'Onion', 'market': 'Lasalgaon APMC', 'base': 2400.0},
      ];

      final target = commodities[_random.nextInt(commodities.length)];
      final delta = (_random.nextInt(25) - 10).toDouble();
      final newPrice = (target['base'] as double) + delta;
      final isUp = delta >= 0;

      MandiSubscription.instance.emit(
        MandiPriceTick(
          commodity: target['crop'] as String,
          market: target['market'] as String,
          newPrice: newPrice,
          trend: isUp ? 'up' : 'down',
          trendDiff: '${isUp ? "+" : ""}₹${delta.abs().toInt()}',
          timestamp: DateTime.now(),
        ),
      );
    });
  }

  /// Emit simulated order progression
  void simulateOrderStep(String orderId, OrderStatus nextStatus) {
    OrderSubscription.instance.emit(
      OrderStatusUpdate(
        orderId: orderId,
        status: nextStatus,
        timestamp: DateTime.now(),
        estimatedDelivery: 'Tomorrow, 2:30 PM',
        agentName: 'Ramesh Singh',
        agentPhone: '+91 98231 44521',
      ),
    );

    // Also trigger notification
    NotificationSubscription.instance.emit(
      NotificationItem(
        id: 'notif_${DateTime.now().millisecondsSinceEpoch}',
        title: 'Order Status Update: #${orderId.substring(0, min(8, orderId.length))}',
        message: 'Your consignment has transitioned to ${nextStatus.displayName}. Track live.',
        type: 'order',
        createdAt: DateTime.now(),
      ),
    );
  }

  void dispose() {
    _simulationTimer?.cancel();
    _connectivitySub?.cancel();
    _stateController.close();
  }
}

/// Global Realtime Service Provider
final realtimeServiceProvider = Provider<RealtimeService>((ref) {
  final service = RealtimeService(enableSimulation: true);
  ref.onDispose(() => service.dispose());
  return service;
});

/// Reactive Connection State Provider
final realtimeConnectionStateProvider = StreamProvider<RealtimeConnectionState>((ref) {
  final service = ref.watch(realtimeServiceProvider);
  return service.connectionStateStream;
});
