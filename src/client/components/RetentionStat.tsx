import React from 'react';

export function RetentionStat({ data }: { data: any }) {
  if (!data) return null;

  const { retentionPercent, firstTimePosters, returned } = data;
  
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (retentionPercent / 100) * circumference;

  return (
    <div className="card retention-container">
      <h2 className="card-title" style={{ alignSelf: 'flex-start', margin: 0 }}>New Member Retention</h2>
      
      <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: 'absolute' }}>
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="var(--bg-tertiary)"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="var(--color-blue)"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        </svg>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {retentionPercent}%
        </div>
      </div>
      
      <div className="retention-text">
        <strong>{returned}</strong> of {firstTimePosters} new members came back
      </div>
    </div>
  );
}
