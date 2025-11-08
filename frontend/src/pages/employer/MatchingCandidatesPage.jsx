import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChartBarIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { employerService } from '../../services/employerService';
import CandidateCard from '../../components/employer/CandidateCard';
import { toast } from 'react-toastify';

const MatchingCandidatesPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [savedCandidates, setSavedCandidates] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [minMatchScore, setMinMatchScore] = useState(0);

  useEffect(() => {
    if (jobId) {
      loadMatchingCandidates();
      loadSavedCandidates();
    }
  }, [jobId]);

  const loadMatchingCandidates = async () => {
    try {
      setLoading(true);
      const response = await employerService.getMatchingCandidates(jobId);
      setCandidates(response.data || []);
      // Also get job details from the first item if available
      if (response.data && response.data.length > 0) {
        // You might want to add a separate API call to get job details
        // For now, we'll just display what we have
      }
    } catch (error) {
      console.error('Error loading matching candidates:', error);
      toast.error('Không thể tải danh sách ứng viên phù hợp');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedCandidates = async () => {
    try {
      const response = await employerService.getSavedCandidates();
      const savedIds = new Set((response.data || []).map(c => c._id));
      setSavedCandidates(savedIds);
    } catch (error) {
      console.error('Error loading saved candidates:', error);
    }
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

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesScore = candidate.matchScore >= minMatchScore;
    return matchesSearch && matchesScore;
  });

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/employer/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Quay lại Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-2xl">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Ứng viên phù hợp
              </h1>
              <p className="text-gray-600 mt-1">{candidates.length} ứng viên tìm thấy</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-green-900 mb-2">💡 Hệ thống gợi ý thông minh</h3>
          <p className="text-green-800">
            Chúng tôi đã tìm kiếm và xếp hạng các ứng viên dựa trên mức độ phù hợp với kỹ năng yêu cầu của tin tuyển dụng.
            Điểm số phù hợp được tính dựa trên số lượng kỹ năng khớp với yêu cầu công việc.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Độ phù hợp tối thiểu: {minMatchScore}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">{filteredCandidates.length}</div>
            <div className="text-sm text-gray-600">Ứng viên phù hợp</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="text-3xl font-bold text-emerald-600 mb-1">
              {filteredCandidates.filter(c => c.matchScore >= 70).length}
            </div>
            <div className="text-sm text-gray-600">Phù hợp cao (≥70%)</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {filteredCandidates.filter(c => savedCandidates.has(c._id)).length}
            </div>
            <div className="text-sm text-gray-600">Đã lưu</div>
          </div>
        </div>

        {/* Candidates List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-full">
                <ChartBarIcon className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Không tìm thấy ứng viên phù hợp</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || minMatchScore > 0
                ? 'Thử thay đổi bộ lọc để xem thêm ứng viên'
                : 'Hiện chưa có ứng viên nào phù hợp với yêu cầu của tin tuyển dụng này'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => (
              <CandidateCard
                key={candidate._id}
                candidate={candidate}
                showMatchScore={true}
                isSaved={savedCandidates.has(candidate._id)}
                onSave={handleSaveCandidate}
                onUnsave={handleUnsaveCandidate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingCandidatesPage;
