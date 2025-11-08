import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/vi';

const ApplicationCard = ({ application }) => {
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
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Link 
            to={`/jobs/${application.jobpostId._id}`}
            className="text-xl font-semibold text-gray-900 hover:text-blue-600"
          >
            {application.jobSummary.title}
          </Link>
          <div className="text-gray-600">
            {application.jobSummary.employerName}
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status.name)}`}>
          {application.status.name}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Ngày nộp:</span>
          <span className="ml-2">{moment(application.submitDate).locale('vi').format('DD/MM/YYYY')}</span>
        </div>
        <div>
          <span className="text-gray-500">Cập nhật:</span>
          <span className="ml-2">{moment(application.status.updatedAt).locale('vi').fromNow()}</span>
        </div>
      </div>

      {application.coverLetter && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Thư giới thiệu:</h4>
          <p className="text-gray-700">{application.coverLetter}</p>
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-gray-500">
        <Link 
          to={`/applications/${application._id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          Xem chi tiết
        </Link>
        {application.status.name === 'Submitted' && (
          <button className="text-red-600 hover:text-red-800">
            Rút đơn ứng tuyển
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;