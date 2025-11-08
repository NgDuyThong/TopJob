import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { employerService } from '../../services/employerService';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load jobs
      const jobsResponse = await employerService.getPostedJobs();
      setJobs(jobsResponse.data || []);
      
      // Load applications for all jobs
      const allApplications = [];
      for (const job of jobsResponse.data || []) {
        try {
          const applicationsResponse = await employerService.getJobApplications(job._id);
          const jobApplications = (applicationsResponse.data || []).map(app => ({
            ...app,
            jobTitle: job.title,
            jobId: job._id
          }));
          allApplications.push(...jobApplications);
        } catch (error) {
          console.error(`Error loading applications for job ${job._id}:`, error);
        }
      }
      
      setApplications(allApplications);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await employerService.updateApplicationStatus(applicationId, newStatus);
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app._id === applicationId 
          ? { ...app, status: { name: newStatus, updatedAt: new Date() } }
          : app
      ));
      
      alert('Cập nhật trạng thái thành công!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  const getStatusColor = (status) => {
    const statusName = typeof status === 'object' ? status?.name : status;
    switch (statusName) {
      case 'Submitted':
        return 'text-blue-600 bg-blue-100';
      case 'Reviewed':
        return 'text-yellow-600 bg-yellow-100';
      case 'Interviewed':
        return 'text-purple-600 bg-purple-100';
      case 'Hired':
        return 'text-green-600 bg-green-100';
      case 'Rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    const statusName = typeof status === 'object' ? status?.name : status;
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
        return statusName || 'N/A';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const filteredApplications = applications.filter(app => {
    const matchesJob = selectedJob === '' || app.jobId === selectedJob;
    const matchesStatus = statusFilter === 'all' || app.status?.name === statusFilter;
    const matchesSearch = searchQuery === '' || 
      app.candidateSummary?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesJob && matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: applications.length,
    Submitted: applications.filter(app => app.status?.name === 'Submitted').length,
    Reviewed: applications.filter(app => app.status?.name === 'Reviewed').length,
    Interviewed: applications.filter(app => app.status?.name === 'Interviewed').length,
    Hired: applications.filter(app => app.status?.name === 'Hired').length,
    Rejected: applications.filter(app => app.status?.name === 'Rejected').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách ứng viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý ứng viên</h1>
          <p className="text-gray-600">Xem và quản lý các đơn ứng tuyển từ ứng viên</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tên ứng viên, vị trí..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Việc làm</label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Tất cả việc làm</option>
                {jobs.map(job => (
                  <option key={job._id} value={job._id}>{job.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Submitted">Đã nộp</option>
                <option value="Reviewed">Đã xem xét</option>
                <option value="Interviewed">Phỏng vấn</option>
                <option value="Hired">Được tuyển</option>
                <option value="Rejected">Bị từ chối</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className={`p-4 rounded-lg border-2 transition-colors duration-200 cursor-pointer ${
                statusFilter === status
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => setStatusFilter(status)}
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
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có ứng viên nào</h3>
              <p className="text-gray-600">
                {searchQuery || selectedJob || statusFilter !== 'all' 
                  ? 'Không tìm thấy ứng viên phù hợp với bộ lọc.'
                  : 'Chưa có ứng viên nào ứng tuyển vào việc làm của bạn.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <div key={application._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.candidateSummary?.fullName || 'N/A'}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status?.name || application.status)}`}>
                          {getStatusText(application.status?.name || application.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-600 mb-3">
                        <div className="flex items-center">
                          <span className="font-medium">{application.jobTitle}</span>
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
                        to={`/employer/applications/${application._id}`}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Cập nhật trạng thái:</span>
                    <div className="flex items-center gap-2">
                      {['Submitted', 'Reviewed', 'Interviewed', 'Hired', 'Rejected'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(application._id, status)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                            (application.status?.name || application.status) === status
                              ? getStatusColor(status)
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {getStatusText(status)}
                        </button>
                      ))}
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
              <span className="text-sm text-gray-600">Đã nộp - Ứng viên vừa gửi đơn</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-100 rounded-full"></span>
              <span className="text-sm text-gray-600">Đã xem xét - Bạn đã xem hồ sơ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-100 rounded-full"></span>
              <span className="text-sm text-gray-600">Phỏng vấn - Đã mời phỏng vấn</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-100 rounded-full"></span>
              <span className="text-sm text-gray-600">Được tuyển - Ứng viên được chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-100 rounded-full"></span>
              <span className="text-sm text-gray-600">Bị từ chối - Không phù hợp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;
