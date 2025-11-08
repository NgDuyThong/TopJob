import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { employerService } from '../../services/employerService';
import CandidateCard from '../../components/employer/CandidateCard';
import { toast } from 'react-toastify';

const SavedCandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [educationFilter, setEducationFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadSavedCandidates();
  }, []);

  const loadSavedCandidates = async () => {
    try {
      setLoading(true);
      const response = await employerService.getSavedCandidates();
      setCandidates(response.data || []);
    } catch (error) {
      console.error('Error loading saved candidates:', error);
      toast.error('Không thể tải danh sách ứng viên đã lưu');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveCandidate = async (candidateId) => {
    try {
      await employerService.unsaveCandidate(candidateId);
      setCandidates(candidates.filter(c => c._id !== candidateId));
      toast.success('Đã bỏ lưu ứng viên');
    } catch (error) {
      console.error('Error unsaving candidate:', error);
      toast.error('Không thể bỏ lưu ứng viên');
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEducation = !educationFilter || candidate.education?.toLowerCase().includes(educationFilter.toLowerCase());
    return matchesSearch && matchesEducation;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.savedDate) - new Date(a.savedDate);
      case 'oldest':
        return new Date(a.savedDate) - new Date(b.savedDate);
      case 'name':
        return (a.fullName || '').localeCompare(b.fullName || '');
      default:
        return 0;
    }
  });

  return (
    <div className="bg-gradient-to-br from-pink-50 via-white to-rose-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/employer/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Quay lại Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-pink-500 to-rose-600 p-3 rounded-2xl">
                <HeartIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Ứng viên đã lưu
              </h1>
              <p className="text-gray-600 mt-1">{candidates.length} ứng viên</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="relative">
              <FunnelIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Lọc theo trình độ học vấn..."
                value={educationFilter}
                onChange={(e) => setEducationFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            >
              <option value="newest">Mới lưu nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="name">Theo tên (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Candidates List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : sortedCandidates.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-pink-100 to-rose-100 p-6 rounded-full">
                <HeartIcon className="h-16 w-16 text-pink-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchQuery || educationFilter ? 'Không tìm thấy ứng viên' : 'Chưa lưu ứng viên nào'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || educationFilter 
                ? 'Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác' 
                : 'Khi bạn lưu ứng viên tiềm năng, họ sẽ xuất hiện tại đây'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedCandidates.map((candidate) => (
              <CandidateCard
                key={candidate._id}
                candidate={candidate}
                isSaved={true}
                onUnsave={handleUnsaveCandidate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedCandidatesPage;
