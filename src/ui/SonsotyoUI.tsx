import React from 'react';

export const SonsotyoKicker: React.FC<{
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, color, style }) => (
  <div className="sonsotyo-kicker" style={{ color, ...style }}>
    {children}
  </div>
);

export const SonsotyoTitle: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <h1 className="sonsotyo-title" style={style}>
    {children}
  </h1>
);

export const SonsotyoPanel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}> = ({ children, style, className = '' }) => (
  <div className={`glass-panel sonsotyo-panel ${className}`.trim()} style={style}>
    {children}
  </div>
);

export const SonsotyoHeroCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div className="glass-panel sonsotyo-hero-card" style={style}>
    {children}
  </div>
);

export const SonsotyoPill: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div className="sonsotyo-pill" style={style}>
    {children}
  </div>
);

export const SonsotyoDiagnosticRow: React.FC<{
  label: React.ReactNode;
  value: React.ReactNode;
  valueStyle?: React.CSSProperties;
}> = ({ label, value, valueStyle }) => (
  <div className="sonsotyo-diagnostic">
    <span>{label}</span>
    <span className="sonsotyo-value" style={valueStyle}>
      {value}
    </span>
  </div>
);
