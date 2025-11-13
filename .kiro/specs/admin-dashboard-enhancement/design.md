# Design Document

## Overview

Tài liệu này mô tả thiết kế chi tiết cho việc nâng cấp Admin Dashboard từ việc sử dụng dữ liệu mock sang kết nối với database thực thông qua REST API. Thiết kế bao gồm việc tạo các API endpoints mới cho admin, xây dựng các trang chi tiết còn thiếu, và cải thiện trải nghiệm người dùng với loading states và error handling.

## Architecture

### High-Level Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  Admin Frontend │◄───────►│  Backend API    │◄───────►│  MongoDB        │
│  (React)        │  HTTP   │  (Express)      │         │  Database       │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

### Component Structure

**Frontend:**
- Admin Dashboard Page (existing - needs API integration)
- Users Management Page (existing - needs API integration)
- Jobs Management Page (existing - needs API integration)
- Companies Management Page (existing - needs API integration)
- Job Detail Page (new)
- Company Detail Page (new)
- Application Detail Page (new)
- Applications Management Page (new)
- Reports Page (new)

**Backend:**
- Admin Statistics Controller (new)
- Admin Users Controller (new)
- Admin Jobs Controller (enhancement)
- Admin Companies Controller (new)
- Admin Applications Controller (enhancement)
- Admin Reports Controller (new)

## Components and Interfaces

### 1. Backend API Endpoints

#### 1.1 Admin Statistics API

**Endpoint:** `GET /api/admin/statistics`

**Purpose:** Lấy tất cả thống kê tổng quan cho dashboard

**Response:**
```json
{
  "totalUsers": 1250,
  "totalCandidates": 1000,
  "totalEmployers": 180,
  "totalJobs": 450,
  "activeJobs": 320,
  "totalApplications": 2500,
  "pendingApplications": 150,
  "totalViews": 15000
}
```

#### 1.2 Admin Users API

**Endpoint:** `GET /api/admin/users`

**Query Parameters:**
- `page` (number): Trang hiện tại
- `limit` (number): Số lượng items per page
- `search` (string): Tìm kiếm theo tên hoặc email
- `role` (string): Lọc theo vai trò (candidate/employer/admin)
- `status` (string): Lọc theo trạng thái (active/inactive/pending)

**Response:**
```json
{
  "users": [
    {
      "_id": "...",
      "username": "nguyenvana",
      "email": "nguyenvana@example.com",
      "type": "candidate",
      "status": "active",
      "createdAt": "2024-01-15T...",
      "lastLogin": "2024-11-10T...",
      "profile": {
        "fullName": "Nguyễn Văn A"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10
  }
}
```

#### 1.3 Admin Jobs API

**Endpoint:** `GET /api/admin/jobs`

**Query Parameters:**
- `page`, `limit`, `search`, `status`

**Response:**
```json
{
  "jobs": [
    {
      "_id": "...",
      "title": "Senior Frontend Developer",
      "employerId": {
        "_id": "...",
        "companyName": "TechCorp Vietnam"
      },
      "location": { "city": "TP.HCM" },
      "salary": "20-30 triệu",
      "status": "open",
      "applicationsCount": 25,
      "views": 150,
      "datePosted": "2024-11-01T..."
    }
  ],
  "pagination": { ... }
}
```

#### 1.4 Admin Companies API

**Endpoint:** `GET /api/admin/companies`

**Query Parameters:**
- `page`, `limit`, `search`

**Response:**
```json
{
  "companies": [
    {
      "_id": "...",
      "companyName": "TechCorp Vietnam",
      "field": "Công nghệ thông tin",
      "companySize": "100-500 nhân viên",
      "address": "TP.HCM",
      "email": "contact@techcorp.vn",
      "verified": true,
      "activeJobsCount": 12,
      "totalApplicationsCount": 145,
      "createdAt": "2024-01-15T..."
    }
  ],
  "pagination": { ... }
}
```

#### 1.5 Admin Applications API

**Endpoint:** `GET /api/admin/applications`

**Query Parameters:**
- `page`, `limit`, `search`, `status`

**Response:**
```json
{
  "applications": [
    {
      "_id": "...",
      "candidateId": {
        "_id": "...",
        "fullName": "Nguyễn Văn A",
        "email": "nguyenvana@example.com"
      },
      "jobpostId": {
        "_id": "...",
        "title": "Senior Frontend Developer",
        "employerId": {
          "companyName": "TechCorp Vietnam"
        }
      },
      "status": {
        "name": "Submitted",
        "updatedAt": "2024-11-10T..."
      },
      "submitDate": "2024-11-10T..."
    }
  ],
  "pagination": { ... }
}
```

#### 1.6 Job Detail API

**Endpoint:** `GET /api/admin/jobs/:id`

