import React, { useState, useEffect } from 'react';
import {
  AdjustmentsHorizontalIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { jobPreferenceService } from '../../services/jobPreferenceService';

const SuggestionsSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [settings, setSettings] = useState({
    preferredLocations: [],
    salaryRange: { min: 0, max: 100 },
    jobTypes: [],
    experienceLevels: [],
    companyTypes: [],
    industries: [],
    preferredSkills: [],
    willingToRelocate: false,
    receiveRecommendations: true,
    notificationFrequency: 'weekly'
  });

  // Load preferences khi component mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const response = await jobPreferenceService.getPreferences();
      if (response.data) {
        setSettings({
          preferredLocations: response.data.preferredLocations || [],
          salaryRange: response.data.salaryRange || { min: 0, max: 100 },
          jobTypes: response.data.jobTypes || [],
          experienceLevels: response.data.experienceLevels || [],
          companyTypes: response.data.companyTypes || [],
          industries: response.data.industries || [],
          preferredSkills: response.data.preferredSkills || [],
          willingToRelocate: response.data.willingToRelocate || false,
          receiveRecommendations: response.data.receiveRecommendations !== false,
          notificationFrequency: response.data.notificationFrequency || 'weekly'
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Không thể tải cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const [newSkill, setNewSkill] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newIndustry, setNewIndustry] = useState('');

  const cities = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Nha Trang', 'Huế', 'Vũng Tàu'];
  const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Freelance', 'Internship'];
  const experienceLevels = ['Intern', 'Junior', 'Middle', 'Senior', 'Lead'];
  const companyTypes = ['Product', 'Outsourcing', 'Startup', 'Enterprise', 'Agency'];
  const industries = [
    'Công nghệ thông tin',
    'Fintech',
    'E-commerce',
    'Marketing',
    'Thiết kế',
    'Kế toán',
    'Nhân sự',
    'Quản lý'
  ];

  const handleAddSkill = () => {
    if (newSkill && !settings.preferredSkills.includes(newSkill)) {
      setSettings({ ...settings, preferredSkills: [...settings.preferredSkills, newSkill] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setSettings({ ...settings, preferredSkills: settings.preferredSkills.filter(s => s !== skill) });
  };

  const handleAddLocation = () => {
    if (newLocation && !settings.preferredLocations.includes(newLocation)) {
      setSettings({ ...settings, preferredLocations: [...settings.preferredLocations, newLocation] });
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (location) => {
    setSettings({ ...settings, preferredLocations: settings.preferredLocations.filter(l => l !== location) });
  };

  const toggleArrayItem = (key, item) => {
    setSettings(prev => ({
      ...prev,
      [key]: prev[key].includes(item)
        ? prev[key].filter(i => i !== item)
        : [...prev[key], item]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validate
      if (settings.salaryRange.min > settings.salaryRange.max) {
        toast.error('Mức lương tối thiểu không thể lớn hơn mức lương tối đa');
        return;
      }

      await jobPreferenceService.updatePreferences(settings);
      toast.success('Đã lưu cài đặt gợi ý việc làm');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Không thể lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Bạn có chắc muốn đặt lại tất cả cài đặt về mặc định?')) {
      return;
    }

    try {
      setResetting(true);
      const response = await jobPreferenceService.resetPreferences();
      if (response.data) {
        setSettings({
          preferredLocations: response.data.preferredLocations || [],
          salaryRange: response.data.salaryRange || { min: 0, max: 100 },
          jobTypes: response.data.jobTypes || [],
          experienceLevels: response.data.experienceLevels || [],
          companyTypes: response.data.companyTypes || [],
          industries: response.data.industries || [],
          preferredSkills: response.data.preferredSkills || [],
          willingToRelocate: response.data.willingToRelocate || false,
          receiveRecommendations: response.data.receiveRecommendations !== false,
          notificationFrequency: response.data.notificationFrequency || 'weekly'
        });
      }
      toast.success('Đã đặt lại cài đặt về mặc định');
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Không thể đặt lại cài đặt');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải cài đặt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-orange-500 to-amber-600 p-3 rounded-2xl">
                <AdjustmentsHorizontalIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Cài đặt gợi ý việc làm
              </h1>
              <p className="text-gray-600 mt-1">Tùy chỉnh cách hệ thống đề xuất việc làm cho bạn</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Receive Recommendations Toggle */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Nhận gợi ý việc làm</h3>
                <p className="text-sm text-gray-600">Bật để nhận đề xuất việc làm phù hợp với hồ sơ của bạn</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, receiveRecommendations: !settings.receiveRecommendations })}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${settings.receiveRecommendations ? 'bg-gradient-to-r from-orange-600 to-amber-600' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${settings.receiveRecommendations ? 'translate-x-7' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>

          {/* Preferred Locations */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <MapPinIcon className="h-6 w-6" />
                <div>
                  <h2 className="text-lg font-bold">Địa điểm ưu tiên</h2>
                  <p className="text-sm text-orange-100">Chọn các thành phố bạn muốn làm việc</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {settings.preferredLocations.map((location) => (
                  <span
                    key={location}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full font-medium"
                  >
                    {location}
                    <button onClick={() => handleRemoveLocation(location)} className="hover:text-orange-900">
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Chọn thành phố...</option>
                  {cities.filter(c => !settings.preferredLocations.includes(c)).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <button
                  onClick={handleAddLocation}
                  disabled={!newLocation}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all disabled:opacity-50 font-medium"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>

          {/* Salary Range */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <CurrencyDollarIcon className="h-6 w-6" />
                <div>
                  <h2 className="text-lg font-bold">Mức lương mong muốn</h2>
                  <p className="text-sm text-green-100">Thiết lập khoảng lương bạn mong muốn</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Từ (triệu)</label>
                  <input
                    type="number"
                    value={settings.salaryRange.min}
                    onChange={(e) => setSettings({
                      ...settings,
                      salaryRange: { ...settings.salaryRange, min: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Đến (triệu)</label>
                  <input
                    type="number"
                    value={settings.salaryRange.max}
                    onChange={(e) => setSettings({
                      ...settings,
                      salaryRange: { ...settings.salaryRange, max: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <span className="text-2xl font-bold text-green-700">
                  {settings.salaryRange.min} - {settings.salaryRange.max} triệu VNĐ
                </span>
              </div>
            </div>
          </div>

          {/* Job Types */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <BriefcaseIcon className="h-6 w-6" />
                <div>
                  <h2 className="text-lg font-bold">Loại hình công việc</h2>
                  <p className="text-sm text-blue-100">Chọn loại hình làm việc bạn quan tâm</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {jobTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleArrayItem('jobTypes', type)}
                    className={`p-4 rounded-xl border-2 transition-all ${settings.jobTypes.includes(type)
                      ? 'border-blue-600 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className="text-center">
                      <div className={`font-semibold ${settings.jobTypes.includes(type) ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                        {type}
                      </div>
                      {settings.jobTypes.includes(type) && (
                        <CheckCircleIcon className="h-5 w-5 text-blue-600 mx-auto mt-2" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Experience Levels */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-2xl">📊</span>
                <div>
                  <h2 className="text-lg font-bold">Cấp bậc kinh nghiệm</h2>
                  <p className="text-sm text-purple-100">Chọn cấp độ phù hợp với bạn</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {experienceLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => toggleArrayItem('experienceLevels', level)}
                    className={`p-4 rounded-xl border-2 transition-all ${settings.experienceLevels.includes(level)
                      ? 'border-purple-600 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className="text-center">
                      <div className={`font-semibold text-sm ${settings.experienceLevels.includes(level) ? 'text-purple-700' : 'text-gray-700'
                        }`}>
                        {level}
                      </div>
                      {settings.experienceLevels.includes(level) && (
                        <CheckCircleIcon className="h-5 w-5 text-purple-600 mx-auto mt-2" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Company Types */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <BuildingOfficeIcon className="h-6 w-6" />
                <div>
                  <h2 className="text-lg font-bold">Loại hình công ty</h2>
                  <p className="text-sm text-indigo-100">Chọn loại công ty bạn muốn làm việc</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {companyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleArrayItem('companyTypes', type)}
                    className={`p-4 rounded-xl border-2 transition-all ${settings.companyTypes.includes(type)
                      ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className="text-center">
                      <div className={`font-semibold ${settings.companyTypes.includes(type) ? 'text-indigo-700' : 'text-gray-700'
                        }`}>
                        {type}
                      </div>
                      {settings.companyTypes.includes(type) && (
                        <CheckCircleIcon className="h-5 w-5 text-indigo-600 mx-auto mt-2" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Industries */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-2xl">🏢</span>
                <div>
                  <h2 className="text-lg font-bold">Ngành nghề quan tâm</h2>
                  <p className="text-sm text-teal-100">Chọn các ngành nghề bạn muốn làm việc</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => toggleArrayItem('industries', industry)}
                    className={`p-4 rounded-xl border-2 transition-all ${settings.industries.includes(industry)
                      ? 'border-teal-600 bg-teal-50 shadow-lg'
                      : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className="text-center">
                      <div className={`font-semibold text-sm ${settings.industries.includes(industry) ? 'text-teal-700' : 'text-gray-700'
                        }`}>
                        {industry}
                      </div>
                      {settings.industries.includes(industry) && (
                        <CheckCircleIcon className="h-5 w-5 text-teal-600 mx-auto mt-2" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-2xl">⭐</span>
                <div>
                  <h2 className="text-lg font-bold">Kỹ năng quan tâm</h2>
                  <p className="text-sm text-rose-100">Thêm các kỹ năng bạn muốn tìm việc</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {settings.preferredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 rounded-full font-medium"
                  >
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="hover:text-rose-900">
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="Nhập kỹ năng..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddSkill}
                  disabled={!newSkill}
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl hover:from-rose-700 hover:to-pink-700 transition-all disabled:opacity-50 font-medium"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleReset}
              disabled={saving || resetting}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
            >
              {resetting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-700"></div>
                  Đang đặt lại...
                </>
              ) : (
                <>
                  <ArrowPathIcon className="h-5 w-5" />
                  Đặt lại mặc định
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || resetting}
              className="px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
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

export default SuggestionsSettingsPage;
