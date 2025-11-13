import { useState } from 'react';
import { ChartBarIcon, UsersIcon, BriefcaseIcon, DocumentTextIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../../components/admin/AdminLayout';

const ReportsPage = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Sample data for charts
    const userRegistrations = [
        { month: 'T1', value: 45, label: 'Jan' },
        { month: 'T2', value: 52, label: 'Feb' },
        { month: 'T3', value: 48, label: 'Mar' },
        { month: 'T4', value: 68, label: 'Apr' },
        { month: 'T5', value: 75, label: 'May' },
        { month: 'T6', value: 82, label: 'Jun' },
        { month: 'T7', value: 90, label: 'Jul' },
        { month: 'T8', value: 85, label: 'Aug' },
        { month: 'T9', value: 95, label: 'Sep' },
        { month: 'T10', value: 88, label: 'Oct' },
        { month: 'T11', value: 92, label: 'Nov' },
        { month: 'T12', value: 105, label: 'Dec' }
    ];

    const jobPostings = [
        { month: 'T1', value: 28 },
        { month: 'T2', value: 35 },
        { month: 'T3', value: 42 },
        { month: 'T4', value: 38 },
        { month: 'T5', value: 45 },
        { month: 'T6', value: 52 },
        { month: 'T7', value: 58 },
        { month: 'T8', value: 55 },
        { month: 'T9', value: 62 },
        { month: 'T10', value: 68 },
        { month: 'T11', value: 72 },
        { month: 'T12', value: 78 }
    ];

    const applications = [
        { month: 'T1', value: 120 },
        { month: 'T2', value: 145 },
        { month: 'T3', value: 165 },
        { month: 'T4', value: 158 },
        { month: 'T5', value: 185 },
        { month: 'T6', value: 210 },
        { month: 'T7', value: 235 },
        { month: 'T8', value: 225 },
        { month: 'T9', value: 255 },
        { month: 'T10', value: 280 },
        { month: 'T11', value: 295 },
        { month: 'T12', value: 320 }
    ];

    const maxUserValue = Math.max(...userRegistrations.map(d => d.value));
    const maxJobValue = Math.max(...jobPostings.map(d => d.value));
    const maxAppValue = Math.max(...applications.map(d => d.value));

    const BarChart = ({ data, maxValue, color = 'purple' }) => {
        return (
            <div className="h-64 flex items-end justify-between gap-2 px-4">
                {data.map((item, index) => {
                    const height = (item.value / maxValue) * 100;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="relative w-full group">
                                <div 
                                    className={`w-full bg-${color}-600 rounded-t-lg transition-all duration-300 hover:bg-${color}-700 cursor-pointer`}
                                    style={{ height: `${height * 2}px` }}
                                >
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {item.value}
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs text-gray-600">{item.month}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    const LineChart = ({ data, maxValue, color = 'blue' }) => {
        const points = data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (item.value / maxValue) * 100;
            return `${x},${y}`;
        }).join(' ');

        return (
            <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((y) => (
                        <line
                            key={y}
                            x1="0"
                            y1={y}
                            x2="100"
                            y2={y}
                            stroke="#e5e7eb"
                            strokeWidth="0.2"
                        />
                    ))}
                    
                    {/* Area under line */}
                    <polygon
                        points={`0,100 ${points} 100,100`}
                        fill={`url(#gradient-${color})`}
                        opacity="0.3"
                    />
                    
                    {/* Line */}
                    <polyline
                        points={points}
                        fill="none"
                        stroke={color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : '#9333ea'}
                        strokeWidth="0.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    
                    {/* Gradient definition */}
                    <defs>
                        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : '#9333ea'} />
                            <stop offset="100%" stopColor={color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : '#9333ea'} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
                
                {/* X-axis labels */}
                <div className="flex justify-between px-4 mt-2">
                    {data.map((item, index) => (
                        index % 2 === 0 && (
                            <span key={index} className="text-xs text-gray-600">{item.month}</span>
                        )
                    ))}
                </div>
            </div>
        );
    };

    return (
        <AdminLayout>
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Báo cáo thống kê</h1>
                    <p className="text-gray-600">Xem báo cáo và phân tích dữ liệu hệ thống</p>
                </div>

                {/* Date Range Filter */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Chọn khoảng thời gian</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <UsersIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Người dùng mới</p>
                                    <p className="text-2xl font-semibold text-gray-900">1,025</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                                        <span className="text-sm text-green-600 font-medium">+12.5%</span>
                                        <span className="text-xs text-gray-500">vs tháng trước</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <BriefcaseIcon className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Việc làm mới</p>
                                    <p className="text-2xl font-semibold text-gray-900">856</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                                        <span className="text-sm text-green-600 font-medium">+8.3%</span>
                                        <span className="text-xs text-gray-500">vs tháng trước</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Đơn ứng tuyển mới</p>
                                    <p className="text-2xl font-semibold text-gray-900">3,420</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                                        <span className="text-sm text-green-600 font-medium">+15.2%</span>
                                        <span className="text-xs text-gray-500">vs tháng trước</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Đăng ký người dùng</h2>
                            <span className="text-sm text-gray-500">12 tháng gần đây</span>
                        </div>
                        <BarChart data={userRegistrations} maxValue={maxUserValue} color="purple" />
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Việc làm đăng tuyển</h2>
                            <span className="text-sm text-gray-500">12 tháng gần đây</span>
                        </div>
                        <BarChart data={jobPostings} maxValue={maxJobValue} color="green" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Xu hướng ứng tuyển</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                <span className="text-sm text-gray-600">Đơn ứng tuyển</span>
                            </div>
                            <span className="text-sm text-gray-500">12 tháng gần đây</span>
                        </div>
                    </div>
                    <LineChart data={applications} maxValue={maxAppValue} color="blue" />
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Tỷ lệ chuyển đổi</p>
                            <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">24.5%</p>
                        <p className="text-xs text-gray-500 mt-1">+2.3% so với tháng trước</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Thời gian trung bình</p>
                            <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">14 ngày</p>
                        <p className="text-xs text-gray-500 mt-1">-1 ngày so với tháng trước</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Tỷ lệ thành công</p>
                            <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">68.2%</p>
                        <p className="text-xs text-gray-500 mt-1">+5.1% so với tháng trước</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Đánh giá trung bình</p>
                            <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">4.7/5</p>
                        <p className="text-xs text-gray-500 mt-1">+0.2 so với tháng trước</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ReportsPage;
