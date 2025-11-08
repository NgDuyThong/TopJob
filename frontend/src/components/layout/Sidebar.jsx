import React from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: 'M3 3h18v4H3V3z' },
  { to: '/jobs', label: 'Công việc', icon: 'M4 6h16M4 12h16M4 18h16' },
  { to: '/candidates', label: 'Ứng viên', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z M6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1' },
  { to: '/settings', label: 'Cài đặt', icon: 'M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z' },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-64 bg-white dark:bg-gray-900 border-r h-screen sticky top-0">
      <div className="p-4 border-b">
        <div className="text-sm text-gray-500">Menu</div>
      </div>
      <nav className="p-3 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
              }`
            }
          >
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d={item.icon} />
            </svg>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t">
        <div className="text-xs text-gray-500">Version 1.0.0</div>
      </div>
    </aside>
  );
}
