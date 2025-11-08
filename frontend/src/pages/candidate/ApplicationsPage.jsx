import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BriefcaseIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { candidateService } from '../../services/candidateService';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await candidateService.getApplications();
      console.log('Applications response:', response);
      const apps = response.data || [];
      console.log('Applications data:', apps);
      console.log('First application:', apps[0]);
      setApplications(apps);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusName = status?.name || status || 'Submitted';
    switch (statusName) {
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Reviewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'Interviewed':
        return 'bg-purple-100 text-purple-800';
      case 'Hired':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    const statusName = status?.name || status || 'Submitted';
    switch (statusName) {
      case 'Submitted':
        return 'Đã nộp';
      case 'Reviewed':
        return 'Đã xem xét';
      case 'Interviewed':
        return 'Phỏng vấn';
      case 'Hired':
        return 'Được tuyển';
      case 'Rejected':
        return 'Bị từ chối';
      default:
        return statusName;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    const statusName = app.status?.name || app.status || 'Submitted';
    return statusName === filter;
  });

  const statusCounts = {
    all: applications.length,
    Submitted: applications.filter(app => (app.status?.name || app.status) === 'Submitted').length,
    Reviewed: applications.filter(app => (app.status?.name || app.status) === 'Reviewed').length,
    Interviewed: applications.filter(app => (app.status?.name || app.status) === 'Interviewed').length,
    Hired: applications.filter(app => (app.status?.name || app.status) === 'Hired').length,
    Rejected: applications.filter(app => (app.status?.name || app.status) === 'Rejected').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách ứng tuyển...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đơn ứng tuyển của tôi</h1>
          <p className="text-gray-600">Theo dõi trạng thái các đơn ứng tuyển của bạn</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className={`p-4 rounded-lg border-2 transition-colors duration-200 cursor-pointer ${
                filter === status
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => setFilter(status)}
            >
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">
                {status === 'all' ? 'Tất cả' : getStatusText(status)}
              </div>
            </div>
          ))}
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'Chưa có đơn ứng tuyển nào' : `Không có đơn ứng tuyển với trạng thái "${getStatusText(filter)}"`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'Hãy bắt đầu tìm kiếm và ứng tuyển các việc làm phù hợp với bạn.'
                  : 'Hãy thử chọn trạng thái khác để xem đơn ứng tuyển.'
                }
              </p>
              {filter === 'all' && (
                <Link
                  to="/jobs"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Tìm việc làm
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <div key={application._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.jobSummary?.title || 'N/A'}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-600 mb-3">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                          <span>{application.jobSummary?.employerName || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>Nộp: {formatDate(application.submitDate)}</span>
                        </div>
                        {application.status?.updatedAt && (
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span>Cập nhật: {formatDate(application.status.updatedAt)}</span>
                          </div>
                        )}
                      </div>

                      {application.coverLetter && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {application.coverLetter}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-4 w-4 mr-1" />
                          <span>CV: {application.resumeFile}</span>
                        </div>
                        {application.viewedHistory && application.viewedHistory.length > 0 && (
                          <div className="flex items-center">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            <span>Đã xem {application.viewedHistory.length} lần</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        to={`/jobs/${application.jobpostId?._id || application.jobpostId}`}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                      >
                        Xem việc làm
                      </Link>
                      {(application.status?.name || application.status) === 'Submitted' && (
                        <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                          Rút đơn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Legend */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chú thích trạng thái</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-100 rounded-full"></span>
              <span className="text-sm text-gray-600">Đã nộp - Đơn ứng tuyển đã được gửi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-100 rounded-full"></span>
              <span className="text-sm text-gray-600">Đã xem xét - Nhà tuyển dụng đã xem hồ sơ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-100 rounded-full"></span>
              <span className="text-sm text-gray-600">Phỏng vấn - Được mời phỏng vấn</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-100 rounded-full"></span>
              <span className="text-sm text-gray-600">Được tuyển - Chúc mừng bạn đã được tuyển!</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-100 rounded-full"></span>
              <span className="text-sm text-gray-600">Bị từ chối - Đơn ứng tuyển không phù hợp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;
