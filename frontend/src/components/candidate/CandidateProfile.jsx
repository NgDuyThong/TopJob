import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Select from '../common/Select';

const CandidateProfile = ({ profile, onUpdate, isLoading }) => {
  const [formData, setFormData] = useState(profile || {
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

  const [skill, setSkill] = useState({ name: '', level: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (e) => {
    const { name, value } = e.target;
    setSkill(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = () => {
    if (skill.name && skill.level) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setSkill({ name: '', level: '' });
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Họ và tên"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Số điện thoại"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <Select
            label="Giới tính"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={[
              { value: 'male', label: 'Nam' },
              { value: 'female', label: 'Nữ' },
              { value: 'other', label: 'Khác' }
            ]}
            required
          />

          <Input
            label="Ngày sinh"
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Học vấn & Kinh nghiệm</h2>
        <div className="space-y-4">
          <Input
            label="Học vấn"
            name="education"
            value={formData.education}
            onChange={handleChange}
            required
          />

          <Input
            label="Kinh nghiệm làm việc"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả bản thân
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Kỹ năng</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              label="Tên kỹ năng"
              name="name"
              value={skill.name}
              onChange={handleSkillChange}
              className="flex-1"
            />
            <Select
              label="Cấp độ"
              name="level"
              value={skill.level}
              onChange={handleSkillChange}
              options={[
                { value: 'basic', label: 'Cơ bản' },
                { value: 'intermediate', label: 'Trung bình' },
                { value: 'advanced', label: 'Nâng cao' }
              ]}
              className="flex-1"
            />
            <div className="flex items-end">
              <Button
                type="button"
                onClick={addSkill}
                disabled={!skill.name || !skill.level}
              >
                Thêm
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
              >
                <span>{skill.name} - {skill.level}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          Cập nhật thông tin
        </Button>
      </div>
    </form>
  );
};

export default CandidateProfile;