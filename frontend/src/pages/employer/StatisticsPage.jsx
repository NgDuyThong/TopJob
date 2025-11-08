import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  BriefcaseIcon,
  UserGroupIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { employerService } from '../../services/employerService';
import JobStats from '../../components/employer/JobStats';
import { toast } from 'react-toastify';

const StatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // all, week, month, year

  useEffect(() => {
    loadStatistics();
  }, [timeRange]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      
      // Lấy danh sách jobs
      const jobsResponse = await employerService.getPostedJobs();
      const jobs = jobsResponse.data || [];
      
      // Tính toán thống kê
      const totalJobs = jobs.length;
      const activeJobs = jobs.filter(job => job.status === 'open').length;
      const closedJobs = jobs.filter(job => job.status === 'closed').length;
      const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);
      const avgViewsPerJob = totalJobs > 0 ? Math.round(totalViews / totalJobs) : 0;
      
      // Lấy tất cả applications từ các jobs
      let allApplications = [];
      const jobsWithApplications = [];
      
      for (const job of jobs) {
        try {
          const applicationsResponse = await employerService.getJobApplications(job._id);
          const applications = applicationsResponse.data || [];
          allApplications = allApplications.concat(applications);
          
          if (applications.length > 0) {
            jobsWithApplications.push({
              title: job.title,
              applications: applications.length,
              views: job.views || 0
            });
          }
        } catch (error) {
          console.error(`Error loading applications for job ${job._id}:`, error);
        }
      }
      
      // Tính toán thống kê applications
      const totalApplications = allApplications.length;
      const pendingApplications = allApplications.filter(app => 
        app.status.name === 'Submitted' || app.status.name === 'Pending'
      ).length;
      const reviewedApplications = allApplications.filter(app => 
        app.status.name === 'Reviewed' || app.status.name === 'Interviewed'
      ).length;
      const acceptedApplications = allApplications.filter(app => 
        app.status.name === 'Accepted' || app.status.name === 'Hired'
      ).length;
      const rejectedApplications = allApplications.filter(app => 
        app.status.name === 'Rejected'
      ).length;
      
      // Tính tỷ lệ
      const applicationRate = totalViews > 0 ? ((totalApplications / totalViews) * 100).toFixed(1) : 0;
      const responseRate = totalApplications > 0 ? (((reviewedApplications + acceptedApplications + rejectedApplications) / totalApplications) * 100).toFixed(1) : 0;
      
      // Sắp xếp top jobs
      const topJobs = jobsWithApplications
        .sort((a, b) => b.applications - a.applications)
        .slice(0, 3);
      
      const calculatedStats = {
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplications,
        pendingApplications,
        reviewedApplications,
        acceptedApplications,
        rejectedApplications,
        totalViews,
        avgViewsPerJob,
        applicationRate: parseFloat(applicationRate),
        responseRate: parseFloat(responseRate),
        trends: {
          applications: 0, // Cần dữ liệu lịch sử để tính
          views: 0,
          responseTime: 0
        },
        topJobs,
        applicationsByStatus: {
          pending: pendingApplications,
          reviewing: reviewedApplications,
          accepted: acceptedApplications,
          rejected: rejectedApplications
        }
      };
      
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error loading statistics:', error);
      toast.error('Không thể tải thống kê');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const data = stats || {
    totalJobs: 0,
    activeJobs: 0,
    closedJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    reviewedApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    totalViews: 0,
    avgViewsPerJob: 0,
    applicationRate: 0,
    responseRate: 0,
    trends: { applications: 0, views: 0, responseTime: 0 },
    topJobs: [],
    applicationsByStatus: { pending: 0, reviewing: 0, accepted: 0, rejected: 0 }
  };

  const TrendIndicator = ({ value }) => {
    const isPositive = value > 0;
    const isNegative = value < 0;
    
    return (
      <div className={`flex items-center gap-1 text-sm font-medium ${
        isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
      }`}>
        {isPositive && <ArrowTrendingUpIcon className="h-4 w-4" />}
        {isNegative && <ArrowTrendingDownIcon className="h-4 w-4" />}
        <span>{Math.abs(value)}%</span>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-20"></div>
                <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-2xl">
                  <ChartBarIcon className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Thống kê & Phân tích
                </h1>
                <p className="text-gray-600 mt-1">Theo dõi hiệu suất tuyển dụng</p>
              </div>
            </div>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="year">Năm nay</option>
            </select>
          </div>
        </div>

        {/* Main Stats */}
        <JobStats stats={data} />

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Application Status Breakdown */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Trạng thái đơn ứng tuyển</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Chờ xử lý</p>
                    <p className="text-sm text-gray-600">Đơn mới chưa xem</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {data.applicationsByStatus?.pending || data.pendingApplications}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <EyeIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Đang xem xét</p>
                    <p className="text-sm text-gray-600">Đang đánh giá</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {data.applicationsByStatus?.reviewing || data.reviewedApplications}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Đã chấp nhận</p>
                    <p className="text-sm text-gray-600">Ứng viên được tuyển</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {data.applicationsByStatus?.accepted || data.acceptedApplications}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircleIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Đã từ chối</p>
                    <p className="text-sm text-gray-600">Không phù hợp</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {data.applicationsByStatus?.rejected || data.rejectedApplications}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Hiệu suất tuyển dụng</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Tỷ lệ ứng tuyển</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-indigo-600">{data.applicationRate}%</span>
                    <TrendIndicator value={data.trends?.applications} />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(data.applicationRate, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Tỷ lệ ứng viên ứng tuyển so với lượt xem</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Tỷ lệ phản hồi</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">{data.responseRate}%</span>
                    <TrendIndicator value={5.2} />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(data.responseRate, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Tỷ lệ đơn đã được xử lý</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Lượt xem trung bình</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-purple-600">{data.avgViewsPerJob}</span>
                    <TrendIndicator value={data.trends?.views} />
                  </div>
                </div>
                <p className="text-xs text-gray-500">Mỗi tin tuyển dụng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Jobs */}
        {data.topJobs && data.topJobs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Tin tuyển dụng hàng đầu</h3>
            <div className="space-y-4">
              {data.topJobs.map((job, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                    index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-white' :
                    'bg-gradient-to-r from-orange-300 to-orange-400 text-white'
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{job.title}</p>
                    <div className="flex gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <UserGroupIcon className="h-4 w-4" />
                        {job.applications} ứng tuyển
                      </span>
                      <span className="flex items-center gap-1">
                        <EyeIcon className="h-4 w-4" />
                        {job.views} lượt xem
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Tỷ lệ chuyển đổi</div>
                    <div className="text-lg font-bold text-indigo-600">
                      {((job.applications / job.views) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 rounded-2xl p-6 mt-6">
          <h3 className="text-lg font-bold text-indigo-900 mb-3">💡 Gợi ý cải thiện</h3>
          <ul className="space-y-2 text-indigo-800">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600">•</span>
              <span>Tin tuyển dụng có lượt xem cao thường có tiêu đề rõ ràng và mô tả chi tiết</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600">•</span>
              <span>Phản hồi nhanh đơn ứng tuyển giúp tăng uy tín với ứng viên</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600">•</span>
              <span>Cập nhật thông tin công ty thường xuyên để thu hút ứng viên tiềm năng</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
