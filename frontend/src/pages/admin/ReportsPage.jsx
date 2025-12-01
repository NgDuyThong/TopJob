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
            end: end.toISOString().split('T')[0],
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
                api.get(`/admin/reports/summary?${params.toString()}`),
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

    // Fill missing dates in range and group if needed
    const fillMissingDates = (data, start, end) => {
        const startDateObj = new Date(start);
        const endDateObj = new Date(end);
        const daysDiff = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24));

        // Ensure data is an array (empty array is valid - means no data yet)
        const safeData = Array.isArray(data) ? data : [];

        // Smart grouping based on date range
        // > 180 days (6 months): group by month
        // > 45 days: group by week
        // <= 45 days: show by day
        if (daysDiff > 180) {
            return groupByMonth(safeData, startDateObj, endDateObj);
        } else if (daysDiff > 45) {
            return groupByWeek(safeData, startDateObj, endDateObj);
        }

        const result = [];
        const dataMap = {};

        // Create map of existing data
        safeData.forEach((item) => {
            dataMap[item.date] = item.count;
        });

        // Fill all dates in range
        const currentDate = new Date(startDateObj);
        while (currentDate <= endDateObj) {
            const dateStr = currentDate.toISOString().split('T')[0];
            result.push({
                month: currentDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' }),
                value: dataMap[dateStr] || 0,
                label: dateStr,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return result;
    };

    // Group data by week
    const groupByWeek = (data, startDate, endDate) => {
        const weekMap = {};

        // Group existing data by week
        data.forEach((item) => {
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
                label: `Tuần ${currentDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })}`,
            });

            currentDate.setDate(currentDate.getDate() + 7);
        }

        return result;
    };

    // Group data by month
    const groupByMonth = (data, startDate, endDate) => {
        const monthMap = {};

        // Group existing data by month
        data.forEach((item) => {
            const date = new Date(item.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthMap[monthKey]) {
                monthMap[monthKey] = 0;
            }
            monthMap[monthKey] += item.count;
        });

        // Fill all months in range
        const result = [];
        const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

        while (currentDate <= endMonth) {
            const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
            const monthNames = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

            result.push({
                month: monthNames[currentDate.getMonth()],
                value: monthMap[monthKey] || 0,
                label: `Tháng ${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,
            });

            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return result;
    };

    // Use real data - always fill dates for the selected range
    const actualUserRegistrations = reportsData
        ? fillMissingDates(reportsData.userRegistrations || [], startDate, endDate)
        : [];

    const actualJobPostings = reportsData ? fillMissingDates(reportsData.jobPostings || [], startDate, endDate) : [];

    const actualApplications = reportsData
        ? fillMissingDates(reportsData.applicationSubmissions || [], startDate, endDate)
        : [];

    // Debug logging
    console.log('Reports Data:', reportsData);
    console.log('Actual User Registrations:', actualUserRegistrations);
    console.log('Actual Job Postings:', actualJobPostings);
    console.log('Actual Applications:', actualApplications);

    const maxUserValue =
        actualUserRegistrations.length > 0 ? Math.max(...actualUserRegistrations.map((d) => d.value), 1) : 1;
    const maxJobValue = actualJobPostings.length > 0 ? Math.max(...actualJobPostings.map((d) => d.value), 1) : 1;
    const maxAppValue = actualApplications.length > 0 ? Math.max(...actualApplications.map((d) => d.value), 1) : 1;

    // Calculate days difference for display
    const daysDiff = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));

    // Tooltip state for charts
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: 0, label: '' });

    const BarChart = ({ data, maxValue, color = 'purple', chartId }) => {
        // Smart label interval based on data length
        let labelInterval;
        if (data.length <= 7) {
            labelInterval = 1; // Show all labels for 7 days or less
        } else if (data.length <= 15) {
            labelInterval = 2; // Show every 2nd label
        } else if (data.length <= 31) {
            labelInterval = Math.ceil(data.length / 8); // ~8 labels for a month
        } else {
            labelInterval = Math.ceil(data.length / 10); // ~10 labels for longer periods
        }

        // Color mapping
        const colorClasses = {
            purple: {
                bg: 'bg-purple-600',
                hover: 'hover:bg-purple-700',
            },
            green: {
                bg: 'bg-green-600',
                hover: 'hover:bg-green-700',
            },
            blue: {
                bg: 'bg-blue-600',
                hover: 'hover:bg-blue-700',
            },
        };

        const colors = colorClasses[color] || colorClasses.purple;

        // Dynamic bar width based on data length
        // If few items: expand to fill container, if many: fixed width with scroll
        const containerWidth = 600; // approximate container width
        const minBarWidth = 40; // minimum bar width
        const maxBarWidth = 80; // maximum bar width for few items
        const barGap = 6;

        // Calculate optimal bar width
        let barWidth;
        const totalGaps = (data.length - 1) * barGap;
        const availableWidth = containerWidth - totalGaps - 32; // 32px for padding
        const calculatedWidth = availableWidth / data.length;

        if (calculatedWidth >= maxBarWidth) {
            barWidth = maxBarWidth; // Cap at max width
        } else if (calculatedWidth >= minBarWidth) {
            barWidth = calculatedWidth; // Use calculated width
        } else {
            barWidth = minBarWidth; // Use minimum with scroll
        }

        // Determine if we need scroll
        const needsScroll = data.length * (minBarWidth + barGap) > containerWidth;
        const totalWidth = needsScroll ? data.length * (minBarWidth + barGap) : '100%';

        const handleMouseEnter = (e, item) => {
            const rect = e.target.getBoundingClientRect();
            setTooltip({
                visible: true,
                x: rect.left + rect.width / 2,
                y: rect.top - 10,
                value: item.value,
                label: item.label || item.month,
            });
        };

        const handleMouseLeave = () => {
            setTooltip({ ...tooltip, visible: false });
        };

        return (
            <div className="h-72 flex flex-col relative">
                {/* Bar chart area */}
                <div className={`flex-1 ${needsScroll ? 'overflow-x-auto' : ''}`} style={{ paddingTop: '20px' }}>
                    <div
                        className="h-full flex items-end justify-center px-4"
                        style={{
                            minWidth: needsScroll ? `${totalWidth}px` : undefined,
                            gap: `${barGap}px`,
                        }}
                    >
                        {data.map((item, index) => {
                            // Calculate height in pixels (max 200px)
                            const heightPx = maxValue > 0 ? Math.round((item.value / maxValue) * 200) : 0;
                            const showLabel = index % labelInterval === 0 || index === data.length - 1;

                            return (
                                <div
                                    key={index}
                                    className="flex flex-col items-center justify-end h-full"
                                    style={{
                                        width: needsScroll ? `${minBarWidth}px` : undefined,
                                        minWidth: needsScroll ? `${minBarWidth}px` : undefined,
                                        flex: needsScroll ? 'none' : '1',
                                        maxWidth: `${maxBarWidth}px`,
                                    }}
                                >
                                    {/* Bar */}
                                    <div
                                        className={`w-full ${colors.bg} ${colors.hover} rounded-t transition-all duration-300 cursor-pointer`}
                                        style={{ height: `${Math.max(heightPx, item.value > 0 ? 6 : 2)}px` }}
                                        onMouseEnter={(e) => handleMouseEnter(e, item)}
                                        onMouseLeave={handleMouseLeave}
                                    />

                                    {/* Label */}
                                    {showLabel ? (
                                        <span className="text-[11px] text-gray-500 text-center leading-tight mt-1.5 truncate w-full">
                                            {item.month}
                                        </span>
                                    ) : (
                                        <span className="text-[11px] invisible mt-1.5">.</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const LineChart = ({ data, maxValue, color = 'blue' }) => {
        if (!data || data.length === 0) return null;

        const pointsData = data.map((item, index) => {
            const x = data.length > 1 ? (index / (data.length - 1)) * 100 : 50;
            const y = maxValue > 0 ? 100 - (item.value / maxValue) * 100 : 100;
            return { x, y, value: item.value, label: item.label || item.month };
        });

        const points = pointsData.map((p) => `${p.x},${p.y}`).join(' ');
        const labelInterval = data.length > 15 ? Math.ceil(data.length / 10) : Math.ceil(data.length / 6);
        const strokeColor = color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : '#9333ea';

        return (
            <div className="h-64 relative">
                {/* SVG Chart */}
                <div className="h-52 relative">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map((y) => (
                            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.2" />
                        ))}

                        {/* Area under line */}
                        <polygon points={`0,100 ${points} 100,100`} fill={`url(#gradient-${color})`} opacity="0.3" />

                        {/* Line */}
                        <polyline
                            points={points}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="0.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={strokeColor} />
                                <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Interactive hover points overlay */}
                    <div className="absolute inset-0">
                        {pointsData.map((point, index) => (
                            <div
                                key={index}
                                className="absolute group"
                                style={{
                                    left: `${point.x}%`,
                                    top: `${point.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                {/* Hover area */}
                                <div className="w-6 h-6 cursor-pointer" />
                                {/* Visible dot on hover */}
                                <div
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ backgroundColor: strokeColor }}
                                />
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none shadow-lg">
                                    <div className="font-semibold">{point.value}</div>
                                    <div className="text-gray-300 text-[10px]">{point.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between px-4 mt-2">
                    {data.map((item, index) => {
                        const showLabel = index % labelInterval === 0 || index === data.length - 1;
                        return showLabel ? (
                            <span key={index} className="text-xs text-gray-600">
                                {item.month}
                            </span>
                        ) : null;
                    })}
                </div>
            </div>
        );
    };

    return (
        <AdminLayout>
            {/* Global Tooltip */}
            {tooltip.visible && (
                <div
                    className="fixed bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl pointer-events-none"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: 'translate(-50%, -100%)',
                        zIndex: 9999,
                    }}
                >
                    <div className="font-bold text-lg">{tooltip.value}</div>
                    <div className="text-gray-300 text-sm">{tooltip.label}</div>
                </div>
            )}

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
                                                    {summary?.usersByRole?.candidate || 0} ứng viên,{' '}
                                                    {summary?.usersByRole?.employer || 0} nhà tuyển dụng
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
                                                    {summary?.jobsByStatus?.open || 0} đang mở,{' '}
                                                    {summary?.jobsByStatus?.closed || 0} đã đóng
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
                                    <span className="text-sm text-gray-500">{daysDiff} ngày</span>
                                </div>
                                <div className="mb-4 flex items-baseline gap-4">
                                    <div>
                                        <span className="text-2xl font-bold text-purple-600">
                                            {actualUserRegistrations.reduce((sum, item) => sum + item.value, 0)}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-2">người dùng mới</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Trung bình:{' '}
                                        {Math.round(
                                            actualUserRegistrations.reduce((sum, item) => sum + item.value, 0) /
                                                daysDiff,
                                        ) || 0}
                                        /ngày
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
                                    <span className="text-sm text-gray-500">{daysDiff} ngày</span>
                                </div>
                                <div className="mb-4 flex items-baseline gap-4">
                                    <div>
                                        <span className="text-2xl font-bold text-green-600">
                                            {actualJobPostings.reduce((sum, item) => sum + item.value, 0)}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-2">việc làm mới</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Trung bình:{' '}
                                        {Math.round(
                                            actualJobPostings.reduce((sum, item) => sum + item.value, 0) / daysDiff,
                                        ) || 0}
                                        /ngày
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
