import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, DocumentTextIcon, UserIcon, BriefcaseIcon, BuildingOfficeIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAdminDetail } from '../../hooks/useAdminData';
import adminApi from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';

const ApplicationDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: application, loading, error } = useAdminDetail(adminApi.getApplicationDetail, id);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Submitted':
                return 'bg-blue-100 text-blue-800';
            case 'Reviewed':
                return 'bg-yellow-100 text-yellow-800';
            case 'Interviewed':
                return 'bg-purple-100 text-purple-800';
            case 'Hired':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="spinner mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải thông tin đơn ứng tuyển...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error || !application) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error || 'Không tìm thấy đơn ứng tuyển'}</p>
                        <button onClick={() => navigate('/admin/applications')} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
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
                    <Link to="/admin/applications" className="inline-flex items-center text-purple-600 hover:text-purple-700">
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Quay lại danh sách đơn ứng tuyển
                    </Link>
                </div>

                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <DocumentTextIcon className="h-8 w-8 text-purple-600" />
                                <h1 className="text-3xl font-bold text-gray-900">Đơn ứng tuyển</h1>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status?.name)}`}>
                                    {application.status?.name || 'Submitted'}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Nộp ngày: {formatDate(application.submitDate)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Candidate Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin ứng viên</h2>
                            
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-500">Họ tên</p>
                                        <p className="font-medium text-gray-900">
                                            {application.candidateSummary?.fullName || application.candidateId?.fullName || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="text-gray-900">
                                            {application.candidateSummary?.email || application.candidateId?.email || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                {application.candidateId?.phone && (
                                    <div className="flex items-center">
                                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Số điện thoại</p>
                                            <p className="text-gray-900">{application.candidateId.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {application.candidateId?.address && (
                                    <div className="flex items-center">
                                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Địa chỉ</p>
                                            <p className="text-gray-900">{application.candidateId.address}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="pt-4">
                                    <Link
                                        to={`/admin/candidates/${application.candidateId?._id}`}
                                        className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                                    >
                                        Xem hồ sơ đầy đủ →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Cover Letter */}
                        {application.coverLetter && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Thư xin việc</h2>
                                <p className="text-gray-600 whitespace-pre-wrap">{application.coverLetter}</p>
                            </div>
                        )}

                        {/* Resume */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">CV / Resume</h2>
                            {application.resumeFile ? (
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <DocumentTextIcon className="h-8 w-8 text-purple-600 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900">Resume.pdf</p>
                                            <p className="text-sm text-gray-500">Tệp đính kèm</p>
                                        </div>
                                    </div>
                                    <a
                                        href={`http://localhost:5000${application.resumeFile}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Xem CV
                                    </a>
                                </div>
                            ) : (
                                <p className="text-gray-500">Không có CV đính kèm</p>
                            )}
                        </div>

                        {/* Status Timeline */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lịch sử trạng thái</h2>
                            <div className="space-y-4">
                                {application.statusHistory && application.statusHistory.length > 0 ? (
                                    application.statusHistory.map((history, index) => (
                                        <div key={index} className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(history.status).replace('text-', 'bg-').split(' ')[0]}`}></div>
                                            </div>
                                            <div className="ml-4">
                                                <p className="font-medium text-gray-900">{history.status}</p>
                                                <p className="text-sm text-gray-500">{formatDate(history.timestamp)}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="w-3 h-3 rounded-full mt-1 bg-blue-600"></div>
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-medium text-gray-900">{application.status?.name || 'Submitted'}</p>
                                            <p className="text-sm text-gray-500">{formatDate(application.status?.updatedAt || application.submitDate)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Job Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Công việc ứng tuyển</h2>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Vị trí</p>
                                        <p className="font-medium text-gray-900">
                                            {application.jobSummary?.title || application.jobpostId?.title || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Công ty</p>
                                        <p className="text-gray-900">
                                            {application.jobSummary?.employerName || application.jobpostId?.employerId?.companyName || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <Link
                                        to={`/admin/jobs/${application.jobpostId?._id}`}
                                        className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Xem chi tiết công việc
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Application Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đơn</h2>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày nộp</p>
                                        <p className="text-gray-900">{formatDate(application.submitDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <ClockIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                                        <p className="text-gray-900">{formatDate(application.status?.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* View History */}
                        {application.viewedHistory && application.viewedHistory.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử xem</h2>
                                <div className="space-y-2">
                                    {application.viewedHistory.map((view, index) => (
                                        <div key={index} className="text-sm">
                                            <p className="text-gray-600">Đã xem lúc {formatDate(view.viewedAt)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ApplicationDetailPage;
