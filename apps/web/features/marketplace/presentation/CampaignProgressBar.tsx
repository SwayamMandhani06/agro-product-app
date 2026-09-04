import React from 'react';
import { computeCampaignProgress, type CooperativeCampaign } from '../domain/cooperative';

interface Props {
  campaign: CooperativeCampaign;
}

export function CampaignProgressBar({ campaign }: Props) {
  const {
    progressPercentage,
    minimumThresholdReached,
    targetReached,
    collectiveSavingsGenerated,
  } = computeCampaignProgress(campaign);

  const minRatio = Math.min(100, Math.round((campaign.minimumQuantity / campaign.targetQuantity) * 100));

  return (
    <div style={{ width: '100%' }}>
      {/* Metric headers */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          fontSize: '12px',
          marginBottom: '6px',
        }}
      >
        <span style={{ color: 'var(--color-neutral-700)', fontWeight: 500 }}>
          Commitment Progress: <strong>{campaign.currentQuantity}</strong> / {campaign.targetQuantity} {campaign.unit}
        </span>
        <span style={{ color: minimumThresholdReached ? 'var(--color-forest)' : 'var(--color-amber)', fontWeight: 600 }}>
          {targetReached
            ? '100% Target Met'
            : minimumThresholdReached
            ? 'Wholesale Threshold Reached'
            : `${Math.max(0, campaign.minimumQuantity - campaign.currentQuantity)} more needed for bulk tier`}
        </span>
      </div>

      {/* Progress Track */}
      <div
        style={{
          position: 'relative',
          height: '10px',
          background: 'var(--color-surface-subtle)',
          borderRadius: '5px',
          overflow: 'hidden',
          border: '1px solid var(--color-surface-tint)',
        }}
      >
        {/* Minimum Threshold Marker */}
        <div
          title={`Minimum MOQ Threshold: ${campaign.minimumQuantity} ${campaign.unit}`}
          style={{
            position: 'absolute',
            left: `${minRatio}%`,
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'var(--color-neutral-400)',
            zIndex: 2,
          }}
        />

        {/* Filled bar */}
        <div
          style={{
            width: `${progressPercentage}%`,
            height: '100%',
            background: targetReached
              ? '#027A38'
              : minimumThresholdReached
              ? '#0B3D2E'
              : '#D97706',
            borderRadius: '5px',
            transition: 'width 300ms ease',
          }}
        />
      </div>

      {/* Labels below */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '6px',
          fontSize: '11px',
          color: 'var(--color-neutral-500)',
        }}
      >
        <span>Min MOQ: {campaign.minimumQuantity} {campaign.unit}</span>
        <span>
          Collective Group Savings:{' '}
          <strong style={{ color: 'var(--color-forest)' }}>
            ₹{collectiveSavingsGenerated.toLocaleString('en-IN')}
          </strong>
        </span>
        <span>Target: {campaign.targetQuantity} {campaign.unit}</span>
      </div>
    </div>
  );
}
