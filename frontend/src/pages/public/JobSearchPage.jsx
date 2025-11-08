import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  FunnelIcon,
  XMarkIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { jobService } from '../../services/jobService';
import { candidateService } from '../../services/candidateService';
import { toast } from 'react-toastify';

const JobSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  
  // Get current user info
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isCandidate = currentUser.type === 'candidate';
  
  // Search and filter states
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    salaryMin: '',
    salaryMax: '',
    experience: '',
    jobType: '',
    workMode: '',
    companySize: '',
    sortBy: 'relevance'
  });
  
  // Temporary filters for mobile (only applied when user clicks "Apply")
  const [tempFilters, setTempFilters] = useState({ ...filters });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    loadJobs();
  }, [filters, pagination.currentPage]);

  // Load saved jobs for candidates
  useEffect(() => {
    const loadSavedJobs = async () => {
      if (isCandidate) {
        try {
          const response = await candidateService.getSavedJobs();
          const savedJobIds = new Set(response.data.map(job => job._id));
          setSavedJobs(savedJobIds);
        } catch (error) {
          console.error('Error loading saved jobs:', error);
        }
      }
    };
    loadSavedJobs();
  }, [isCandidate]);
  
  // Sync tempFilters with filters when filters change (e.g., from desktop mode)
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      
      // Map frontend categories to database position.title values
      let categoryValue = filters.category;
      
      const categoryMapping = {
        'Lập trình viên': 'Developer|Engineer|Programmer|Software|DevOps|System Analyst|React|Vue|Angular|Node|Python|Java|PHP|Go|\\.NET',
        'Marketing': 'Marketing|SEO|Content|Social Media|Brand Manager|Growth|Performance Marketing|PPC|Email Marketing',
        'Kế toán': 'Kế toán|Kiểm toán',
        'Nhân sự': 'HR|Nhân sự|Tuyển dụng|Talent|C&B|đào tạo',
        'Bán hàng': 'Sales|Business Development|Account Manager|Telesales|B2B|B2C|Key Account',
        'Thiết kế': 'Designer|Illustrator|3D Designer',
        'Kỹ thuật': 'Kỹ sư|Technical Leader|QA/QC|tự động hóa|sản xuất',
        'Quản lý': 'Project Manager|Product Manager|Operations Manager|Program Manager|Scrum Master|General Manager|Department Manager|Team Leader|Portfolio Manager'
      };
      
      if (filters.category && categoryMapping[filters.category]) {
        categoryValue = categoryMapping[filters.category];
      }
      
      const params = {
        q: filters.query,
        location: filters.location,
        category: categoryValue,
        salaryMin: filters.salaryMin,
        salaryMax: filters.salaryMax,
        experience: filters.experience,
        jobType: filters.jobType,
        workMode: filters.workMode,
        companySize: filters.companySize,
        sortBy: filters.sortBy
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'relevance') {
          delete params[key];
        }
      });

      const response = await jobService.searchJobs(params, pagination.currentPage, 10);
      
      setJobs(response.data?.jobs || []);
      setPagination({
        currentPage: response.data?.currentPage || 1,
        totalPages: response.data?.pages || 1,
        total: response.data?.total || 0
      });

    } catch (error) {
      console.error('Error loading jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    if (isMobile) {
      // On mobile, update temp filters only
      setTempFilters(prev => ({
        ...prev,
        [key]: value
      }));
    } else {
      // On desktop, update filters directly
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
      setPagination(prev => ({
        ...prev,
        currentPage: 1
      }));
    }
  };
  
  const applyFilters = () => {
    setFilters(tempFilters);
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
    if (isMobile) {
      setShowFilters(false);
    }
  };
  
  const clearFilters = () => {
    const clearedFilters = {
      query: filters.query, // Keep search query
      location: filters.location, // Keep location
      category: '',
      salaryMin: '',
      salaryMax: '',
      experience: '',
      jobType: '',
      workMode: '',
      companySize: '',
      sortBy: 'relevance'
    };
    
    if (isMobile) {
      setTempFilters(clearedFilters);
    } else {
      setFilters(clearedFilters);
      setPagination(prev => ({
        ...prev,
        currentPage: 1
      }));
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query);
    if (filters.location) params.set('location', filters.location);
    if (filters.category) params.set('category', filters.category);
    setSearchParams(params);
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const toggleSaveJob = async (jobId) => {
    // Check if user is logged in as candidate
    if (!isCandidate) {
      toast.error('Vui lòng đăng nhập với tài khoản ứng viên để lưu việc làm');
      navigate('/login');
      return;
    }

    const isSaved = savedJobs.has(jobId);
    
    try {
      if (isSaved) {
        await candidateService.unsaveJob(jobId);
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        toast.success('Đã bỏ lưu việc làm');
      } else {
        await candidateService.saveJob(jobId);
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.add(jobId);
          return newSet;
        });
        toast.success('Đã lưu việc làm');
      }
    } catch (error) {
      console.error('Error toggling save job:', error);
      toast.error(error.message || 'Không thể lưu việc làm');
    }
  };

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

  const categories = [
    'Lập trình viên', 'Marketing', 'Kế toán', 'Nhân sự', 
    'Bán hàng', 'Thiết kế', 'Kỹ thuật', 'Quản lý'
  ];

  const experienceLevels = [
    'Chưa có kinh nghiệm', '1-2 năm', '2-3 năm', 
    '3-5 năm', '5-7 năm', '7+ năm'
  ];

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const workModes = ['On-site', 'Remote', 'Hybrid'];
  const companySizes = ['1-10 nhân viên', '10-50 nhân viên', '50-100 nhân viên', '100-500 nhân viên', '500+ nhân viên'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm việc làm, kỹ năng, công ty..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1 relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Địa điểm"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Tìm kiếm
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <FunnelIcon className="h-5 w-5" />
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop & Mobile Overlay */}
          {showFilters && (
            <div 
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setShowFilters(false)}
            >
              <div 
                className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 h-full w-80 ml-auto overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngành nghề</label>
                  <select
                    value={isMobile ? tempFilters.category : filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Tất cả ngành nghề</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mức lương (VNĐ)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Từ"
                      value={isMobile ? tempFilters.salaryMin : filters.salaryMin}
                      onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Đến"
                      value={isMobile ? tempFilters.salaryMax : filters.salaryMax}
                      onChange={(e) => handleFilterChange('salaryMax', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kinh nghiệm</label>
                  <select
                    value={isMobile ? tempFilters.experience : filters.experience}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Tất cả mức kinh nghiệm</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại hình công việc</label>
                  <select
                    value={isMobile ? tempFilters.jobType : filters.jobType}
                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Tất cả loại hình</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Work Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức làm việc</label>
                  <select
                    value={isMobile ? tempFilters.workMode : filters.workMode}
                    onChange={(e) => handleFilterChange('workMode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Tất cả hình thức</option>
                    {workModes.map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>

                {/* Company Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quy mô công ty</label>
                  <select
                    value={isMobile ? tempFilters.companySize : filters.companySize}
                    onChange={(e) => handleFilterChange('companySize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Tất cả quy mô</option>
                    {companySizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                  {isMobile && (
                    <button
                      onClick={applyFilters}
                      className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
                    >
                      Áp dụng
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Job Listings */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    <span className="text-purple-600">{pagination.total}</span> việc làm tìm thấy
                  </h2>
                  <p className="text-gray-600">
                    {filters.category && (
                      <span className="font-medium text-purple-600">{filters.category}</span>
                    )}
                    {filters.query && (
                      <span> • Kết quả cho "<span className="font-medium">{filters.query}</span>"</span>
                    )}
                    {filters.location && (
                      <span> • tại <span className="font-medium">{filters.location}</span></span>
                    )}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Sắp xếp:</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white font-medium text-sm shadow-sm hover:border-purple-400 transition-colors"
                  >
                    <option value="relevance">📊 Liên quan nhất</option>
                    <option value="newest">🆕 Mới nhất</option>
                    <option value="salary-high">💰 Lương cao nhất</option>
                    <option value="salary-low">💵 Lương thấp nhất</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Đang tìm kiếm việc làm phù hợp...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && jobs.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Không tìm thấy việc làm phù hợp</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác để có kết quả tốt hơn.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Job Cards */}
            {!loading && (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-200 transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Company Logo */}
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                            <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {/* Job Title & Level */}
                            <div className="flex items-start gap-2 mb-2">
                              <Link 
                                to={`/jobs/${job._id}`}
                                className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors line-clamp-1"
                              >
                                {job.title}
                              </Link>
                              <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                                {job.position?.level || 'N/A'}
                              </span>
                            </div>
                            
                            {/* Company Name */}
                            <p className="text-purple-600 font-semibold mb-3 flex items-center gap-2">
                              <BuildingOfficeIcon className="h-4 w-4" />
                              {job.employerId?.companyName || 'Công ty'}
                            </p>
                            
                            {/* Job Info Grid */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPinIcon className="h-4 w-4 text-gray-400" />
                                <span className="truncate">{job.location?.city || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
                                <span className="font-semibold text-green-600">{formatSalary(job.salary)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <ClockIcon className="h-4 w-4 text-gray-400" />
                                <span>{formatDate(job.datePosted)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <StarIcon className="h-4 w-4 text-yellow-500" />
                                <span>{job.views || 0} lượt xem</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => toggleSaveJob(job._id)}
                            className="p-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                            title={savedJobs.has(job._id) ? "Đã lưu" : "Lưu tin"}
                          >
                            {savedJobs.has(job._id) ? (
                              <HeartSolidIcon className="h-6 w-6 text-red-500" />
                            ) : (
                              <HeartIcon className="h-6 w-6" />
                            )}
                          </button>
                          <button 
                            className="p-2.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
                            title="Chia sẻ"
                          >
                            <ShareIcon className="h-6 w-6" />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                        {job.description}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skillsRequired?.slice(0, 6).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
                          >
                            {skill.name}
                          </span>
                        ))}
                        {job.skillsRequired?.length > 6 && (
                          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200">
                            +{job.skillsRequired.length - 6} kỹ năng khác
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-gray-700">{job.applicationsCount || 0}</span>
                            <span>ứng viên</span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1">
                            <span>Hạn:</span>
                            <span className="font-medium text-red-600">
                              {new Date(job.deadline).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                            <span className="text-xs text-blue-600 font-medium">{job.position?.workMode || 'N/A'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="text-purple-600 hover:text-purple-700 font-semibold text-sm hover:underline"
                          >
                            Xem chi tiết →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && jobs.length > 0 && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center mt-8 gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 hover:border-purple-300 font-medium text-gray-700 transition-all shadow-sm disabled:hover:bg-white disabled:hover:border-gray-300"
                >
                  ← Trước
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                    let page;
                    if (pagination.totalPages <= 7) {
                      page = i + 1;
                    } else if (pagination.currentPage <= 4) {
                      page = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 3) {
                      page = pagination.totalPages - 6 + i;
                    } else {
                      page = pagination.currentPage - 3 + i;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all shadow-sm ${
                          page === pagination.currentPage
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                            : 'border border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-300'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 hover:border-purple-300 font-medium text-gray-700 transition-all shadow-sm disabled:hover:bg-white disabled:hover:border-gray-300"
                >
                  Sau →
                </button>
              </div>
            )}

            {/* No Results */}
            {!loading && jobs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy việc làm phù hợp</h3>
                <p className="text-gray-600 mb-4">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
                <button
                  onClick={() => {
                    setFilters({
                      query: '',
                      location: '',
                      category: '',
                      salaryMin: '',
                      salaryMax: '',
                      experience: '',
                      jobType: '',
                      workMode: '',
                      companySize: '',
                      sortBy: 'relevance'
                    });
                  }}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;