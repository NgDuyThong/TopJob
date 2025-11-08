import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { employerService } from '../../services/employerService';

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplicationDetail();
  }, [id]);

  const loadApplicationDetail = async () => {
    try {
      setLoading(true);
      const response = await employerService.getApplicationDetail(id);
      console.log('Application detail:', response.data);
      setApplication(response.data);
    } catch (error) {
      console.error('Error loading application detail:', error);
      alert('Không thể tải thông tin ứng viên. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await employerService.updateApplicationStatus(id, newStatus);
      
      // Update local state
      setApplication(prev => ({
        ...prev,
        status: { name: newStatus, updatedAt: new Date() }
      }));
      
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

  const downloadResume = () => {
    if (application?.resumeFile || application?.resume) {
      const resumeFileName = application.resumeFile || application.resume;
      const resumeUrl = `http://localhost:5000/uploads/resumes/${resumeFileName}`;
      window.open(resumeUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin ứng viên...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy ứng viên</h2>
          <p className="text-gray-600 mb-4">Ứng viên này không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate('/employer/applications')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/employer/applications')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Quay lại danh sách ứng viên
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {application.candidateSummary?.fullName || 'N/A'}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    {application.candidateSummary?.email && (
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        <span>{application.candidateSummary.email}</span>
                      </div>
                    )}
                    {application.candidateSummary?.phone && (
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        <span>{application.candidateSummary.phone}</span>
                      </div>
                    )}
                  </div>
                  {application.candidateSummary?.address && (
                    <div className="flex items-center text-gray-600 mt-2">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span>{application.candidateSummary.address}</span>
                    </div>
                  )}
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                  {getStatusText(application.status)}
                </span>
              </div>

              {/* Application Info */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin ứng tuyển</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Vị trí ứng tuyển</p>
                    <p className="font-medium text-gray-900">
                      <Link
                        to={`/employer/jobs/${application.jobpostId?._id || application.jobpostId}`}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        {application.jobpostId?.title || 'N/A'}
                      </Link>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày nộp đơn</p>
                    <p className="font-medium text-gray-900">{formatDate(application.submitDate)}</p>
                  </div>
                  {application.status?.updatedAt && (
                    <div>
                      <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                      <p className="font-medium text-gray-900">{formatDate(application.status.updatedAt)}</p>
                    </div>
                  )}
                  {application.viewedHistory && application.viewedHistory.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Số lần xem</p>
                      <p className="font-medium text-gray-900">{application.viewedHistory.length} lần</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            {application.coverLetter && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Thư xin việc
                </h3>
                <div className="prose max-w-none text-gray-700">
                  <p className="whitespace-pre-wrap">{application.coverLetter}</p>
                </div>
              </div>
            )}

            {/* Resume/CV */}
            {(application.resumeFile || application.resume) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  CV/Resume
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{application.resumeFile || application.resume}</p>
                      <p className="text-sm text-gray-500">CV của ứng viên</p>
                    </div>
                  </div>
                  <button
                    onClick={downloadResume}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Tải xuống
                  </button>
                </div>
              </div>
            )}

            {/* Candidate Profile Details */}
            {application.candidateSummary && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Thông tin chi tiết
                </h3>
                <div className="space-y-4">
                  {application.candidateSummary.skills && application.candidateSummary.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Kỹ năng</p>
                      <div className="flex flex-wrap gap-2">
                        {application.candidateSummary.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700"
                          >
                            {typeof skill === 'string' ? skill : skill.name || skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {application.candidateSummary.experience && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Kinh nghiệm</p>
                      <p className="text-gray-600">{application.candidateSummary.experience}</p>
                    </div>
                  )}
                  
                  {application.candidateSummary.education && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Học vấn</p>
                      <p className="text-gray-600">{application.candidateSummary.education}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cập nhật trạng thái</h3>
              <div className="space-y-2">
                {['Submitted', 'Reviewed', 'Interviewed', 'Hired', 'Rejected'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      (application.status?.name || application.status) === status
                        ? getStatusColor(status) + ' border-2 border-current'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getStatusText(status)}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Timeline */}
            {application.viewedHistory && application.viewedHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử hoạt động</h3>
                <div className="space-y-3">
                  {application.viewedHistory.slice(0, 5).map((view, index) => (
                    <div key={index} className="flex items-start">
                      <ClockIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-900">Đã xem hồ sơ</p>
                        <p className="text-xs text-gray-500">{formatDate(view.viewedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
              <div className="space-y-2">
                {application.candidateSummary?.email && (
                  <a
                    href={`mailto:${application.candidateSummary.email}`}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Gửi email
                  </a>
                )}
                {application.candidateSummary?.phone && (
                  <a
                    href={`tel:${application.candidateSummary.phone}`}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Gọi điện
                  </a>
                )}
                {(application.resumeFile || application.resume) && (
                  <button
                    onClick={downloadResume}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Tải CV
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
