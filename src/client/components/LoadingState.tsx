import React from 'react';

export function LoadingState() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-muted)' }}>Loading dashboard data...</p>
    </div>
  );
}
