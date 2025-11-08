import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HandThumbUpIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UserGroupIcon,
  EyeIcon,
  ClockIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const EmployersInterestedPage = () => {
  const [employers, setEmployers] = useState([]);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return `${Math.floor(diffDays / 30)} tháng trước`;
  };

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-teal-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-2xl">
                <HandThumbUpIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Nhà tuyển dụng quan tâm
              </h1>
              <p className="text-gray-600 mt-1">{employers.length} công ty đã xem hồ sơ của bạn</p>
            </div>
          </div>
        </div>

        {employers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-500 rounded-full blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-full">
                <HandThumbUpIcon className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Chưa có nhà tuyển dụng nào</h3>
            <p className="text-gray-600 mb-6">Khi có nhà tuyển dụng quan tâm, thông tin sẽ hiển thị tại đây</p>
            <Link
              to="/candidate/profile/edit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <UserGroupIcon className="h-5 w-5" />
              Cải thiện hồ sơ
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {employers.map((employer) => (
              <div 
                key={employer.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl flex items-center justify-center">
                        <BuildingOfficeIcon className="h-10 w-10 text-green-600" />
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <Link 
                            to={`/companies/${employer.id}`}
                            className="text-2xl font-bold text-gray-900 hover:text-green-600 transition-colors"
                          >
                            {employer.companyName}
                          </Link>
                          <p className="text-gray-600 mt-1">{employer.field}</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          <EyeIcon className="h-4 w-4" />
                          Đã xem hồ sơ
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPinIcon className="h-5 w-5 text-green-600" />
                          <span className="text-sm">{employer.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <UserGroupIcon className="h-5 w-5 text-blue-600" />
                          <span className="text-sm">{employer.companySize} nhân viên</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <ClockIcon className="h-5 w-5 text-orange-600" />
                          <span className="text-sm">{formatTimeAgo(employer.viewedAt)}</span>
                        </div>
                      </div>

                      {/* Message */}
                      {employer.message && (
                        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 mb-4">
                          <div className="flex items-start gap-2">
                            <EnvelopeIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">Tin nhắn từ nhà tuyển dụng:</p>
                              <p className="text-sm text-gray-700 line-clamp-2">{employer.message}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        <Link
                          to={`/companies/${employer.id}`}
                          className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium"
                        >
                          Xem công ty
                        </Link>
                        <Link
                          to={`/jobs?company=${employer.id}`}
                          className="px-6 py-2.5 bg-white border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-colors text-sm font-medium"
                        >
                          {employer.jobsCount} việc làm
                        </Link>
                        {employer.message && (
                          <button
                            className="px-6 py-2.5 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            Phản hồi
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="px-6 py-3 bg-gradient-to-r from-green-50 to-teal-50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      💡 <span className="font-medium">Mẹo:</span> Hãy phản hồi nhanh để tăng cơ hội được mời phỏng vấn
                    </span>
                    <span className="text-green-600 font-medium">
                      {formatTimeAgo(employer.viewedAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        {employers.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl p-6 border border-green-200">
            <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
              <HandThumbUpIcon className="h-6 w-6" />
              Mẹo để thu hút nhà tuyển dụng
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>Cập nhật hồ sơ thường xuyên để tăng khả năng hiển thị</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>Thêm kỹ năng và chứng chỉ mới nhất</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>Phản hồi nhanh tin nhắn từ nhà tuyển dụng</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>Tìm hiểu kỹ về công ty trước khi phản hồi</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployersInterestedPage;
