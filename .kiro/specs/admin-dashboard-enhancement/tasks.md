# Implementation Plan

- [x] 1. Set up backend admin routes and middleware



  - Create admin routes directory structure
  - Implement admin authentication middleware to verify admin role
  - Create base admin router with proper error handling





  - _Requirements: All requirements need admin authentication_

- [ ] 2. Implement admin statistics API
  - [x] 2.1 Create admin statistics controller


    - Write controller function to aggregate statistics from database
    - Calculate total users, candidates, employers, jobs, applications, views





    - Calculate active jobs and pending applications counts
    - _Requirements: 1.1, 1.2_
  
  - [ ] 2.2 Create statistics route
    - Add GET /api/admin/statistics endpoint


    - Connect route to statistics controller
    - Add admin authentication middleware





    - _Requirements: 1.1_

- [ ] 3. Implement admin users management API
  - [ ] 3.1 Create admin users controller
    - Write function to fetch users with pagination

    - Implement search functionality by name and email
    - Implement filtering by role and status
    - Populate candidate/employer profile data
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  


  - [ ] 3.2 Create users management route
    - Add GET /api/admin/users endpoint with query parameters
    - Connect route to users controller





    - Add admin authentication middleware
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 4. Implement admin jobs management API
  - [x] 4.1 Create admin jobs controller

    - Write function to fetch jobs with pagination
    - Implement search by title and company name
    - Implement status filtering
    - Populate employer information
    - _Requirements: 4.1, 4.2, 4.3_


  
  - [x] 4.2 Create job detail controller





    - Write function to fetch complete job details
    - Include applications list for the job
    - Include employer information
    - _Requirements: 6.1, 6.2, 6.3_
  

  - [ ] 4.3 Create job management routes
    - Add GET /api/admin/jobs endpoint
    - Add GET /api/admin/jobs/:id endpoint
    - Add PUT /api/admin/jobs/:id/status endpoint for status updates
    - Add DELETE /api/admin/jobs/:id endpoint
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.5_








- [ ] 5. Implement admin companies management API
  - [ ] 5.1 Create admin companies controller
    - Write function to fetch companies (employers) with pagination
    - Implement search by company name and industry
    - Calculate active jobs count and total applications for each company


    - Add verification status field





    - _Requirements: 5.1, 5.2, 5.4, 5.5_
  
  - [ ] 5.2 Create company detail controller
    - Write function to fetch complete company details


    - Include list of all jobs posted by company
    - Calculate company statistics (total jobs, active jobs, applications)





    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ] 5.3 Create company management routes
    - Add GET /api/admin/companies endpoint
    - Add GET /api/admin/companies/:id endpoint

    - Add PUT /api/admin/companies/:id/verify endpoint
    - _Requirements: 5.1, 5.2, 5.3, 7.1, 7.5_

- [ ] 6. Implement admin applications management API
  - [x] 6.1 Create admin applications controller

    - Write function to fetch all applications with pagination




    - Implement search by candidate name and job title
    - Implement status filtering
    - Populate candidate and job information
    - _Requirements: 9.1, 9.2, 9.3_
  

  - [ ] 6.2 Create application detail controller
    - Write function to fetch complete application details
    - Include full candidate information
    - Include full job and company information



    - Include status history timeline
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ] 6.3 Create application management routes
    - Add GET /api/admin/applications endpoint
    - Add GET /api/admin/applications/:id endpoint

    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 8.1_

- [ ] 7. Implement admin reports API
  - [ ] 7.1 Create admin reports controller
    - Write function to aggregate user registration data by date

    - Write function to aggregate job posting data by date
    - Write function to aggregate application submission data by date
    - Implement date range filtering
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_




  
  - [ ] 7.2 Create reports route
    - Add GET /api/admin/reports endpoint with date range parameters
    - Connect route to reports controller
    - _Requirements: 10.1, 10.5_


- [ ] 8. Create frontend API service layer
  - [ ] 8.1 Create adminApi service
    - Write service functions for all admin API endpoints
    - Implement proper error handling and token management

    - Add request/response interceptors
    - _Requirements: All frontend requirements_
  



  - [ ] 8.2 Create custom hooks for data fetching
    - Write useAdminStatistics hook with auto-refresh
    - Write usePaginatedData hook for lists
    - Write useAdminDetail hook for detail pages
    - _Requirements: 1.4, 3.5, 4.5, 5.3, 9.5_


