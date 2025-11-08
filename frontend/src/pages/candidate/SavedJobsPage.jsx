import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { candidateService } from '../../services/candidateService';
import { toast } from 'react-toastify';

const SavedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await candidateService.getSavedJobs();
      console.log('Saved jobs response:', response);
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
      toast.error('Không thể tải danh sách việc làm đã lưu');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await candidateService.unsaveJob(jobId);
      setJobs(jobs.filter(job => job._id !== jobId));
      toast.success('Đã bỏ lưu việc làm');
    } catch (error) {
      console.error('Error unsaving job:', error);
      toast.error('Không thể bỏ lưu việc làm');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return `${Math.floor(diffDays / 30)} tháng trước`;
  };

  const getDeadlineColor = (deadline) => {
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return 'text-red-600';
    if (daysLeft <= 7) return 'text-orange-600';
    return 'text-green-600';
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.position.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.employerId.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !filterLocation || job.location.city === filterLocation;
    return matchesSearch && matchesLocation;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.savedDate) - new Date(a.savedDate);
      case 'oldest':
        return new Date(a.savedDate) - new Date(b.savedDate);
      case 'deadline':
        return new Date(a.deadline) - new Date(b.deadline);
      default:
        return 0;
    }
  });

  const locations = [...new Set(jobs.map(job => job.location.city))];

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-2xl">
                <HeartSolidIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Việc làm đã lưu
              </h1>
              <p className="text-gray-600 mt-1">Quản lý {jobs.length} việc làm bạn quan tâm</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm việc làm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Tất cả địa điểm</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="newest">Lưu gần đây</option>
                <option value="oldest">Lưu lâu nhất</option>
                <option value="deadline">Gần hết hạn</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        ) : sortedJobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-full">
                <HeartIcon className="h-16 w-16 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchQuery || filterLocation ? 'Không tìm thấy việc làm' : 'Chưa có việc làm nào được lưu'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterLocation 
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Hãy bấm vào biểu tượng trái tim ở trang chi tiết việc làm để lưu lại'}
            </p>
            {(searchQuery || filterLocation) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterLocation('');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <XMarkIcon className="h-5 w-5" />
                Xóa bộ lọc
              </button>
            )}
            {!searchQuery && !filterLocation && (
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                Tìm việc làm
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedJobs.map((job) => (
              <div 
                key={job._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Content */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/jobs/${job._id}`}
                        className="group/link"
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover/link:text-purple-600 transition-colors line-clamp-1">
                          {job.position.title}
                        </h3>
                      </Link>
                      
                      <Link 
                        to={`/companies/${job.employerId._id}`}
                        className="inline-flex items-center gap-2 text-gray-700 hover:text-purple-600 mb-4 transition-colors"
                      >
                        <BuildingOfficeIcon className="h-5 w-5" />
                        <span className="font-medium">{job.employerId.companyName}</span>
                      </Link>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPinIcon className="h-5 w-5 text-purple-600" />
                          <span className="text-sm">{job.location.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium">{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ClockIcon className={`h-5 w-5 ${getDeadlineColor(job.deadline)}`} />
                          <span className={`text-sm font-medium ${getDeadlineColor(job.deadline)}`}>
                            {Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24))} ngày
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                          <span className="text-sm">Lưu {formatDate(job.savedDate)}</span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2">
                        {job.skillsRequired.slice(0, 4).map((skill, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm rounded-full font-medium"
                          >
                            {skill.name}
                          </span>
                        ))}
                        {job.skillsRequired.length > 4 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium">
                            +{job.skillsRequired.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <button
                        onClick={() => handleUnsaveJob(job._id)}
                        className="p-2 rounded-xl bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
                        title="Bỏ lưu"
                      >
                        <HeartSolidIcon className="h-6 w-6" />
                      </button>
                      
                      <Link
                        to={`/jobs/${job._id}`}
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium whitespace-nowrap"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        👁️ {job.views} lượt xem
                      </span>
                    </div>
                    <span className="text-purple-600 font-medium">
                      Hạn nộp: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage;
