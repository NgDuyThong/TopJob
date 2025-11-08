import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PublicLayout from '../layouts/PublicLayout';

const PublicRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // Pages that are accessible to both authenticated and unauthenticated users
  const publicAccessPages = ['/companies', '/jobs', '/companies/:id', '/jobs/:id'];
  
  // Check if current path is in public access pages
  const isPublicAccessPage = publicAccessPages.some(page => {
    if (page.includes(':id')) {
      const pathPattern = page.replace(':id', '[^/]+');
      return new RegExp(`^${pathPattern}$`).test(location.pathname);
    }
    return location.pathname === page || location.pathname.startsWith(page + '/');
  });

  // Only redirect to dashboard if user is authenticated and not accessing a public-accessible page
  if (isAuthenticated && !isPublicAccessPage) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};

export default PublicRoutes;