import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { employerService } from '../../services/employerService';
import { jobService } from '../../services/jobService';
import { toast } from 'react-toastify';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    loadJobDetails();
  }, [id]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      
      // Load job details
      const jobResponse = await jobService.getJobById(id);
      setJob(jobResponse.data);

      // Load applications
      const applicationsResponse = await employerService.getJobApplications(id);
      setApplications(applicationsResponse.data || []);

    } catch (error) {
      console.error('Error loading job details:', error);
      toast.error('Không thể tải thông tin công việc');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      return;
    }

    try {
      await jobService.deleteJob(id);
      toast.success('Đã xóa công việc thành công');
      navigate('/employer/dashboard');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Không thể xóa công việc');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await jobService.updateJob(id, { status: newStatus });
      setJob(prev => ({ ...prev, status: newStatus }));
      toast.success(`Đã ${newStatus === 'open' ? 'mở' : 'đóng'} công việc`);
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await employerService.updateApplicationStatus(applicationId, newStatus);
      
      // Reload applications
      const applicationsResponse = await employerService.getJobApplications(id);
      setApplications(applicationsResponse.data || []);
      
      toast.success('Đã cập nhật trạng thái ứng viên');
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Không thể cập nhật trạng thái ứng viên');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Thỏa thuận';
    return `${parseInt(salary).toLocaleString('vi-VN')} VNĐ`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'text-green-600 bg-green-100';
      case 'closed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return 'Đang tuyển';
      case 'closed':
        return 'Đã đóng';
      default:
        return status;
    }
  };

  const getApplicationStatusColor = (status) => {
    const statusName = typeof status === 'string' ? status : status?.name;
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

  const getApplicationStatusText = (status) => {
    const statusName = typeof status === 'string' ? status : status?.name;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin công việc...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy công việc</h2>
          <Link
            to="/employer/dashboard"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Quay lại Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-5 w-5" />
                  <span>{job.location?.city || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CurrencyDollarIcon className="h-5 w-5" />
                  <span>{formatSalary(job.salary)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Hạn: {formatDate(job.deadline)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                {getStatusText(job.status)}
              </span>
              <button
                onClick={() => handleUpdateStatus(job.status === 'open' ? 'closed' : 'open')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  job.status === 'open'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {job.status === 'open' ? 'Đóng tuyển' : 'Mở lại tuyển dụng'}
              </button>
              <Link
                to={`/employer/jobs/${id}/edit`}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <PencilIcon className="h-5 w-5" />
              </Link>
              <button
                onClick={handleDeleteJob}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Ứng viên</p>
                  <p className="text-2xl font-semibold text-gray-900">{applications.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <EyeIcon className="h-8 w-8 text-indigo-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Lượt xem</p>
                  <p className="text-2xl font-semibold text-gray-900">{job.views || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Đã đăng</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatDate(job.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Chi tiết công việc
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Ứng viên ({applications.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'details' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Job Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Mô tả công việc</h2>
              <div className="prose max-w-none text-gray-600">
                {job.description}
              </div>
            </div>

            {/* Position */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Vị trí</h2>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">{job.position?.title || 'N/A'}</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                  {job.position?.level || 'N/A'}
                </span>
              </div>
            </div>

            {/* Skills Required */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Kỹ năng yêu cầu</h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired?.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-purple-600">({skill.level})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Địa điểm</h2>
              <div className="text-gray-600">
                <p>{job.location?.address}</p>
                <p>{job.location?.city}</p>
              </div>
            </div>

            {/* Other Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Mức lương</h3>
                <p className="text-gray-600">{formatSalary(job.salary)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Ngôn ngữ</h3>
                <p className="text-gray-600">{job.language || 'Tiếng Việt'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Hạn nộp</h3>
                <p className="text-gray-600">{formatDate(job.deadline)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Trạng thái</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                  {getStatusText(job.status)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có ứng viên nào</h3>
                <p className="text-gray-600">Các ứng viên sẽ xuất hiện ở đây khi họ nộp đơn ứng tuyển.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {applications.map((application) => (
                  <div key={application._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.candidateId?.userId?.fullName || 'N/A'}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApplicationStatusColor(application.status)}`}>
                            {getApplicationStatusText(application.status)}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          <p>Email: {application.candidateId?.userId?.email || 'N/A'}</p>
                          <p>Ngày nộp: {formatDate(application.appliedDate)}</p>
                        </div>

                        <div className="mb-3">
                          <h4 className="font-medium text-gray-900 mb-1">Thư xin việc:</h4>
                          <p className="text-gray-600 text-sm">{application.coverLetter || 'Không có'}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          {application.resume && (
                            <a
                              href={`http://localhost:3000/${application.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                            >
                              Xem CV
                            </a>
                          )}
                          <Link
                            to={`/candidate/profile/${application.candidateId?._id}`}
                            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                          >
                            Xem hồ sơ
                          </Link>
                        </div>
                      </div>

                      <div className="ml-4">
                        <select
                          value={typeof application.status === 'string' ? application.status : application.status?.name || ''}
                          onChange={(e) => handleUpdateApplicationStatus(application._id, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="Submitted">Đã nộp</option>
                          <option value="Reviewed">Đã xem xét</option>
                          <option value="Interviewed">Phỏng vấn</option>
                          <option value="Hired">Được tuyển</option>
                          <option value="Rejected">Từ chối</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsPage;
