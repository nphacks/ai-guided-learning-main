import React from "react";

export const LoadingSpinner: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-secondary"></div>
      <p className="text-white text-lg font-medium">Loading...</p>
    </div>
  </div>
);