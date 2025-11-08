import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const EmployerProfile = ({ profile, onUpdate, isLoading }) => {
  const [formData, setFormData] = useState(profile || {
    companyName: '',
    field: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    website: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin công ty</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Tên công ty"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          <Input
            label="Lĩnh vực hoạt động"
            name="field"
            value={formData.field}
            onChange={handleChange}
            required
          />

          <Input
            label="Email công ty"
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

          <Input
            label="Địa chỉ công ty"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <Input
            label="Website"
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://"
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả về công ty
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
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

export default EmployerProfile;