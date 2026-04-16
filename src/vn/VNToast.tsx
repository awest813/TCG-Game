import React from 'react';

export const VNToast: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="vn-toast" role="status" aria-live="polite">
      {message}
    </div>
  );
};
