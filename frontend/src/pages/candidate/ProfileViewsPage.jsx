import React, { useState } from 'react';
import { 
  EyeIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ClockIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const ProfileViewsPage = () => {
  const [stats] = useState({
    totalViews: 0,
    thisWeek: 0,
    thisMonth: 0,
    growth: 0
  });

  const [views, setViews] = useState([]);

  const [timeFilter, setTimeFilter] = useState('all'); // all, today, week, month

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Vừa xong';
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-2xl">
                <EyeIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Lượt xem hồ sơ
              </h1>
              <p className="text-gray-600 mt-1">Theo dõi ai đã xem hồ sơ của bạn</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <EyeIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalViews}</div>
            <div className="text-sm text-gray-600">Tổng lượt xem</div>
            <div className="mt-2 text-xs text-green-600 font-medium">
              +{stats.growth}% so với tháng trước
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-purple-100 rounded-xl">
                <CalendarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.thisWeek}</div>
            <div className="text-sm text-gray-600">Tuần này</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-100 rounded-xl">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.thisMonth}</div>
            <div className="text-sm text-gray-600">Tháng này</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">4m 12s</div>
            <div className="text-sm text-indigo-100">TB thời gian xem</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mb-6">
          <div className="flex gap-3">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'today', label: 'Hôm nay' },
              { value: 'week', label: 'Tuần này' },
              { value: 'month', label: 'Tháng này' }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setTimeFilter(filter.value)}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                  timeFilter === filter.value
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Views List */}
        {views.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-full">
                <EyeIcon className="h-16 w-16 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Chưa có dữ liệu</h3>
            <p className="text-gray-600 mb-6">Khi có lượt xem mới, dữ liệu sẽ hiển thị tại đây</p>
            <Link
              to="/candidate/profile/edit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Cải thiện hồ sơ
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {views.map((view) => (
              <div 
                key={view.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                        <BuildingOfficeIcon className="h-8 w-8 text-indigo-600" />
                      </div>
                    </div>

                    {/* View Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{view.companyName}</h3>
                          <p className="text-gray-600 text-sm">{view.field}</p>
                        </div>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                          {formatDateTime(view.viewedAt)}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPinIcon className="h-5 w-5 text-indigo-600" />
                          <span className="text-sm">{view.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <ClockIcon className="h-5 w-5 text-purple-600" />
                          <span className="text-sm">Xem trong {view.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <EyeIcon className="h-5 w-5 text-blue-600" />
                          <span className="text-sm">{view.sections.length} phần</span>
                        </div>
                      </div>

                      {/* Sections Viewed */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Đã xem:</p>
                        <div className="flex flex-wrap gap-2">
                          {view.sections.map((section, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm"
                            >
                              {section}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <Link
                        to={`/companies/${view.id}`}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium"
                      >
                        <BuildingOfficeIcon className="h-4 w-4" />
                        Xem công ty
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">💡 Mẹo:</span> Công ty này đã dành {view.duration} để xem hồ sơ của bạn - đây là dấu hiệu tích cực!
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        {views.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6 border border-indigo-200">
            <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
              <ChartBarIcon className="h-6 w-6" />
              Tăng lượt xem hồ sơ
            </h3>
            <ul className="space-y-2 text-sm text-indigo-800">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold mt-1">✓</span>
                <span>Cập nhật hồ sơ thường xuyên (ít nhất 1 lần/tuần)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold mt-1">✓</span>
                <span>Thêm ảnh đại diện chuyên nghiệp</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold mt-1">✓</span>
                <span>Hoàn thiện 100% các mục trong hồ sơ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold mt-1">✓</span>
                <span>Sử dụng từ khóa liên quan đến ngành nghề</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileViewsPage;
