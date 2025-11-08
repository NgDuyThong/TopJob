import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  XMarkIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { jobService } from '../../services/jobService';
import { toast } from 'react-toastify';

const JobEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  useEffect(() => {
    loadJobData();
  }, [id]);

  const loadJobData = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobById(id);
      const job = response.data;
      
      // Convert deadline to YYYY-MM-DD format
      const deadlineDate = new Date(job.deadline);
      const formattedDeadline = deadlineDate.toISOString().split('T')[0];
      
      setFormData({
        title: job.title || '',
        description: job.description || '',
        position: {
          title: job.position?.title || '',
          level: job.position?.level || 'Junior'
        },
        skillsRequired: job.skillsRequired || [],
        location: {
          city: job.location?.city || '',
          address: job.location?.address || ''
        },
        salary: job.salary || '',
        language: job.language || 'Tiếng Việt',
        deadline: formattedDeadline,
        status: job.status || 'open'
      });
    } catch (error) {
      console.error('Error loading job:', error);
      toast.error('Không thể tải thông tin công việc');
      navigate('/employer/dashboard');
    } finally {
      setLoading(false);
    }
  };

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
      newErrors.title = 'Vui lòng nhập tiêu đề công việc';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả công việc';
    }
    if (!formData.position.title.trim()) {
      newErrors['position.title'] = 'Vui lòng nhập vị trí tuyển dụng';
    }
    if (!formData.location.city.trim()) {
      newErrors['location.city'] = 'Vui lòng nhập thành phố';
    }
    if (!formData.deadline) {
      newErrors.deadline = 'Vui lòng chọn hạn nộp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setSubmitting(true);
      await jobService.updateJob(id, formData);
      toast.success('Cập nhật công việc thành công!');
      navigate(`/employer/jobs/${id}`);
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error(error.response?.data?.message || 'Không thể cập nhật công việc');
    } finally {
      setSubmitting(false);
    }
  };

  const getSkillLevelBadge = (level) => {
    const colors = {
      basic: 'bg-green-100 text-green-800',
      intermediate: 'bg-blue-100 text-blue-800',
      advanced: 'bg-purple-100 text-purple-800',
      expert: 'bg-red-100 text-red-800'
    };
    return colors[level] || colors.basic;
  };

  const getSkillLevelText = (level) => {
    const texts = {
      basic: 'Cơ bản',
      intermediate: 'Trung cấp',
      advanced: 'Nâng cao',
      expert: 'Chuyên gia'
    };
    return texts[level] || level;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin công việc...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa tin tuyển dụng</h1>
            <p className="mt-1 text-sm text-gray-600">Cập nhật thông tin tin tuyển dụng của bạn</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề công việc <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ví dụ: Frontend Developer"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả công việc <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Mô tả chi tiết về công việc, trách nhiệm, yêu cầu..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vị trí <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BriefcaseIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="position.title"
                    value={formData.position.title}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors['position.title'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Frontend Developer"
                  />
                </div>
                {errors['position.title'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['position.title']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cấp bậc
                </label>
                <select
                  name="position.level"
                  value={formData.position.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Intern">Intern</option>
                  <option value="Junior">Junior</option>
                  <option value="Middle">Middle</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
            </div>

            {/* Skills Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kỹ năng yêu cầu
              </label>
              
              {/* Add Skill Input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nhập tên kỹ năng"
                />
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="basic">Cơ bản</option>
                  <option value="intermediate">Trung cấp</option>
                  <option value="advanced">Nâng cao</option>
                  <option value="expert">Chuyên gia</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  Thêm
                </button>
              </div>

              {/* Skills List */}
              {formData.skillsRequired.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skillsRequired.map((skill, index) => (
                    <div
                      key={index}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getSkillLevelBadge(skill.level)}`}
                    >
                      <span>{skill.name}</span>
                      <span className="text-xs opacity-75">({getSkillLevelText(skill.level)})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thành phố <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors['location.city'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Hồ Chí Minh"
                  />
                </div>
                {errors['location.city'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['location.city']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="123 đường số 1"
                />
              </div>
            </div>

            {/* Salary and Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mức lương (VNĐ)
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="10000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngôn ngữ
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Tiếng Việt">Tiếng Việt</option>
                  <option value="English">English</option>
                  <option value="中文">中文</option>
                  <option value="日本語">日本語</option>
                  <option value="한국어">한국어</option>
                </select>
              </div>
            </div>

            {/* Deadline and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hạn nộp hồ sơ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.deadline ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="open">Đang tuyển</option>
                  <option value="closed">Đã đóng</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/employer/jobs/${id}`)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobEditPage;
