import React, { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const JobPostForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    position: {
      title: '',
      level: ''
    },
    skillsRequired: [],
    location: {
      city: '',
      address: ''
    },
    salary: '',
    language: '',
    deadline: ''
  });

  const [skill, setSkill] = useState({ name: '', level: '' });

  const handleChange = (e) => {
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
        skillsRequired: [...prev.skillsRequired, skill]
      }));
      setSkill({ name: '', level: '' });
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Tiêu đề công việc"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Vị trí"
            name="position.title"
            value={formData.position.title}
            onChange={handleChange}
            required
          />

          <Select
            label="Cấp bậc"
            name="position.level"
            value={formData.position.level}
            onChange={handleChange}
            options={[
              { value: 'Intern', label: 'Thực tập sinh' },
              { value: 'Junior', label: 'Junior' },
              { value: 'Senior', label: 'Senior' },
              { value: 'Manager', label: 'Manager' }
            ]}
            required
          />

          <Select
            label="Thành phố"
            name="location.city"
            value={formData.location.city}
            onChange={handleChange}
            options={[
              { value: 'Hà Nội', label: 'Hà Nội' },
              { value: 'TP.HCM', label: 'TP. Hồ Chí Minh' },
              { value: 'Đà Nẵng', label: 'Đà Nẵng' },
              { value: 'Remote', label: 'Remote' }
            ]}
            required
          />

          <Input
            label="Địa chỉ cụ thể"
            name="location.address"
            value={formData.location.address}
            onChange={handleChange}
          />

          <Input
            label="Mức lương"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="VD: 15-25 triệu, Thỏa thuận"
            required
          />

          <Input
            label="Ngôn ngữ làm việc"
            name="language"
            value={formData.language}
            onChange={handleChange}
            required
          />

          <Input
            label="Hạn nộp hồ sơ"
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Mô tả công việc</h2>
        <div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={10}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Mô tả chi tiết về công việc, yêu cầu và quyền lợi..."
            required
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Yêu cầu kỹ năng</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              label="Tên kỹ năng"
              name="name"
              value={skill.name}
              onChange={handleSkillChange}
              className="flex-1"
              placeholder="VD: JavaScript, React, Node.js"
            />
            <Select
              label="Cấp độ yêu cầu"
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
            {formData.skillsRequired.map((skill, index) => (
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
          size="lg"
          isLoading={isLoading}
        >
          {initialData ? 'Cập nhật tin tuyển dụng' : 'Đăng tin tuyển dụng'}
        </Button>
      </div>
    </form>
  );
};

export default JobPostForm;