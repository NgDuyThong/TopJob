import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    MagnifyingGlassIcon,
    BuildingOfficeIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ShieldCheckIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';
import { usePaginatedData } from '../../hooks/useAdminData';
import adminApi from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import { toast } from 'react-toastify';

const CompaniesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const params = {
        page: currentPage,
        limit: 9,
        search: debouncedSearch,
        status: filterStatus
    };

    const { data: companies, pagination, loading, error, refresh } = usePaginatedData(
        useCallback(() => adminApi.getCompanies(params), [currentPage, debouncedSearch, filterStatus])
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Handle verify/unverify company
    const handleToggleVerify = async (companyId, currentVerified) => {
        try {
            setIsUpdating(true);
            await adminApi.verifyCompany(companyId, !currentVerified);
            toast.success(currentVerified ? 'Đã hủy xác minh công ty' : 'Đã xác minh công ty');
            refresh();
        } catch (error) {
            console.error('Error toggling company verification:', error);
            toast.error(error.response?.data?.message || 'Không thể cập nhật trạng thái xác minh');
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle suspend/unsuspend company
    const handleToggleSuspend = async (companyId, accountId, currentStatus) => {
        // Validate accountId
        if (!accountId) {
            toast.error('Không tìm thấy tài khoản của công ty này');
            console.error('Missing accountId for company:', companyId);
            return;
        }

        const newStatus = currentStatus === 'active' ? 'locked' : 'active';
        const action = newStatus === 'locked' ? 'đình chỉ' : 'kích hoạt lại';
        
        if (!window.confirm(`Bạn có chắc chắn muốn ${action} công ty này?`)) {
            return;
        }

        try {
            setIsUpdating(true);
            console.log('Updating account:', accountId, 'to status:', newStatus);
            await adminApi.updateUserStatus(accountId, newStatus);
            toast.success(`Đã ${action} công ty thành công!`);
            refresh();
        } catch (error) {
            console.error('Error toggling company suspension:', error);
            toast.error(error.response?.data?.message || `Không thể ${action} công ty`);
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading && currentPage === 1) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="spinner mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải danh sách công ty...</p>
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
            <div>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý công ty</h1>
                    <p className="text-gray-600">Quản lý các nhà tuyển dụng và công ty</p>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên công ty hoặc ngành nghề..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="locked">Đã đình chỉ</option>
                        </select>
                    </div>
                </div>

                {/* Companies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                    {isUpdating && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                            <div className="spinner"></div>
                        </div>
                    )}
                    
                    {companies && companies.length > 0 ? companies.map((company) => (
                        <div key={company._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{company.companyName}</h3>
                                        <button
                                            onClick={() => handleToggleVerify(company._id, company.verified)}
                                            disabled={isUpdating}
                                            className="inline-flex items-center text-xs hover:underline disabled:opacity-50"
                                        >
                                            {company.verified ? (
                                                <>
                                                    <CheckCircleIcon className="h-4 w-4 mr-1 text-green-600" />
                                                    <span className="text-green-600">Đã xác minh</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircleIcon className="h-4 w-4 mr-1 text-gray-500" />
                                                    <span className="text-gray-500">Chưa xác minh</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggleVerify(company._id, company.verified)}
                                    disabled={isUpdating}
                                    className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                                        company.verified 
                                            ? 'text-green-600 hover:bg-green-50' 
                                            : 'text-gray-400 hover:bg-gray-50'
                                    }`}
                                    title={company.verified ? 'Hủy xác minh' : 'Xác minh công ty'}
                                >
                                    <ShieldCheckIcon className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div>
                                    <span className="font-medium">Ngành:</span> {company.field || 'N/A'}
                                </div>
                                <div>
                                    <span className="font-medium">Quy mô:</span> {company.companySize}
                                </div>
                                <div>
                                    <span className="font-medium">Địa điểm:</span> {company.address || 'N/A'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Trạng thái:</span>
                                    {company.status === 'locked' ? (
                                        <span className="inline-flex items-center gap-1 text-red-600">
                                            <LockClosedIcon className="h-4 w-4" />
                                            Đã đình chỉ
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-green-600">
                                            <CheckCircleIcon className="h-4 w-4" />
                                            Hoạt động
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-200">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{company.activeJobsCount || 0}</div>
                                    <div className="text-xs text-gray-500">Việc làm</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{company.totalApplicationsCount || 0}</div>
                                    <div className="text-xs text-gray-500">Ứng tuyển</div>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 mb-4">
                                Tham gia: {formatDate(company.createdAt)}
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    to={`/admin/companies/${company._id}`}
                                    className="flex-1 text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <EyeIcon className="h-4 w-4 inline mr-2" />
                                    Chi tiết
                                </Link>
                                <button
                                    onClick={() => company.accountId && handleToggleSuspend(company._id, company.accountId, company.status)}
                                    disabled={isUpdating || !company.accountId}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                                        company.status === 'locked'
                                            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:shadow-md disabled:opacity-50'
                                            : !company.accountId
                                            ? 'bg-red-50 text-red-600 border border-red-200 opacity-60 cursor-not-allowed'
                                            : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:shadow-lg hover:border-red-300 disabled:opacity-50'
                                    }`}
                                    title={
                                        !company.accountId 
                                            ? 'Công ty chưa có tài khoản đăng nhập' 
                                            : company.status === 'locked' 
                                            ? 'Kích hoạt lại' 
                                            : 'Đình chỉ công ty'
                                    }
                                >
                                    {company.status === 'locked' ? (
                                        <>
                                            <CheckCircleIcon className="h-4 w-4 inline mr-2" />
                                            Kích hoạt
                                        </>
                                    ) : (
                                        <>
                                            <XCircleIcon className="h-4 w-4 inline mr-2" />
                                            Đình chỉ
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy công ty</h3>
                            <p className="mt-1 text-sm text-gray-500">Thử tìm kiếm với từ khóa khác</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Hiển thị <span className="font-medium">{companies.length}</span> / <span className="font-medium">{pagination.totalItems}</span> công ty
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Trước
                            </button>
                            {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === i + 1 ? 'bg-purple-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === pagination.totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default CompaniesPage;
