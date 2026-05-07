import { useState } from 'react';

export function RefreshButton({ isMod, onRefresh }: { isMod: boolean, onRefresh: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);

  if (!isMod) return null;

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetch('/api/cache/bust', { method: 'POST' });
      await onRefresh();
    } catch (err) {
      console.error('Failed to bust cache', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className="refresh-button" 
      onClick={handleRefresh}
      disabled={loading}
    >
      {loading ? (
        <>
          <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
          Refreshing...
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21v-5h5" />
          </svg>
          Refresh Data
        </>
      )}
    </button>
  );
}
