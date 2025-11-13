import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useAdminStatistics, useDashboardData } from '../../hooks/useAdminData';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboardPage = () => {
  // Use custom hooks to fetch data from API
  const { stats, loading: statsLoading, error: statsError, refresh: refreshStats } = useAdminStatistics();
  const { recentJobs, recentApplications, loading: dashboardLoading, error: dashboardError } = useDashboardData();

  const loading = statsLoading || dashboardLoading;
  const error = statsError || dashboardError;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'text-green-600 bg-green-100';
      case 'closed':
        return 'text-red-600 bg-red-100';
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
    switch (status) {
      case 'open':
        return 'Đang tuyển';
      case 'closed':
        return 'Đã đóng';
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
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <p className="text-lg font-semibold">Lỗi tải dữ liệu</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={refreshStats}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Tổng quan hệ thống quản lý tuyển dụng</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalUsers?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ứng viên</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalCandidates?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nhà tuyển dụng</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalEmployers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BriefcaseIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Việc làm</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalJobs || 0}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats?.activeJobs || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đơn ứng tuyển</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalApplications?.toLocaleString() || 0}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{stats?.pendingApplications || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIcon className="h-8 w-8 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng lượt xem</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalViews?.toLocaleString() || 0}</p>
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
                  to="/admin/jobs"
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  Xem tất cả
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentJobs && recentJobs.length > 0 ? recentJobs.map((job) => (
                  <div key={job._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>{job.companyName}</span>
                        <span>{job.applicationsCount} ứng viên</span>
                        <span>{job.views} lượt xem</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {getStatusText(job.status)}
                      </span>
                      <Link
                        to={`/admin/jobs/${job._id}`}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                      >
                        Xem
                      </Link>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-4">Không có việc làm gần đây</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Đơn ứng tuyển mới</h2>
                <Link
                  to="/admin/applications"
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  Xem tất cả
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentApplications && recentApplications.length > 0 ? recentApplications.map((application) => (
                  <div key={application._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{application.candidateName}</h3>
                      <p className="text-sm text-gray-600">{application.jobTitle}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(application.submitDate)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                      <Link
                        to={`/admin/applications/${application._id}`}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                      >
                        Xem
                      </Link>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 py-4">Không có đơn ứng tuyển mới</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Quản lý người dùng</h3>
                <p className="text-sm text-gray-600">Xem và quản lý tài khoản</p>
              </div>
            </Link>

            <Link
              to="/admin/jobs"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <BriefcaseIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Quản lý việc làm</h3>
                <p className="text-sm text-gray-600">Duyệt và quản lý bài đăng</p>
              </div>
            </Link>

            <Link
              to="/admin/companies"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Quản lý công ty</h3>
                <p className="text-sm text-gray-600">Xem và quản lý nhà tuyển dụng</p>
              </div>
            </Link>

            <Link
              to="/admin/reports"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Báo cáo thống kê</h3>
                <p className="text-sm text-gray-600">Xem báo cáo và phân tích</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
