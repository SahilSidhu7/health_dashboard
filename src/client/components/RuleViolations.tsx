import React from 'react';

export function RuleViolations({ data }: { data: any }) {
  if (!data || !data.byReason) return null;

  const reasons = Object.entries(data.byReason) as [string, number][];
  if (reasons.length === 0) return null;

  const topCount = reasons[0]?.[1] || 1;

  return (
    <div className="card">
      <h2 className="card-title">Top Rule Violations</h2>
      <div className="rule-list">
        {reasons.slice(0, 5).map(([reason, count], index) => {
          const percentage = Math.round((count / topCount) * 100);
          return (
            <div key={reason} className="rule-item">
              <div className="rule-header">
                <span className="rule-rank">#{index + 1}</span>
                <span className="rule-reason" title={reason}>{reason}</span>
                <span className="rule-count">{count}</span>
              </div>
              <div className="rule-progress-bg">
                <div className="rule-progress-fill" style={{ width: `${percentage}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
