import React from 'react';
import { Link } from 'react-router-dom';
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  EyeIcon,
  PencilIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const JobCard = ({ job, showActions = true }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    return status === 'open' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-gray-100 text-gray-500';
  };

  const getStatusText = (status) => {
    return status === 'open' ? 'Đang tuyển' : 'Đã đóng';
  };

  const daysUntilDeadline = Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                {getStatusText(job.status)}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <BriefcaseIcon className="h-4 w-4" />
                <span>{job.position?.level}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                <span>{job.location?.city}</span>
              </div>
              <div className="flex items-center gap-1">
                <CurrencyDollarIcon className="h-4 w-4" />
                <span>{job.salary}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <UserGroupIcon className="h-5 w-5" />
              <span className="text-2xl font-bold">{job.applicationsCount || 0}</span>
            </div>
            <p className="text-xs text-gray-600">Ứng tuyển</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
              <EyeIcon className="h-5 w-5" />
              <span className="text-2xl font-bold">{job.views || 0}</span>
            </div>
            <p className="text-xs text-gray-600">Lượt xem</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
              <CalendarIcon className="h-5 w-5" />
              <span className="text-2xl font-bold">{daysUntilDeadline}</span>
            </div>
            <p className="text-xs text-gray-600">Ngày còn lại</p>
          </div>
        </div>

        {/* Skills */}
        {job.skillsRequired && job.skillsRequired.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Kỹ năng yêu cầu:</p>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                >
                  {skill.name}
                </span>
              ))}
              {job.skillsRequired.length > 4 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{job.skillsRequired.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="flex gap-4 text-xs text-gray-500 mb-4">
          <div>Đăng: {formatDate(job.datePosted)}</div>
          <div>Hạn: {formatDate(job.deadline)}</div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            <Link
              to={`/employer/applications?jobId=${job._id}`}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-center text-sm font-medium"
            >
              Xem đơn ứng tuyển
            </Link>
            <Link
              to={`/employer/jobs/${job._id}/edit`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
            >
              <PencilIcon className="h-5 w-5" />
            </Link>
            <Link
              to={`/employer/jobs/${job._id}/candidates`}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all duration-300"
              title="Xem ứng viên phù hợp"
            >
              <ChartBarIcon className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;
