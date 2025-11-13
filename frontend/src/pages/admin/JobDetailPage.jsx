import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BriefcaseIcon, BuildingOfficeIcon, MapPinIcon, CurrencyDollarIcon, EyeIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useAdminDetail } from '../../hooks/useAdminData';
import adminApi from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';

const JobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: job, loading, error } = useAdminDetail(adminApi.getJobDetail, id);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusBadge = (status) => {
        if (status === 'open') {
            return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Đang tuyển</span>;
        }
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Đã đóng</span>;
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="spinner mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải thông tin công việc...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error || !job) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error || 'Không tìm thấy công việc'}</p>
                        <button onClick={() => navigate('/admin/jobs')} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
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
                    <Link to="/admin/jobs" className="inline-flex items-center text-purple-600 hover:text-purple-700">
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Quay lại danh sách công việc
                    </Link>
                </div>

                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <BriefcaseIcon className="h-8 w-8 text-purple-600" />
                                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 mb-4">
                                <div className="flex items-center">
                                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                                    {job.employerId?.companyName || 'N/A'}
                                </div>
                                <div className="flex items-center">
                                    <MapPinIcon className="h-5 w-5 mr-2" />
                                    {job.location?.city || 'N/A'}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {getStatusBadge(job.status)}
                                <span className="text-sm text-gray-500">Đăng ngày: {formatDate(job.datePosted)}</span>
                                <span className="text-sm text-gray-500">Hạn: {formatDate(job.deadline)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Details */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin công việc</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Mô tả công việc</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
                                </div>

                                {job.skillsRequired && job.skillsRequired.length > 0 && (
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Kỹ năng yêu cầu</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {job.skillsRequired.map((skill, index) => (
                                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                    {skill.name} - {skill.level}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Vị trí</h3>
                                        <p className="text-gray-600">{job.position?.title || 'N/A'}</p>
                                        <p className="text-sm text-gray-500">{job.position?.level} - {job.position?.type}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Hình thức làm việc</h3>
                                        <p className="text-gray-600">{job.position?.workMode || 'N/A'}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Mức lương</h3>
                                    <div className="flex items-center text-gray-600">
                                        <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                                        {job.salary}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Địa điểm làm việc</h3>
                                    <p className="text-gray-600">{job.location?.address || job.location?.city || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Applications List */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Danh sách ứng viên ({job.applications?.length || 0})
                            </h2>
                            
                            {job.applications && job.applications.length > 0 ? (
                                <div className="space-y-3">
                                    {job.applications.map((app) => (
                                        <Link
                                            key={app._id}
                                            to={`/admin/applications/${app._id}`}
                                            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{app.candidateName}</h3>
                                                    <p className="text-sm text-gray-500">{app.candidateEmail}</p>
                                                    <p className="text-xs text-gray-400 mt-1">Nộp ngày: {formatDate(app.submitDate)}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    app.status === 'Submitted' ? 'bg-blue-100 text-blue-800' :
                                                    app.status === 'Reviewed' ? 'bg-yellow-100 text-yellow-800' :
                                                    app.status === 'Interviewed' ? 'bg-purple-100 text-purple-800' :
                                                    app.status === 'Hired' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-8">Chưa có ứng viên nào</p>
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
                                        <UserGroupIcon className="h-5 w-5 mr-2" />
                                        <span>Ứng viên</span>
                                    </div>
                                    <span className="text-2xl font-bold text-purple-600">{job.applicationsCount || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600">
                                        <EyeIcon className="h-5 w-5 mr-2" />
                                        <span>Lượt xem</span>
                                    </div>
                                    <span className="text-2xl font-bold text-blue-600">{job.views || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Company Info */}
                        {job.employerId && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin công ty</h2>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Tên công ty</p>
                                        <p className="font-medium text-gray-900">{job.employerId.companyName}</p>
                                    </div>
                                    {job.employerId.email && (
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="text-gray-900">{job.employerId.email}</p>
                                        </div>
                                    )}
                                    <Link
                                        to={`/admin/companies/${job.employerId._id}`}
                                        className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mt-4"
                                    >
                                        Xem chi tiết công ty
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default JobDetailPage;
