import React from 'react';
import Button from '../common/Button';

const JobDetail = ({ job, onApply, isEmployer, isCandidate }) => {
  if (!job) return null;

  const deadline = new Date(job.deadline);
  const isExpired = deadline < new Date();

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {job.title}
            </h1>
            <div className="text-lg text-blue-600 hover:underline">
              {job.employerId.companyName}
            </div>
          </div>
          {isCandidate && !isExpired && (
            <Button
              onClick={onApply}
              variant="primary"
              size="lg"
            >
              Ứng tuyển ngay
            </Button>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="p-6 border-b">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Địa điểm</h3>
            <p className="text-gray-900">{job.location.city}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Mức lương</h3>
            <p className="text-gray-900">{job.salary}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Cấp bậc</h3>
            <p className="text-gray-900">{job.position.level}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Ngôn ngữ</h3>
            <p className="text-gray-900">{job.language}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold mb-4">Mô tả công việc</h2>
        <div className="prose max-w-none">
          {job.description.split('\\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Required Skills */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold mb-4">Yêu cầu kỹ năng</h2>
        <div className="flex flex-wrap gap-2">
          {job.skillsRequired.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              {skill.name} - {skill.level}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <div>Đăng ngày: {new Date(job.datePosted).toLocaleDateString('vi-VN')}</div>
            <div>Hạn nộp: {new Date(job.deadline).toLocaleDateString('vi-VN')}</div>
          </div>
          <div className="text-sm text-gray-500">
            <div>{job.views} lượt xem</div>
            <div>{job.applicationsCount} ứng viên đã ứng tuyển</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;