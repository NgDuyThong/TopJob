# Hệ thống Tuyển dụng - JobLink

## Cấu trúc Project

```
DoAnMonHoc/
├── backend/          # Server Node.js + Express + MongoDB
└── frontend/         # Client React + Vite
```

## Yêu cầu hệ thống

- Node.js >= 16.x
- MongoDB (local hoặc MongoDB Atlas)
- npm hoặc yarn

## Cài đặt và Chạy Project

### 1. Backend

```powershell
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env (nếu chưa có)
# Nội dung file .env:
PORT=5000
MONGO_URI=mongodb+srv://ngduythong1412_db_user:oXMXCzDMZwp1yc81@cluster0.mq1i3ql.mongodb.net/JobLink
JWT_SECRET=187a4b1a6d411a215adb4712dac174aa39abfaf368973264011ab0f1ed1787e0c56e83de179ad078b2f46e1eb3111cd139ca5a435371111ea33d2fe38585eef0
JWT_EXPIRES_IN=3d
CLIENT_URL=http://localhost:5173
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=app_password
CLOUDINARY_URL=your_cloudinary_api_url

# Chạy server development
npm run dev

# Server sẽ chạy tại http://localhost:5000
```

### 2. Frontend

```powershell
# Mở terminal mới
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Tạo file .env (nếu chưa có)
# Nội dung file .env:
VITE_API_URL=http://localhost:5000/api

# Chạy client development
npm run dev

# Client sẽ chạy tại http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/validate-token` - Xác thực token

### Candidates
- `GET /api/candidates` - Lấy danh sách ứng viên (Admin)
- `GET /api/candidates/profile` - Lấy thông tin profile
- `PUT /api/candidates/profile` - Cập nhật profile
- `GET /api/candidates/applications` - Lấy danh sách đơn ứng tuyển
- `PUT /api/candidates/skills` - Cập nhật kỹ năng
- `GET /api/candidates/matching-jobs` - Tìm việc phù hợp

### Employers
- `GET /api/employers` - Lấy danh sách nhà tuyển dụng
- `GET /api/employers/profile` - Lấy thông tin profile
- `PUT /api/employers/profile` - Cập nhật profile
- `GET /api/employers/jobs` - Lấy danh sách bài đăng của công ty
- `GET /api/employers/applications` - Lấy danh sách ứng viên

### Job Posts
- `GET /api/jobs` - Lấy tất cả bài đăng (public)
- `GET /api/jobs/search` - Tìm kiếm bài đăng
- `GET /api/jobs/recent` - Lấy bài đăng mới nhất
- `GET /api/jobs/:id` - Lấy chi tiết bài đăng
- `POST /api/jobs/:id/view` - Tăng lượt xem
- `POST /api/jobs` - Tạo bài đăng mới (Employer)
- `PUT /api/jobs/:id` - Cập nhật bài đăng (Employer)
- `DELETE /api/jobs/:id` - Xóa bài đăng (Employer)

### Applications
- `POST /api/applications` - Nộp đơn ứng tuyển
- `GET /api/applications/:id` - Lấy chi tiết đơn ứng tuyển
- `PUT /api/applications/:id/status` - Cập nhật trạng thái
- `DELETE /api/applications/:id` - Rút đơn ứng tuyển

### Accounts (Admin)
- `GET /api/accounts` - Lấy danh sách tài khoản
- `PUT /api/accounts/:id/status` - Cập nhật trạng thái tài khoản
- `DELETE /api/accounts/:id` - Xóa tài khoản

## Database Schema

Xem chi tiết trong file đính kèm yêu cầu.

## Lưu ý

1. **CORS**: Backend đã cấu hình CORS cho phép frontend kết nối
2. **Authentication**: Hầu hết các API yêu cầu Bearer Token trong header
3. **File Upload**: CV được upload và lưu trữ trong thư mục `backend/src/uploads`
4. **Socket.IO**: Hỗ trợ real-time notifications (port 5000)

## Troubleshooting

### Server không kết nối được
- Kiểm tra MongoDB connection string trong file `.env`
- Kiểm tra port 5000 có bị chiếm dụng không: `netstat -ano | findstr :5000`

### Frontend không gọi được API
- Kiểm tra file `.env` trong frontend có đúng `VITE_API_URL`
- Kiểm tra backend đang chạy tại http://localhost:5000
- Xem Console trong browser để kiểm tra lỗi CORS

### Token hết hạn
- Token mặc định hết hạn sau 3 ngày (cấu hình trong `JWT_EXPIRES_IN`)
- Xóa localStorage và đăng nhập lại

## Scripts hữu ích

### Backend
```powershell
# Chạy script kiểm tra database
node src/scripts/checkDb.js

# Chạy script seed data mẫu
node src/scripts/seedData.js
```

## Contributors

- Nguyễn Duy Thông
