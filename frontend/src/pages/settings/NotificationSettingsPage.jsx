import React, { useState } from 'react';
import { 
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const NotificationSettingsPage = () => {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    email: {
      jobAlerts: true,
      applicationUpdates: true,
      newMessages: true,
      weeklyDigest: false,
      promotions: false,
    },
    push: {
      jobAlerts: true,
      applicationUpdates: true,
      newMessages: true,
      urgentOnly: false,
    },
    frequency: {
      jobAlerts: 'instant', // instant, daily, weekly
      digest: 'weekly', // daily, weekly, monthly
    }
  });

  const handleToggle = (category, key) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }));
  };

  const handleFrequencyChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      frequency: {
        ...prev.frequency,
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // TODO: API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Đã lưu cài đặt thông báo');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Không thể lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  const SettingItem = ({ label, description, checked, onChange }) => (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1 pr-4">
        <h4 className="text-sm font-medium text-gray-900 mb-1">{label}</h4>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
          checked ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-blue-600 p-3 rounded-2xl">
                <BellIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Cài đặt Thông báo
              </h1>
              <p className="text-gray-600 mt-1">Quản lý cách bạn nhận thông báo từ hệ thống</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Quản lý thông báo hiệu quả</h3>
              <p className="text-sm text-blue-700">
                Bật thông báo quan trọng để không bỏ lỡ cơ hội việc làm. Tắt thông báo không cần thiết để tránh làm phiền.
              </p>
            </div>
          </div>

          {/* Email Notifications */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <EnvelopeIcon className="h-6 w-6" />
                <div>
                  <h2 className="text-lg font-bold">Thông báo Email</h2>
                  <p className="text-sm text-purple-100">Nhận thông báo qua email</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <SettingItem
                label="Cơ hội việc làm mới"
                description="Nhận email khi có việc làm phù hợp với hồ sơ của bạn"
                checked={settings.email.jobAlerts}
                onChange={() => handleToggle('email', 'jobAlerts')}
              />
              <SettingItem
                label="Cập nhật đơn ứng tuyển"
                description="Thông báo khi trạng thái đơn ứng tuyển thay đổi"
                checked={settings.email.applicationUpdates}
                onChange={() => handleToggle('email', 'applicationUpdates')}
              />
              <SettingItem
                label="Tin nhắn mới"
                description="Nhận thông báo khi có tin nhắn từ nhà tuyển dụng"
                checked={settings.email.newMessages}
                onChange={() => handleToggle('email', 'newMessages')}
              />
              <SettingItem
                label="Bản tin tuần"
                description="Tổng hợp việc làm mới và thông tin hữu ích hàng tuần"
                checked={settings.email.weeklyDigest}
                onChange={() => handleToggle('email', 'weeklyDigest')}
              />
              <SettingItem
                label="Khuyến mãi & Ưu đãi"
                description="Nhận thông tin về các chương trình khuyến mãi"
                checked={settings.email.promotions}
                onChange={() => handleToggle('email', 'promotions')}
              />
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <DevicePhoneMobileIcon className="h-6 w-6" />
                <div>
                  <h2 className="text-lg font-bold">Thông báo Đẩy</h2>
                  <p className="text-sm text-blue-100">Nhận thông báo trên trình duyệt</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <SettingItem
                label="Cơ hội việc làm mới"
                description="Thông báo ngay khi có việc làm phù hợp"
                checked={settings.push.jobAlerts}
                onChange={() => handleToggle('push', 'jobAlerts')}
              />
              <SettingItem
                label="Cập nhật đơn ứng tuyển"
                description="Thông báo ngay khi có cập nhật quan trọng"
                checked={settings.push.applicationUpdates}
                onChange={() => handleToggle('push', 'applicationUpdates')}
              />
              <SettingItem
                label="Tin nhắn mới"
                description="Thông báo khi có tin nhắn mới từ nhà tuyển dụng"
                checked={settings.push.newMessages}
                onChange={() => handleToggle('push', 'newMessages')}
              />
              <SettingItem
                label="Chỉ thông báo khẩn"
                description="Chỉ nhận thông báo quan trọng và khẩn cấp"
                checked={settings.push.urgentOnly}
                onChange={() => handleToggle('push', 'urgentOnly')}
              />
            </div>
          </div>

          {/* Frequency Settings */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <BellIcon className="h-6 w-6" />
                <div>
                  <h2 className="text-lg font-bold">Tần suất thông báo</h2>
                  <p className="text-sm text-cyan-100">Thiết lập tần suất nhận thông báo</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Job Alerts Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Thông báo việc làm
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'instant', label: '⚡ Ngay lập tức', desc: 'Nhận ngay' },
                    { value: 'daily', label: '📅 Hàng ngày', desc: 'Tổng hợp 1 lần/ngày' },
                    { value: 'weekly', label: '📆 Hàng tuần', desc: 'Tổng hợp 1 lần/tuần' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleFrequencyChange('jobAlerts', option.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        settings.frequency.jobAlerts === option.value
                          ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-lg font-semibold mb-1 ${
                          settings.frequency.jobAlerts === option.value ? 'text-purple-700' : 'text-gray-700'
                        }`}>
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500">{option.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Digest Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Bản tin tổng hợp
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'daily', label: '📬 Hàng ngày', desc: 'Mỗi ngày' },
                    { value: 'weekly', label: '📮 Hàng tuần', desc: 'Mỗi tuần' },
                    { value: 'monthly', label: '📭 Hàng tháng', desc: 'Mỗi tháng' },
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleFrequencyChange('digest', option.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        settings.frequency.digest === option.value
                          ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-lg font-semibold mb-1 ${
                          settings.frequency.digest === option.value ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500">{option.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-orange-900 mb-1">Lưu ý quan trọng</h3>
              <p className="text-sm text-orange-700">
                Nếu tắt thông báo cập nhật đơn ứng tuyển, bạn có thể bỏ lỡ thông tin quan trọng từ nhà tuyển dụng.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  Lưu cài đặt
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
