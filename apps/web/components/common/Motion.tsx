import React from 'react';

export function FadeIn({
  children,
  delayMs = 0,
  className = '',
  style,
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`fade-in ${className}`}
      style={{
        animationDelay: delayMs > 0 ? `${delayMs}ms` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SlideUp({
  children,
  delayMs = 0,
  className = '',
  style,
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`slide-up ${className}`}
      style={{
        animationDelay: delayMs > 0 ? `${delayMs}ms` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function ScalePress({
  children,
  onClick,
  className = '',
  style,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      className={`interactive-press ${className}`}
      style={{ display: 'inline-block', cursor: onClick ? 'pointer' : undefined, ...style }}
    >
      {children}
    </div>
  );
}

export function StaggerContainer({
  children,
  staggerMs = 40,
  className = '',
  style,
}: {
  children: React.ReactNode[];
  staggerMs?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={className} style={style}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return (
          <div
            className="slide-up"
            style={{ animationDelay: `${index * staggerMs}ms` }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
