import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BriefcaseIcon,
  UserGroupIcon,
  EyeIcon,
  ChartBarIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { employerService } from '../../services/employerService';
import JobStats from '../../components/employer/JobStats';

const DashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    totalViews: 0,
    hiredCandidates: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load employer profile
      const profileResponse = await employerService.getProfile();
      setProfile(profileResponse.data);

      // Load posted jobs
      const jobsResponse = await employerService.getPostedJobs();
      const jobs = jobsResponse.data || [];
      setRecentJobs(jobs.slice(0, 5));

      // Calculate stats
      const totalJobs = jobs.length;
      const activeJobs = jobs.filter(job => job.status === 'open').length;
      const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);
      
      // Load applications for each job
      let totalApplications = 0;
      let pendingApplications = 0;
      let hiredCandidates = 0;
      
      for (const job of jobs) {
        try {
          const applicationsResponse = await employerService.getJobApplications(job._id);
          const applications = applicationsResponse.data || [];
          totalApplications += applications.length;
          pendingApplications += applications.filter(app => app.status.name === 'Submitted').length;
          hiredCandidates += applications.filter(app => app.status.name === 'Hired').length;
        } catch (error) {
          console.error(`Error loading applications for job ${job._id}:`, error);
        }
      }

      setStats({
        totalJobs,
        activeJobs,
        totalApplications,
        pendingApplications,
        totalViews,
        hiredCandidates
      });

      // Load recent applications (from first few jobs)
      if (jobs.length > 0) {
        try {
          const firstJobApplications = await employerService.getJobApplications(jobs[0]._id);
          setRecentApplications(firstJobApplications.data?.slice(0, 5) || []);
        } catch (error) {
          console.error('Error loading recent applications:', error);
        }
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
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
    switch (status) {
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
    switch (status) {
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
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Chào mừng trở lại, {profile?.companyName || 'Nhà tuyển dụng'}!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BriefcaseIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng việc làm</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Việc làm đang tuyển</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng ứng viên</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ xem xét</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng lượt xem</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã tuyển</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.hiredCandidates}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Việc làm gần đây</h2>
                <Link
                  to="/employer/jobs"
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  Xem tất cả
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentJobs.length === 0 ? (
                <div className="text-center py-8">
                  <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có việc làm nào</h3>
                  <p className="text-gray-600 mb-4">Hãy bắt đầu đăng tin tuyển dụng đầu tiên của bạn.</p>
                  <Link
                    to="/employer/jobs/create"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Đăng tin tuyển dụng
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div key={job._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>{job.location?.city || 'N/A'}</span>
                          <span>{job.applicationsCount || 0} ứng viên</span>
                          <span>{job.views || 0} lượt xem</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {getStatusText(job.status)}
                        </span>
                        <Link
                          to={`/employer/jobs/${job._id}`}
                          className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                        >
                          Xem
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Ứng viên mới</h2>
                <Link
                  to="/employer/applications"
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  Xem tất cả
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentApplications.length === 0 ? (
                <div className="text-center py-8">
                  <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có ứng viên nào</h3>
                  <p className="text-gray-600">Ứng viên sẽ xuất hiện ở đây khi họ ứng tuyển vào việc làm của bạn.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <div key={application._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{application.candidateSummary?.fullName || 'N/A'}</h3>
                        <p className="text-sm text-gray-600">{application.jobSummary?.title || 'N/A'}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(application.submitDate)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApplicationStatusColor(application.status.name)}`}>
                          {getApplicationStatusText(application.status.name)}
                        </span>
                        <Link
                          to={`/employer/applications/${application._id}`}
                          className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                        >
                          Xem
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/employer/jobs/create"
              className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <PlusIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-purple-600">Đăng tin mới</h3>
                <p className="text-sm text-gray-600">Tạo tin tuyển dụng</p>
              </div>
            </Link>

            <Link
              to="/employer/candidates/search"
              className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <MagnifyingGlassIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600">Tìm ứng viên</h3>
                <p className="text-sm text-gray-600">Tìm kiếm nhân tài</p>
              </div>
            </Link>

            <Link
              to="/employer/saved-candidates"
              className="flex items-center gap-3 p-4 border-2 border-pink-200 rounded-xl hover:bg-pink-50 hover:border-pink-400 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-pink-600">Đã lưu</h3>
                <p className="text-sm text-gray-600">Ứng viên quan tâm</p>
              </div>
            </Link>

            <Link
              to="/employer/statistics"
              className="flex items-center gap-3 p-4 border-2 border-indigo-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600">Thống kê</h3>
                <p className="text-sm text-gray-600">Phân tích dữ liệu</p>
              </div>
            </Link>

            <Link
              to="/employer/profile"
              className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-xl hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-orange-600">Công ty</h3>
                <p className="text-sm text-gray-600">Thông tin công ty</p>
              </div>
            </Link>

            <Link
              to="/employer/jobs"
              className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-xl hover:bg-green-50 hover:border-green-400 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <BriefcaseIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-green-600">Quản lý tin</h3>
                <p className="text-sm text-gray-600">Tin tuyển dụng</p>
              </div>
            </Link>

            <Link
              to="/employer/applications"
              className="flex items-center gap-3 p-4 border-2 border-teal-200 rounded-xl hover:bg-teal-50 hover:border-teal-400 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-teal-600">Đơn ứng tuyển</h3>
                <p className="text-sm text-gray-600">Xem hồ sơ</p>
              </div>
            </Link>

            <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-lg">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-700">Sắp ra mắt</h3>
                <p className="text-sm text-gray-500">Tính năng mới</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
