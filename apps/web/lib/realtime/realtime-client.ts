// ============================================================
// REALTIME CLIENT
// Core abstraction over Supabase Realtime Channels with
// resilient fallback to simulated live market events
// ============================================================

import { getSupabaseClient } from '@/lib/supabase/client';
import { isBackendConfigured } from '@/lib/config/env';
import { connectionManager } from './connection-manager';
import type { RealtimeChannel } from '@supabase/supabase-js';

class RealtimeClient {
  private channels: Map<string, RealtimeChannel> = new Map();
  private mockIntervalTimer: NodeJS.Timeout | null = null;
  private isInitialized = false;

  public init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (isBackendConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        connectionManager.setConnecting();
        // Supabase client manages websocket connection
        client.channel('system_status').subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            connectionManager.setConnected();
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            connectionManager.scheduleReconnect();
          }
        });
      }
    } else {
      // In local/mock mode, mark as connected to provide high-fidelity interactive simulation
      connectionManager.setConnected();
    }
  }

  public getChannel(channelName: string): RealtimeChannel | null {
    const client = getSupabaseClient();
    if (!client) return null;

    if (!this.channels.has(channelName)) {
      const channel = client.channel(channelName);
      this.channels.set(channelName, channel);
    }

    return this.channels.get(channelName)!;
  }

  public removeChannel(channelName: string): void {
    const client = getSupabaseClient();
    const channel = this.channels.get(channelName);
    if (client && channel) {
      client.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  public registerMockTicker(callback: () => void, intervalMs = 12000): () => void {
    // Allows simulated live updates in offline/mock demo mode
    if (!this.mockIntervalTimer) {
      this.mockIntervalTimer = setInterval(() => {
        callback();
      }, intervalMs);
    }

    return () => {
      if (this.mockIntervalTimer) {
        clearInterval(this.mockIntervalTimer);
        this.mockIntervalTimer = null;
      }
    };
  }
}

export const realtimeClient = new RealtimeClient();
