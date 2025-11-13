import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    ArrowLeftIcon, 
    UserIcon, 
    EnvelopeIcon, 
    PhoneIcon, 
    MapPinIcon,
    CalendarIcon,
    BriefcaseIcon,
    BuildingOfficeIcon,
    CheckCircleIcon,
    XCircleIcon,
    LockClosedIcon,
    LockOpenIcon
} from '@heroicons/react/24/outline';
import { useAdminDetail } from '../../hooks/useAdminData';
import adminApi from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import { toast } from 'react-toastify';
import { useState } from 'react';

const UserDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: user, loading, error, refresh } = useAdminDetail(adminApi.getUserDetail, id);
    const [isUpdating, setIsUpdating] = useState(false);

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

    const handleUpdateStatus = async (newStatus) => {
        try {
            setIsUpdating(true);
            await adminApi.updateUserStatus(id, newStatus);
            toast.success('Cập nhật trạng thái thành công!');
            refresh();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(error.response?.data?.message || 'Không thể cập nhật trạng thái');
        } finally {
            setIsUpdating(false);
        }
    };

    const getRoleText = (role) => {
        switch (role) {
            case 'admin': return 'Quản trị viên';
            case 'employer': return 'Nhà tuyển dụng';
            case 'candidate': return 'Ứng viên';
            default: return role;
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'employer': return 'bg-blue-100 text-blue-800';
            case 'candidate': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="spinner mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải thông tin người dùng...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error || !user) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error || 'Không tìm thấy người dùng'}</p>
                        <button 
                            onClick={() => navigate('/admin/users')} 
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const profile = user.type === 'candidate' ? user.candidateId : user.employerId;

    return (
        <AdminLayout>
            <div>
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link to="/admin/users" className="inline-flex items-center text-purple-600 hover:text-purple-700">
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Quay lại danh sách người dùng
                    </Link>
                </div>

                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-3xl font-bold text-purple-600">
                                    {(profile?.fullName || profile?.companyName || user.username)?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                    {profile?.fullName || profile?.companyName || user.username}
                                </h1>
                                <div className="flex items-center gap-3">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.type)}`}>
                                        {getRoleText(user.type)}
                                    </span>
                                    {user.status === 'active' ? (
                                        <span className="inline-flex items-center gap-1 text-sm text-green-600">
                                            <CheckCircleIcon className="h-5 w-5" />
                                            Active
                                        </span>
                                    ) : user.status === 'locked' ? (
                                        <span className="inline-flex items-center gap-1 text-sm text-red-600">
                                            <XCircleIcon className="h-5 w-5" />
                                            Locked
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-sm text-yellow-600">
                                            <CalendarIcon className="h-5 w-5" />
                                            Pending
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                            {user.status === 'active' ? (
                                <button
                                    onClick={() => handleUpdateStatus('locked')}
                                    disabled={isUpdating}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
                                >
                                    <LockClosedIcon className="h-4 w-4" />
                                    Lock User
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleUpdateStatus('active')}
                                    disabled={isUpdating}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50"
                                >
                                    <LockOpenIcon className="h-4 w-4" />
                                    Activate User
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - User Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Account Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                                    <p className="text-gray-900">{user.username}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">User ID</label>
                                    <p className="text-gray-900 font-mono text-sm">{user._id}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Created At</label>
                                    <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Last Login</label>
                                    <p className="text-gray-900">{formatDate(user.lastLogin)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Information */}
                        {profile && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                                <div className="space-y-4">
                                    {user.type === 'candidate' ? (
                                        <>
                                            <div className="flex items-start gap-3">
                                                <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                                                    <p className="text-gray-900">{profile.fullName || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                                    <p className="text-gray-900">{profile.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                                                    <p className="text-gray-900">{profile.phone || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                                                    <p className="text-gray-900">{profile.address || 'N/A'}</p>
                                                </div>
                                            </div>
                                            {profile.skills && profile.skills.length > 0 && (
                                                <div className="flex items-start gap-3">
                                                    <BriefcaseIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-2">Skills</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {profile.skills.map((skill, index) => (
                                                                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-start gap-3">
                                                <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">Company Name</label>
                                                    <p className="text-gray-900">{profile.companyName || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                                    <p className="text-gray-900">{profile.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                                                    <p className="text-gray-900">{profile.phone || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                                                    <p className="text-gray-900">{profile.address || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <BriefcaseIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">Company Size</label>
                                                    <p className="text-gray-900">{profile.companySize || 'N/A'}</p>
                                                </div>
                                            </div>
                                            {profile.description && (
                                                <div className="flex items-start gap-3">
                                                    <div className="h-5 w-5"></div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                                                        <p className="text-gray-900">{profile.description}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Stats & Actions */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Status</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                                        user.status === 'locked' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {user.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Role</span>
                                    <span className="text-sm font-medium text-gray-900">{getRoleText(user.type)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Member Since</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Status Actions */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Actions</h2>
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleUpdateStatus('active')}
                                    disabled={isUpdating || user.status === 'active'}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CheckCircleIcon className="h-4 w-4" />
                                    Set Active
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('locked')}
                                    disabled={isUpdating || user.status === 'locked'}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <LockClosedIcon className="h-4 w-4" />
                                    Lock Account
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('pending')}
                                    disabled={isUpdating || user.status === 'pending'}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CalendarIcon className="h-4 w-4" />
                                    Set Pending
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserDetailPage;
