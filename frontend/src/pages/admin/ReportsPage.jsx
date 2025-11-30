import { useState, useEffect } from 'react';
import { UsersIcon, BriefcaseIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';

const ReportsPage = () => {
    // Set default date range to last 30 days
    const getDefaultDates = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        
        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        };
    };

    const defaultDates = getDefaultDates();
    const [startDate, setStartDate] = useState(defaultDates.start);
    const [endDate, setEndDate] = useState(defaultDates.end);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null);
    const [reportsData, setReportsData] = useState(null);

    // Fetch reports data from API
    useEffect(() => {
        fetchReportsData();
    }, [startDate, endDate]);

    const fetchReportsData = async () => {
        try {
            setLoading(true);
            
            // Build query params
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            
            // Fetch reports and summary in parallel
            const [reportsRes, summaryRes] = await Promise.all([
                api.get(`/admin/reports?${params.toString()}`),
                api.get(`/admin/reports/summary?${params.toString()}`)
            ]);

            console.log('Reports Data:', reportsRes.data.data);
            console.log('Summary Data:', summaryRes.data.data);

            setReportsData(reportsRes.data.data);
            setSummary(summaryRes.data.data.summary);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    // Sample data for charts (fallback)
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

    // Fill missing dates in range and group if needed
    const fillMissingDates = (data, start, end) => {
        if (!data || data.length === 0) return [];
        
        const startDate = new Date(start);
        const endDate = new Date(end);
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        // If more than 60 days, group by week
        if (daysDiff > 60) {
            return groupByWeek(data, startDate, endDate);
        }
        
        const result = [];
        const dataMap = {};
        
        // Create map of existing data
        data.forEach(item => {
            dataMap[item.date] = item.count;
        });
        
        // Fill all dates in range
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            result.push({
                month: currentDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' }),
                value: dataMap[dateStr] || 0,
                label: dateStr
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return result;
    };

    // Group data by week
    const groupByWeek = (data, startDate, endDate) => {
        const weekMap = {};
        
        // Group existing data by week
        data.forEach(item => {
            const date = new Date(item.date);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
            const weekKey = weekStart.toISOString().split('T')[0];
            
            if (!weekMap[weekKey]) {
                weekMap[weekKey] = 0;
            }
            weekMap[weekKey] += item.count;
        });
        
        // Fill all weeks in range
        const result = [];
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() - currentDate.getDay()); // Start from Sunday
        
        while (currentDate <= endDate) {
            const weekKey = currentDate.toISOString().split('T')[0];
            const weekEnd = new Date(currentDate);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            result.push({
                month: `${currentDate.getDate()}/${currentDate.getMonth() + 1}`,
                value: weekMap[weekKey] || 0,
                label: `Tuần ${currentDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })}`
            });
            
            currentDate.setDate(currentDate.getDate() + 7);
        }
        
        return result;
    };

    // Use real data if available, otherwise use sample data
    const actualUserRegistrations = reportsData?.userRegistrations 
        ? fillMissingDates(reportsData.userRegistrations, startDate, endDate)
        : userRegistrations;

    const actualJobPostings = reportsData?.jobPostings
        ? fillMissingDates(reportsData.jobPostings, startDate, endDate)
        : jobPostings;

    const actualApplications = reportsData?.applicationSubmissions
        ? fillMissingDates(reportsData.applicationSubmissions, startDate, endDate)
        : applications;

    // Debug logging
    console.log('Actual User Registrations:', actualUserRegistrations);
    console.log('Actual Job Postings:', actualJobPostings);
    console.log('Actual Applications:', actualApplications);

    const maxUserValue = Math.max(...actualUserRegistrations.map(d => d.value));
    const maxJobValue = Math.max(...actualJobPostings.map(d => d.value));
    const maxAppValue = Math.max(...actualApplications.map(d => d.value));

    const BarChart = ({ data, maxValue, color = 'purple' }) => {
        // Show labels for every nth item based on data length
        const labelInterval = data.length > 15 ? Math.ceil(data.length / 10) : 1;
        
        // Color mapping
        const colorClasses = {
            purple: {
                bg: 'bg-purple-600',
                hover: 'hover:bg-purple-700'
            },
            green: {
                bg: 'bg-green-600',
                hover: 'hover:bg-green-700'
            },
            blue: {
                bg: 'bg-blue-600',
                hover: 'hover:bg-blue-700'
            }
        };
        
        const colors = colorClasses[color] || colorClasses.purple;
        
        return (
            <div className="h-64 flex items-end justify-between gap-1 px-4">
                {data.map((item, index) => {
                    const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                    const showLabel = index % labelInterval === 0 || index === data.length - 1;
                    
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                            <div className="relative w-full group">
                                <div 
                                    className={`w-full ${colors.bg} ${colors.hover} rounded-t-lg transition-all duration-300 cursor-pointer relative`}
                                    style={{ 
                                        height: `${Math.max(height * 2, item.value > 0 ? 10 : 2)}px`,
                                        minHeight: item.value > 0 ? '10px' : '2px'
                                    }}
                                    title={`${item.label || item.month}: ${item.value}`}
                                >
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                        <div className="font-semibold">{item.value}</div>
                                        <div className="text-gray-300">{item.label || item.month}</div>
                                    </div>
                                </div>
                            </div>
                            {showLabel && (
                                <span className="text-xs text-gray-600 truncate w-full text-center">{item.month}</span>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const LineChart = ({ data, maxValue, color = 'blue' }) => {
        if (!data || data.length === 0) return null;
        
        const points = data.map((item, index) => {
            const x = data.length > 1 ? (index / (data.length - 1)) * 100 : 50;
            const y = maxValue > 0 ? 100 - (item.value / maxValue) * 100 : 100;
            return `${x},${y}`;
        }).join(' ');

        const labelInterval = data.length > 15 ? Math.ceil(data.length / 10) : Math.ceil(data.length / 6);

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
                    {data.map((item, index) => {
                        const showLabel = index % labelInterval === 0 || index === data.length - 1;
                        return showLabel ? (
                            <span key={index} className="text-xs text-gray-600">{item.month}</span>
                        ) : null;
                    })}
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
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Chọn khoảng thời gian</h2>
                        <button
                            onClick={fetchReportsData}
                            disabled={loading}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                            {loading ? 'Đang tải...' : 'Làm mới'}
                        </button>
                    </div>
                    
                    {/* Quick date range buttons */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <button
                            onClick={() => {
                                const end = new Date();
                                const start = new Date();
                                start.setDate(start.getDate() - 7);
                                setStartDate(start.toISOString().split('T')[0]);
                                setEndDate(end.toISOString().split('T')[0]);
                            }}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            7 ngày qua
                        </button>
                        <button
                            onClick={() => {
                                const end = new Date();
                                const start = new Date();
                                start.setDate(start.getDate() - 30);
                                setStartDate(start.toISOString().split('T')[0]);
                                setEndDate(end.toISOString().split('T')[0]);
                            }}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            30 ngày qua
                        </button>
                        <button
                            onClick={() => {
                                const end = new Date();
                                const start = new Date();
                                start.setMonth(start.getMonth() - 3);
                                setStartDate(start.toISOString().split('T')[0]);
                                setEndDate(end.toISOString().split('T')[0]);
                            }}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            3 tháng qua
                        </button>
                        <button
                            onClick={() => {
                                const end = new Date();
                                const start = new Date();
                                start.setMonth(start.getMonth() - 6);
                                setStartDate(start.toISOString().split('T')[0]);
                                setEndDate(end.toISOString().split('T')[0]);
                            }}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            6 tháng qua
                        </button>
                        <button
                            onClick={() => {
                                const end = new Date();
                                const start = new Date();
                                start.setFullYear(start.getFullYear() - 1);
                                setStartDate(start.toISOString().split('T')[0]);
                                setEndDate(end.toISOString().split('T')[0]);
                            }}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            1 năm qua
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                max={endDate}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <>
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
                                            <p className="text-2xl font-semibold text-gray-900">
                                                {summary?.totalNewUsers?.toLocaleString() || '0'}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-xs text-gray-500">
                                                    {summary?.usersByRole?.candidate || 0} ứng viên, {summary?.usersByRole?.employer || 0} nhà tuyển dụng
                                                </span>
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
                                            <p className="text-2xl font-semibold text-gray-900">
                                                {summary?.totalNewJobs?.toLocaleString() || '0'}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-xs text-gray-500">
                                                    {summary?.jobsByStatus?.open || 0} đang mở, {summary?.jobsByStatus?.closed || 0} đã đóng
                                                </span>
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
                                            <p className="text-2xl font-semibold text-gray-900">
                                                {summary?.totalNewApplications?.toLocaleString() || '0'}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-xs text-gray-500">
                                                    Trong khoảng thời gian đã chọn
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Charts */}
                {!loading && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-lg font-semibold text-gray-900">Đăng ký người dùng</h2>
                                    <span className="text-sm text-gray-500">
                                        {actualUserRegistrations.length} {actualUserRegistrations.length > 60 ? 'tuần' : 'ngày'}
                                    </span>
                                </div>
                                <div className="mb-4 flex items-baseline gap-4">
                                    <div>
                                        <span className="text-2xl font-bold text-purple-600">
                                            {actualUserRegistrations.reduce((sum, item) => sum + item.value, 0)}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-2">người dùng mới</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Trung bình: {Math.round(actualUserRegistrations.reduce((sum, item) => sum + item.value, 0) / actualUserRegistrations.length || 0)}/{actualUserRegistrations.length > 60 ? 'tuần' : 'ngày'}
                                    </div>
                                </div>
                                {actualUserRegistrations.length > 0 ? (
                                    <BarChart data={actualUserRegistrations} maxValue={maxUserValue} color="purple" />
                                ) : (
                                    <div className="h-64 flex items-center justify-center text-gray-500">
                                        Không có dữ liệu
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-lg font-semibold text-gray-900">Việc làm đăng tuyển</h2>
                                    <span className="text-sm text-gray-500">
                                        {actualJobPostings.length} {actualJobPostings.length > 60 ? 'tuần' : 'ngày'}
                                    </span>
                                </div>
                                <div className="mb-4 flex items-baseline gap-4">
                                    <div>
                                        <span className="text-2xl font-bold text-green-600">
                                            {actualJobPostings.reduce((sum, item) => sum + item.value, 0)}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-2">việc làm mới</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Trung bình: {Math.round(actualJobPostings.reduce((sum, item) => sum + item.value, 0) / actualJobPostings.length || 0)}/{actualJobPostings.length > 60 ? 'tuần' : 'ngày'}
                                    </div>
                                </div>
                                {actualJobPostings.length > 0 ? (
                                    <BarChart data={actualJobPostings} maxValue={maxJobValue} color="green" />
                                ) : (
                                    <div className="h-64 flex items-center justify-center text-gray-500">
                                        Không có dữ liệu
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-semibold text-gray-900">Xu hướng ứng tuyển</h2>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Đơn ứng tuyển</span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {startDate && endDate ? 'Khoảng thời gian đã chọn' : '12 tháng gần đây'}
                                    </span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <span className="text-2xl font-bold text-blue-600">
                                    {actualApplications.reduce((sum, item) => sum + item.value, 0)}
                                </span>
                                <span className="text-sm text-gray-500 ml-2">đơn ứng tuyển mới</span>
                            </div>
                            {actualApplications.length > 0 ? (
                                <LineChart data={actualApplications} maxValue={maxAppValue} color="blue" />
                            ) : (
                                <div className="h-64 flex items-center justify-center text-gray-500">
                                    Không có dữ liệu
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default ReportsPage;
