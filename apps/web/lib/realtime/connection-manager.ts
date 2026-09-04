// ============================================================
// REALTIME CONNECTION MANAGER
// Manages explicit connection lifecycle states across Web
// ============================================================

export type ConnectionState = 'connected' | 'connecting' | 'reconnecting' | 'offline' | 'error';

type StateListener = (state: ConnectionState, previousState: ConnectionState) => void;

class ConnectionManager {
  private currentState: ConnectionState = 'connecting';
  private listeners: Set<StateListener> = new Set();
  private lastConnectedAt: Date | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 8;
  private backoffBaseMs = 1000;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.currentState = navigator.onLine ? 'connecting' : 'offline';

      window.addEventListener('online', () => {
        this.handleNetworkOnline();
      });

      window.addEventListener('offline', () => {
        this.handleNetworkOffline();
      });
    }
  }

  public getState(): ConnectionState {
    return this.currentState;
  }

  public getLastConnectedAt(): Date | null {
    return this.lastConnectedAt;
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    // Immediately emit current state to new subscriber
    listener(this.currentState, this.currentState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setConnected(): void {
    const prev = this.currentState;
    this.currentState = 'connected';
    this.lastConnectedAt = new Date();
    this.reconnectAttempts = 0;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.notify(prev);
  }

  public setConnecting(): void {
    const prev = this.currentState;
    this.currentState = 'connecting';
    this.notify(prev);
  }

  public setReconnecting(): void {
    const prev = this.currentState;
    this.currentState = 'reconnecting';
    this.reconnectAttempts++;
    this.notify(prev);
  }

  public setOffline(): void {
    const prev = this.currentState;
    this.currentState = 'offline';
    this.notify(prev);
  }

  public setError(): void {
    const prev = this.currentState;
    this.currentState = 'error';
    this.notify(prev);
  }

  private handleNetworkOnline(): void {
    this.setConnecting();
    this.scheduleReconnect(100);
  }

  private handleNetworkOffline(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.setOffline();
  }

  public scheduleReconnect(delayMs?: number): void {
    if (this.reconnectTimer) return;

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.setError();
      return;
    }

    const delay =
      delayMs ??
      Math.min(
        this.backoffBaseMs * Math.pow(1.5, this.reconnectAttempts) + Math.random() * 500,
        30000
      );

    this.setReconnecting();
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      // Triggers reconnection attempt
    }, delay);
  }

  private notify(previousState: ConnectionState): void {
    if (this.currentState === previousState) return;
    for (const listener of this.listeners) {
      try {
        listener(this.currentState, previousState);
      } catch (err) {
        console.error('Connection listener error:', err);
      }
    }
  }
}

export const connectionManager = new ConnectionManager();