- [ ] 9. Update Admin Dashboard Page with real data
  - [ ] 9.1 Integrate statistics API
    - Replace mock data with API call using useAdminStatistics hook
    - Add loading state with skeleton loaders
    - Add error state with retry button

    - Implement auto-refresh every 5 minutes
    - _Requirements: 1.1, 1.2, 1.3, 1.5_
  
  - [ ] 9.2 Integrate recent jobs and applications
    - Replace mock data with API calls

    - Ensure "Xem tất cả" links navigate correctly
    - Ensure "Xem" buttons navigate to detail pages with correct IDs
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  




  - [ ] 9.3 Fix quick actions navigation
    - Verify all quick action links navigate to correct pages
    - _Requirements: 2.3, 2.4_


- [ ] 10. Update Users Management Page with real data
  - [ ] 10.1 Integrate users API
    - Replace mock data with API call using usePaginatedData hook
    - Implement search functionality with debouncing
    - Implement role and status filters

    - Implement pagination controls
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ] 10.2 Add loading and error states
    - Add skeleton loaders for table rows

    - Add empty state when no users found
    - Add error state with retry option
    - _Requirements: 3.1_





- [ ] 11. Update Jobs Management Page with real data
  - [ ] 11.1 Integrate jobs API
    - Replace mock data with API call using usePaginatedData hook
    - Implement search functionality with debouncing
    - Implement status filter
    - Implement pagination controls

    - _Requirements: 4.1, 4.2, 4.3, 4.5_
  
  - [ ] 11.2 Implement job actions
    - Connect "Xem chi tiết" button to navigate to job detail page

    - Implement edit button functionality (status update)
    - Implement delete button with confirmation dialog
    - _Requirements: 4.4, 4.5_
  

  - [ ] 11.3 Add loading and error states
    - Add skeleton loaders for job cards
    - Add empty state when no jobs found
    - Add error state with retry option
    - _Requirements: 4.1_


- [ ] 12. Update Companies Management Page with real data
  - [x] 12.1 Integrate companies API



    - Replace mock data with API call using usePaginatedData hook
    - Implement search functionality with debouncing
    - Implement pagination controls
    - Display real statistics (active jobs, applications)
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  
  - [ ] 12.2 Implement company actions
    - Connect "Xem chi tiết" button to navigate to company detail page
    - Display verification status correctly
    - _Requirements: 5.3, 5.5_

  
  - [ ] 12.3 Add loading and error states
    - Add skeleton loaders for company cards

    - Add empty state when no companies found
    - Add error state with retry option
    - _Requirements: 5.1_




- [ ] 13. Create Job Detail Page
  - [ ] 13.1 Build job detail page component
    - Create page layout with breadcrumbs
    - Display complete job information (title, description, requirements, salary, location)
    - Display company information section

    - Display job statistics (views, applications count)
    - _Requirements: 6.1, 6.2_
  
  - [ ] 13.2 Add applications list section
    - Display list of all applications for this job

    - Show candidate name, status, and submission date
    - Add click handler to navigate to application detail
    - _Requirements: 6.3, 6.4_
  

  - [ ] 13.3 Add job management actions
    - Add button to change job status (open/close)
    - Add delete button with confirmation dialog
    - Show success/error toast notifications

    - _Requirements: 6.5_
  
  - [ ] 13.4 Add loading and error states
    - Add skeleton loader for page content


    - Add 404 state if job not found
    - Add error state with retry option
    - _Requirements: 6.1_


- [x] 14. Create Company Detail Page

  - [ ] 14.1 Build company detail page component
    - Create page layout with breadcrumbs
    - Display complete company profile (name, industry, size, location, description, contact)
    - Display company statistics section
    - _Requirements: 7.1, 7.2, 7.4_

  
  - [ ] 14.2 Add jobs list section
    - Display list of all jobs posted by company
    - Show job title, status, deadline, applications count
    - Add click handler to navigate to job detail

    - _Requirements: 7.3_
  
  - [ ] 14.3 Add company management actions
    - Add verify/unverify button

    - Add link to view employer account details
    - Show success/error toast notifications
    - _Requirements: 7.5_
  

  - [ ] 14.4 Add loading and error states
    - Add skeleton loader for page content
    - Add 404 state if company not found


    - Add error state with retry option

    - _Requirements: 7.1_

