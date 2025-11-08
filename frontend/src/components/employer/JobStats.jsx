import React from 'react';
import {
  ChartBarIcon,
  BriefcaseIcon,
  UserGroupIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const JobStatsCard = ({ icon: Icon, title, value, subtitle, color = 'blue', trend }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 bg-blue-100 text-blue-600',
    green: 'from-green-500 to-green-600 bg-green-100 text-green-600',
    purple: 'from-purple-500 to-purple-600 bg-purple-100 text-purple-600',
    orange: 'from-orange-500 to-orange-600 bg-orange-100 text-orange-600',
    red: 'from-red-500 to-red-600 bg-red-100 text-red-600',
    yellow: 'from-yellow-500 to-yellow-600 bg-yellow-100 text-yellow-600'
  };

  const [gradientClass, bgClass, textClass] = colorClasses[color].split(' ');

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${bgClass} rounded-xl`}>
          <Icon className={`h-6 w-6 ${textClass}`} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className={`text-3xl font-bold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent mb-1`}>
        {value}
      </div>
      <div className="text-sm font-medium text-gray-700 mb-1">{title}</div>
      {subtitle && (
        <div className="text-xs text-gray-500">{subtitle}</div>
      )}
    </div>
  );
};

const JobStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <JobStatsCard
        icon={BriefcaseIcon}
        title="Tin tuyển dụng"
        value={stats?.totalJobs || 0}
        subtitle="Tổng số tin đã đăng"
        color="blue"
      />
      <JobStatsCard
        icon={UserGroupIcon}
        title="Đơn ứng tuyển"
        value={stats?.totalApplications || 0}
        subtitle="Tổng số đơn nhận được"
        color="green"
        trend={stats?.applicationsTrend}
      />
      <JobStatsCard
        icon={EyeIcon}
        title="Lượt xem"
        value={stats?.totalViews || 0}
        subtitle="Lượt xem tin tuyển dụng"
        color="purple"
        trend={stats?.viewsTrend}
      />
      <JobStatsCard
        icon={CheckCircleIcon}
        title="Đã chấp nhận"
        value={stats?.acceptedApplications || 0}
        subtitle="Ứng viên được tuyển"
        color="green"
      />
    </div>
  );
};

export { JobStatsCard };
export default JobStats;
