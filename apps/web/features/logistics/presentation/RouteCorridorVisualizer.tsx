// ============================================================
// ROUTE CORRIDOR VISUALIZER (SVG)
// Clean topological delivery corridor visualization
// Visual storytelling without paid maps API, cartoon trucks, or emojis
// ============================================================

'use client';

import React from 'react';
import type { Shipment, ShipmentStatus } from '../domain/shipment';
import { Warehouse, Building2, Truck, Home, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RouteCorridorVisualizerProps {
  shipment: Shipment;
  compact?: boolean;
}

interface CorridorNode {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  activeStatuses: ShipmentStatus[];
  completedStatuses: ShipmentStatus[];
}

const CORRIDOR_NODES: CorridorNode[] = [
  {
    key: 'origin',
    title: 'Central Warehouse',
    subtitle: 'Pune Fulfillment',
    icon: Warehouse,
    activeStatuses: ['created', 'pickupScheduled', 'pickedUp'],
    completedStatuses: [
      'processing',
      'inTransit',
      'atRegionalHub',
      'outForDelivery',
      'deliveryAttempted',
      'delivered',
    ],
  },
  {
    key: 'hub',
    title: 'Regional Hub',
    subtitle: 'Hadapsar Sorting',
    icon: Building2,
    activeStatuses: ['processing', 'inTransit', 'atRegionalHub'],
    completedStatuses: ['outForDelivery', 'deliveryAttempted', 'delivered'],
  },
  {
    key: 'distribution',
    title: 'Rural Distribution',
    subtitle: 'Local Feeder Outpost',
    icon: Truck,
    activeStatuses: ['outForDelivery', 'deliveryAttempted'],
    completedStatuses: ['delivered'],
  },
  {
    key: 'destination',
    title: 'Farm Gate',
    subtitle: 'Recipient Address',
    icon: Home,
    activeStatuses: ['delivered'],
    completedStatuses: [],
  },
];

export const RouteCorridorVisualizer: React.FC<RouteCorridorVisualizerProps> = ({
  shipment,
  compact = false,
}) => {
  const isCancelled = shipment.status === 'cancelled' || shipment.status === 'returned';
  const isAttempted = shipment.status === 'deliveryAttempted';

  // Calculate current node index (0..3)
  const getNodeState = (node: CorridorNode) => {
    if (isCancelled) return 'inactive';
    if (node.activeStatuses.includes(shipment.status)) return 'active';
    if (node.completedStatuses.includes(shipment.status)) return 'completed';
    return 'pending';
  };

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        padding: compact ? '16px' : '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header corridor info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: compact ? 16 : 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              color: 'var(--color-text-tertiary)',
            }}
          >
            Rural Delivery Corridor
          </span>
          <h3
            style={{
              margin: '2px 0 0',
              fontSize: compact ? 14 : 16,
              fontWeight: 700,
              color: 'var(--color-forest)',
            }}
          >
            {shipment.serviceZone} · {shipment.distanceBand}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isAttempted ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                background: 'var(--color-warning-light)',
                color: 'var(--color-warning)',
              }}
            >
              <AlertTriangle size={14} /> Attempt Rescheduled
            </span>
          ) : shipment.status === 'delivered' ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                background: 'var(--color-success-light)',
                color: 'var(--color-success)',
              }}
            >
              <CheckCircle2 size={14} /> Delivered
            </span>
          ) : (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                background: 'var(--color-amber-50)',
                color: 'var(--color-amber-700)',
                border: '1px solid var(--color-amber-200)',
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--color-amber-600)',
                  boxShadow: '0 0 0 3px rgba(217, 119, 6, 0.25)',
                  animation: 'pulse 2s infinite',
                }}
              />
              Active In Transit
            </span>
          )}
        </div>
      </div>

      {/* SVG Corridor Track */}
      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          alignItems: 'center',
          gap: 8,
          padding: '10px 0',
        }}
      >
        {/* Connecting Line Track */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: '12.5%',
            right: '12.5%',
            height: 3,
            background: 'var(--color-neutral-200)',
            zIndex: 0,
          }}
        />

        {CORRIDOR_NODES.map((node) => {
          const state = getNodeState(node);
          const isCurrentActive = state === 'active';
          const isDone = state === 'completed';
          const Icon = node.icon;

          return (
            <div
              key={node.key}
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {/* Node Circle */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: isCurrentActive
                    ? 'var(--color-forest)'
                    : isDone
                    ? 'var(--color-forest)'
                    : 'var(--color-surface)',
                  border: `2.5px solid ${
                    isCurrentActive
                      ? 'var(--color-amber)'
                      : isDone
                      ? 'var(--color-forest)'
                      : 'var(--color-neutral-300)'
                  }`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCurrentActive || isDone ? '#ffffff' : 'var(--color-text-tertiary)',
                  boxShadow: isCurrentActive
                    ? '0 0 0 5px rgba(217, 119, 6, 0.2), 0 4px 10px rgba(0, 0, 0, 0.08)'
                    : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  marginBottom: 10,
                }}
              >
                <Icon size={20} strokeWidth={isCurrentActive ? 2.5 : 2} />
              </div>

              {/* Node Labels */}
              <p
                style={{
                  margin: '0 0 2px',
                  fontSize: compact ? 12 : 13,
                  fontWeight: isCurrentActive ? 800 : isDone ? 700 : 500,
                  color: isCurrentActive
                    ? 'var(--color-forest)'
                    : isDone
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-tertiary)',
                }}
              >
                {node.title}
              </p>
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--color-text-tertiary)',
                  display: compact ? 'none' : 'block',
                  maxWidth: 120,
                  lineHeight: 1.3,
                }}
              >
                {node.subtitle}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current location banner */}
      <div
        style={{
          marginTop: compact ? 12 : 20,
          padding: '10px 14px',
          background: 'var(--color-canvas)',
          borderRadius: 8,
          border: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
        }}
      >
        <span style={{ color: 'var(--color-text-secondary)' }}>
          Current Location:{' '}
          <strong style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
            {shipment.currentLocation}
          </strong>
        </span>
        <span style={{ color: 'var(--color-text-tertiary)' }}>
          Waybill:{' '}
          <code
            style={{
              fontWeight: 700,
              color: 'var(--color-forest)',
              background: '#fff',
              padding: '2px 6px',
              borderRadius: 4,
              border: '1px solid var(--color-border)',
            }}
          >
            {shipment.trackingNumber}
          </code>
        </span>
      </div>
    </div>
  );
};
