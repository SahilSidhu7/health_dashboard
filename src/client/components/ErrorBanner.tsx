import React from 'react';

export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  
  return (
    <div className="error-banner">
      <strong>Error:</strong> {message}
    </div>
  );
}
