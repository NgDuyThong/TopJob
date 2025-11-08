import React, { useState } from 'react';
import { 
  ShieldCheckIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const SecuritySettingsPage = () => {
  const [activeTab, setActiveTab] = useState('password');
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [sessions] = useState([
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'Hà Nội, Việt Nam',
      ip: '192.168.1.100',
      lastActive: '5 phút trước',
      isCurrent: true
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'Hà Nội, Việt Nam',
      ip: '192.168.1.101',
      lastActive: '2 ngày trước',
      isCurrent: false
    }
  ]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setSaving(true);
      // TODO: API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Đã đổi mật khẩu thành công');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Không thể đổi mật khẩu');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutSession = (sessionId) => {
    toast.success('Đã đăng xuất phiên làm việc');
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!'
    );
    if (confirmed) {
      toast.info('Chức năng xóa tài khoản đang được phát triển');
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-2xl">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Bảo mật & Tài khoản
              </h1>
              <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'password'
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <KeyIcon className="h-5 w-5" />
                Đổi mật khẩu
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'sessions'
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <ComputerDesktopIcon className="h-5 w-5" />
                Phiên đăng nhập
              </div>
            </button>
            <button
              onClick={() => setActiveTab('danger')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'danger'
                  ? 'text-red-600 bg-red-50 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                Vùng nguy hiểm
              </div>
            </button>
          </div>
        </div>

        {/* Password Change Tab */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <KeyIcon className="h-6 w-6" />
                <div>
                  <h2 className="text-lg font-bold">Đổi mật khẩu</h2>
                  <p className="text-sm text-blue-100">Cập nhật mật khẩu của bạn để bảo mật tài khoản</p>
                </div>
              </div>
            </div>
            <form onSubmit={handlePasswordChange} className="p-6 space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Mật khẩu hiện tại *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Mật khẩu mới *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordData.newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className={`text-xs flex items-center gap-1 ${passwordData.newPassword.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                      <CheckCircleIcon className="h-4 w-4" />
                      Tối thiểu 6 ký tự
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Xác nhận mật khẩu mới *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordData.confirmPassword && (
                  <div className={`mt-2 text-xs ${passwordData.newPassword === passwordData.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordData.newPassword === passwordData.confirmPassword ? '✓ Mật khẩu khớp' : '✗ Mật khẩu không khớp'}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {saving ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
            </form>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <ComputerDesktopIcon className="h-6 w-6" />
                <div>
                  <h2 className="text-lg font-bold">Phiên đăng nhập</h2>
                  <p className="text-sm text-cyan-100">Quản lý các thiết bị đang đăng nhập</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {sessions.map((session) => (
                <div 
                  key={session.id}
                  className={`p-4 rounded-xl border-2 ${session.isCurrent ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${session.isCurrent ? 'bg-green-100' : 'bg-gray-200'}`}>
                        {session.device.includes('iPhone') ? (
                          <DevicePhoneMobileIcon className={`h-6 w-6 ${session.isCurrent ? 'text-green-600' : 'text-gray-600'}`} />
                        ) : (
                          <ComputerDesktopIcon className={`h-6 w-6 ${session.isCurrent ? 'text-green-600' : 'text-gray-600'}`} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{session.device}</h3>
                          {session.isCurrent && (
                            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                              Hiện tại
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">📍 {session.location}</p>
                        <p className="text-sm text-gray-500">IP: {session.ip}</p>
                        <p className="text-sm text-gray-500">Hoạt động: {session.lastActive}</p>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <button
                        onClick={() => handleLogoutSession(session.id)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        Đăng xuất
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Danger Zone Tab */}
        {activeTab === 'danger' && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-red-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <ExclamationTriangleIcon className="h-6 w-6" />
                <div>
                  <h2 className="text-lg font-bold">Vùng nguy hiểm</h2>
                  <p className="text-sm text-red-100">Các hành động không thể hoàn tác</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <TrashIcon className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-red-900 mb-2">Xóa tài khoản</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Khi xóa tài khoản, tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn bao gồm:
                    </p>
                    <ul className="text-sm text-red-700 space-y-1 mb-6 ml-4 list-disc">
                      <li>Hồ sơ và thông tin cá nhân</li>
                      <li>Đơn ứng tuyển đã nộp</li>
                      <li>Việc làm đã lưu</li>
                      <li>Lịch sử hoạt động</li>
                    </ul>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                    >
                      Tôi hiểu và muốn xóa tài khoản
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySettingsPage;
