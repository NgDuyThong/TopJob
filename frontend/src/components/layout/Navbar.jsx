import React from 'react';

export default function Navbar() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b shadow-sm">
      <div className="app-container flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 dark:text-gray-200 md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="flex items-baseline">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold">T</div>
              <div>
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">TopJob</div>
                <div className="ml-0 text-sm text-gray-500">Quản lý tuyển dụng</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1 w-80">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
            </svg>
            <input className="bg-transparent focus:outline-none text-sm w-full" placeholder="Tìm công việc hoặc ứng viên..." />
          </div>

          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium">A</div>
            <div className="hidden md:block text-sm">
              <div className="text-gray-900 dark:text-gray-100">Admin</div>
              <div className="text-xs text-gray-500">Quản trị viên</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
