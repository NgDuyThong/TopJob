import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon,
  BriefcaseIcon,
  HomeIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
  };

  // Get user from Redux or localStorage as fallback
  const getAuthUser = () => {
    // Ưu tiên localStorage vì nó luôn được cập nhật khi đăng nhập
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('🔍 Navbar - authUser from localStorage:', parsed);
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
    }
    // Fallback to Redux user
    console.log('🔍 Navbar - authUser from Redux:', user);
    return user || null;
  };
  
  const authUser = getAuthUser();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigation = [
    { name: 'Trang chủ', href: '/', icon: HomeIcon },
    { name: 'Việc làm', href: '/jobs', icon: BriefcaseIcon },
    { name: 'Công ty', href: '/companies', icon: BuildingOfficeIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <BriefcaseIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">TopJob</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Đăng nhập
                  </Link>
                  <Link 
                    to="/register"
                    className="btn-primary text-sm"
                  >
                    Đăng ký
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <UserCircleIcon className="w-6 h-6" />
                    <span className="hidden sm:block text-sm font-medium">{authUser ? (authUser.username || (authUser.type === 'candidate' ? 'Ứng viên' : authUser.type === 'employer' ? 'Nhà tuyển dụng' : 'Tài khoản')) : 'Tài khoản'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {authUser && authUser.type === 'candidate' ? (
                        <>
                          <div className="px-4 pb-2 text-xs uppercase tracking-wide text-gray-400">Tài khoản</div>
                          <Link to="/candidate/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>Thông tin cá nhân</Link>
                          <div className="my-2 border-t border-gray-100" />
                          <div className="px-4 pb-2 text-xs uppercase tracking-wide text-gray-400">Quản lý tìm việc</div>
                          <Link to="/candidate/saved-jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>Việc làm đã lưu</Link>
                          <Link to="/candidate/applications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>Việc làm đã ứng tuyển</Link>
                          <Link to="/candidate/recommended-jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>Việc làm phù hợp</Link>
                          <Link to="/candidate/job-suggestions-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>Cài đặt gợi ý việc làm</Link>
                          <div className="my-2 border-t border-gray-100" />
                          <div className="px-4 pb-2 text-xs uppercase tracking-wide text-gray-400">CV & Cover Letter</div>
                          <Link to="/candidate/cv-builder" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>CV của tôi</Link>
                          <Link to="/candidate/cover-letters" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>Cover Letter của tôi</Link>
                          <Link to="/candidate/employers-interested" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>NTD muốn kết nối</Link>
                          <Link to="/candidate/profile-views" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>NTD xem hồ sơ</Link>
                          <div className="my-2 border-t border-gray-100" />
                          <div className="px-4 pb-2 text-xs uppercase tracking-wide text-gray-400">Cài đặt</div>
                          <Link to="/settings/personalization" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>Giao diện</Link>
                          <Link to="/settings/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>Email & Thông báo</Link>
                          <Link to="/settings/security" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>Cá nhân & Bảo mật</Link>
                        </>
                      ) : authUser ? (
                        <>
                          <div className="px-4 pb-2 text-xs uppercase tracking-wide text-gray-400">Tài khoản</div>
                          <Link to="/employer/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>Bảng điều khiển</Link>
                          <Link to="/employer/applications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>Đơn ứng tuyển</Link>
                        </>
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">Đang tải...</div>
                      )}
                      {authUser && <div className="my-2 border-t border-gray-100" />}
                      {authUser && <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Đăng xuất</button>}
                    </div>
                  )}
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden border-t border-gray-200 bg-gray-50 px-4 py-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm việc làm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;