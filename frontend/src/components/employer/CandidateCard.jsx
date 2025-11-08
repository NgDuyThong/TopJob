import React from 'react';
import { Link } from 'react-router-dom';
import {
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  StarIcon,
  HeartIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const CandidateCard = ({ candidate, onSave, onUnsave, isSaved = false, showMatchScore = false }) => {
  const handleToggleSave = (e) => {
    e.preventDefault();
    if (isSaved) {
      onUnsave && onUnsave(candidate._id);
    } else {
      onSave && onSave(candidate._id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
              <UserIcon className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          {/* Candidate Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <Link 
                  to={`/employer/candidates/${candidate._id}`}
                  className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {candidate.fullName}
                </Link>
                {candidate.education && (
                  <p className="text-gray-600 mt-1">{candidate.education}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
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

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 mb-4">
              {candidate.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span className="text-sm">{candidate.email}</span>
                </div>
              )}
              {candidate.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <PhoneIcon className="h-4 w-4" />
                  <span className="text-sm">{candidate.phone}</span>
                </div>
              )}
              {candidate.address && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPinIcon className="h-4 w-4" />
                  <span className="text-sm">{candidate.address}</span>
                </div>
              )}
            </div>

            {/* Experience */}
            {candidate.experience && (
              <div className="flex items-start gap-2 mb-4 text-gray-700">
                <BriefcaseIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Kinh nghiệm</p>
                  <p className="text-sm text-gray-600 mt-1">{candidate.experience}</p>
                </div>
              </div>
            )}

            {/* Skills */}
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <StarIcon className="h-5 w-5 text-yellow-500" />
                  <p className="text-sm font-medium text-gray-700">Kỹ năng</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.slice(0, 6).map((skill, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-sm rounded-full ${
                        candidate.matchingSkills?.some(s => s.name === skill.name)
                          ? 'bg-green-100 text-green-700 font-medium'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {skill.name}
                    </span>
                  ))}
                  {candidate.skills.length > 6 && (
                    <span className="px-3 py-1 text-sm bg-gray-100 text-gray-500 rounded-full">
                      +{candidate.skills.length - 6}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <Link
                to={`/employer/candidates/${candidate._id}`}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-center font-medium"
              >
                Xem hồ sơ
              </Link>
              {candidate.email && (
                <a
                  href={`mailto:${candidate.email}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2"
                >
                  <EnvelopeIcon className="h-5 w-5" />
                  Liên hệ
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
