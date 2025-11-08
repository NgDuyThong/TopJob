import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  GlobeAltIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { api } from '../../services/api';

const CompanyDetailsPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  const fetchCompanyDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/employers/public/${id}`);
      
      if (response.data.status === 'success') {
        setCompany(response.data.data);
        
        // Fetch jobs của công ty
        const jobsResponse = await api.get('/jobs', {
          params: { employerId: id }
        });
        
        if (jobsResponse.data.status === 'success') {
          setJobs(jobsResponse.data.data.jobs);
        }
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
      toast.error('Không thể tải thông tin công ty');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BuildingOfficeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Không tìm thấy thông tin công ty</p>
          <Link to="/companies" className="text-purple-600 hover:underline mt-4 inline-block">
            Quay lại danh sách công ty
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-start">
            <div className="bg-white rounded-lg p-4 mr-6">
              <BuildingOfficeIcon className="h-16 w-16 text-purple-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{company.companyName}</h1>
              <p className="text-lg text-purple-100">{company.field}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Về chúng tôi</h2>
              <p className="text-gray-600 whitespace-pre-line">{company.description}</p>
            </div>

            {/* Job Openings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Vị trí đang tuyển ({jobs.length})
              </h2>

              {jobs.length === 0 ? (
                <p className="text-gray-500">Hiện tại công ty chưa có vị trí tuyển dụng nào.</p>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Link
                      key={job._id}
                      to={`/jobs/${job._id}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:border-purple-600 hover:shadow-md transition"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <BriefcaseIcon className="h-4 w-4 mr-1" />
                          {job.position?.level}
                        </span>
                        <span className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {job.location?.city}
                        </span>
                        <span className="text-purple-600 font-semibold">
                          {job.salary}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                        {job.description}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Địa chỉ</p>
                    <p className="text-sm text-gray-600">{company.address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Số điện thoại</p>
                    <a 
                      href={`tel:${company.phone}`}
                      className="text-sm text-purple-600 hover:underline"
                    >
                      {company.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <a 
                      href={`mailto:${company.email}`}
                      className="text-sm text-purple-600 hover:underline break-all"
                    >
                      {company.email}
                    </a>
                  </div>
                </div>

                {company.website && (
                  <div className="flex items-start">
                    <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Website</p>
                      <a 
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:underline break-all"
                      >
                        {company.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/companies"
                  className="block w-full text-center bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Quay lại danh sách
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsPage;
