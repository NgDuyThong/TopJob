# JobHub - Nền tảng tuyển dụng hiện đại

## 🚀 Giới thiệu

JobHub là một nền tảng tuyển dụng hiện đại được xây dựng với React, Node.js và MongoDB. Giao diện được thiết kế tham khảo từ các trang web tuyển dụng hàng đầu như TopCV, VietCV và ViecLam24h.

## ✨ Tính năng chính

### Cho ứng viên:
- 🔍 Tìm kiếm việc làm với bộ lọc nâng cao
- 💼 Xem chi tiết công việc
- ❤️ Lưu việc làm yêu thích
- 📱 Giao diện responsive trên mọi thiết bị
- 🔐 Đăng ký/đăng nhập an toàn

### Cho nhà tuyển dụng:
- 📝 Đăng tin tuyển dụng
- 👥 Quản lý ứng viên
- 📊 Thống kê và báo cáo
- 🎯 Tìm kiếm ứng viên phù hợp

## 🛠️ Công nghệ sử dụng

### Frontend:
- **React 19** - UI Framework
- **Tailwind CSS 3** - Styling
- **Redux Toolkit** - State Management
- **React Router** - Routing
- **Heroicons** - Icons
- **React Toastify** - Notifications
- **Vite** - Build Tool

### Backend:
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - Real-time communication

## 📦 Cài đặt và chạy dự án

### Yêu cầu hệ thống:
- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB >= 5.0

### 1. Clone repository:
```bash
git clone <repository-url>
cd DoAnMonHoc
```

### 2. Cài đặt dependencies cho Backend:
```bash
cd backend
npm install
```

### 3. Cài đặt dependencies cho Frontend:
```bash
cd frontend
npm install
```

### 4. Cấu hình môi trường:
Tạo file `.env` trong thư mục `backend`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobhub
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

### 5. Chạy Backend:
```bash
cd backend
npm run dev
```

### 6. Chạy Frontend:
```bash
cd frontend
npm run dev
```

### 7. Truy cập ứng dụng:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🎨 Giao diện

### Trang chủ:
- Hero section với search bar
- Danh sách ngành nghề phổ biến
- Việc làm mới nhất
- Features và benefits

### Trang việc làm:
- Bộ lọc nâng cao (địa điểm, mức lương, kinh nghiệm)
- Job cards với hover effects
- Pagination
- Save/Share functionality

### Trang chi tiết việc làm:
- Thông tin chi tiết công việc
- Thông tin công ty
- Kỹ năng yêu cầu
- Nút ứng tuyển

### Trang đăng nhập/đăng ký:
- Thiết kế hiện đại với gradient
- Form validation
- Social login buttons
- Responsive design

## 🔧 Cấu trúc dự án

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── common/         # Common components (Navbar, Footer)
│   │   ├── job/            # Job-related components
│   │   └── ui/             # UI components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── store/              # Redux store
│   ├── utils/              # Utility functions
│   └── App.jsx             # Main App component
├── public/                 # Static files
└── package.json

backend/
├── src/
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middlewares/       # Custom middlewares
│   ├── config/            # Configuration files
│   └── server.js          # Main server file
└── package.json
```

## 🎯 API Endpoints

### Jobs:
- `GET /api/jobs` - Lấy danh sách việc làm
- `GET /api/jobs/:id` - Lấy chi tiết việc làm
- `POST /api/jobs` - Tạo việc làm mới
- `PUT /api/jobs/:id` - Cập nhật việc làm
- `DELETE /api/jobs/:id` - Xóa việc làm
- `GET /api/jobs/search` - Tìm kiếm việc làm

### Authentication:
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất

### Applications:
- `GET /api/applications` - Lấy danh sách đơn ứng tuyển
- `POST /api/applications` - Gửi đơn ứng tuyển
- `PUT /api/applications/:id` - Cập nhật trạng thái đơn

## 🚀 Deployment

### Frontend (Vercel/Netlify):
```bash
cd frontend
npm run build
```

### Backend (Heroku/Railway):
```bash
cd backend
npm start
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- Email: hotro@jobhub.vn
- Phone: (024) 6680 5588
- Website: https://jobhub.vn

---

**JobHub** - Nền tảng tuyển dụng hàng đầu Việt Nam 🚀