- [ ] 15. Create Application Detail Page
  - [ ] 15.1 Build application detail page component
    - Create page layout with breadcrumbs
    - Display application details (submission date, status)

    - Display candidate information section
    - Display job and company information section
    - _Requirements: 8.1, 8.2_
  
  - [ ] 15.2 Add resume and cover letter section
    - Display cover letter text

    - Add link/button to view/download resume file
    - _Requirements: 8.3_
  
  - [ ] 15.3 Add status timeline section
    - Display application status history
    - Show all status changes with timestamps
    - _Requirements: 8.4_
  
  - [ ] 15.4 Add navigation links
    - Add link to view full candidate profile
    - Add link to view job detail
    - Add link to view company detail
    - _Requirements: 8.5_
  
  - [ ] 15.5 Add loading and error states
    - Add skeleton loader for page content
    - Add 404 state if application not found
    - Add error state with retry option
    - _Requirements: 8.1_

- [ ] 16. Create Applications Management Page
  - [ ] 16.1 Build applications management page component
    - Create page layout with header
    - Implement applications table/list view
    - Display key information (candidate, job, company, status, date)
    - _Requirements: 9.1, 9.5_
  
  - [ ] 16.2 Implement search and filters
    - Add search input for candidate name and job title with debouncing
    - Add status filter dropdown
    - Implement pagination controls
    - _Requirements: 9.2, 9.3, 9.5_
  
  - [ ] 16.3 Implement navigation
    - Add click handler on rows to navigate to application detail
    - _Requirements: 9.4_
  
  - [ ] 16.4 Add loading and error states
    - Add skeleton loaders for table rows
    - Add empty state when no applications found
    - Add error state with retry option
    - _Requirements: 9.1_

- [ ] 17. Create Reports Page
  - [ ] 17.1 Build reports page component
    - Create page layout with header
    - Add date range picker for filtering
    - Create sections for different chart types
    - _Requirements: 10.1, 10.5_
  
  - [ ] 17.2 Implement user registration chart
    - Integrate chart library (recharts or chart.js)
    - Fetch and display user registration trend data
    - Show data points by date
    - _Requirements: 10.2_
  
  - [ ] 17.3 Implement job posting chart
    - Fetch and display job posting trend data
    - Show data points by date
    - _Requirements: 10.3_
  
  - [ ] 17.4 Implement application submission chart
    - Fetch and display application submission trend data
    - Show data points by date
    - _Requirements: 10.4_
  
  - [ ] 17.5 Add loading and error states
    - Add skeleton loaders for charts
    - Add empty state when no data in date range
    - Add error state with retry option
    - _Requirements: 10.1_

- [ ] 18. Update routing configuration
  - Add routes for all new pages (job detail, company detail, application detail, applications list, reports)
  - Ensure all routes are protected with admin authentication
  - Add 404 page for invalid routes
  - _Requirements: All navigation requirements_

- [ ] 19. Implement UI/UX improvements
  - [ ] 19.1 Add toast notification system
    - Install and configure toast library (react-hot-toast or similar)
    - Add success notifications for actions
    - Add error notifications for failures
    - _Requirements: All requirements with user actions_
  
  - [ ] 19.2 Add confirmation dialogs
    - Create reusable confirmation dialog component
    - Add confirmations for delete actions
    - Add confirmations for status changes
    - _Requirements: 4.5, 6.5, 7.5_
  
  - [ ] 19.3 Add breadcrumb navigation
    - Create breadcrumb component
    - Add breadcrumbs to all detail pages
    - _Requirements: All detail page requirements_
  
  - [ ] 19.4 Improve loading states
    - Create skeleton loader components
    - Apply to all data loading scenarios
    - _Requirements: 1.5, 3.1, 4.1, 5.1, 9.1_
  
  - [ ] 19.5 Improve error states
    - Create error display component with retry button
    - Apply to all error scenarios
    - _Requirements: 1.3, all API error handling_

- [ ] 20. Testing and validation
  - [ ] 20.1 Test all API endpoints
    - Test statistics endpoint returns correct data
    - Test pagination works correctly
    - Test search and filters work correctly
    - Test error handling for invalid requests
    - _Requirements: All backend requirements_
  
  - [ ] 20.2 Test frontend integration
    - Test all pages load data correctly
    - Test navigation between pages works
    - Test search and filters update results
    - Test pagination controls work
    - _Requirements: All frontend requirements_
  
  - [ ] 20.3 Test user interactions
    - Test delete confirmations work
    - Test status updates work
    - Test toast notifications appear
    - Test error recovery works
    - _Requirements: All user action requirements_
