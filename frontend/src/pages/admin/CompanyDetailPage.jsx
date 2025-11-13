import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BuildingOfficeIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, GlobeAltIcon, CheckCircleIcon, XCircleIcon, BriefcaseIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useAdminDetail } from '../../hooks/useAdminData';
import adminApi from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';

const CompanyDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: company, loading, error } = useAdminDetail(adminApi.getCompanyDetail, id);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="spinner mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải thông tin công ty...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error || !company) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error || 'Không tìm thấy công ty'}</p>
                        <button onClick={() => navigate('/admin/companies')} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div>
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link to="/admin/companies" className="inline-flex items-center text-purple-600 hover:text-purple-700">
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Quay lại danh sách công ty
                    </Link>
                </div>

                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
                                <h1 className="text-3xl font-bold text-gray-900">{company.companyName}</h1>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                {company.verified ? (
                                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                                        Đã xác minh
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                                        <XCircleIcon className="h-4 w-4 mr-1" />
                                        Chưa xác minh
                                    </span>
                                )}
                                <span className="text-sm text-gray-500">Tham gia: {formatDate(company.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Company Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin công ty</h2>

                            <div className="space-y-4">
                                {company.description && (
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Giới thiệu</h3>
                                        <p className="text-gray-600 whitespace-pre-wrap">{company.description}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Lĩnh vực</h3>
                                        <p className="text-gray-600">{company.field || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Quy mô</h3>
                                        <p className="text-gray-600">{company.companySize}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {company.email && (
                                        <div className="flex items-center text-gray-600">
                                            <EnvelopeIcon className="h-5 w-5 mr-2" />
                                            {company.email}
                                        </div>
                                    )}
                                    {company.phone && (
                                        <div className="flex items-center text-gray-600">
                                            <PhoneIcon className="h-5 w-5 mr-2" />
                                            {company.phone}
                                        </div>
                                    )}
                                    {company.address && (
                                        <div className="flex items-center text-gray-600">
                                            <MapPinIcon className="h-5 w-5 mr-2" />
                                            {company.address}
                                        </div>
                                    )}
                                    {company.website && (
                                        <div className="flex items-center text-gray-600">
                                            <GlobeAltIcon className="h-5 w-5 mr-2" />
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                                                {company.website}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Jobs List */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Danh sách công việc ({company.jobs?.length || 0})
                            </h2>

                            {company.jobs && company.jobs.length > 0 ? (
                                <div className="space-y-3">
                                    {company.jobs.map((job) => (
                                        <Link
                                            key={job._id}
                                            to={`/admin/jobs/${job._id}`}
                                            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                        <span>Hạn: {formatDate(job.deadline)}</span>
                                                        <span>{job.applicationsCount || 0} ứng viên</span>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {job.status === 'open' ? 'Đang tuyển' : 'Đã đóng'}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-8">Chưa có công việc nào</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Statistics */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600">
                                        <BriefcaseIcon className="h-5 w-5 mr-2" />
                                        <span>Tổng việc làm</span>
                                    </div>
                                    <span className="text-2xl font-bold text-purple-600">{company.statistics?.totalJobs || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600">
                                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                                        <span>Đang tuyển</span>
                                    </div>
                                    <span className="text-2xl font-bold text-green-600">{company.statistics?.activeJobs || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600">
                                        <UserGroupIcon className="h-5 w-5 mr-2" />
                                        <span>Ứng tuyển</span>
                                    </div>
                                    <span className="text-2xl font-bold text-blue-600">{company.statistics?.totalApplications || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Account Status */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái tài khoản</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Trạng thái xác minh</p>
                                    <p className="font-medium text-gray-900">
                                        {company.verified ? 'Đã xác minh' : 'Chưa xác minh'}
                                    </p>
                                </div>
                                {company.accountStatus && (
                                    <div>
                                        <p className="text-sm text-gray-500">Trạng thái tài khoản</p>
                                        <p className="font-medium text-gray-900 capitalize">{company.accountStatus}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CompanyDetailPage;
