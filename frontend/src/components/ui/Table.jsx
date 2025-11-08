import React from 'react';

export default function Table({ columns = [], data = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b">
                {col.title}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} hover:bg-gray-100 dark:hover:bg-gray-700`}>
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 border-b">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right border-b">
                <button className="px-3 py-1 text-sm text-indigo-600 hover:underline">View</button>
                <button className="px-3 py-1 text-sm text-gray-500">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
