enum RealtimeConnectionState {
  connected,
  connecting,
  reconnecting,
  offline,
  error;

  bool get isConnected => this == RealtimeConnectionState.connected;
  bool get isOffline => this == RealtimeConnectionState.offline;
  bool get isReconnecting => this == RealtimeConnectionState.reconnecting;

  String get label => switch (this) {
        RealtimeConnectionState.connected => 'Live',
        RealtimeConnectionState.connecting => 'Connecting...',
        RealtimeConnectionState.reconnecting => 'Reconnecting...',
        RealtimeConnectionState.offline => 'Offline',
        RealtimeConnectionState.error => 'Connection Error',
      };
}
