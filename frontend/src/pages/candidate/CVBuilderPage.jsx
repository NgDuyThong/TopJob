import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { 
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  StarIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { candidateService } from '../../services/candidateService';

const CVBuilderPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const cvPreviewRef = useRef(null);
  
  // Form data
  const [formData, setFormData] = useState({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: [],
    certifications: []
  });

  const [newItem, setNewItem] = useState({
    type: 'experience',
    data: {}
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await candidateService.getProfile();
      setProfile(response.data);
      
      // Initialize form data with profile data including CV
      setFormData({
        personal: {
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.cv?.personal?.address || '',
          linkedin: response.data.cv?.personal?.linkedin || '',
          github: response.data.cv?.personal?.github || '',
          website: response.data.cv?.personal?.website || ''
        },
        summary: response.data.summary || '',
        experience: response.data.cv?.experience || [],
        education: response.data.cv?.education || [],
        skills: response.data.skills || [],
        projects: response.data.cv?.projects || [],
        languages: response.data.cv?.languages || [],
        certifications: response.data.cv?.certifications || []
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addNewItem = (type) => {
    const newItemData = {
      id: Date.now(),
      ...getDefaultItemData(type)
    };

    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], newItemData]
    }));
  };

  const removeItem = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const getDefaultItemData = (type) => {
    switch (type) {
      case 'skills':
        return {
          name: '',
          level: 'basic'
        };
      case 'experience':
        return {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          location: ''
        };
      case 'education':
        return {
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          gpa: '',
          description: ''
        };
      case 'projects':
        return {
          name: '',
          description: '',
          technologies: '',
          url: '',
          startDate: '',
          endDate: ''
        };
      case 'languages':
        return {
          language: '',
          proficiency: 'Native'
        };
      case 'certifications':
        return {
          name: '',
          issuer: '',
          date: '',
          credentialId: '',
          url: ''
        };
      default:
        return {};
    }
  };

  const handleSaveCV = async () => {
    try {
      setSaving(true);
      // Update profile with full CV data
      await candidateService.updateProfile({
        fullName: formData.personal.fullName,
        email: formData.personal.email,
        phone: formData.personal.phone,
        summary: formData.summary,
        skills: formData.skills,
        cv: {
          personal: {
            address: formData.personal.address,
            linkedin: formData.personal.linkedin,
            github: formData.personal.github,
            website: formData.personal.website
          },
          experience: formData.experience,
          education: formData.education,
          projects: formData.projects,
          languages: formData.languages,
          certifications: formData.certifications
        }
      });
      alert('CV đã được lưu thành công!');
    } catch (error) {
      console.error('Error saving CV:', error);
      alert('Có lỗi xảy ra khi lưu CV. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const downloadCV = () => {
    if (!previewMode) {
      alert('Vui lòng chuyển sang chế độ "Xem trước" để tải CV');
      return;
    }

    const element = cvPreviewRef.current;
    if (!element) {
      alert('Không thể tải CV. Vui lòng thử lại.');
      return;
    }

    const opt = {
      margin: 10,
      filename: `CV_${formData.personal.fullName || 'My_CV'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const sections = [
    { id: 'personal', name: 'Thông tin cá nhân', icon: UserIcon },
    { id: 'summary', name: 'Mô tả bản thân', icon: DocumentTextIcon },
    { id: 'experience', name: 'Kinh nghiệm', icon: BriefcaseIcon },
    { id: 'education', name: 'Học vấn', icon: AcademicCapIcon },
    { id: 'skills', name: 'Kỹ năng', icon: StarIcon },
    { id: 'projects', name: 'Dự án', icon: DocumentTextIcon },
    { id: 'languages', name: 'Ngôn ngữ', icon: DocumentTextIcon },
    { id: 'certifications', name: 'Chứng chỉ', icon: DocumentTextIcon }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải CV Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Builder</h1>
          <p className="text-gray-600">Tạo CV chuyên nghiệp và hấp dẫn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Các phần CV</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                      activeSection === section.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{section.name}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <EyeIcon className="h-4 w-4" />
                  {previewMode ? 'Chỉnh sửa' : 'Xem trước'}
                </button>
                
                <button
                  onClick={handleSaveCV}
                  disabled={saving}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <CheckIcon className="h-4 w-4" />
                  {saving ? 'Đang lưu...' : 'Lưu CV'}
                </button>

                <button
                  onClick={downloadCV}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Tải CV
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {previewMode ? (
              <CVPreview data={formData} ref={cvPreviewRef} />
            ) : (
              <CVEditor 
                data={formData}
                setData={setFormData}
                activeSection={activeSection}
                onInputChange={handleInputChange}
                onArrayInputChange={handleArrayInputChange}
                onAddItem={addNewItem}
                onRemoveItem={removeItem}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// CV Editor Component
const CVEditor = ({ data, setData, activeSection, onInputChange, onArrayInputChange, onAddItem, onRemoveItem }) => {
  const sections = [
    { id: 'personal', name: 'Thông tin cá nhân' },
    { id: 'summary', name: 'Mô tả bản thân' },
    { id: 'experience', name: 'Kinh nghiệm' },
    { id: 'education', name: 'Học vấn' },
    { id: 'skills', name: 'Kỹ năng' },
    { id: 'projects', name: 'Dự án' },
    { id: 'languages', name: 'Ngôn ngữ' },
    { id: 'certifications', name: 'Chứng chỉ' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
                <input
                  type="text"
                  value={data.personal.fullName}
                  onChange={(e) => onInputChange('personal', 'fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={data.personal.email}
                  onChange={(e) => onInputChange('personal', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                <input
                  type="tel"
                  value={data.personal.phone}
                  onChange={(e) => onInputChange('personal', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                <input
                  type="text"
                  value={data.personal.address}
                  onChange={(e) => onInputChange('personal', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={data.personal.linkedin}
                  onChange={(e) => onInputChange('personal', 'linkedin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                <input
                  type="url"
                  value={data.personal.github}
                  onChange={(e) => onInputChange('personal', 'github', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Mô tả bản thân</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tóm tắt về bản thân</label>
              <textarea
                value={data.summary}
                onChange={(e) => setData(prev => ({ ...prev, summary: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Viết mô tả ngắn gọn về bản thân, kinh nghiệm và mục tiêu nghề nghiệp..."
              />
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Kinh nghiệm làm việc</h2>
              <button
                onClick={() => onAddItem('experience')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Thêm kinh nghiệm
              </button>
            </div>
            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <div key={exp.id || index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Kinh nghiệm #{index + 1}</h3>
                    <button
                      onClick={() => onRemoveItem('experience', index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Công ty *</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => onArrayInputChange('experience', index, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí *</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => onArrayInputChange('experience', index, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => onArrayInputChange('experience', index, 'location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => onArrayInputChange('experience', index, 'current', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        Đang làm việc tại đây
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày *</label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => onArrayInputChange('experience', index, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                      <input
                        type="month"
                        value={exp.endDate}
                        disabled={exp.current}
                        onChange={(e) => onArrayInputChange('experience', index, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả công việc</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => onArrayInputChange('experience', index, 'description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Mô tả về công việc, trách nhiệm và thành tích..."
                    />
                  </div>
                </div>
              ))}
              {data.experience.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BriefcaseIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Chưa có kinh nghiệm nào được thêm</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Học vấn</h2>
              <button
                onClick={() => onAddItem('education')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Thêm học vấn
              </button>
            </div>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={edu.id || index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Học vấn #{index + 1}</h3>
                    <button
                      onClick={() => onRemoveItem('education', index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trường *</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => onArrayInputChange('education', index, 'institution', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bằng cấp *</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => onArrayInputChange('education', index, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Cử nhân, Thạc sĩ, Tiến sĩ..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên ngành</label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => onArrayInputChange('education', index, 'field', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => onArrayInputChange('education', index, 'gpa', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="3.5/4.0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => onArrayInputChange('education', index, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                      <input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => onArrayInputChange('education', index, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea
                      value={edu.description}
                      onChange={(e) => onArrayInputChange('education', index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Thành tích, hoạt động ngoại khóa..."
                    />
                  </div>
                </div>
              ))}
              {data.education.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AcademicCapIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Chưa có học vấn nào được thêm</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Dự án</h2>
              <button
                onClick={() => onAddItem('projects')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Thêm dự án
              </button>
            </div>
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <div key={project.id || index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Dự án #{index + 1}</h3>
                    <button
                      onClick={() => onRemoveItem('projects', index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên dự án *</label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => onArrayInputChange('projects', index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Link dự án</label>
                      <input
                        type="url"
                        value={project.url}
                        onChange={(e) => onArrayInputChange('projects', index, 'url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                      <input
                        type="month"
                        value={project.startDate}
                        onChange={(e) => onArrayInputChange('projects', index, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                      <input
                        type="month"
                        value={project.endDate}
                        onChange={(e) => onArrayInputChange('projects', index, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Công nghệ sử dụng</label>
                    <input
                      type="text"
                      value={project.technologies}
                      onChange={(e) => onArrayInputChange('projects', index, 'technologies', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="React, Node.js, MongoDB..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả dự án</label>
                    <textarea
                      value={project.description}
                      onChange={(e) => onArrayInputChange('projects', index, 'description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Mô tả về dự án, vai trò, kết quả đạt được..."
                    />
                  </div>
                </div>
              ))}
              {data.projects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Chưa có dự án nào được thêm</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'languages':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Ngôn ngữ</h2>
              <button
                onClick={() => onAddItem('languages')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Thêm ngôn ngữ
              </button>
            </div>
            <div className="space-y-4">
              {data.languages.map((lang, index) => (
                <div key={lang.id || index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngôn ngữ</label>
                      <input
                        type="text"
                        value={lang.language}
                        onChange={(e) => onArrayInputChange('languages', index, 'language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Tiếng Anh, Tiếng Nhật..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trình độ</label>
                      <select
                        value={lang.proficiency}
                        onChange={(e) => onArrayInputChange('languages', index, 'proficiency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="Native">Bản ngữ</option>
                        <option value="Fluent">Thành thạo</option>
                        <option value="Advanced">Nâng cao</option>
                        <option value="Intermediate">Trung cấp</option>
                        <option value="Basic">Cơ bản</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem('languages', index)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {data.languages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Chưa có ngôn ngữ nào được thêm</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Chứng chỉ</h2>
              <button
                onClick={() => onAddItem('certifications')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Thêm chứng chỉ
              </button>
            </div>
            <div className="space-y-4">
              {data.certifications.map((cert, index) => (
                <div key={cert.id || index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Chứng chỉ #{index + 1}</h3>
                    <button
                      onClick={() => onRemoveItem('certifications', index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên chứng chỉ *</label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => onArrayInputChange('certifications', index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tổ chức cấp</label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => onArrayInputChange('certifications', index, 'issuer', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày cấp</label>
                      <input
                        type="month"
                        value={cert.date}
                        onChange={(e) => onArrayInputChange('certifications', index, 'date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mã chứng chỉ</label>
                      <input
                        type="text"
                        value={cert.credentialId}
                        onChange={(e) => onArrayInputChange('certifications', index, 'credentialId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link xác thực</label>
                    <input
                      type="url"
                      value={cert.url}
                      onChange={(e) => onArrayInputChange('certifications', index, 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              ))}
              {data.certifications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Chưa có chứng chỉ nào được thêm</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Kỹ năng</h2>
              <button
                onClick={() => onAddItem('skills')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Thêm kỹ năng
              </button>
            </div>
            <div className="space-y-4">
              {data.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên kỹ năng</label>
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => onArrayInputChange('skills', index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ</label>
                      <select
                        value={skill.level}
                        onChange={(e) => onArrayInputChange('skills', index, 'level', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="basic">Cơ bản</option>
                        <option value="intermediate">Trung bình</option>
                        <option value="advanced">Nâng cao</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem('skills', index)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {data.skills.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <StarIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Chưa có kỹ năng nào được thêm</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {renderSection()}
    </div>
  );
};

// CV Preview Component
const CVPreview = React.forwardRef(({ data }, ref) => {
  return (
    <div ref={ref} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.personal.fullName}</h1>
          <div className="flex items-center justify-center gap-4 text-gray-600">
            <span>{data.personal.email}</span>
            <span>•</span>
            <span>{data.personal.phone}</span>
          </div>
          {data.personal.address && (
            <p className="text-gray-600 mt-2">{data.personal.address}</p>
          )}
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mô tả bản thân</h2>
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Kỹ năng</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill.name} ({skill.level})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-purple-600 pb-2">Kinh nghiệm làm việc</h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-gray-300">
                  <div className="absolute w-3 h-3 bg-purple-600 rounded-full -left-[7px] top-1"></div>
                  <div className="mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-purple-600 font-medium">{exp.company}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    {exp.location && <span>{exp.location}</span>}
                    {exp.location && exp.startDate && <span>•</span>}
                    {exp.startDate && (
                      <span>
                        {new Date(exp.startDate).toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' })} - {' '}
                        {exp.current ? 'Hiện tại' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' }) : ''}
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-purple-600 pb-2">Học vấn</h2>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-gray-300">
                  <div className="absolute w-3 h-3 bg-purple-600 rounded-full -left-[7px] top-1"></div>
                  <div className="mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-purple-600 font-medium">{edu.institution}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    {edu.field && <span>{edu.field}</span>}
                    {edu.field && edu.gpa && <span>•</span>}
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <div className="text-sm text-gray-600 mb-2">
                      {edu.startDate && new Date(edu.startDate).toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' })}
                      {edu.startDate && edu.endDate && ' - '}
                      {edu.endDate && new Date(edu.endDate).toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' })}
                    </div>
                  )}
                  {edu.description && (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-purple-600 pb-2">Dự án</h2>
            <div className="space-y-6">
              {data.projects.map((project, index) => (
                <div key={index} className="border-l-2 border-gray-300 pl-6 relative">
                  <div className="absolute w-3 h-3 bg-purple-600 rounded-full -left-[7px] top-1"></div>
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline text-sm">
                        {project.url}
                      </a>
                    )}
                  </div>
                  {(project.startDate || project.endDate) && (
                    <div className="text-sm text-gray-600 mb-2">
                      {project.startDate && new Date(project.startDate).toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' })}
                      {project.startDate && project.endDate && ' - '}
                      {project.endDate && new Date(project.endDate).toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' })}
                    </div>
                  )}
                  {project.technologies && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">Công nghệ: </span>
                      <span className="text-sm text-gray-600">{project.technologies}</span>
                    </div>
                  )}
                  {project.description && (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-purple-600 pb-2">Ngôn ngữ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.languages.map((lang, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{lang.language}</span>
                  <span className="text-sm text-purple-600 font-medium">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-purple-600 pb-2">Chứng chỉ</h2>
            <div className="space-y-4">
              {data.certifications.map((cert, index) => (
                <div key={index} className="border-l-2 border-gray-300 pl-6 relative">
                  <div className="absolute w-3 h-3 bg-purple-600 rounded-full -left-[7px] top-1"></div>
                  <div className="mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                    {cert.issuer && (
                      <p className="text-purple-600 font-medium">{cert.issuer}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    {cert.date && (
                      <span>{new Date(cert.date).toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' })}</span>
                    )}
                    {cert.date && cert.credentialId && <span>•</span>}
                    {cert.credentialId && <span>Mã: {cert.credentialId}</span>}
                  </div>
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline text-sm mt-1 inline-block">
                      Xác thực chứng chỉ
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state if no data */}
        {!data.summary && 
         data.skills.length === 0 && 
         data.experience.length === 0 && 
         data.education.length === 0 && 
         data.projects.length === 0 && 
         data.languages.length === 0 && 
         data.certifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Xem trước CV sẽ được hoàn thiện trong phiên bản tiếp theo</p>
          </div>
        )}
      </div>
    </div>
  );
});

CVPreview.displayName = 'CVPreview';

export default CVBuilderPage;
