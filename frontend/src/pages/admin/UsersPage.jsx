import { useState, useCallback, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    UserIcon,
    CheckCircleIcon,
    XCircleIcon,
    PlusIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    AdjustmentsHorizontalIcon,
    PencilIcon,
    EyeIcon,
    LockClosedIcon,
    LockOpenIcon
} from '@heroicons/react/24/outline';
import { usePaginatedData } from '../../hooks/useAdminData';
import adminApi from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import { toast } from 'react-toastify';

const UsersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Build params for API
    const params = {
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        role: filterRole,
        status: filterStatus
    };

    const { data: users, pagination, loading, error, refresh } = usePaginatedData(
        useCallback(() => adminApi.getUsers(params), [currentPage, debouncedSearch, filterRole, filterStatus])
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'employer':
                return 'bg-blue-100 text-blue-800';
            case 'candidate':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleText = (role) => {
        switch (role) {
            case 'admin':
                return 'Quản trị viên';
            case 'employer':
                return 'Nhà tuyển dụng';
            case 'candidate':
                return 'Ứng viên';
            default:
                return role;
        }
    };

    // Handle select all
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.map(user => user._id));
        } else {
            setSelectedUsers([]);
        }
    };

    // Handle select single user
    const handleSelectUser = (userId) => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    // Handle update user status
    const handleUpdateStatus = async (userId, newStatus) => {
        try {
            setIsUpdating(true);
            await adminApi.updateUserStatus(userId, newStatus);
            toast.success('Cập nhật trạng thái thành công!');
            refresh();
        } catch (error) {
            console.error('Error updating user status:', error);
            toast.error(error.response?.data?.message || 'Không thể cập nhật trạng thái');
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle bulk status update
    const handleBulkStatusUpdate = async (newStatus) => {
        if (selectedUsers.length === 0) {
            toast.warning('Vui lòng chọn ít nhất một người dùng');
            return;
        }

        try {
            setIsUpdating(true);
            await Promise.all(
                selectedUsers.map(userId => adminApi.updateUserStatus(userId, newStatus))
            );
            toast.success(`Đã cập nhật trạng thái cho ${selectedUsers.length} người dùng`);
            setSelectedUsers([]);
            refresh();
        } catch (error) {
            console.error('Error bulk updating status:', error);
            toast.error('Không thể cập nhật trạng thái hàng loạt');
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle export
    const handleExport = () => {
        if (!users || users.length === 0) {
            toast.warning('Không có dữ liệu để xuất');
            return;
        }

        // Create CSV content
        const headers = ['Username', 'Name', 'Email', 'Role', 'Status', 'Created At'];
        const rows = users.map(user => [
            user.username,
            user.profile?.fullName || user.profile?.companyName || 'N/A',
            user.profile?.email || 'N/A',
            getRoleText(user.type),
            user.status,
            formatDate(user.createdAt)
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // Download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Đã xuất dữ liệu thành công!');
    };

    if (loading && currentPage === 1) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="spinner mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải danh sách người dùng...</p>
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
                        <p className="text-red-600 mb-4">{error}</p>
                        <button onClick={refresh} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            Thử lại
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">TOTAL USERS</p>
                        <span className="text-xs text-green-600 flex items-center gap-1">
                            <span>↑</span> 5.0%
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-gray-900">{pagination?.totalItems || 0}</p>
                        <span className="text-sm text-gray-500">from {Math.max(0, (pagination?.totalItems || 0) - 2)}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">ACTIVE MEMBERS</p>
                        <span className="text-xs text-green-600 flex items-center gap-1">
                            <span>↑</span> 1.2%
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-gray-900">
                            {users?.filter(u => u.status === 'active').length || 0}
                        </p>
                        <span className="text-sm text-gray-500">from {Math.max(0, (users?.filter(u => u.status === 'active').length || 0) - 1)}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">NEW/RETURNING</p>
                        <span className="text-xs text-red-600 flex items-center gap-1">
                            <span>↓</span> 2.8%
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-gray-900">56%</p>
                        <span className="text-sm text-gray-500">from 48.7</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">ACTIVE MEMBERS</p>
                        <span className="text-xs text-green-600 flex items-center gap-1">
                            <span>↑</span> 0.3%
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-gray-900">28%</p>
                        <span className="text-sm text-gray-500">from 28.6%</span>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-lg border border-gray-200">
                {/* Toolbar */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <span className="text-sm text-gray-600">{selectedUsers.length} Selected</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {selectedUsers.length > 0 && (
                            <div className="flex items-center gap-2 mr-2">
                                <button 
                                    onClick={() => handleBulkStatusUpdate('active')}
                                    disabled={isUpdating}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50"
                                >
                                    <LockOpenIcon className="w-4 h-4" />
                                    Activate
                                </button>
                                <button 
                                    onClick={() => handleBulkStatusUpdate('locked')}
                                    disabled={isUpdating}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
                                >
                                    <LockClosedIcon className="w-4 h-4" />
                                    Lock
                                </button>
                            </div>
                        )}
                        <button 
                            onClick={handleExport}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            Export
                        </button>
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg ${
                                showFilters 
                                    ? 'text-purple-700 bg-purple-50 border-purple-200' 
                                    : 'text-gray-700 border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <AdjustmentsHorizontalIcon className="w-4 h-4" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                <select
                                    value={filterRole}
                                    onChange={(e) => {
                                        setFilterRole(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="candidate">Candidates</option>
                                    <option value="employer">Employers</option>
                                    <option value="admin">Admins</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => {
                                        setFilterStatus(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="locked">Locked</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setFilterRole('all');
                                        setFilterStatus('all');
                                        setSearchTerm('');
                                        setCurrentPage(1);
                                    }}
                                    className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <input 
                                        type="checkbox" 
                                        checked={users?.length > 0 && selectedUsers.length === users.length}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    NAME
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    POSITION
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    CONTACT
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    STATUS
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    CREATED
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    ROLE
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users && users.length > 0 ? users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedUsers.includes(user._id)}
                                            onChange={() => handleSelectUser(user._id)}
                                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                <span className="text-purple-600 font-medium text-sm">
                                                    {(user.profile?.fullName || user.profile?.companyName || user.username)?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.profile?.fullName || user.profile?.companyName || user.username}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {user.profile?.email || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{getRoleText(user.type)}</div>
                                        <div className="text-sm text-gray-500">{user.type === 'employer' ? 'Company' : 'Job Seeker'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{user.profile?.email || 'N/A'}</div>
                                        <div className="text-sm text-gray-500">{user.profile?.phone || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative group">
                                            {user.status === 'active' ? (
                                                <span className="inline-flex items-center gap-1 text-sm text-green-600 cursor-pointer">
                                                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                                    Active
                                                </span>
                                            ) : user.status === 'locked' ? (
                                                <span className="inline-flex items-center gap-1 text-sm text-red-600 cursor-pointer">
                                                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                                    Locked
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-sm text-yellow-600 cursor-pointer">
                                                    <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                                                    Pending
                                                </span>
                                            )}
                                            
                                            {/* Status dropdown */}
                                            <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
                                                <button
                                                    onClick={() => handleUpdateStatus(user._id, 'active')}
                                                    disabled={isUpdating || user.status === 'active'}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                                    Active
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(user._id, 'locked')}
                                                    disabled={isUpdating || user.status === 'locked'}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                                    Locked
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(user._id, 'pending')}
                                                    disabled={isUpdating || user.status === 'pending'}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                                                    Pending
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.type)}`}>
                                            {getRoleText(user.type)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => window.location.href = `/admin/users/${user._id}`}
                                                className="p-1 text-gray-400 hover:text-purple-600"
                                                title="View details"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            {user.status === 'active' ? (
                                                <button 
                                                    onClick={() => handleUpdateStatus(user._id, 'locked')}
                                                    disabled={isUpdating}
                                                    className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50"
                                                    title="Lock user"
                                                >
                                                    <LockClosedIcon className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleUpdateStatus(user._id, 'active')}
                                                    disabled={isUpdating}
                                                    className="p-1 text-gray-400 hover:text-green-600 disabled:opacity-50"
                                                    title="Activate user"
                                                >
                                                    <LockOpenIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center">
                                        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                                        <p className="mt-1 text-sm text-gray-500">Try changing your filters or search term</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    
                    {/* Loading overlay */}
                    {isUpdating && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                            <div className="spinner"></div>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{users.length}</span> of <span className="font-medium">{pagination.totalItems}</span> users
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-1 rounded text-sm font-medium ${
                                            currentPage === pageNum
                                                ? 'bg-purple-600 text-white'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === pagination.totalPages}
                                className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default UsersPage;
