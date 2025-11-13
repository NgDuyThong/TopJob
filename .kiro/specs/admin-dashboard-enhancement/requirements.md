# Requirements Document

## Introduction

Hệ thống admin dashboard hiện tại đang sử dụng dữ liệu gán cứng (mock data) và các nút điều hướng chưa hoạt động đầy đủ. Tính năng này sẽ nâng cấp admin dashboard để kết nối với database thực, xây dựng các trang chi tiết còn thiếu, và đảm bảo tất cả các chức năng điều hướng hoạt động hoàn chỉnh.

## Glossary

- **Admin Dashboard**: Trang tổng quan quản trị hệ thống tuyển dụng
- **Backend API**: Các endpoint REST API phục vụ dữ liệu từ database
- **Mock Data**: Dữ liệu giả được gán cứng trong code
- **Real-time Data**: Dữ liệu thực từ database MongoDB
- **Navigation**: Hệ thống điều hướng giữa các trang trong ứng dụng
- **Detail Pages**: Các trang hiển thị thông tin chi tiết của một đối tượng cụ thể

## Requirements

### Requirement 1

**User Story:** Là một quản trị viên, tôi muốn xem thống kê thực tế từ database trên dashboard, để có cái nhìn chính xác về tình trạng hệ thống

#### Acceptance Criteria

1. WHEN THE Admin Dashboard loads, THE System SHALL fetch statistics from the database including total users, candidates, employers, jobs, applications, and views
2. WHEN THE statistics data is retrieved successfully, THE System SHALL display the data in the dashboard cards with proper formatting
3. IF THE statistics API call fails, THEN THE System SHALL display an error message and show zero values with a retry option
4. THE System SHALL update statistics automatically every 5 minutes while the dashboard is active
5. THE System SHALL display loading indicators while fetching statistics data

### Requirement 2

**User Story:** Là một quản trị viên, tôi muốn xem danh sách việc làm gần đây và đơn ứng tuyển mới từ database, để theo dõi hoạt động mới nhất của hệ thống

#### Acceptance Criteria

1. WHEN THE Admin Dashboard loads, THE System SHALL fetch the 5 most recent job posts from the database
2. WHEN THE Admin Dashboard loads, THE System SHALL fetch the 5 most recent applications from the database
3. WHEN THE user clicks on "Xem tất cả" link for jobs, THE System SHALL navigate to the full jobs management page
4. WHEN THE user clicks on "Xem tất cả" link for applications, THE System SHALL navigate to the applications management page
5. WHEN THE user clicks on "Xem" button for a specific job or application, THE System SHALL navigate to the detail page with the correct ID

### Requirement 3

**User Story:** Là một quản trị viên, tôi muốn xem danh sách người dùng từ database với khả năng lọc và tìm kiếm, để quản lý tài khoản người dùng hiệu quả

#### Acceptance Criteria

1. WHEN THE Users Page loads, THE System SHALL fetch all users from the database with pagination support
2. WHEN THE user enters text in the search box, THE System SHALL filter users by name or email matching the search term
3. WHEN THE user selects a role filter, THE System SHALL display only users with the selected role
4. WHEN THE user selects a status filter, THE System SHALL display only users with the selected status
5. WHEN THE user clicks pagination buttons, THE System SHALL load the corresponding page of users from the database

### Requirement 4

**User Story:** Là một quản trị viên, tôi muốn xem danh sách công việc từ database với khả năng lọc và tìm kiếm, để quản lý các bài đăng tuyển dụng

#### Acceptance Criteria

1. WHEN THE Jobs Page loads, THE System SHALL fetch all job posts from the database with pagination support
2. WHEN THE user enters text in the search box, THE System SHALL filter jobs by title or company name matching the search term
3. WHEN THE user selects a status filter, THE System SHALL display only jobs with the selected status (open/closed)
4. WHEN THE user clicks on "Xem chi tiết" button, THE System SHALL navigate to the job detail page
5. WHEN THE user clicks on edit or delete buttons, THE System SHALL show appropriate confirmation dialogs

