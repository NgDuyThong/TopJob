import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  BriefcaseIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { usePaginatedData } from '../../hooks/useAdminData';
import adminApi from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import { toast } from 'react-toastify';

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const params = {
    page: currentPage,
    limit: 10,
    search: debouncedSearch,
    status: filterStatus
  };

  const { data: jobs, pagination, loading, error, refresh } = usePaginatedData(
    useCallback(() => adminApi.getJobs(params), [currentPage, debouncedSearch, filterStatus])
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getStatusBadge = (status) => {
    if (status === 'open') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="h-4 w-4 mr-1" />
          Đang tuyển
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircleIcon className="h-4 w-4 mr-1" />
        Đã đóng
      </span>
    );
  };

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedJobs(jobs.map(job => job._id));
    } else {
      setSelectedJobs([]);
    }
  };

  // Handle select single job
  const handleSelectJob = (jobId) => {
    setSelectedJobs(prev => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  };

  // Handle update job status
  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      setIsUpdating(true);
      await adminApi.updateJobStatus(jobId, newStatus);
      toast.success('Cập nhật trạng thái thành công!');
      refresh();
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error(error.response?.data?.message || 'Không thể cập nhật trạng thái');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa việc làm này?')) {
      return;
    }

    try {
      setIsUpdating(true);
      await adminApi.deleteJob(jobId);
      toast.success('Đã xóa việc làm thành công!');
      refresh();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa việc làm');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedJobs.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một việc làm');
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedJobs.length} việc làm?`)) {
      return;
    }

    try {
      setIsUpdating(true);
      await Promise.all(
        selectedJobs.map(jobId => adminApi.deleteJob(jobId))
      );
      toast.success(`Đã xóa ${selectedJobs.length} việc làm`);
      setSelectedJobs([]);
      refresh();
    } catch (error) {
      console.error('Error bulk deleting jobs:', error);
      toast.error('Không thể xóa việc làm hàng loạt');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedJobs.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một việc làm');
      return;
    }

    try {
      setIsUpdating(true);
      await Promise.all(
        selectedJobs.map(jobId => adminApi.updateJobStatus(jobId, newStatus))
      );
      toast.success(`Đã cập nhật trạng thái cho ${selectedJobs.length} việc làm`);
      setSelectedJobs([]);
      refresh();
    } catch (error) {
      console.error('Error bulk updating status:', error);
      toast.error('Không thể cập nhật trạng thái hàng loạt');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading && currentPage === 1) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách việc làm...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={refresh} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Thử lại
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý việc làm</h1>
          <p className="text-gray-600">Quản lý và duyệt tất cả bài đăng tuyển dụng</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên công việc hoặc công ty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="open">Đang tuyển</option>
                <option value="closed">Đã đóng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={jobs?.length > 0 && selectedJobs.length === jobs.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
              />
              <span className="text-sm text-gray-600">{selectedJobs.length} Selected</span>
            </div>

            <div className="flex items-center gap-2">
              {selectedJobs.length > 0 && (
                <div className="flex items-center gap-2 mr-2">
                  <button 
                    onClick={() => handleBulkStatusUpdate('open')}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50"
                  >
                    <LockOpenIcon className="w-4 h-4" />
                    Open
                  </button>
                  <button 
                    onClick={() => handleBulkStatusUpdate('closed')}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
                  >
                    <LockClosedIcon className="w-4 h-4" />
                    Close
                  </button>
                  <button 
                    onClick={handleBulkDelete}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 gap-6 relative">
          {isUpdating && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <div className="spinner"></div>
            </div>
          )}
          
          {jobs && jobs.length > 0 ? jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <input 
                  type="checkbox" 
                  checked={selectedJobs.includes(job._id)}
                  onChange={() => handleSelectJob(job._id)}
                  className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <div className="relative group">
                      {getStatusBadge(job.status)}
                      
                      {/* Status dropdown */}
                      <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
                        <button
                          onClick={() => handleUpdateStatus(job._id, 'open')}
                          disabled={isUpdating || job.status === 'open'}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <CheckCircleIcon className="h-4 w-4 text-green-600" />
                          Open
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(job._id, 'closed')}
                          disabled={isUpdating || job.status === 'closed'}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <XCircleIcon className="h-4 w-4 text-red-600" />
                          Closed
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-purple-600 font-medium mb-3">{job.companyName}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Địa điểm:</span> {job.location}
                    </div>
                    <div>
                      <span className="font-medium">Mức lương:</span> {job.salary}
                    </div>
                    <div>
                      <span className="font-medium">Ứng viên:</span> {job.applicationsCount}
                    </div>
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {job.views} lượt xem
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-500">
                    Đăng ngày: {formatDate(job.datePosted)}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    to={`/admin/jobs/${job._id}`}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Xem chi tiết"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    disabled={isUpdating}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Xóa"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy việc làm</h3>
              <p className="mt-1 text-sm text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
            </div>
          )}
        </div>

        {/* Empty State - removed duplicate */}
        {false && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy việc làm</h3>
            <p className="mt-1 text-sm text-gray-500">
              Thử thay đổi bộ lọc hoặc tìm kiếm khác
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{jobs.length}</span> / <span className="font-medium">{pagination.totalItems}</span> việc làm
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage === i + 1 ? 'bg-purple-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default JobsPage;
