import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PlusIcon,
  XMarkIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BriefcaseIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { jobService } from '../../services/jobService';

const JobCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position: {
      title: '',
      level: 'Junior'
    },
    skillsRequired: [],
    location: {
      city: '',
      address: ''
    },
    salary: '',
    language: 'Tiếng Việt',
    deadline: '',
    status: 'open'
  });
  const [newSkill, setNewSkill] = useState({ name: '', level: 'basic' });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, { ...newSkill, name: newSkill.name.trim() }]
      }));
      setNewSkill({ name: '', level: 'basic' });
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề việc làm là bắt buộc';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả công việc là bắt buộc';
    }

    if (!formData.position.title.trim()) {
      newErrors['position.title'] = 'Vị trí công việc là bắt buộc';
    }

    if (!formData.location.city.trim()) {
      newErrors['location.city'] = 'Thành phố là bắt buộc';
    }

    if (!formData.salary.trim()) {
      newErrors.salary = 'Mức lương là bắt buộc';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Hạn nộp hồ sơ là bắt buộc';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      if (deadlineDate <= today) {
        newErrors.deadline = 'Hạn nộp hồ sơ phải sau ngày hiện tại';
      }
    }

    if (formData.skillsRequired.length === 0) {
      newErrors.skillsRequired = 'Vui lòng thêm ít nhất một kỹ năng yêu cầu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await jobService.createJob(formData);
      alert('Đăng tin tuyển dụng thành công!');
      navigate('/employer/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Có lỗi xảy ra khi đăng tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Dashboard */}
        <Link
          to="/employer/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Quay lại Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng tin tuyển dụng</h1>
          <p className="text-gray-600">Tạo bài đăng tuyển dụng mới để tìm kiếm ứng viên phù hợp</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề việc làm *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ví dụ: Senior Frontend Developer"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vị trí công việc *
                </label>
                <input
                  type="text"
                  name="position.title"
                  value={formData.position.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors['position.title'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ví dụ: Frontend Developer"
                />
                {errors['position.title'] && <p className="mt-1 text-sm text-red-600">{errors['position.title']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cấp bậc
                </label>
                <select
                  name="position.level"
                  value={formData.position.level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Intern">Thực tập sinh</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Manager">Quản lý</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngôn ngữ
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Tiếng Việt">Tiếng Việt</option>
                  <option value="English">English</option>
                  <option value="Tiếng Việt & English">Tiếng Việt & English</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả công việc *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Mô tả chi tiết về công việc, trách nhiệm, yêu cầu..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>

          {/* Location and Salary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Địa điểm và lương</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thành phố *
                </label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors['location.city'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ví dụ: Hồ Chí Minh"
                />
                {errors['location.city'] && <p className="mt-1 text-sm text-red-600">{errors['location.city']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ chi tiết
                </label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ví dụ: 123 Nguyễn Huệ, Q1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mức lương *
                </label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.salary ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ví dụ: 15-25 triệu VNĐ"
                />
                {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hạn nộp hồ sơ *
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.deadline ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.deadline && <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>}
              </div>
            </div>
          </div>

          {/* Skills Required */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Kỹ năng yêu cầu</h2>
            
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
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Thêm
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.skillsRequired.map((skill, index) => (
                <div
                  key={index}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getSkillLevelColor(skill.level)}`}
                >
                  <span>{skill.name}</span>
                  <span className="text-xs">({getSkillLevelText(skill.level)})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            {errors.skillsRequired && (
              <p className="mt-2 text-sm text-red-600">{errors.skillsRequired}</p>
            )}

            {formData.skillsRequired.length === 0 && (
              <p className="text-gray-500 italic">Chưa có kỹ năng nào được thêm</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/employer/jobs')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner h-4 w-4"></div>
                  Đang đăng tin...
                </>
              ) : (
                <>
                  <PlusIcon className="h-4 w-4" />
                  Đăng tin tuyển dụng
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobCreatePage;
