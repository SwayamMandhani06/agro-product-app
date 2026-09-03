import React from 'react';

export function Skeleton({
  width,
  height,
  borderRadius,
  className = '',
  style,
}: {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width: width ?? '100%',
        height: height ?? '16px',
        borderRadius: borderRadius ?? 'var(--radius-sm)',
        ...style,
      }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
      <Skeleton height={140} borderRadius={0} />
      <div style={{ padding: '12px 14px 14px' }}>
        <Skeleton width="40%" height={10} style={{ marginBottom: 6 }} />
        <Skeleton width="85%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="60%" height={14} style={{ marginBottom: 12 }} />
        <Skeleton width="100%" height={32} borderRadius={6} />
      </div>
    </div>
  );
}

export function DashboardMetricSkeleton() {
  return (
    <div className="card" style={{ padding: '16px 18px' }}>
      <Skeleton width="50%" height={12} style={{ marginBottom: 8 }} />
      <Skeleton width="70%" height={24} style={{ marginBottom: 4 }} />
      <Skeleton width="40%" height={10} />
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="card" style={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <Skeleton width="30%" height={14} />
        <Skeleton width="20%" height={20} borderRadius={4} />
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton width={48} height={48} borderRadius={8} />
        <div style={{ flex: 1 }}>
          <Skeleton width="70%" height={14} style={{ marginBottom: 6 }} />
          <Skeleton width="40%" height={12} />
        </div>
        <Skeleton width="20%" height={18} />
      </div>
    </div>
  );
}

export function MandiTableSkeleton() {
  return (
    <div style={{ padding: '16px' }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-divider)' }}>
          <Skeleton width="25%" height={14} />
          <Skeleton width="20%" height={14} />
          <Skeleton width="15%" height={14} />
          <Skeleton width="20%" height={14} />
        </div>
      ))}
    </div>
  );
}
