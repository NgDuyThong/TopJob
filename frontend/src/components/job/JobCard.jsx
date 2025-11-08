import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  BriefcaseIcon,
  BuildingOfficeIcon,
  ClockIcon,
  StarIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const JobCard = ({ job, onSave, onShare, isSaved = false, showActions = true }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) onSave(job._id);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) onShare(job);
  };

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="job-card group block"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {job.title}
            </h3>
            <div className="flex items-center text-yellow-500">
              <StarIcon className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <BuildingOfficeIcon className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{job.employerId?.companyName || 'Công ty'}</span>
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isSaved ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <ShareIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center text-gray-600">
          <MapPinIcon className="w-4 h-4 mr-2" />
          <span className="text-sm">{job.location?.city}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <BriefcaseIcon className="w-4 h-4 mr-2" />
          <span className="text-sm">{job.position?.level}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <ClockIcon className="w-4 h-4 mr-2" />
          <span className="text-sm">{formatDate(job.datePosted)}</span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {job.description?.substring(0, 200)}...
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {job.skillsRequired?.slice(0, 3).map((skill, index) => (
            <span key={index} className="badge-gray">
              {skill.name}
            </span>
          ))}
          {job.skillsRequired?.length > 3 && (
            <span className="badge-gray">
              +{job.skillsRequired.length - 3} khác
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold text-green-600">{job.salary}</span>
          <div className="flex items-center text-blue-600 group-hover:text-blue-700">
            <span className="text-sm font-medium">Xem chi tiết</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;