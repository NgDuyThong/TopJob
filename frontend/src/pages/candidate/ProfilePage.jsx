import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  StarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { candidateService } from '../../services/candidateService';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    birthDate: '',
    education: '',
    experience: '',
    summary: '',
    skills: []
  });
  const [newSkill, setNewSkill] = useState({ name: '', level: 'basic' });

  const location = useLocation();

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    // If URL ends with /edit, enable edit mode by default
    if (location.pathname.endsWith('/edit')) {
      setEditing(true);
    }
  }, [location.pathname]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await candidateService.getProfile();
      setProfile(response.data);
      setFormData({
        fullName: response.data.fullName || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        gender: response.data.gender || '',
        birthDate: response.data.birthDate ? new Date(response.data.birthDate).toISOString().split('T')[0] : '',
        education: response.data.education || '',
        experience: response.data.experience || '',
        summary: response.data.summary || '',
        skills: response.data.skills || []
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { ...newSkill, name: newSkill.name.trim() }]
      }));
      setNewSkill({ name: '', level: 'basic' });
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await candidateService.updateProfile(formData);
      setProfile({ ...profile, ...formData });
      setEditing(false);
      alert('Cập nhật hồ sơ thành công!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Có lỗi xảy ra khi cập nhật hồ sơ. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      fullName: profile.fullName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      gender: profile.gender || '',
      birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : '',
      education: profile.education || '',
      experience: profile.experience || '',
      summary: profile.summary || '',
      skills: profile.skills || []
    });
    setEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'basic': return 'bg-yellow-100 text-yellow-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillLevelText = (level) => {
    switch (level) {
      case 'basic': return 'Cơ bản';
      case 'intermediate': return 'Trung bình';
      case 'advanced': return 'Nâng cao';
      default: return level;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy hồ sơ</h2>
          <p className="text-gray-600">Vui lòng đăng nhập để xem hồ sơ của bạn.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {editing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="bg-transparent border-b border-gray-300 focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    profile.fullName
                  )}
                </h1>
                <p className="text-gray-600">
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-transparent border-b border-gray-300 focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    profile.email
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {editing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <CheckIcon className="h-4 w-4" />
                    {saving ? 'Đang lưu...' : 'Lưu'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <PencilIcon className="h-4 w-4" />
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  {editing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profile.gender || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  {editing ? (
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{formatDate(profile.birthDate)}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Học vấn</label>
                  {editing ? (
                    <select
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Chọn trình độ học vấn</option>
                      <option value="Trung học phổ thông">Trung học phổ thông</option>
                      <option value="Trung cấp">Trung cấp</option>
                      <option value="Cao đẳng">Cao đẳng</option>
                      <option value="Đại học">Đại học</option>
                      <option value="Thạc sĩ">Thạc sĩ</option>
                      <option value="Tiến sĩ">Tiến sĩ</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profile.education || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kinh nghiệm làm việc</h2>
              {editing ? (
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Chọn kinh nghiệm</option>
                  <option value="Chưa có kinh nghiệm">Chưa có kinh nghiệm</option>
                  <option value="Dưới 1 năm">Dưới 1 năm</option>
                  <option value="1-2 năm">1-2 năm</option>
                  <option value="2-3 năm">2-3 năm</option>
                  <option value="3-5 năm">3-5 năm</option>
                  <option value="5-7 năm">5-7 năm</option>
                  <option value="7-10 năm">7-10 năm</option>
                  <option value="Trên 10 năm">Trên 10 năm</option>
                </select>
              ) : (
                <p className="text-gray-900">{profile.experience || 'N/A'}</p>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kỹ năng</h2>
              
              {editing && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Tên kỹ năng"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <select
                      value={newSkill.level}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="basic">Cơ bản</option>
                      <option value="intermediate">Trung bình</option>
                      <option value="advanced">Nâng cao</option>
                    </select>
                    <button
                      onClick={handleAddSkill}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getSkillLevelColor(skill.level)}`}
                  >
                    <span>{skill.name}</span>
                    <span className="text-xs">({getSkillLevelText(skill.level)})</span>
                    {editing && (
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {formData.skills.length === 0 && (
                <p className="text-gray-500 italic">Chưa có kỹ năng nào được thêm</p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Mô tả bản thân</h2>
              {editing ? (
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Viết mô tả về bản thân, kinh nghiệm và mục tiêu nghề nghiệp..."
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">
                  {profile.summary || 'Chưa có mô tả bản thân'}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Profile Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Thống kê hồ sơ</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Số đơn ứng tuyển:</span>
                  <span className="font-medium text-gray-900">{profile.applications?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Kỹ năng:</span>
                  <span className="font-medium text-gray-900">{profile.skills?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="font-medium text-gray-900">{formatDate(profile.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
              <div className="space-y-2">
                <a
                  href="/candidate/applications"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  Xem đơn ứng tuyển
                </a>
                <a
                  href="/candidate/recommended-jobs"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  Việc làm phù hợp
                </a>
                <a
                  href="/candidate/cv-builder"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  Tạo CV
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
