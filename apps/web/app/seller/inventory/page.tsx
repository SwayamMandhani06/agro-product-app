'use client';

import React, { useState } from 'react';
import { useMarketplaceStore } from '@/features/marketplace/marketplace-store';
import { SellerPortalNav } from '@/features/marketplace/presentation/SellerPortalNav';
import type { InventoryMovementType } from '@/features/marketplace/domain/inventory';
import { Plus } from 'lucide-react';

export default function SellerInventoryPage() {
  const { inventory, movements, adjustStock } = useMarketplaceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvId, setSelectedInvId] = useState(inventory[0]?.id || '');
  const [movementType, setMovementType] = useState<InventoryMovementType>('stock_in');
  const [quantity, setQuantity] = useState<number>(50);
  const [refId, setRefId] = useState('');
  const [notes, setNotes] = useState('');

  const totalPhysicalUnits = inventory.reduce((acc, i) => acc + i.stockQuantity, 0);
  const totalReservedUnits = inventory.reduce((acc, i) => acc + i.reservedQuantity, 0);
  const lowStockCount = inventory.filter((i) => i.stockQuantity <= i.reorderLevel).length;

  const handleRecordMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvId || quantity <= 0) return;

    const delta = movementType === 'stock_out' || movementType === 'order_reserved' ? -quantity : quantity;
    adjustStock(selectedInvId, delta, movementType, notes || `Movement recorded: ${refId || 'Warehouse intake'}`);
    setIsModalOpen(false);
    setRefId('');
    setNotes('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      <SellerPortalNav />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* KPI Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-tint)', borderRadius: '8px', padding: '16px 20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
              Physical Warehouse Inventory
            </span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '6px' }}>
              {totalPhysicalUnits} Units
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              Across {inventory.length} active registered SKUs
            </div>
          </div>

          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-tint)', borderRadius: '8px', padding: '16px 20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
              Reserved for Orders
            </span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#92400E', marginTop: '6px' }}>
              {totalReservedUnits} Units
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              Committed to packaging & rural dispatch
            </div>
          </div>

          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-tint)', borderRadius: '8px', padding: '16px 20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
              Available Buffer Stock
            </span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-forest)', marginTop: '6px' }}>
              {Math.max(0, totalPhysicalUnits - totalReservedUnits)} Units
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              Ready for immediate farmer & cooperative order placement
            </div>
          </div>

          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-tint)', borderRadius: '8px', padding: '16px 20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
              Reorder Deficit Alerts
            </span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: lowStockCount > 0 ? '#991B1B' : '#01421E', marginTop: '6px' }}>
              {lowStockCount} Items
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              {lowStockCount > 0 ? 'Requires immediate depot replenishment' : 'All buffer levels satisfactory'}
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--color-slate)' }}>
              Inventory Movements & Stock Audit Log
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
              Immutable traceability records for inward replenishments, dispatch deductions, and audit reconciliations
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--color-forest)',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus size={16} /> Record Inward / Adjustment
          </button>
        </div>

        {/* Audit Log Table */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-surface-tint)' }}>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Timestamp</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Movement Type</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Product / SKU</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Quantity</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Stock Transition</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Reference ID</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Audit Notes</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((mov) => {
                  const invItem = inventory.find((i) => i.id === mov.inventoryId);
                  const isPositive = mov.quantity > 0;

                  const typeConfigs: Record<InventoryMovementType, { bg: string; text: string; label: string }> = {
                    stock_in: { bg: '#EAF6EF', text: '#01421E', label: 'Stock Inward' },
                    stock_out: { bg: '#FEE2E2', text: '#991B1B', label: 'Order Dispatch' },
                    adjustment: { bg: '#EFF6FF', text: '#1E40AF', label: 'Audit Adjustment' },
                    order_reserved: { bg: '#FEF3C7', text: '#92400E', label: 'Order Reserved' },
                    order_released: { bg: '#F3F4F6', text: '#374151', label: 'Reserve Released' },
                  };

                  const cfg = typeConfigs[mov.movementType] || { bg: '#F3F4F6', text: '#374151', label: mov.movementType };

                  return (
                    <tr key={mov.id} style={{ borderBottom: '1px solid var(--color-surface-subtle)' }}>
                      <td style={{ padding: '12px 16px', color: 'var(--color-neutral-600)', whiteSpace: 'nowrap' }}>
                        {new Date(mov.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: cfg.bg,
                            color: cfg.text,
                            textTransform: 'uppercase',
                          }}
                        >
                          {cfg.label}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-slate)' }}>
                          {invItem?.productTitle || mov.productId}
                        </div>
                        <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--color-neutral-500)' }}>
                          {invItem?.sku || 'SKU-UNKNOWN'}
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                        <span style={{ color: isPositive ? 'var(--color-forest)' : '#991B1B' }}>
                          {isPositive ? `+${mov.quantity}` : mov.quantity} {invItem?.unit || 'units'}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-neutral-600)' }}>
                        {mov.previousStock} → <strong style={{ color: 'var(--color-slate)' }}>{mov.newStock}</strong>
                      </td>

                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-neutral-700)' }}>
                        {mov.referenceId || '—'}
                      </td>

                      <td style={{ padding: '12px 16px', color: 'var(--color-neutral-600)', maxWidth: '280px' }}>
                        {mov.notes || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Record Movement Modal */}
        {isModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99,
              padding: '20px',
            }}
          >
            <form
              onSubmit={handleRecordMovement}
              style={{
                background: 'var(--color-surface)',
                borderRadius: '8px',
                padding: '24px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-slate)' }}>
                Record Warehouse Stock Movement
              </h3>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '4px' }}>
                  Target Product / SKU
                </label>
                <select
                  value={selectedInvId}
                  onChange={(e) => setSelectedInvId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-surface-tint)',
                    background: 'var(--color-surface-subtle)',
                    fontSize: '13px',
                  }}
                >
                  {inventory.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.sku} — {inv.productTitle} (Current: {inv.stockQuantity})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '4px' }}>
                    Movement Type
                  </label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value as InventoryMovementType)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-surface-tint)',
                      background: 'var(--color-surface-subtle)',
                      fontSize: '13px',
                    }}
                  >
                    <option value="stock_in">Stock Inward (+)</option>
                    <option value="stock_out">Stock Outward (-)</option>
                    <option value="adjustment">Audit Adjustment</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '4px' }}>
                    Quantity Units
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-surface-tint)',
                      background: 'var(--color-surface-subtle)',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '4px' }}>
                  Reference ID (e.g. PO number, GRN)
                </label>
                <input
                  type="text"
                  placeholder="PO-2026-XXXX or GRN-MH-012"
                  value={refId}
                  onChange={(e) => setRefId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-surface-tint)',
                    background: 'var(--color-surface-subtle)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '4px' }}>
                  Audit Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Batch intake from manufacturer depot"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-surface-tint)',
                    background: 'var(--color-surface-subtle)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    border: '1px solid var(--color-surface-tint)',
                    background: 'var(--color-surface)',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    border: 'none',
                    background: 'var(--color-forest)',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save Movement
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
