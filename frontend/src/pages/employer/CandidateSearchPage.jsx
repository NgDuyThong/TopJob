import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { employerService } from '../../services/employerService';
import CandidateCard from '../../components/employer/CandidateCard';
import { toast } from 'react-toastify';

const CandidateSearchPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [savedCandidates, setSavedCandidates] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [filters, setFilters] = useState({
    keyword: '',
    education: '',
    experience: '',
    skills: '',
    location: ''
  });

  const loadSavedCandidates = async () => {
    try {
      const response = await employerService.getSavedCandidates();
      const savedIds = new Set((response.data || []).map(c => c._id));
      setSavedCandidates(savedIds);
    } catch (error) {
      console.error('Error loading saved candidates:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!filters.keyword && !filters.education && !filters.experience && !filters.skills && !filters.location) {
      toast.warning('Vui lòng nhập ít nhất một tiêu chí tìm kiếm');
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      console.log('Searching with filters:', filters);
      const response = await employerService.searchCandidates(filters);
      console.log('Search response:', response);
      setCandidates(response.data || []);
      await loadSavedCandidates();
      toast.success(`Tìm thấy ${response.data?.length || 0} ứng viên`);
    } catch (error) {
      console.error('Error searching candidates:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Không thể tìm kiếm ứng viên');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      keyword: '',
      education: '',
      experience: '',
      skills: '',
      location: ''
    });
    setCandidates([]);
    setHasSearched(false);
  };

  const handleSaveCandidate = async (candidateId) => {
    try {
      await employerService.saveCandidate(candidateId);
      setSavedCandidates(new Set([...savedCandidates, candidateId]));
      toast.success('Đã lưu ứng viên');
    } catch (error) {
      console.error('Error saving candidate:', error);
      toast.error('Không thể lưu ứng viên');
    }
  };

  const handleUnsaveCandidate = async (candidateId) => {
    try {
      await employerService.unsaveCandidate(candidateId);
      const newSaved = new Set(savedCandidates);
      newSaved.delete(candidateId);
      setSavedCandidates(newSaved);
      toast.success('Đã bỏ lưu ứng viên');
    } catch (error) {
      console.error('Error unsaving candidate:', error);
      toast.error('Không thể bỏ lưu ứng viên');
    }
  };

  return (
    <div className="bg-gradient-to-br from-cyan-50 via-white to-blue-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-2xl">
                <MagnifyingGlassIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Tìm kiếm ứng viên
              </h1>
              <p className="text-gray-600 mt-1">Tìm ứng viên tiềm năng theo kỹ năng và kinh nghiệm</p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
          <form onSubmit={handleSearch}>
            <div className="space-y-6">
              {/* Primary Search */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Từ khóa tìm kiếm
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="keyword"
                    value={filters.keyword}
                    onChange={handleFilterChange}
                    placeholder="Tên, email, hoặc từ khóa..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-lg"
                  />
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <FunnelIcon className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-bold text-gray-900">Bộ lọc nâng cao</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trình độ học vấn
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={filters.education}
                      onChange={handleFilterChange}
                      placeholder="VD: Đại học, Cao đẳng..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kinh nghiệm
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={filters.experience}
                      onChange={handleFilterChange}
                      placeholder="VD: 2 năm, 5 năm..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kỹ năng
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={filters.skills}
                      onChange={handleFilterChange}
                      placeholder="VD: JavaScript, React, Node.js..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa điểm
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={filters.location}
                      onChange={handleFilterChange}
                      placeholder="VD: Hà Nội, TP.HCM..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  {loading ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
                </button>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          </div>
        ) : hasSearched ? (
          candidates.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-20"></div>
                <div className="relative bg-gradient-to-r from-cyan-100 to-blue-100 p-6 rounded-full">
                  <UserGroupIcon className="h-16 w-16 text-cyan-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Không tìm thấy ứng viên</h3>
              <p className="text-gray-600 mb-6">
                Thử điều chỉnh tiêu chí tìm kiếm hoặc sử dụng từ khóa khác
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Tìm thấy {candidates.length} ứng viên
                </h2>
              </div>
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate._id}
                    candidate={candidate}
                    isSaved={savedCandidates.has(candidate._id)}
                    onSave={handleSaveCandidate}
                    onUnsave={handleUnsaveCandidate}
                  />
                ))}
              </div>
            </>
          )
        ) : (
          <div className="bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-200 rounded-2xl p-8 text-center">
            <UserGroupIcon className="h-16 w-16 text-cyan-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-cyan-900 mb-2">
              Bắt đầu tìm kiếm ứng viên
            </h3>
            <p className="text-cyan-800">
              Nhập tiêu chí tìm kiếm phía trên để tìm ứng viên phù hợp với nhu cầu của bạn
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateSearchPage;
