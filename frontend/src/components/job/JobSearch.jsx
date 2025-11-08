import React, { useState } from 'react';
import Select from '../common/Select';
import Button from '../common/Button';

const JobSearch = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    city: '',
    position: '',
    level: '',
    salary: ''
  });

  const cities = [
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hcm', label: 'TP. Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'other', label: 'Tỉnh thành khác' }
  ];

  const positions = [
    { value: 'developer', label: 'Lập trình viên' },
    { value: 'tester', label: 'Kiểm thử viên' },
    { value: 'designer', label: 'Thiết kế' },
    { value: 'business', label: 'Kinh doanh' }
  ];

  const levels = [
    { value: 'Intern', label: 'Thực tập sinh' },
    { value: 'Junior', label: 'Junior' },
    { value: 'Senior', label: 'Senior' },
    { value: 'Manager', label: 'Manager' }
  ];

  const salaryRanges = [
    { value: '0-5', label: 'Dưới 5 triệu' },
    { value: '5-10', label: '5 - 10 triệu' },
    { value: '10-20', label: '10 - 20 triệu' },
    { value: '20+', label: 'Trên 20 triệu' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      city: '',
      position: '',
      level: '',
      salary: ''
    });
    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          name="city"
          value={filters.city}
          onChange={handleChange}
          options={cities}
          placeholder="Chọn thành phố"
          label="Địa điểm"
        />

        <Select
          name="position"
          value={filters.position}
          onChange={handleChange}
          options={positions}
          placeholder="Chọn vị trí"
          label="Vị trí"
        />

        <Select
          name="level"
          value={filters.level}
          onChange={handleChange}
          options={levels}
          placeholder="Chọn cấp bậc"
          label="Cấp bậc"
        />

        <Select
          name="salary"
          value={filters.salary}
          onChange={handleChange}
          options={salaryRanges}
          placeholder="Chọn mức lương"
          label="Mức lương"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
        >
          Đặt lại
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          Tìm kiếm
        </Button>
      </div>
    </form>
  );
};

export default JobSearch;