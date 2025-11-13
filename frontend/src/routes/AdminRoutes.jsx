import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardLayout from '../layouts/DashboardLayout';

const AdminRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Fallback: check localStorage if Redux store doesn't have token
  const token = localStorage.getItem('token');
  const localUserType = localStorage.getItem('userType');
  
  // If we have token but not authenticated in Redux, trust localStorage
  const actuallyAuthenticated = isAuthenticated || !!token;

  if (!actuallyAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check user type from multiple sources
  const userType = user?.type || user?.role || localUserType;
  
  if (userType !== 'admin') {
    // If not admin, redirect to home
    return <Navigate to="/" replace />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminRoutes;