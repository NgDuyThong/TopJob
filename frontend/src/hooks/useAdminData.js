import { useState, useEffect, useCallback } from 'react';
import adminApi from '../services/adminApi';

/**
 * Hook for fetching admin statistics with auto-refresh
 */
export const useAdminStatistics = (refreshInterval = 5 * 60 * 1000) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getStatistics();
      setStats(response.data);
    } catch (err) {
      console.error('Error loading statistics:', err);
      setError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
    
    // Auto-refresh if interval is set
    if (refreshInterval > 0) {
      const interval = setInterval(loadStatistics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [loadStatistics, refreshInterval]);

  return { stats, loading, error, refresh: loadStatistics };
};

/**
 * Hook for fetching paginated data with filters
 */
export const usePaginatedData = (fetchFunction, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFunction(params);
      
      // Handle different response structures
      const responseData = response.data || response;
      setData(responseData.users || responseData.jobs || responseData.companies || responseData.applications || []);
      setPagination(responseData.pagination);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, params]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { 
    data, 
    pagination, 
    loading, 
    error, 
    setParams, 
    refresh: loadData 
  };
};

/**
 * Hook for fetching detail data by ID
 */
export const useAdminDetail = (fetchFunction, id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFunction(id);
      setData(response.data);
    } catch (err) {
      console.error('Error loading detail:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refresh: loadData };
};

/**
 * Hook for fetching dashboard recent data
 */
export const useDashboardData = () => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [jobsResponse, appsResponse] = await Promise.all([
        adminApi.getRecentJobs(5),
        adminApi.getRecentApplications(5)
      ]);

      setRecentJobs(jobsResponse.data || []);
      setRecentApplications(appsResponse.data || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { recentJobs, recentApplications, loading, error, refresh: loadData };
};
