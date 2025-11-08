import React, { useState } from 'react';
import { 
  PaintBrushIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  LanguageIcon,
  CheckCircleIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const PersonalizationSettingsPage = () => {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'light', // light, dark, auto
    primaryColor: 'purple', // purple, blue, green, orange, pink
    language: 'vi', // vi, en
    fontSize: 'medium', // small, medium, large
    compactMode: false,
  });

  const themes = [
    { value: 'light', label: '☀️ Sáng', icon: SunIcon, desc: 'Giao diện sáng' },
    { value: 'dark', label: '🌙 Tối', icon: MoonIcon, desc: 'Giao diện tối' },
    { value: 'auto', label: '🔄 Tự động', icon: ComputerDesktopIcon, desc: 'Theo hệ thống' },
  ];

  const colors = [
    { value: 'purple', label: 'Tím', color: 'from-purple-600 to-pink-600' },
    { value: 'blue', label: 'Xanh dương', color: 'from-blue-600 to-cyan-600' },
    { value: 'green', label: 'Xanh lá', color: 'from-green-600 to-emerald-600' },
    { value: 'orange', label: 'Cam', color: 'from-orange-600 to-amber-600' },
    { value: 'pink', label: 'Hồng', color: 'from-pink-600 to-rose-600' },
    { value: 'indigo', label: 'Chàm', color: 'from-indigo-600 to-purple-600' },
  ];

  const fontSizes = [
    { value: 'small', label: 'Nhỏ', size: 'text-sm', desc: '14px' },
    { value: 'medium', label: 'Trung bình', size: 'text-base', desc: '16px' },
    { value: 'large', label: 'Lớn', size: 'text-lg', desc: '18px' },
  ];

  const languages = [
    { value: 'vi', label: '🇻🇳 Tiếng Việt', desc: 'Vietnamese' },
    { value: 'en', label: '🇺🇸 English', desc: 'English' },
  ];

  const handleSave = async () => {
    try {
      setSaving(true);
      // TODO: API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Đã lưu cài đặt giao diện');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Không thể lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-2xl">
                <PaintBrushIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Tùy chỉnh giao diện
              </h1>
              <p className="text-gray-600 mt-1">Thiết lập giao diện và trải nghiệm sử dụng theo ý bạn</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <SunIcon className="h-6 w-6" />
                <div>
                  <h2 className="text-lg font-bold">Chế độ hiển thị</h2>
                  <p className="text-sm text-purple-100">Chọn chủ đề sáng, tối hoặc tự động</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {themes.map((theme) => {
                  const Icon = theme.icon;
                  return (
                    <button
                      key={theme.value}
                      onClick={() => setSettings({ ...settings, theme: theme.value })}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        settings.theme === theme.value
                          ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`h-12 w-12 mx-auto mb-3 ${
                        settings.theme === theme.value ? 'text-purple-600' : 'text-gray-400'
                      }`} />
                      <div className="text-center">
                        <div className={`text-lg font-semibold mb-1 ${
                          settings.theme === theme.value ? 'text-purple-700' : 'text-gray-700'
                        }`}>
                          {theme.label}
                        </div>
                        <div className="text-sm text-gray-500">{theme.desc}</div>
                      </div>
                      {settings.theme === theme.value && (
                        <div className="mt-3 flex justify-center">
                          <CheckCircleIcon className="h-6 w-6 text-purple-600" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Color Scheme */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <SwatchIcon className="h-6 w-6" />
                <div>
                  <h2 className="text-lg font-bold">Màu chủ đạo</h2>
                  <p className="text-sm text-pink-100">Chọn màu sắc yêu thích cho giao diện</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSettings({ ...settings, primaryColor: color.value })}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      settings.primaryColor === color.value
                        ? 'border-gray-900 scale-105 shadow-lg'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className={`h-16 w-full rounded-lg bg-gradient-to-r ${color.color} mb-3`}></div>
                    <div className="text-center">
                      <div className={`text-sm font-medium ${
                        settings.primaryColor === color.value ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {color.label}
                      </div>
                    </div>
                    {settings.primaryColor === color.value && (
                      <div className="mt-2 flex justify-center">
                        <CheckCircleIcon className="h-5 w-5 text-gray-900" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Font Size */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-2xl">Aa</span>
                <div>
                  <h2 className="text-lg font-bold">Kích thước chữ</h2>
                  <p className="text-sm text-blue-100">Điều chỉnh kích thước văn bản</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSettings({ ...settings, fontSize: size.value })}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      settings.fontSize === size.value
                        ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`font-semibold mb-2 ${size.size} ${
                      settings.fontSize === size.value ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {size.label}
                    </div>
                    <div className="text-sm text-gray-500">{size.desc}</div>
                    <div className={`mt-3 ${size.size} text-gray-600`}>
                      Văn bản mẫu
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <LanguageIcon className="h-6 w-6" />
                <div>
                  <h2 className="text-lg font-bold">Ngôn ngữ</h2>
                  <p className="text-sm text-green-100">Chọn ngôn ngữ hiển thị</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => setSettings({ ...settings, language: lang.value })}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      settings.language === lang.value
                        ? 'border-green-600 bg-green-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-2xl font-semibold mb-2 ${
                        settings.language === lang.value ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {lang.label}
                      </div>
                      <div className="text-sm text-gray-500">{lang.desc}</div>
                      {settings.language === lang.value && (
                        <div className="mt-3 flex justify-center">
                          <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <ComputerDesktopIcon className="h-6 w-6" />
                <div>
                  <h2 className="text-lg font-bold">Tùy chọn khác</h2>
                  <p className="text-sm text-orange-100">Các cài đặt bổ sung</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between py-4">
                <div className="flex-1 pr-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Chế độ thu gọn</h4>
                  <p className="text-xs text-gray-500">Hiển thị giao diện gọn gàng hơn với ít khoảng trắng</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, compactMode: !settings.compactMode })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                    settings.compactMode ? 'bg-gradient-to-r from-orange-600 to-amber-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.compactMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Preview Box */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <EyeIcon className="h-6 w-6" />
                <div>
                  <h2 className="text-lg font-bold">Xem trước</h2>
                  <p className="text-sm text-indigo-100">Giao diện sẽ trông như thế này</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50">
              <div className={`bg-white rounded-xl shadow-lg p-6 ${settings.fontSize === 'small' ? 'text-sm' : settings.fontSize === 'large' ? 'text-lg' : 'text-base'}`}>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${colors.find(c => c.value === settings.primaryColor)?.color} text-white mb-4`}>
                  <CheckCircleIcon className="h-5 w-5" />
                  <span className="font-medium">Button mẫu</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tiêu đề mẫu</h3>
                <p className="text-gray-600 mb-4">
                  Đây là văn bản mẫu để bạn xem trước giao diện. Văn bản sẽ hiển thị với kích thước và màu sắc bạn đã chọn.
                </p>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${colors.find(c => c.value === settings.primaryColor)?.color} bg-opacity-10`}>
                    Tag mẫu 1
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${colors.find(c => c.value === settings.primaryColor)?.color} bg-opacity-10`}>
                    Tag mẫu 2
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                setSettings({
                  theme: 'light',
                  primaryColor: 'purple',
                  language: 'vi',
                  fontSize: 'medium',
                  compactMode: false,
                });
                toast.info('Đã khôi phục cài đặt mặc định');
              }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Khôi phục mặc định
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
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

const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export default PersonalizationSettingsPage;
