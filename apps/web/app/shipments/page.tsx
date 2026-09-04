'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { useLogisticsStore } from '@/features/logistics/logistics-store';
import { RouteCorridorVisualizer } from '@/features/logistics/presentation/RouteCorridorVisualizer';
import {
  SHIPMENT_STATUS_LABELS,
  SHIPMENT_STATUS_COLORS,
  type Shipment,
  type ShipmentStatus,
} from '@/features/logistics/domain/shipment';

import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  Search,
  ChevronRight,
  Phone,
  X,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ShipmentsPage() {
  const {
    shipments,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    advanceMilestone,
    simulateException,
    recordDeliveryAttempt,
    completeDelivery,
  } = useLogisticsStore();

  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    shipments.length > 0 ? shipments[0] : null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Compute Metrics
  const metrics = useMemo(() => {
    const active = shipments.filter(
      (s) => !['delivered', 'cancelled', 'returned'].includes(s.status)
    ).length;
    const inTransit = shipments.filter(
      (s) => ['inTransit', 'atRegionalHub', 'processing'].includes(s.status)
    ).length;
    const outForDelivery = shipments.filter(
      (s) => s.status === 'outForDelivery' || s.status === 'deliveryAttempted'
    ).length;
    const delivered = shipments.filter((s) => s.status === 'delivered').length;

    return { active, inTransit, outForDelivery, delivered };
  }, [shipments]);

  // Filtered shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      const matchesSearch =
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.currentLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.destinationLocation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'inTransit'
          ? ['inTransit', 'atRegionalHub', 'processing'].includes(s.status)
          : s.status === statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [shipments, searchQuery, statusFilter]);

  const handleRowClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setDrawerOpen(true);
  };

  const handleAdvance = async () => {
    if (!selectedShipment) return;
    setActionLoading(true);
    const updated = await advanceMilestone(selectedShipment.id);
    if (updated) setSelectedShipment(updated);
    setActionLoading(false);
  };

  const handleSimulateDelay = async () => {
    if (!selectedShipment) return;
    setActionLoading(true);
    const updated = await simulateException(selectedShipment.id, 'weather_delay');
    if (updated) setSelectedShipment(updated);
    setActionLoading(false);
  };

  const handleRecordAttempt = async () => {
    if (!selectedShipment) return;
    setActionLoading(true);
    const updated = await recordDeliveryAttempt(selectedShipment.id, 'customer_unavailable');
    if (updated) setSelectedShipment(updated);
    setActionLoading(false);
  };

  const handleCompleteDelivery = async () => {
    if (!selectedShipment) return;
    setActionLoading(true);
    const updated = await completeDelivery(selectedShipment.id);
    if (updated) setSelectedShipment(updated);
    setActionLoading(false);
  };

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 24, paddingBottom: 48 }}>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Truck size={22} color="var(--color-forest)" strokeWidth={2.2} />
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)' }}>
                Shipment & Rural Logistics Intelligence
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--color-text-secondary)' }}>
              Operational tracking across line-haul feeder corridors and rural farm delivery gates.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                background: 'var(--color-brand-50)',
                color: 'var(--color-forest)',
                border: '1px solid var(--color-brand-200)',
              }}
            >
              <ShieldCheck size={14} /> Free Tier Simulator Active
            </span>
          </div>
        </div>

        {/* 1. OPERATIONAL METRIC CARDS (Restrained SaaS Metrics) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Active Consignments
              </span>
              <Package size={16} color="var(--color-forest)" />
            </div>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {metrics.active}
            </p>
            <span style={{ fontSize: 11.5, color: 'var(--color-text-tertiary)' }}>Across 3 agro districts</span>
          </div>

          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                In Line-Haul Transit
              </span>
              <Truck size={16} color="var(--color-amber-600)" />
            </div>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: 'var(--color-amber-600)' }}>
              {metrics.inTransit}
            </p>
            <span style={{ fontSize: 11.5, color: 'var(--color-text-tertiary)' }}>Sorting & highway feeder</span>
          </div>

          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Out for Delivery
              </span>
              <Clock size={16} color="var(--color-forest)" />
            </div>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: 'var(--color-forest)' }}>
              {metrics.outForDelivery}
            </p>
            <span style={{ fontSize: 11.5, color: 'var(--color-text-tertiary)' }}>EV agents on local route</span>
          </div>

          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Delivered This Month
              </span>
              <CheckCircle2 size={16} color="var(--color-success)" />
            </div>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: 'var(--color-success)' }}>
              {metrics.delivered}
            </p>
            <span style={{ fontSize: 11.5, color: 'var(--color-text-tertiary)' }}>100% farm gate verification</span>
          </div>
        </div>

        {/* 2. ACTIVE CORRIDOR VISUALIZATION */}
        {selectedShipment && (
          <div style={{ marginBottom: 24 }}>
            <RouteCorridorVisualizer shipment={selectedShipment} />
          </div>
        )}

        {/* 3. SEARCH & STATUS FILTER TOOLBAR */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 10,
            padding: '14px 16px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', minWidth: 260, flex: 1, maxWidth: 360 }}>
            <Search size={15} color="var(--color-text-tertiary)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search shipment ID, AWB, city, order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 6,
                border: '1px solid var(--color-border)',
                fontSize: 13,
                outline: 'none',
                background: 'var(--color-canvas)',
              }}
            />
          </div>

          {/* Status Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {(
              [
                { id: 'all', label: 'All Shipments' },
                { id: 'inTransit', label: 'In Transit' },
                { id: 'outForDelivery', label: 'Out for Delivery' },
                { id: 'delivered', label: 'Delivered' },
                { id: 'deliveryAttempted', label: 'Exceptions' },
              ] as const
            ).map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as ShipmentStatus | 'all')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    background: active ? 'var(--color-forest)' : 'transparent',
                    color: active ? '#ffffff' : 'var(--color-text-secondary)',
                    border: active ? '1px solid var(--color-forest)' : '1px solid var(--color-border)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. SHIPMENTS DATA TABLE (Desktop-First) */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr
                  style={{
                    background: 'var(--color-canvas)',
                    borderBottom: '1px solid var(--color-border)',
                    color: 'var(--color-text-tertiary)',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    fontWeight: 700,
                  }}
                >
                  <th style={{ padding: '12px 16px' }}>Shipment ID / AWB</th>
                  <th style={{ padding: '12px 16px' }}>Order ID</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Current Location</th>
                  <th style={{ padding: '12px 16px' }}>Service Zone</th>
                  <th style={{ padding: '12px 16px' }}>Delivery Window</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((s) => {
                  const statusStyle = SHIPMENT_STATUS_COLORS[s.status] || {
                    bg: 'var(--color-neutral-100)',
                    color: 'var(--color-text-primary)',
                  };
                  const isSelected = selectedShipment?.id === s.id;

                  return (
                    <tr
                      key={s.id}
                      onClick={() => handleRowClick(s)}
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                        cursor: 'pointer',
                        background: isSelected ? 'var(--color-brand-50)' : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'var(--color-neutral-50)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                            {s.id}
                          </span>
                          <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-forest)' }}>
                            {s.trackingNumber}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Link
                          href={`/orders/${s.orderId}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontWeight: 600,
                            color: 'var(--color-forest)',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          {s.orderId} <ArrowUpRight size={12} />
                        </Link>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: 4,
                            fontSize: 11.5,
                            fontWeight: 700,
                            background: statusStyle.bg,
                            color: statusStyle.color,
                          }}
                        >
                          {SHIPMENT_STATUS_LABELS[s.status] || s.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                        {s.currentLocation}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-text-secondary)', fontSize: 12 }}>
                        {s.serviceZone}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-text-secondary)', fontSize: 12 }}>
                        {new Date(s.estimatedDeliveryEnd).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(s);
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-forest)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 2,
                            fontWeight: 600,
                            fontSize: 12,
                          }}
                        >
                          View Details <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredShipments.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
              <Package size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
              <p style={{ margin: 0, fontWeight: 600 }}>No shipments matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. SLIDE-OVER SHIPMENT DETAIL DRAWER */}
      {drawerOpen && selectedShipment && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 99,
            }}
            onClick={() => setDrawerOpen(false)}
          />

          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '90%',
              maxWidth: 520,
              background: 'var(--color-surface)',
              zIndex: 100,
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
                    {selectedShipment.id}
                  </h2>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 700,
                      background: SHIPMENT_STATUS_COLORS[selectedShipment.status]?.bg,
                      color: SHIPMENT_STATUS_COLORS[selectedShipment.status]?.color,
                    }}
                  >
                    {SHIPMENT_STATUS_LABELS[selectedShipment.status]}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                  Waybill: {selectedShipment.trackingNumber} · Order: #{selectedShipment.orderId}
                </p>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-tertiary)',
                  padding: 4,
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Route Corridor preview */}
              <RouteCorridorVisualizer shipment={selectedShipment} compact />

              {/* Delivery Intelligence Summary */}
              <div
                style={{
                  background: 'var(--color-canvas)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>Service Corridor</span>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{selectedShipment.serviceZone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>Distance Band</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{selectedShipment.distanceBand}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>Expected Window</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-forest)' }}>
                    {new Date(selectedShipment.estimatedDeliveryStart).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} –{' '}
                    {new Date(selectedShipment.estimatedDeliveryEnd).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>Destination</span>
                  <span style={{ fontSize: 12, fontWeight: 500, maxWidth: 240, textAlign: 'right' }}>
                    {selectedShipment.destinationLocation}
                  </span>
                </div>
              </div>

              {/* Assigned Agent */}
              {selectedShipment.deliveryAgent && (
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    padding: '14px',
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
                    Designated Rural Delivery Agent
                  </span>
                  <p style={{ margin: '4px 0 2px', fontSize: 14, fontWeight: 700 }}>
                    {selectedShipment.deliveryAgent.name} (★ {selectedShipment.deliveryAgent.rating})
                  </p>
                  <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                    {selectedShipment.deliveryAgent.vehicleType} · {selectedShipment.deliveryAgent.vehicleNumber}
                  </p>
                  <a
                    href={`tel:${selectedShipment.deliveryAgent.phone}`}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--color-forest)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Phone size={12} /> Contact Agent ({selectedShipment.deliveryAgent.phone})
                  </a>
                </div>
              )}

              {/* Interactive Demo Progression Actions */}
              <div
                style={{
                  background: 'var(--color-brand-50)',
                  border: '1px dashed var(--color-forest)',
                  borderRadius: 8,
                  padding: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <RefreshCw size={14} color="var(--color-forest)" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-forest)' }}>
                    Demo Lifecycle Progression (Free Tier)
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    onClick={handleAdvance}
                    disabled={actionLoading || selectedShipment.status === 'delivered'}
                    className="btn btn-primary"
                    style={{ width: '100%', fontSize: 13 }}
                  >
                    Advance to Next Milestone →
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <button
                      onClick={handleSimulateDelay}
                      disabled={actionLoading || selectedShipment.status === 'delivered'}
                      className="btn btn-secondary"
                      style={{ fontSize: 12 }}
                    >
                      Weather Delay
                    </button>
                    <button
                      onClick={handleRecordAttempt}
                      disabled={actionLoading || selectedShipment.status === 'delivered'}
                      className="btn btn-secondary"
                      style={{ fontSize: 12 }}
                    >
                      Failed Attempt
                    </button>
                  </div>
                  {selectedShipment.status !== 'delivered' && (
                    <button
                      onClick={handleCompleteDelivery}
                      disabled={actionLoading}
                      className="btn btn-secondary"
                      style={{ width: '100%', fontSize: 12, color: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                    >
                      Complete Delivery (Farm Gate)
                    </button>
                  )}
                </div>
              </div>

              {/* Detailed Tracking Events Log */}
              <div>
                <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
                  Tracking Event Log ({selectedShipment.events.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {selectedShipment.events.map((e) => (
                    <div
                      key={e.id}
                      style={{
                        borderLeft: '2px solid var(--color-forest)',
                        paddingLeft: 12,
                        paddingBottom: 2,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                          {SHIPMENT_STATUS_LABELS[e.status] || e.status}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
                          {formatDate(e.eventTime)}
                        </span>
                      </div>
                      <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'var(--color-forest)', fontWeight: 600 }}>
                        {e.location}
                      </p>
                      <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                        {e.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Link to order */}
              <Link
                href={`/orders/${selectedShipment.orderId}`}
                className="btn btn-secondary btn-full"
                style={{ textAlign: 'center', fontSize: 13 }}
              >
                View Full Order #{selectedShipment.orderId}
              </Link>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
