import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  StarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  HeartIcon,
  ShareIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { candidateService } from '../../services/candidateService';

const RecommendedJobsPage = () => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState(new Set());

  useEffect(() => {
    loadRecommendedJobs();
  }, []);

  const loadRecommendedJobs = async () => {
    try {
      setLoading(true);
      const response = await candidateService.getRecommendedJobs();
      
      // Debug logging
      console.log('🔍 [RecommendedJobs] API Response:', response);
      console.log('🔍 [RecommendedJobs] Source:', response.source);
      console.log('🔍 [RecommendedJobs] Jobs count:', response.data?.length || 0);
      
      if (response.data && response.data.length > 0) {
        console.log('🔍 [RecommendedJobs] First job:', {
          title: response.data[0].title,
          matchScore: response.data[0].matchScore,
          matchingSkillsCount: response.data[0].matchingSkillsCount,
          totalRequiredSkills: response.data[0].totalRequiredSkills,
          matchingSkills: response.data[0].matchingSkills
        });
        
        // Log all match scores
        const scores = response.data.map(j => j.matchScore);
        console.log('🔍 [RecommendedJobs] All match scores:', scores);
        console.log('🔍 [RecommendedJobs] Unique scores:', [...new Set(scores)]);
      }
      
      setRecommendedJobs(response.data || []);
    } catch (error) {
      console.error('❌ [RecommendedJobs] Error loading:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
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

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tìm việc làm phù hợp...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Việc làm phù hợp với bạn</h1>
            <p className="text-gray-600">
              Dựa trên kỹ năng và kinh nghiệm của bạn, chúng tôi đã tìm thấy {recommendedJobs.length} việc làm phù hợp
            </p>
          </div>
          <button
            onClick={loadRecommendedJobs}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>

        {/* How it works */}
        <div className="bg-purple-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cách hoạt động</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Phân tích kỹ năng</h3>
              <p className="text-sm text-gray-600">Hệ thống phân tích kỹ năng trong hồ sơ của bạn</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">So sánh yêu cầu</h3>
              <p className="text-sm text-gray-600">Tìm kiếm việc làm có kỹ năng trùng khớp</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Tính điểm phù hợp</h3>
              <p className="text-sm text-gray-600">Tính toán độ phù hợp và sắp xếp theo thứ tự</p>
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        {recommendedJobs.length === 0 ? (
          <div className="text-center py-12">
            <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có việc làm phù hợp</h3>
            <p className="text-gray-600 mb-6">
              Hãy cập nhật kỹ năng trong hồ sơ của bạn để nhận được gợi ý việc làm phù hợp hơn.
            </p>
            <Link
              to="/candidate/profile"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Cập nhật hồ sơ
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {recommendedJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMatchScoreColor(job.matchScore || 0)}`}>
                          {job.matchScore || 0}% phù hợp
                        </span>
                      </div>
                      <p className="text-purple-600 font-medium mb-2">{job.employerId?.companyName || 'Công ty'}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{job.location?.city || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          <span>{formatSalary(job.salary)}</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>{formatDate(job.datePosted)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSaveJob(job._id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      {savedJobs.has(job._id) ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                      <ShareIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                {/* Matching Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Kỹ năng phù hợp: {job.matchingSkillsCount || 0}/{job.totalRequiredSkills || job.skillsRequired?.length || 0}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired?.slice(0, 5).map((skill, index) => {
                      // matchingSkills từ Neo4j là array of strings
                      const skillName = typeof skill === 'string' ? skill : skill.name;
                      const isMatching = job.matchingSkills?.includes(skillName) || 
                                       job.matchingSkills?.some(ms => 
                                         (typeof ms === 'string' ? ms : ms.name) === skillName
                                       );
                      return (
                        <span
                          key={index}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            isMatching 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {isMatching && <CheckCircleIcon className="h-3 w-3" />}
                          {skillName}
                        </span>
                      );
                    })}
                    {job.skillsRequired?.length > 5 && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        +{job.skillsRequired.length - 5} khác
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{job.applicationsCount || 0} ứng viên</span>
                    <span>Hạn nộp: {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                    >
                      Xem chi tiết
                    </Link>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                      Ứng tuyển ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mẹo để tìm việc phù hợp hơn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Cập nhật kỹ năng</h3>
              <p className="text-sm text-gray-600 mb-3">
                Thêm các kỹ năng mới mà bạn đã học được vào hồ sơ để tăng cơ hội tìm việc phù hợp.
              </p>
              <Link
                to="/candidate/profile"
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                Cập nhật hồ sơ →
              </Link>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Mở rộng tìm kiếm</h3>
              <p className="text-sm text-gray-600 mb-3">
                Thử tìm kiếm với các từ khóa khác nhau hoặc mở rộng phạm vi địa lý.
              </p>
              <Link
                to="/jobs"
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                Tìm kiếm việc làm →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedJobsPage;