### Requirement 5

**User Story:** Là một quản trị viên, tôi muốn xem danh sách công ty từ database với khả năng lọc và tìm kiếm, để quản lý các nhà tuyển dụng

#### Acceptance Criteria

1. WHEN THE Companies Page loads, THE System SHALL fetch all companies (employers) from the database with pagination support
2. WHEN THE user enters text in the search box, THE System SHALL filter companies by name or industry matching the search term
3. WHEN THE user clicks on "Xem chi tiết" button, THE System SHALL navigate to the company detail page
4. THE System SHALL display company statistics including active jobs count and total applications count
5. THE System SHALL display verification status for each company

### Requirement 6

**User Story:** Là một quản trị viên, tôi muốn xem trang chi tiết của một công việc cụ thể, để xem đầy đủ thông tin và quản lý công việc đó

#### Acceptance Criteria

1. WHEN THE Job Detail Page loads with a job ID, THE System SHALL fetch complete job information from the database
2. THE System SHALL display all job details including title, description, requirements, salary, location, and company information
3. THE System SHALL display a list of all applications for this job
4. WHEN THE user clicks on an application, THE System SHALL navigate to the application detail page
5. THE System SHALL provide buttons to edit job status (open/close) and delete the job

### Requirement 7

**User Story:** Là một quản trị viên, tôi muốn xem trang chi tiết của một công ty cụ thể, để xem đầy đủ thông tin công ty và các công việc của họ

#### Acceptance Criteria

1. WHEN THE Company Detail Page loads with a company ID, THE System SHALL fetch complete company information from the database
2. THE System SHALL display company profile including name, industry, size, location, description, and contact information
3. THE System SHALL display a list of all jobs posted by this company
4. THE System SHALL display statistics for the company including total jobs, active jobs, and total applications
5. THE System SHALL provide buttons to verify/unverify the company and view the employer's account details

### Requirement 8

**User Story:** Là một quản trị viên, tôi muốn xem trang chi tiết của một đơn ứng tuyển cụ thể, để xem thông tin ứng viên và trạng thái ứng tuyển

#### Acceptance Criteria

1. WHEN THE Application Detail Page loads with an application ID, THE System SHALL fetch complete application information from the database
2. THE System SHALL display application details including candidate information, job information, cover letter, and resume
3. THE System SHALL display the current status of the application
4. THE System SHALL display the application timeline showing all status changes
5. THE System SHALL provide a link to view the candidate's full profile

### Requirement 9

**User Story:** Là một quản trị viên, tôi muốn xem trang quản lý đơn ứng tuyển với danh sách tất cả các đơn, để theo dõi và quản lý quá trình tuyển dụng

#### Acceptance Criteria

1. WHEN THE Applications Management Page loads, THE System SHALL fetch all applications from the database with pagination support
2. WHEN THE user enters text in the search box, THE System SHALL filter applications by candidate name or job title
3. WHEN THE user selects a status filter, THE System SHALL display only applications with the selected status
4. WHEN THE user clicks on an application, THE System SHALL navigate to the application detail page
5. THE System SHALL display key information for each application including candidate name, job title, company, status, and submission date

### Requirement 10

**User Story:** Là một quản trị viên, tôi muốn xem trang báo cáo thống kê với các biểu đồ và số liệu phân tích, để hiểu xu hướng và hiệu suất của hệ thống

#### Acceptance Criteria

1. WHEN THE Reports Page loads, THE System SHALL fetch statistical data for charts and graphs from the database
2. THE System SHALL display a chart showing user registration trends over time
3. THE System SHALL display a chart showing job posting trends over time
4. THE System SHALL display a chart showing application submission trends over time
5. THE System SHALL provide date range filters to customize the report period
