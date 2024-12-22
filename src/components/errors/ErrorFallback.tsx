import React from 'react';

export const ErrorFallback: React.FC = () => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
    <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
    <p className="text-red-600">Please try refreshing the page or contact support if the problem persists.</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Reload Page
    </button>
  </div>
);