import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    HomeIcon,
    UsersIcon,
    BriefcaseIcon,
    BuildingOfficeIcon,
    DocumentTextIcon,
    ChartBarIcon,
    Bars3Icon,
    XMarkIcon,
    MagnifyingGlassIcon,
    BellIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { logout } from '../../store/slices/authSlice';

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedMenus, setExpandedMenus] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
        {
            name: 'Pages',
            icon: DocumentTextIcon,
            children: [
                { name: 'Users', href: '/admin/users', icon: UsersIcon },
                { name: 'Jobs', href: '/admin/jobs', icon: BriefcaseIcon },
                { name: 'Companies', href: '/admin/companies', icon: BuildingOfficeIcon },
                { name: 'Applications', href: '/admin/applications', icon: DocumentTextIcon },
                { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon }
            ]
        }
    ];

    const toggleMenu = (name) => {
        setExpandedMenus(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const isActive = (href) => {
        return location.pathname === href || location.pathname.startsWith(href + '/');
    };

    const getBreadcrumbs = () => {
        const paths = location.pathname.split('/').filter(Boolean);
        const breadcrumbs = [];

        if (paths[0] === 'admin') {
            breadcrumbs.push({ name: 'Pages', href: null });

            if (paths[1]) {
                const pageName = paths[1].charAt(0).toUpperCase() + paths[1].slice(1);
                breadcrumbs.push({ name: pageName, href: `/admin/${paths[1]}` });

                if (paths[2]) {
                    breadcrumbs.push({ name: 'Overview', href: null });
                }
            }
        }

        return breadcrumbs;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'
                    } bg-white border-r border-gray-200`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                    {sidebarOpen ? (
                        <Link to="/admin/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">T</span>
                            </div>
                            <span className="text-xl font-semibold text-gray-900">TopJob</span>
                        </Link>
                    ) : (
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mx-auto">
                            <span className="text-white font-bold text-lg">T</span>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`p-1 rounded-lg hover:bg-gray-100 ${!sidebarOpen && 'hidden'}`}
                    >
                        <Bars3Icon className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => (
                        <div key={item.name}>
                            {item.children ? (
                                <div>
                                    <button
                                        onClick={() => toggleMenu(item.name)}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${sidebarOpen ? '' : 'justify-center'
                                            } hover:bg-gray-100 text-gray-700`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5 flex-shrink-0" />
                                            {sidebarOpen && <span>{item.name}</span>}
                                        </div>
                                        {sidebarOpen && (
                                            expandedMenus[item.name] ? (
                                                <ChevronDownIcon className="w-4 h-4" />
                                            ) : (
                                                <ChevronRightIcon className="w-4 h-4" />
                                            )
                                        )}
                                    </button>
                                    {sidebarOpen && expandedMenus[item.name] && (
                                        <div className="ml-6 mt-1 space-y-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.name}
                                                    to={child.href}
                                                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${isActive(child.href)
                                                        ? 'bg-purple-50 text-purple-600 font-medium'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    <child.icon className="w-4 h-4 flex-shrink-0" />
                                                    <span>{child.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${sidebarOpen ? '' : 'justify-center'
                                        } ${isActive(item.href)
                                            ? 'bg-purple-50 text-purple-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    {sidebarOpen && <span>{item.name}</span>}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer - Layouts Section */}
                {sidebarOpen && (
                    <div className="px-3 py-4 border-t border-gray-200">
                        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            LAYOUTS
                        </p>
                        <div className="space-y-1">
                            <Link
                                to="/admin/settings"
                                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                            >
                                <Cog6ToothIcon className="w-5 h-5" />
                                <span>Settings</span>
                            </Link>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-6">
                        {/* Left: Toggle + Breadcrumb */}
                        <div className="flex items-center gap-4">
                            {!sidebarOpen && (
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <Bars3Icon className="w-5 h-5 text-gray-600" />
                                </button>
                            )}

                            {/* Breadcrumb */}
                            <nav className="flex items-center gap-2 text-sm">
                                {getBreadcrumbs().map((crumb, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        {index > 0 && <span className="text-gray-400">/</span>}
                                        {crumb.href ? (
                                            <Link to={crumb.href} className="text-gray-600 hover:text-purple-600">
                                                {crumb.name}
                                            </Link>
                                        ) : (
                                            <span className="text-gray-400">{crumb.name}</span>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* Right: Search + Icons + User */}
                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="relative hidden md:block">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search in front"
                                    className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            {/* Icons */}
                            <button className="relative p-2 rounded-lg hover:bg-gray-100">
                                <BellIcon className="w-5 h-5 text-gray-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            <button className="p-2 rounded-lg hover:bg-gray-100">
                                <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
                            </button>

                            {/* User Menu */}
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-purple-600 font-medium text-sm">
                                        {user?.username?.charAt(0).toUpperCase() || 'A'}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                    title="Logout"
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
