import React from 'react';

function getColor(score: number) {
  if (score >= 70) return 'var(--color-green)';
  if (score >= 40) return 'var(--color-amber)';
  return 'var(--color-red)';
}

export function HealthScore({ data }: { data: any }) {
  if (!data) return null;
  
  const { score, subScores } = data;
  const color = getColor(score);
  
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="card health-score-container">
      <h2 className="card-title">Community Health Score</h2>
      
      <div className="health-score-ring">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="var(--bg-tertiary)"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        </svg>
        <div className="health-score-value" style={{ color }}>
          {score}
        </div>
      </div>

      <div className="sub-scores">
        <div className="sub-score-pill">
          <div className="pill-dot" style={{ backgroundColor: getColor(subScores.removalRate) }}></div>
          Removal Rate: {subScores.removalRate}
        </div>
        <div className="sub-score-pill">
          <div className="pill-dot" style={{ backgroundColor: getColor(subScores.reportResolution) }}></div>
          Response Time: {subScores.reportResolution}
        </div>
        <div className="sub-score-pill">
          <div className="pill-dot" style={{ backgroundColor: getColor(subScores.retention) }}></div>
          Retention: {subScores.retention}
        </div>
      </div>
    </div>
  );
}