**Response:**
```json
{
  "_id": "...",
  "title": "Senior Frontend Developer",
  "description": "...",
  "position": {
    "title": "Senior Frontend Developer",
    "level": "Senior",
    "type": "Full-time",
    "workMode": "Hybrid"
  },
  "skillsRequired": [
    { "name": "React", "level": "Advanced" }
  ],
  "location": {
    "city": "TP.HCM",
    "address": "123 Nguyen Hue"
  },
  "salary": "20-30 triệu",
  "language": "Vietnamese",
  "datePosted": "2024-11-01T...",
  "deadline": "2024-12-01T...",
  "status": "open",
  "views": 150,
  "applicationsCount": 25,
  "employerId": {
    "_id": "...",
    "companyName": "TechCorp Vietnam",
    "email": "contact@techcorp.vn"
  },
  "applications": [
    {
      "_id": "...",
      "candidateSummary": {
        "fullName": "Nguyễn Văn A",
        "email": "nguyenvana@example.com"
      },
      "status": { "name": "Submitted" },
      "submitDate": "2024-11-10T..."
    }
  ]
}
```

#### 1.7 Company Detail API

**Endpoint:** `GET /api/admin/companies/:id`

**Response:**
```json
{
  "_id": "...",
  "companyName": "TechCorp Vietnam",
  "field": "Công nghệ thông tin",
  "email": "contact@techcorp.vn",
  "phone": "0123456789",
  "address": "TP.HCM",
  "description": "...",
  "companySize": "100-500 nhân viên",
  "website": "https://techcorp.vn",
  "verified": true,
  "createdAt": "2024-01-15T...",
  "jobPosts": [
    {
      "jobId": "...",
      "title": "Senior Frontend Developer",
      "deadline": "2024-12-01T...",
      "status": "open",
      "applicationsCount": 25
    }
  ],
  "statistics": {
    "totalJobs": 15,
    "activeJobs": 12,
    "totalApplications": 145
  }
}
```

#### 1.8 Application Detail API

**Endpoint:** `GET /api/admin/applications/:id`

**Response:**
```json
{
  "_id": "...",
  "candidateId": {
    "_id": "...",
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "phone": "0123456789",
    "address": "TP.HCM"
  },
  "jobpostId": {
    "_id": "...",
    "title": "Senior Frontend Developer",
    "employerId": {
      "_id": "...",
      "companyName": "TechCorp Vietnam"
    }
  },
  "resumeFile": "/uploads/resumes/...",
  "coverLetter": "...",
  "submitDate": "2024-11-10T...",
  "status": {
    "name": "Submitted",
    "updatedAt": "2024-11-10T..."
  },
  "viewedHistory": [
    {
      "employerId": "...",
      "viewedAt": "2024-11-11T..."
    }
  ],
  "statusHistory": [
    {
      "status": "Submitted",
      "timestamp": "2024-11-10T..."
    }
  ]
}
```

#### 1.9 Reports API

**Endpoint:** `GET /api/admin/reports`

**Query Parameters:**
- `startDate` (date): Ngày bắt đầu
- `endDate` (date): Ngày kết thúc
- `type` (string): Loại báo cáo (users/jobs/applications)

**Response:**
```json
{
  "userRegistrations": [
    { "date": "2024-11-01", "count": 15 },
    { "date": "2024-11-02", "count": 20 }
  ],
  "jobPostings": [
    { "date": "2024-11-01", "count": 5 },
    { "date": "2024-11-02", "count": 8 }
  ],
  "applicationSubmissions": [
    { "date": "2024-11-01", "count": 45 },
    { "date": "2024-11-02", "count": 52 }
  ]
}
```

### 2. Frontend Components

#### 2.1 API Service Layer

Tạo một service layer để quản lý tất cả API calls:

