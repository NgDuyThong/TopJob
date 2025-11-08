import React from 'react';

export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm sm:rounded-lg p-4 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <div className="text-sm text-gray-500">{/* placeholder for actions */}</div>
        </div>
      )}
      <div className="text-sm text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  );
}
