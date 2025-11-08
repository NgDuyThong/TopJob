import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPinIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CalendarIcon,
  ShareIcon,
  HeartIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { candidateService } from '../../services/candidateService';
import { toast } from 'react-toastify';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resumeFile: null
  });
  const [submitting, setSubmitting] = useState(false);

  // Get current user info
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isCandidate = currentUser.type === 'candidate';

  useEffect(() => {
    loadJobDetails();
  }, [id]);

  // Load saved status for candidates
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (isCandidate && id) {
        try {
          const response = await candidateService.getSavedJobs();
          const isSaved = response.data.some(job => job._id === id);
          setSaved(isSaved);
        } catch (error) {
          console.error('Error checking saved status:', error);
        }
      }
    };
    checkSavedStatus();
  }, [isCandidate, id]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      
      // Lấy chi tiết việc làm
      const jobResponse = await jobService.getJobById(id);
      setJob(jobResponse.data);

      // Tăng lượt xem
      await jobService.incrementJobViews(id);

    } catch (error) {
      console.error('Error loading job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async () => {
    // Check if user is logged in as candidate
    if (!isCandidate) {
      toast.error('Vui lòng đăng nhập với tài khoản ứng viên để lưu việc làm');
      navigate('/login');
      return;
    }

    try {
      if (saved) {
        await candidateService.unsaveJob(id);
        setSaved(false);
        toast.success('Đã bỏ lưu việc làm');
      } else {
        await candidateService.saveJob(id);
        setSaved(true);
        toast.success('Đã lưu việc làm');
      }
    } catch (error) {
      console.error('Error toggling save job:', error);
      toast.error(error.message || 'Không thể lưu việc làm');
    }
  };

  const handleApplyJob = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setShowApplicationModal(true);
  };

  const handleFileChange = (e) => {
    setApplicationData(prev => ({
      ...prev,
      resumeFile: e.target.files[0]
    }));
  };

  const handleSubmitApplication = async () => {
    try {
      setSubmitting(true);

      // Validate
      if (!applicationData.resumeFile) {
        alert('Vui lòng chọn file CV (PDF, DOC, DOCX)');
        return;
      }

      if (!applicationData.coverLetter.trim()) {
        alert('Vui lòng nhập thư xin việc');
        return;
      }
      
      const response = await applicationService.submitApplication({
        jobpostId: id,
        coverLetter: applicationData.coverLetter,
        resumeFile: applicationData.resumeFile
      });

      alert('Ứng tuyển thành công!');
      setShowApplicationModal(false);
      setApplicationData({
        coverLetter: '',
        resumeFile: null
      });

    } catch (error) {
      console.error('Error submitting application:', error);
      const errorMessage = error?.message || error?.error || 'Có lỗi xảy ra khi ứng tuyển. Vui lòng thử lại.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Thỏa thuận';
    return salary;
  };

  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin việc làm...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy việc làm</h2>
          <p className="text-gray-600 mb-6">Việc làm này có thể đã bị xóa hoặc không tồn tại.</p>
          <Link
            to="/jobs"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Quay lại danh sách việc làm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Quay lại
            </button>
            <Link
              to="/jobs"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Tất cả việc làm
            </Link>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                  <span className="font-medium">{job.employerId?.companyName || 'Công ty'}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>{job.location?.city || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>{formatDate(job.datePosted)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveJob}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                {saved ? (
                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
                {saved ? 'Đã lưu' : 'Lưu việc làm'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <ShareIcon className="h-5 w-5" />
                Chia sẻ
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mô tả công việc</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Skills Required */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Kỹ năng yêu cầu</h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill.name} ({skill.level})
                  </span>
                ))}
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin công ty</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">{job.employerId?.companyName || 'Công ty'}</h3>
                  <p className="text-gray-600">{job.employerId?.field || 'Lĩnh vực'}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{job.employerId?.address || 'Địa chỉ'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    <span>Quy mô: {job.employerId?.companySize || 'N/A'}</span>
                  </div>
                  {job.employerId?.website && (
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">Website:</span>
                      <a
                        href={job.employerId.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700"
                      >
                        {job.employerId.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Apply Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {formatSalary(job.salary)}
                </div>
                <div className="text-gray-600">
                  {job.position?.level && `${job.position.level} • `}
                  {job.language}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Hạn nộp hồ sơ:</span>
                  <span className={`font-medium ${isDeadlinePassed(job.deadline) ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatDate(job.deadline)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Số lượng ứng viên:</span>
                  <span className="font-medium text-gray-900">{job.applicationsCount || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Lượt xem:</span>
                  <span className="font-medium text-gray-900">{job.views || 0}</span>
                </div>
              </div>

              {isDeadlinePassed(job.deadline) ? (
                <div className="text-center py-4">
                  <XMarkIcon className="h-12 w-12 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 font-medium">Đã hết hạn nộp hồ sơ</p>
                </div>
              ) : (
                <button
                  onClick={handleApplyJob}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Ứng tuyển ngay
                </button>
              )}

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Bạn cần đăng nhập để ứng tuyển
                </p>
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Chi tiết việc làm</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Vị trí:</span>
                  <span className="font-medium">{job.position?.title || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Cấp bậc:</span>
                  <span className="font-medium">{job.position?.level || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Địa điểm:</span>
                  <span className="font-medium">{job.location?.city || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ngôn ngữ:</span>
                  <span className="font-medium">{job.language}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`font-medium ${job.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
                    {job.status === 'open' ? 'Đang tuyển' : 'Đã đóng'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ứng tuyển việc làm</h3>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thư xin việc
                </label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Viết thư xin việc của bạn..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV/Resume (PDF, DOC, DOCX)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowApplicationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitApplication}
                disabled={submitting || !applicationData.resumeFile}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {submitting ? 'Đang gửi...' : 'Gửi đơn ứng tuyển'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;
