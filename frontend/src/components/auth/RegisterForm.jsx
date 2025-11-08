import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const RegisterForm = ({ onRegister, isLoading }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    type: '',
    // For candidate
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    birthDate: '',
    education: '',
    experience: '',
    summary: '',
    // For employer
    companyName: '',
    field: '',
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
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    const submitData = { ...formData };
    delete submitData.confirmPassword;
    onRegister(submitData);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              đăng nhập nếu đã có tài khoản
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Thông tin tài khoản</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Tên đăng nhập"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
              />

              <Select
                label="Loại tài khoản"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                options={[
                  { value: 'candidate', label: 'Ứng viên' },
                  { value: 'employer', label: 'Nhà tuyển dụng' }
                ]}
              />

              <Input
                label="Mật khẩu"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />

              <Input
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {formData.type === 'candidate' && (
            <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Thông tin ứng viên</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Họ và tên"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />

                <Input
                  label="Số điện thoại"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />

                <Select
                  label="Giới tính"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  options={[
                    { value: 'male', label: 'Nam' },
                    { value: 'female', label: 'Nữ' },
                    { value: 'other', label: 'Khác' }
                  ]}
                />

                <Input
                  label="Ngày sinh"
                  name="birthDate"
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={handleChange}
                />

                <Input
                  label="Học vấn"
                  name="education"
                  required
                  value={formData.education}
                  onChange={handleChange}
                />

                <div className="md:col-span-2">
                  <Input
                    label="Kinh nghiệm làm việc"
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả bản thân
                  </label>
                  <textarea
                    name="summary"
                    rows={4}
                    required
                    value={formData.summary}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.type === 'employer' && (
            <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Thông tin công ty</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Tên công ty"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                />

                <Input
                  label="Lĩnh vực hoạt động"
                  name="field"
                  required
                  value={formData.field}
                  onChange={handleChange}
                />

                <Input
                  label="Email công ty"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />

                <Input
                  label="Số điện thoại"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />

                <Input
                  label="Địa chỉ"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                />

                <Input
                  label="Website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://"
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả về công ty
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
            >
              Đăng ký
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;