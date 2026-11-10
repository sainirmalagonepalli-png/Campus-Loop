import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

const TrustScoreBadge = ({ score = 50, size = 'sm', showLabel = true }) => {
  let statusClass = '';
  let Icon = ShieldCheck;
  let level = 'Trusted';

  if (score >= 70) {
    statusClass = ''; // default green
    Icon = ShieldCheck;
    level = 'High Trust';
  } else if (score >= 40) {
    statusClass = 'moderate';
    Icon = Shield;
    level = 'Good';
  } else {
    statusClass = 'low';
    Icon = ShieldAlert;
    level = 'At Risk';
  }

  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <span
      className={`trust-score-pill ${statusClass}`}
      title={`Trust Score: ${score}/100 (${level})`}
      style={{
        padding: size === 'lg' ? '0.4rem 0.9rem' : size === 'md' ? '0.3rem 0.75rem' : '0.2rem 0.55rem',
        fontSize: size === 'lg' ? '1rem' : size === 'md' ? '0.9rem' : '0.78rem',
      }}
    >
      <Icon size={iconSizes[size] || 14} />
      <span>{score} pts</span>
      {showLabel && size !== 'xs' && (
        <span style={{ opacity: 0.8, fontSize: '0.85em', fontWeight: 500 }}>
          • {level}
        </span>
      )}
    </span>
  );
};

export default TrustScoreBadge;
