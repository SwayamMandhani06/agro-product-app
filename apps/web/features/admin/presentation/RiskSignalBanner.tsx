'use client';

import React from 'react';
import { useAdminStore } from '../admin-store';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { RISK_SEVERITY_LABELS } from '../domain/governance';

export function RiskSignalBanner() {
  const { riskSignals, resolveRiskSignal } = useAdminStore();
  const unresolved = riskSignals.filter((r) => !r.isResolved);

  if (unresolved.length === 0) return null;

  return (
    <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {unresolved.map((signal) => {
        const isCritical = signal.severity === 'critical';
        const isHigh = signal.severity === 'high';

        const bg = isCritical ? '#FEF2F2' : isHigh ? '#FFFBEB' : '#F0FDF4';
        const border = isCritical ? '#F87171' : isHigh ? '#FCD34D' : '#86EFAC';
        const text = isCritical ? '#991B1B' : isHigh ? '#92400E' : '#166534';
        const badgeBg = isCritical ? '#DC2626' : isHigh ? '#D97706' : '#15803D';

        return (
          <div
            key={signal.id}
            style={{
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
              <div style={{ color: text }}>
                {isCritical ? <ShieldAlert size={20} /> : <AlertTriangle size={20} />}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      background: badgeBg,
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {RISK_SEVERITY_LABELS[signal.severity]} RISK
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: text }}>
                    {signal.ruleTriggered}: {signal.entityLabel}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: text, marginTop: '2px', opacity: 0.9 }}>
                  {signal.description}
                </div>
              </div>
            </div>

            <button
              onClick={() => resolveRiskSignal(signal.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#FFFFFF',
                border: `1px solid ${border}`,
                color: text,
                fontSize: '12px',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <CheckCircle size={14} />
              <span>Mark Resolved</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
