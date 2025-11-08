import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 flex-shrink-0 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          {/* Placeholder logo */}
          <span className="text-indigo-600 font-bold">{(job.company || 'C').charAt(0)}</span>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                <Link to={`/jobs/${job.id}`} className="hover:underline">{job.title}</Link>
              </h3>
              <div className="text-sm text-gray-500 mt-1">{job.company} • {job.location}</div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">{job.type}</div>
              <div className="text-xs text-gray-400">{job.posted}</div>
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{job.summary}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {job.tags?.slice(0,3).map((t) => (
                <span key={t} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">{t}</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/jobs/${job.id}`} className="text-indigo-600 text-sm hover:underline">Chi tiết</Link>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Ứng tuyển</button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
