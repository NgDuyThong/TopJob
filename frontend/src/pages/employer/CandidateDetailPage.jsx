import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  UserIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  StarIcon,
  DocumentArrowDownIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { employerService } from '../../services/employerService';
import { toast } from 'react-toastify';

const CandidateDetailPage = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (candidateId) {
      loadCandidateDetail();
      checkIfSaved();
    }
  }, [candidateId]);

  const loadCandidateDetail = async () => {
    try {
      setLoading(true);
      const response = await employerService.getCandidateDetail(candidateId);
      setCandidate(response.data);
    } catch (error) {
      console.error('Error loading candidate detail:', error);
      toast.error('Không thể tải thông tin ứng viên');
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const response = await employerService.getSavedCandidates();
      const savedIds = (response.data || []).map(c => c._id);
      setIsSaved(savedIds.includes(candidateId));
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleToggleSave = async () => {
    try {
      if (isSaved) {
        await employerService.unsaveCandidate(candidateId);
        setIsSaved(false);
        toast.success('Đã bỏ lưu ứng viên');
      } else {
        await employerService.saveCandidate(candidateId);
        setIsSaved(true);
        toast.success('Đã lưu ứng viên');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast.error('Không thể thực hiện thao tác');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy ứng viên</h2>
          <Link to="/employer/candidates/search" className="text-blue-600 hover:text-blue-700">
            Quay lại tìm kiếm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          to="/employer/candidates/search"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Quay lại
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          {/* Profile Content */}
          <div className="p-8 -mt-16">
            <div className="flex items-start gap-6 mb-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-4 border-white">
                  <UserIcon className="h-16 w-16 text-blue-600" />
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 pt-16">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{candidate.fullName}</h1>
                    {candidate.education && (
                      <p className="text-lg text-gray-600">{candidate.education}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleToggleSave}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        isSaved
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-blue-100 hover:text-blue-600'
                      }`}
                    >
                      {isSaved ? (
                        <HeartSolidIcon className="h-6 w-6" />
                      ) : (
                        <HeartIcon className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {candidate.email && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{candidate.email}</p>
                  </div>
                </div>
              )}

              {candidate.phone && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <PhoneIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600">Số điện thoại</p>
                    <p className="text-sm font-medium text-gray-900">{candidate.phone}</p>
                  </div>
                </div>
              )}

              {candidate.address && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPinIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600">Địa chỉ</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{candidate.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {candidate.email && (
                <a
                  href={`mailto:${candidate.email}`}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <EnvelopeIcon className="h-5 w-5" />
                  Gửi email
                </a>
              )}
              {candidate.resumeUrl && (
                <a
                  href={candidate.resumeUrl}
                  download
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  Tải CV
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-6">
          {/* Summary */}
          {candidate.summary && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Giới thiệu</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{candidate.summary}</p>
            </div>
          )}

          {/* Experience */}
          {candidate.experience && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BriefcaseIcon className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Kinh nghiệm làm việc</h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{candidate.experience}</p>
            </div>
          )}

          {/* Education */}
          {candidate.education && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Học vấn</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{candidate.education}</p>
            </div>
          )}

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <StarIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Kỹ năng</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {candidate.skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      skill.level === 'expert' ? 'bg-green-100 text-green-700' :
                      skill.level === 'advanced' ? 'bg-blue-100 text-blue-700' :
                      skill.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {skill.level === 'expert' ? 'Chuyên gia' :
                       skill.level === 'advanced' ? 'Nâng cao' :
                       skill.level === 'intermediate' ? 'Trung bình' :
                       'Cơ bản'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailPage;
