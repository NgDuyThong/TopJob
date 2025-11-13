# Admin Layout Update

## Thay đổi

Đã cập nhật giao diện admin theo template mới với các tính năng:

### 1. AdminLayout Component
- **Sidebar Navigation**: Sidebar có thể thu gọn/mở rộng
- **Logo & Branding**: Logo "Front" với màu tím chủ đạo
- **Menu Navigation**: 
  - Dashboard
  - Pages (expandable)
    - Users
    - Jobs  
    - Companies
    - Applications
    - Reports
- **Top Header**:
  - Breadcrumb navigation
  - Search bar
  - Notification icon (với badge)
  - Settings icon
  - User avatar với logout button

### 2. Các trang đã cập nhật

Tất cả các trang admin đã được cập nhật để sử dụng AdminLayout:

- ✅ DashboardPage
- ✅ UsersPage (với stats cards và table mới)
- ✅ JobsPage
- ✅ CompaniesPage
- ✅ ApplicationsPage
- ✅ ReportsPage
- ✅ JobDetailPage
- ✅ CompanyDetailPage
- ✅ ApplicationDetailPage

### 3. UsersPage - Thiết kế mới

UsersPage đã được thiết kế lại hoàn toàn theo template:

- **Stats Cards**: 4 cards hiển thị thống kê với trend indicators
- **Toolbar**: 
  - Search bar
  - Selected count
  - Action buttons (Delete, Export, Filter)
  - Add user button (màu tím)
- **Table**: 
  - Checkbox selection
  - Avatar với initial
  - Position & department info
  - Country
  - Status với dot indicator
  - Portfolio progress bar
  - Role badge
  - Edit action

### 4. Màu sắc

Màu tím chủ đạo được giữ nguyên:
- Primary: `purple-600` (#9333EA)
- Hover: `purple-700`
- Light: `purple-50`, `purple-100`

### 5. Responsive

Layout responsive với:
- Sidebar có thể thu gọn trên mobile
- Grid layout tự động điều chỉnh
- Table có horizontal scroll

## Cách sử dụng

Tất cả các trang admin tự động sử dụng AdminLayout. Không cần Navbar và Footer cho admin routes.

```jsx
import AdminLayout from '../../components/admin/AdminLayout';

const YourAdminPage = () => {
  return (
    <AdminLayout>
      {/* Your content here */}
    </AdminLayout>
  );
};
```

## Navigation

- Sidebar menu tự động highlight active page
- Breadcrumb tự động generate từ URL
- Click logo để về Dashboard
- Toggle sidebar bằng icon hamburger

## Next Steps

1. Cập nhật các trang detail khác nếu cần
2. Thêm chức năng cho các action buttons
3. Implement notification system
4. Thêm user profile dropdown
5. Cải thiện responsive cho mobile
