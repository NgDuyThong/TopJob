# 🚀 Hướng dẫn Khởi động Project JobLink

## ✅ Server đã sẵn sàng!

Server backend của bạn đã được cấu hình đúng và đang chạy tại: **http://localhost:5000**

## 📋 Tóm tắt các vấn đề đã fix:

### 1. **CORS Configuration**
- ✅ Đã cấu hình CORS cho phép frontend kết nối
- ✅ Thêm credentials support

### 2. **API Endpoints**
- ✅ Tất cả routes đã được thiết lập đúng
- ✅ Authentication middleware hoạt động
- ✅ File upload (multer) đã được cấu hình

### 3. **Frontend Service Integration**
- ✅ Tạo file `.env` cho frontend với `VITE_API_URL`
- ✅ Sửa `authService.js` để sử dụng API instance thống nhất
- ✅ Tất cả services đã tích hợp với API đúng

### 4. **Error Handling**
- ✅ Xử lý lỗi email riêng biệt (không block chức năng chính)
- ✅ Validation cho file upload
- ✅ Proper error responses

### 5. **Database Models**
- ✅ Tất cả models phù hợp với schema đã cho
- ✅ Relationships được thiết lập đúng
- ✅ Middleware hooks hoạt động

---

## 🎯 Cách sử dụng

### **Khởi động Backend:**

\`\`\`powershell
cd backend
npm run dev
\`\`\`

Server chạy tại: http://localhost:5000

### **Khởi động Frontend:**

Mở terminal mới:

\`\`\`powershell
cd frontend
npm run dev
\`\`\`

Client chạy tại: http://localhost:5173

---

## 🧪 Test API

### **Option 1: Sử dụng file test-api.html**
Mở file `test-api.html` trong trình duyệt để test các API cơ bản.

### **Option 2: Sử dụng Postman hoặc Thunder Client**

#### **1. Health Check (Public)**
\`\`\`
GET http://localhost:5000/api/health
\`\`\`

#### **2. Get All Jobs (Public)**
\`\`\`
GET http://localhost:5000/api/jobs
\`\`\`

#### **3. Register Account (Public)**
\`\`\`
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "candidate1",
  "password": "password123",
  "type": "candidate",
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "phone": "0123456789",
  "gender": "Nam",
  "birthDate": "2000-01-01",
  "education": "Đại học",
  "experience": "2 năm",
  "skills": [
    {"name": "JavaScript", "level": "intermediate"},
    {"name": "React", "level": "advanced"}
  ],
  "summary": "Tôi là một developer nhiệt huyết"
}
\`\`\`

#### **4. Login (Public)**
\`\`\`
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "candidate1",
  "password": "password123"
}
\`\`\`

**Response sẽ trả về token:**
\`\`\`json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "candidate",
    "candidateId": "..."
  }
}
\`\`\`

#### **5. Get Candidate Profile (Protected)**
\`\`\`
GET http://localhost:5000/api/candidates/profile
Authorization: Bearer YOUR_TOKEN_HERE
\`\`\`

---

## 📊 Database Collections

Các collection trong MongoDB:
- ✅ **accounts** - Tài khoản người dùng
- ✅ **candidates** - Thông tin ứng viên
- ✅ **employers** - Thông tin nhà tuyển dụng
- ✅ **jobposts** - Bài đăng tuyển dụng
- ✅ **applications** - Đơn ứng tuyển

---

## 🔑 Tài khoản Test

Nếu đã có data trong DB, bạn có thể tạo tài khoản test:

### **Admin:**
- Username: admin
- Password: admin123

### **Candidate:**
- Register qua API hoặc Frontend

### **Employer:**
- Register qua API hoặc Frontend với type: "employer"

---

## 📝 API Routes Summary

### **Auth (Public)**
- POST `/api/auth/register` - Đăng ký
- POST `/api/auth/login` - Đăng nhập
- POST `/api/auth/validate-token` - Validate token

### **Jobs (Public routes)**
- GET `/api/jobs` - Lấy tất cả jobs
- GET `/api/jobs/search?q=keyword` - Tìm kiếm
- GET `/api/jobs/recent` - Jobs mới nhất
- GET `/api/jobs/:id` - Chi tiết job
- POST `/api/jobs/:id/view` - Tăng lượt xem

### **Jobs (Protected - Employer)**
- POST `/api/jobs` - Tạo job mới
- PUT `/api/jobs/:id` - Cập nhật job
- DELETE `/api/jobs/:id` - Xóa job

### **Candidates (Protected)**
- GET `/api/candidates` - Danh sách (Admin)
- GET `/api/candidates/profile` - Profile của tôi
- PUT `/api/candidates/profile` - Cập nhật profile
- GET `/api/candidates/applications` - Đơn của tôi
- PUT `/api/candidates/skills` - Cập nhật skills
- GET `/api/candidates/matching-jobs` - Jobs phù hợp

### **Employers (Protected)**
- GET `/api/employers` - Danh sách (Admin)
- GET `/api/employers/profile` - Profile của tôi
- PUT `/api/employers/profile` - Cập nhật profile
- GET `/api/employers/jobs` - Jobs đã đăng
- GET `/api/employers/jobs/:id/applications` - Đơn ứng tuyển

### **Applications (Protected)**
- POST `/api/applications` - Nộp đơn (file upload)
- GET `/api/applications/:id` - Chi tiết đơn
- DELETE `/api/applications/:id` - Rút đơn
- PUT `/api/applications/:id/status` - Cập nhật trạng thái (Employer)

### **Accounts (Protected - Admin)**
- GET `/api/accounts` - Danh sách tài khoản
- PUT `/api/accounts/:id/status` - Cập nhật trạng thái

---

## ⚠️ Lưu ý quan trọng

1. **MongoDB Connection**: Đảm bảo connection string trong `.env` đúng
2. **Port**: Server chạy port 5000, frontend port 5173
3. **File Upload**: CV được lưu trong `backend/uploads/resumes/`
4. **Email**: Email service có thể fail nhưng không ảnh hưởng chức năng
5. **CORS**: Chỉ cho phép `http://localhost:5173` kết nối

---

## 🐛 Troubleshooting

### **1. Server không start được**
\`\`\`powershell
# Kiểm tra port 5000
netstat -ano | findstr :5000

# Kill process nếu cần
taskkill /PID <PID> /F

# Restart server
npm run dev
\`\`\`

### **2. Frontend không gọi được API**
- Kiểm tra file `frontend/.env` có `VITE_API_URL=http://localhost:5000/api`
- Clear localStorage: `localStorage.clear()` trong Console
- Hard refresh: Ctrl + Shift + R

### **3. Token expires**
- Token hết hạn sau 3 ngày
- Đăng nhập lại để lấy token mới

### **4. File upload error**
- Kiểm tra thư mục `backend/uploads/resumes/` đã tồn tại
- Chỉ chấp nhận .pdf, .doc, .docx
- Max file size: 5MB

---

## 🎉 Kết luận

Server của bạn đã sẵn sàng hoạt động! Tất cả các API đã được thiết lập đúng theo mô hình database. Bạn có thể:

1. ✅ Test API bằng file `test-api.html`
2. ✅ Khởi động frontend và test UI
3. ✅ Sử dụng Postman/Thunder Client để test chi tiết
4. ✅ Tạo seed data nếu cần

**Next steps:**
- Chạy frontend với `cd frontend && npm run dev`
- Test các chức năng đăng ký, đăng nhập
- Tạo jobs và test ứng tuyển
- Kiểm tra matching algorithms

Good luck! 🚀
