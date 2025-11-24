import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  BriefcaseIcon,
  BuildingOfficeIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { jobService } from '../../services/jobService';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalCandidates: 0,
    successRate: 0
  });

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      
      // Lấy việc làm mới nhất
      const recentJobsResponse = await jobService.getRecentJobs();
      setRecentJobs(recentJobsResponse.data || []);

      // Lấy việc làm nổi bật (có thể thêm logic để lọc việc làm nổi bật)
      const featuredJobsResponse = await jobService.getAllJobs({ 
        limit: 6,
        page: 1 
      });
      setFeaturedJobs(featuredJobsResponse.data?.jobs || []);

      // Mock stats - có thể tạo API riêng cho stats
      setStats({
        totalJobs: featuredJobsResponse.data?.total || 0,
        totalCompanies: 180,
        totalCandidates: 5000,
        successRate: 85
      });

    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to job search page with query params
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    window.location.href = `/jobs?${params.toString()}`;
  };

  const popularCategories = [
    { name: 'Lập trình viên', count: 434, icon: '💻' },
    { name: 'Kế toán viên', count: 156, icon: '📊' },
    { name: 'Marketing Manager', count: 134, icon: '📢' },
    { name: 'UI/UX Designer', count: 298, icon: '🎨' },
    { name: 'Product Manager', count: 167, icon: '📱' },
    { name: 'Nhân sự', count: 123, icon: '👥' }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 ngày trước';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} tuần trước`;
    return `${Math.ceil(diffDays / 30)} tháng trước`;
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Thỏa thuận';
    return salary;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Tìm việc làm mơ ước tại
              <span className="block text-yellow-300">TopJob</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 animate-slide-in-left">
              Kết nối với hàng nghìn cơ hội việc làm từ các công ty hàng đầu Việt Nam
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-12 animate-slide-in-right">
              <div className="bg-white rounded-2xl p-2 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm việc làm, kỹ năng, công ty..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                    <input
                      type="text"
                      placeholder="Địa điểm làm việc"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <MagnifyingGlassIcon className="h-6 w-6" />
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{stats.totalJobs.toLocaleString()}+</div>
                <div className="text-purple-200">Việc làm</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{stats.totalCompanies}+</div>
                <div className="text-purple-200">Công ty</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{stats.totalCandidates.toLocaleString()}+</div>
                <div className="text-purple-200">Ứng viên</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{stats.successRate}%</div>
                <div className="text-purple-200">Tỷ lệ thành công</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ngành nghề phổ biến</h2>
            <p className="text-gray-600 text-lg">Khám phá các cơ hội việc làm trong lĩnh vực bạn quan tâm</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularCategories.map((category, index) => (
              <Link
                key={index}
                to={`/jobs?category=${encodeURIComponent(category.name)}`}
                className="group bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                {/* <p className="text-sm text-gray-500">{category.count} việc làm</p> */}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Việc làm nổi bật</h2>
              <p className="text-gray-600 text-lg">Những cơ hội việc làm hấp dẫn nhất hiện tại</p>
            </div>
            <Link
              to="/jobs"
              className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2"
            >
              Xem tất cả
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-purple-600 font-medium">{job.employerId?.companyName || 'Công ty'}</p>
                  </div>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                    {job.position?.level || 'N/A'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{job.location?.city || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{formatSalary(job.salary)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{formatDate(job.datePosted)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired?.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {job.skillsRequired?.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        +{job.skillsRequired.length - 3} khác
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{job.applicationsCount || 0} ứng viên</span>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    Xem chi tiết →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Việc làm mới nhất</h2>
            <p className="text-gray-600 text-lg">Cập nhật những cơ hội việc làm mới nhất</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentJobs.slice(0, 6).map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-purple-600 font-medium">{job.employerId?.companyName || 'Công ty'}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    Mới
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{job.location?.city || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{formatSalary(job.salary)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{formatDate(job.datePosted)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{job.applicationsCount || 0} ứng viên</span>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    Xem chi tiết →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose TopJob */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tại sao chọn TopJob?</h2>
            <p className="text-gray-600 text-lg">Nền tảng tuyển dụng hàng đầu Việt Nam</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BriefcaseIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Việc làm chất lượng</h3>
              <p className="text-gray-600">Hàng nghìn cơ hội việc làm từ các công ty uy tín</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cộng đồng lớn</h3>
              <p className="text-gray-600">Kết nối với hàng nghìn ứng viên và nhà tuyển dụng</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tỷ lệ thành công cao</h3>
              <p className="text-gray-600">85% ứng viên tìm được việc làm phù hợp</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dễ sử dụng</h3>
              <p className="text-gray-600">Giao diện thân thiện, tìm việc nhanh chóng</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng tìm việc làm mơ ước?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Tham gia TopJob ngay hôm nay và khởi đầu hành trình sự nghiệp của bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Đăng ký miễn phí
            </Link>
            <Link
              to="/jobs"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Tìm việc ngay
            </Link>
          </div>
        </div>
      </section>

      {/* Separator to prevent diagonal line */}
      <div className="h-1 bg-gray-900"></div>
    </div>
  );
};

export default HomePage;