import React from 'react';

export function MetricCards({ modlogData, workloadData }: { modlogData: any, workloadData: any }) {
  if (!modlogData || !workloadData) return null;

  const activeMods = workloadData.length;
  const removed7d = modlogData.removedLast7Days;
  const removed30d = modlogData.removedLast30Days;
  const avgHours = modlogData.avgHoursToAction;

  return (
    <div className="grid-metrics">
      <div className="card metric-card">
        <span className="metric-label">Posts removed (7d)</span>
        <span className="metric-value">{removed7d}</span>
      </div>
      <div className="card metric-card">
        <span className="metric-label">Posts removed (30d)</span>
        <span className="metric-value">{removed30d}</span>
      </div>
      <div className="card metric-card">
        <span className="metric-label">Avg hours to action</span>
        <span className="metric-value">{avgHours}h</span>
      </div>
      <div className="card metric-card">
        <span className="metric-label">Active moderators</span>
        <span className="metric-value">{activeMods}</span>
      </div>
    </div>
  );
}