**File:** `frontend/src/services/adminApi.js`

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const adminApi = {
  // Statistics
  getStatistics: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/statistics`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return response.json();
  },
  
  // Users
  getUsers: async (params) => {
    const query = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/admin/users?${query}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return response.json();
  },
  
  // Jobs
  getJobs: async (params) => { ... },
  getJobDetail: async (id) => { ... },
  updateJobStatus: async (id, status) => { ... },
  deleteJob: async (id) => { ... },
  
  // Companies
  getCompanies: async (params) => { ... },
  getCompanyDetail: async (id) => { ... },
  
  // Applications
  getApplications: async (params) => { ... },
  getApplicationDetail: async (id) => { ... },
  
  // Reports
  getReports: async (params) => { ... }
};
```

#### 2.2 Custom Hooks

**File:** `frontend/src/hooks/useAdminData.js`

```javascript
export const useAdminStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadStatistics();
    const interval = setInterval(loadStatistics, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);
  
  const loadStatistics = async () => {
    try {
      const data = await adminApi.getStatistics();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return { stats, loading, error, refresh: loadStatistics };
};

export const usePaginatedData = (fetchFunction, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);
  
  useEffect(() => {
    loadData();
  }, [params]);
  
  const loadData = async () => {
    try {
      setLoading(true);
      const result = await fetchFunction(params);
      setData(result.data || result.users || result.jobs || result.companies || result.applications);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return { data, pagination, loading, error, setParams, refresh: loadData };
};
```

#### 2.3 New Pages

**Job Detail Page:** `frontend/src/pages/admin/JobDetailPage.jsx`
- Hiển thị đầy đủ thông tin công việc
- Danh sách ứng viên đã apply
- Nút chỉnh sửa trạng thái và xóa công việc

**Company Detail Page:** `frontend/src/pages/admin/CompanyDetailPage.jsx`
- Hiển thị thông tin công ty
- Danh sách công việc của công ty
- Thống kê công ty
- Nút verify/unverify

**Application Detail Page:** `frontend/src/pages/admin/ApplicationDetailPage.jsx`
- Thông tin ứng viên
- Thông tin công việc
- CV và cover letter
- Timeline trạng thái
- Link đến profile ứng viên

**Applications Management Page:** `frontend/src/pages/admin/ApplicationsPage.jsx`
- Danh sách tất cả đơn ứng tuyển
- Filters: status, search
- Pagination
- Link đến chi tiết

**Reports Page:** `frontend/src/pages/admin/ReportsPage.jsx`
- Biểu đồ xu hướng đăng ký người dùng
- Biểu đồ xu hướng đăng việc
- Biểu đồ xu hướng ứng tuyển
- Date range picker

## Data Models

### Frontend State Management

Sử dụng React hooks và context cho state management:

```javascript
// AdminContext.js
const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [statistics, setStatistics] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const refreshStatistics = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <AdminContext.Provider value={{ statistics, setStatistics, refreshStatistics }}>
      {children}
    </AdminContext.Provider>
  );
};
```

### Backend Data Aggregation

Các controller sẽ sử dụng MongoDB aggregation để tính toán statistics:

```javascript
// Example: Calculate statistics
const totalUsers = await Account.countDocuments();
const totalCandidates = await Account.countDocuments({ type: 'candidate' });
const totalEmployers = await Account.countDocuments({ type: 'employer' });
const totalJobs = await JobPost.countDocuments();
const activeJobs = await JobPost.countDocuments({ status: 'open' });
const totalApplications = await Application.countDocuments();
const pendingApplications = await Application.countDocuments({ 'status.name': 'Submitted' });
const totalViews = await JobPost.aggregate([
  { $group: { _id: null, total: { $sum: '$views' } } }
]);
```

## Error Handling

### Frontend Error Handling

1. **Network Errors:** Hiển thị toast notification với nút retry
2. **404 Errors:** Redirect về trang danh sách với thông báo
3. **403 Errors:** Redirect về login page
4. **500 Errors:** Hiển thị error page với support contact

### Backend Error Handling

```javascript
// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});
```

## Testing Strategy

### Unit Tests

- Test API service functions
- Test custom hooks
- Test utility functions

### Integration Tests

- Test API endpoints với mock database
- Test complete user flows (search, filter, pagination)

### E2E Tests

- Test admin login và navigation
- Test data loading và display
- Test CRUD operations

### Manual Testing Checklist

- [ ] Dashboard loads với real data
- [ ] All navigation links work
- [ ] Search và filters work correctly
- [ ] Pagination works
- [ ] Detail pages load correctly
- [ ] Error states display properly
- [ ] Loading states display properly
- [ ] Mobile responsive

## Security Considerations

1. **Authentication:** Tất cả admin endpoints require JWT token
2. **Authorization:** Verify user role is 'admin' trong middleware
3. **Input Validation:** Validate tất cả query parameters
4. **Rate Limiting:** Implement rate limiting cho admin APIs
5. **Audit Logging:** Log tất cả admin actions

## Performance Optimization

1. **Pagination:** Limit results to 10-20 items per page
2. **Caching:** Cache statistics for 5 minutes
3. **Lazy Loading:** Load detail pages only when needed
4. **Debouncing:** Debounce search inputs (300ms)
5. **Indexing:** Ensure database indexes on frequently queried fields

## UI/UX Improvements

1. **Loading States:** Skeleton loaders cho tất cả data fetching
2. **Empty States:** Friendly messages khi không có data
3. **Error States:** Clear error messages với recovery actions
4. **Confirmation Dialogs:** Confirm trước khi delete hoặc change status
5. **Toast Notifications:** Success/error feedback cho user actions
6. **Breadcrumbs:** Navigation breadcrumbs trên detail pages
