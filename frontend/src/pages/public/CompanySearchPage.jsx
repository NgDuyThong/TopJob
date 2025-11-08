import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  BuildingOfficeIcon, 
  MapPinIcon, 
  BriefcaseIcon,
  UsersIcon,
  GlobeAltIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { BuildingOfficeIcon as BuildingOfficeSolidIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { api } from '../../services/api';

const CompanySearchPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    field: '',
    city: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const fetchCompanies = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        limit: 12,
        ...filters
      };

      if (searchQuery) {
        params.q = searchQuery;
      }

      console.log('Fetching companies with params:', params);
      const response = await api.get('/employers/public', { params });
      console.log('Response:', response.data);
      
      if (response.data.status === 'success') {
        console.log('Companies fetched:', response.data.data.employers);
        setCompanies(response.data.data.employers);
        setPagination({
          page: pageNum,
          limit: 12,
          total: response.data.data.total,
          pages: response.data.data.pages
        });
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Không thể tải danh sách công ty');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('CompanySearchPage mounted, fetching companies...');
    fetchCompanies(1);
  }, [searchQuery, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to page 1 and fetch
    fetchCompanies(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm mb-6">
              <BuildingOfficeSolidIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
              Khám phá các công ty hàng đầu
            </h1>
            <p className="text-xl text-purple-100">
              Kết nối với hơn <span className="font-bold text-white">{pagination.total}+</span> nhà tuyển dụng uy tín trên toàn quốc
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                <MagnifyingGlassIcon className="h-6 w-6 text-purple-600 mr-3" />
                <input
                  type="text"
                  placeholder="Tìm kiếm công ty, ngành nghề..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-gray-700 bg-transparent placeholder-gray-400 font-medium"
                />
              </div>

              <select
                name="field"
                value={filters.field}
                onChange={handleFilterChange}
                className="px-6 py-3 text-gray-700 bg-gray-50 rounded-xl outline-none cursor-pointer font-medium hover:bg-gray-100 transition-colors"
              >
                <option value="">📂 Tất cả lĩnh vực</option>
                <option value="Lập trình viên">💻 Công nghệ thông tin</option>
                <option value="Kế toán">💰 Tài chính - Ngân hàng</option>
                <option value="Marketing">📢 Marketing - Truyền thông</option>
                <option value="Nhân sự">👥 Nhân sự</option>
                <option value="Bán hàng">🛍️ Bán hàng</option>
                <option value="Thiết kế">🎨 Thiết kế</option>
                <option value="Kỹ thuật">⚙️ Kỹ thuật</option>
                <option value="Quản lý">📊 Quản lý</option>
              </select>

              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                🔍 Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Companies List */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-600 mb-6"></div>
            <p className="text-lg text-gray-600 font-medium">Đang tìm kiếm công ty...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center max-w-2xl mx-auto">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BuildingOfficeIcon className="h-16 w-16 text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Không tìm thấy công ty nào</h3>
            <p className="text-gray-600 text-lg mb-8">Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm được kết quả phù hợp hơn.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({ field: '', city: '' });
              }}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Tìm thấy <span className="text-purple-600">{pagination.total}</span> công ty
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {filters.field && (
                      <span>Lĩnh vực: <span className="font-semibold text-purple-600">{filters.field}</span></span>
                    )}
                    {searchQuery && (
                      <span> • Từ khóa: "<span className="font-semibold">{searchQuery}</span>"</span>
                    )}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Trang {pagination.page} / {pagination.pages}
                </div>
              </div>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <Link
                  key={company._id}
                  to={`/companies/${company._id}`}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-200 hover:border-purple-200 transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                >
                  {/* Company Header with Gradient Background */}
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <BuildingOfficeSolidIcon className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="text-white">
                          <h3 className="text-lg font-bold mb-1 line-clamp-1">
                            {company.companyName}
                          </h3>
                          <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                            {company.field || 'Đa ngành'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company Body */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {company.description || 'Công ty uy tín, môi trường làm việc chuyên nghiệp'}
                    </p>

                    {/* Company Info Grid */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
                        <span className="line-clamp-1">{company.address || 'Chưa cập nhật'}</span>
                      </div>
                      
                      {company.companySize && (
                        <div className="flex items-center text-sm text-gray-600">
                          <UsersIcon className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                          <span>{company.companySize}</span>
                        </div>
                      )}
                      
                      {company.website && (
                        <div className="flex items-center text-sm text-gray-600">
                          <GlobeAltIcon className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                          <span className="line-clamp-1">{company.website.replace(/^https?:\/\//, '')}</span>
                        </div>
                      )}
                      
                      {company.foundedYear && (
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0" />
                          <span>Thành lập: {company.foundedYear}</span>
                        </div>
                      )}
                    </div>

                    {/* Job Count */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-purple-600 font-semibold">
                          <BriefcaseIcon className="h-5 w-5 mr-2" />
                          <span>{company.jobCount || company.jobPosts?.length || 0} việc làm</span>
                        </div>
                        <span className="text-sm text-purple-600 font-semibold group-hover:translate-x-1 transition-transform">
                          Xem chi tiết →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center mt-12 gap-2">
                <button
                  onClick={() => fetchCompanies(Math.max(1, pagination.page - 1))}
                  disabled={pagination.page === 1}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 hover:border-purple-300 font-semibold text-gray-700 transition-all shadow-sm disabled:hover:bg-white disabled:hover:border-gray-300"
                >
                  ← Trước
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.min(pagination.pages, 7))].map((_, index) => {
                    let page;
                    if (pagination.pages <= 7) {
                      page = index + 1;
                    } else if (pagination.page <= 4) {
                      page = index + 1;
                    } else if (pagination.page >= pagination.pages - 3) {
                      page = pagination.pages - 6 + index;
                    } else {
                      page = pagination.page - 3 + index;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => fetchCompanies(page)}
                        className={`w-11 h-11 rounded-xl font-bold transition-all shadow-sm ${
                          pagination.page === page
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-110'
                            : 'border border-gray-300 text-gray-700 hover:bg-purple-50 hover:border-purple-300'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => fetchCompanies(Math.min(pagination.pages, pagination.page + 1))}
                  disabled={pagination.page === pagination.pages}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 hover:border-purple-300 font-semibold text-gray-700 transition-all shadow-sm disabled:hover:bg-white disabled:hover:border-gray-300"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CompanySearchPage;
