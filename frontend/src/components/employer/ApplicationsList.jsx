import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import moment from 'moment';
import 'moment/locale/vi';

const ApplicationsList = ({ applications, onUpdateStatus }) => {
  const getStatusColor = (status) => {
    const colors = {
      Submitted: 'bg-yellow-100 text-yellow-800',
      Reviewed: 'bg-blue-100 text-blue-800',
      Interviewed: 'bg-purple-100 text-purple-800',
      Rejected: 'bg-red-100 text-red-800',
      Hired: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div key={application._id} className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Link
                to={`/candidates/${application.candidateId._id}`}
                className="text-xl font-semibold text-gray-900 hover:text-blue-600"
              >
                {application.candidateSummary.fullName}
              </Link>
              <div className="text-gray-600">
                {application.candidateSummary.email}
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status.name)}`}>
              {application.status.name}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Học vấn</h4>
              <p className="text-gray-900">{application.candidateId.education}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Kinh nghiệm</h4>
              <p className="text-gray-900">{application.candidateId.experience}</p>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Kỹ năng</h4>
            <div className="flex flex-wrap gap-2">
              {application.candidateId.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {skill.name} - {skill.level}
                </span>
              ))}
            </div>
          </div>

          {application.coverLetter && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Thư giới thiệu</h4>
              <p className="text-gray-700">{application.coverLetter}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Nộp đơn: {moment(application.submitDate).locale('vi').fromNow()}
            </div>
            
            <div className="flex gap-2">
              <a
                href={application.resumeFile}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Xem CV
              </a>

              <select
                value={application.status.name}
                onChange={(e) => onUpdateStatus(application._id, e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="Submitted">Đã nộp</option>
                <option value="Reviewed">Đã xem xét</option>
                <option value="Interviewed">Đã phỏng vấn</option>
                <option value="Hired">Nhận việc</option>
                <option value="Rejected">Từ chối</option>
              </select>

              <Button
                onClick={() => window.location.href = `mailto:${application.candidateSummary.email}`}
                variant="outline"
              >
                Liên hệ
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationsList;