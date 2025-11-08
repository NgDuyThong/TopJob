# 🎯 Hệ thống Tuyển dụng - JobLink

## 📋 Giới thiệu

JobLink là hệ thống tuyển dụng trực tuyến kết nối ứng viên và nhà tuyển dụng, sử dụng công nghệ **Hybrid Database** (MongoDB + Neo4j) để tối ưu hóa hiệu suất và độ chính xác của hệ thống gợi ý.

### 🌟 Tính năng chính:

**Cho Ứng viên:**
- 📝 Đăng ký và quản lý hồ sơ cá nhân
- 🔍 Tìm kiếm việc làm theo kỹ năng, vị trí, lương
- 🎯 **Gợi ý việc làm phù hợp với kỹ năng** (AI-powered by Neo4j)
- � Nộp đơrn ứng tuyển trực tuyến
- 💾 Lưu việc làm yêu thích
- 📊 Theo dõi trạng thái đơn ứng tuyển

**Cho Nhà tuyển dụng:**
- 🏢 Quản lý thông tin công ty
- 📢 Đăng tin tuyển dụng
- 🎯 **Tìm ứng viên phù hợp với yêu cầu công việc** (AI-powered by Neo4j)
- 📋 Quản lý đơn ứng tuyển
- 📊 Thống kê và báo cáo

**Cho Admin:**
- 👥 Quản lý tài khoản người dùng
- 📊 Thống kê hệ thống
- 🔧 Quản trị dữ liệu

---

## 🏗️ Kiến trúc Hệ thống

### Công nghệ sử dụng:

**Frontend:**
- React 18 + Vite
- React Router v6
- Axios
- TailwindCSS / Material-UI

**Backend:**
- Node.js + Express.js
- JWT Authentication
- Multer (File upload)
- Nodemailer (Email)

**Database:**
- **MongoDB** - Database chính (lưu trữ toàn bộ dữ liệu)
  - Users, Candidates, Employers
  - Job Posts, Applications
  - Full CRUD operations
  
- **Neo4j Graph Database** - Database phụ (tối ưu recommendations)
  - Skill matching algorithms
  - Graph traversal cho gợi ý
  - Real-time sync từ MongoDB

### 🔄 Hybrid Database Architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    USER ACTIONS                         │
│  (Register, Update Profile, Create Job, Apply, etc.)   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Express Backend     │
         │   (Controllers)       │
         └───────┬───────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌──────────────┐   ┌──────────────┐
│   MongoDB    │   │    Neo4j     │
│   (Primary)  │◄─►│  (Secondary) │
│              │   │              │
│ • All Data   │   │ • Skills     │
│ • CRUD Ops   │   │ • Relations  │
│ • Storage    │   │ • Matching   │
└──────────────┘   └──────────────┘
        │                 │
        └────────┬────────┘
                 │
                 ▼
         ┌───────────────┐
         │  Auto-Sync    │
         │  Real-time    │
         └───────────────┘
```

**Lợi ích của Hybrid Database:**
- ✅ MongoDB: Lưu trữ đầy đủ, CRUD nhanh, schema linh hoạt
- ✅ Neo4j: Tính toán match score chính xác, graph traversal nhanh
- ✅ Auto-sync: Dữ liệu luôn đồng bộ giữa 2 databases
- ✅ Fault-tolerant: Nếu Neo4j down, MongoDB vẫn hoạt động

---

## 📁 Cấu trúc Project

```
JobLink/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB connection
│   │   │   └── neo4j.js           # Neo4j connection
│   │   ├── models/                # MongoDB Schemas
│   │   │   ├── Account.js
│   │   │   ├── Candidate.js
│   │   │   ├── Employer.js
│   │   │   ├── JobPost.js
│   │   │   └── Application.js
│   │   ├── services/
│   │   │   └── neo4jService.js    # Neo4j operations
│   │   ├── controllers/           # Business logic
│   │   │   ├── authController.js
│   │   │   ├── candidateController.js
│   │   │   ├── employerController.js
│   │   │   ├── jobPostController.js
│   │   │   └── applicationController.js
│   │   ├── routes/                # API routes
│   │   ├── middlewares/           # Auth, validation
│   │   ├── utils/                 # Helpers
│   │   └── scripts/               # Database scripts
│   │       ├── seedData.js        # Seed MongoDB
│   │       ├── syncToNeo4j.js     # Sync to Neo4j
│   │       └── testRecommendations.js
│   ├── uploads/                   # CV files
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/            # React components
    │   ├── pages/                 # Page components
    │   ├── services/              # API calls
    │   ├── context/               # React Context
    │   └── utils/                 # Helpers
    ├── .env
    └── package.json
```

---

## 🚀 Cài đặt và Chạy Project

### 1️⃣ Yêu cầu hệ thống

- Node.js >= 16.x
- MongoDB (local hoặc MongoDB Atlas)
- Neo4j Desktop hoặc Docker (optional nhưng recommended)
- npm hoặc yarn

### 2️⃣ Cài đặt MongoDB

**Option 1: MongoDB Atlas (Cloud - Recommended)**
1. Đăng ký tài khoản tại https://www.mongodb.com/cloud/atlas
2. Tạo cluster miễn phí
3. Whitelist IP address
4. Lấy connection string

**Option 2: MongoDB Local**
```bash
# Download và cài đặt từ: https://www.mongodb.com/try/download/community
# Hoặc dùng Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3️⃣ Cài đặt Neo4j (Optional)

**Option 1: Neo4j Desktop (Recommended)**
1. Download từ: https://neo4j.com/download/
2. Tạo database mới
3. Set password của bạn (ví dụ: `your_password`)
4. Start database

**Option 2: Docker**
```bash
docker run -d \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/your_password \
  --name neo4j \
  neo4j:latest
```

**Lưu ý:** Neo4j chỉ dùng cho chức năng gợi ý. Nếu không cài, hệ thống vẫn hoạt động bình thường với MongoDB.

### 4️⃣ Backend Setup

```bash
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env
```

**Cấu hình file `.env`:**
```env
# Server
PORT=5000

# MongoDB (Bắt buộc)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/JobLink

# JWT
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRES_IN=3d

# Neo4j (Optional - cho chức năng gợi ý)
NEO4J_URI=neo4j://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password

# Email (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
CLIENT_URL=http://localhost:5173
```

**Khởi tạo Database:**
```bash
# 1. Seed dữ liệu mẫu vào MongoDB
node src/scripts/seedData.js

# 2. Nếu dùng Neo4j, init constraints
node src/scripts/initNeo4j.js

# 3. Sync data từ MongoDB sang Neo4j
node src/scripts/syncToNeo4j.js
```

**Chạy server:**
```bash
npm run dev
# Server chạy tại http://localhost:5000
```

### 5️⃣ Frontend Setup

```bash
cd frontend

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env
```

**File `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Chạy client:**
```bash
npm run dev
# Client chạy tại http://localhost:5173
```

---

## 🔄 Auto-Sync: MongoDB ↔ Neo4j

Hệ thống **tự động đồng bộ** dữ liệu từ MongoDB sang Neo4j khi có thay đổi:

### ✅ CREATE (Tạo mới)
- Đăng ký tài khoản → Tạo node trong Neo4j
- Tạo job post → Sync job + required skills
- Nộp đơn ứng tuyển → Tạo application relationship

### ✅ UPDATE (Cập nhật)
- Cập nhật profile → Update node properties
- Cập nhật skills → Update HAS_SKILL relationships
- Cập nhật job post → Update job + skills

### ✅ DELETE (Xóa)
- Xóa job post → Xóa node và relationships

**Không cần chạy sync thủ công!** Mọi thay đổi tự động sync real-time.

---

## 📝 API Endpoints

### 🔐 Authentication
```
POST   /api/auth/register          # Đăng ký tài khoản
POST   /api/auth/login             # Đăng nhập
POST   /api/auth/validate-token    # Validate JWT token
```

### 👤 Candidates
```
GET    /api/candidates/profile                # Lấy profile
PUT    /api/candidates/profile                # Cập nhật profile
PUT    /api/candidates/skills                 # Cập nhật kỹ năng
GET    /api/candidates/matching-jobs          # Gợi ý việc làm (Neo4j) ⭐
GET    /api/candidates/applications           # Danh sách đơn đã nộp
GET    /api/candidates/saved-jobs             # Việc làm đã lưu
POST   /api/candidates/saved-jobs/:jobId      # Lưu việc làm
DELETE /api/candidates/saved-jobs/:jobId      # Bỏ lưu
```

### 🏢 Employers
```
GET    /api/employers/profile                           # Lấy profile
PUT    /api/employers/profile                           # Cập nhật profile
GET    /api/employers/jobs                              # Danh sách jobs đã đăng
GET    /api/employers/jobs/:jobId/matching-candidates   # Tìm ứng viên (Neo4j) ⭐
GET    /api/employers/jobs/:jobId/applications          # Đơn ứng tuyển của job
GET    /api/employers/applications/:id                  # Chi tiết đơn
PUT    /api/employers/applications/:id/status           # Cập nhật trạng thái
```

### 💼 Job Posts
```
GET    /api/jobs                   # Lấy tất cả jobs (public)
GET    /api/jobs/search            # Tìm kiếm jobs
GET    /api/jobs/recent            # Jobs mới nhất
GET    /api/jobs/:id               # Chi tiết job
POST   /api/jobs                   # Tạo job (Employer)
PUT    /api/jobs/:id               # Cập nhật job (Employer)
DELETE /api/jobs/:id               # Xóa job (Employer)
```

### 📄 Applications
```
POST   /api/applications           # Nộp đơn ứng tuyển
GET    /api/applications/:id       # Chi tiết đơn
PUT    /api/applications/:id/status # Cập nhật trạng thái
DELETE /api/applications/:id       # Rút đơn
```

---

## 🎯 Chức năng Gợi ý (Neo4j-powered)

### 1. Gợi ý việc làm cho Ứng viên

**Endpoint:** `GET /api/candidates/matching-jobs`

**Thuật toán:**
1. Lấy skills của candidate từ Neo4j
2. Tìm jobs có yêu cầu skills trùng khớp
3. Tính match score dựa trên:
   - Số lượng skills trùng khớp
   - Tổng số skills yêu cầu
   - Mức độ thành thạo (proficiency level)
4. Sắp xếp theo match score giảm dần

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "690e1dad54b80223a0e233b5",
      "title": "Senior Full-stack Developer",
      "salary": "20-30 triệu",
      "location": "TP.HCM",
      "matchScore": 85,                    // 0-100%
      "matchingSkillsCount": 6,            // 6/7 skills
      "totalRequiredSkills": 7,
      "matchingSkills": ["JavaScript", "React", "Node.js", "MongoDB", "Docker", "Git"]
    }
  ],
  "source": "neo4j"
}
```

### 2. Tìm ứng viên phù hợp cho Job

**Endpoint:** `GET /api/employers/jobs/:jobId/matching-candidates`

**Thuật toán:**
1. Lấy required skills của job
2. Tìm candidates có skills phù hợp
3. Tính match score
4. Kiểm tra candidate đã apply chưa
5. Sắp xếp theo match score

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "690e1da554b80223a0e22369",
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@email.com",
      "education": "Đại học Bách Khoa",
      "experience": "3 năm",
      "matchScore": 90,
      "matchingSkills": ["JavaScript", "React", "Node.js"],
      "hasApplied": false
    }
  ],
  "source": "neo4j"
}
```

---

## 🛠️ Scripts Hữu Ích

### Database Scripts:
```bash
# Seed dữ liệu mẫu vào MongoDB
node backend/src/scripts/seedData.js

# Init Neo4j constraints và indexes
node backend/src/scripts/initNeo4j.js

# Sync toàn bộ data từ MongoDB sang Neo4j
node backend/src/scripts/syncToNeo4j.js
```

### Testing Scripts:
```bash
# Test chức năng gợi ý
node backend/src/scripts/testRecommendations.js

# Verify API đang dùng Neo4j hay MongoDB
node backend/src/scripts/verifyNeo4jUsage.js

# Check dữ liệu trong Neo4j
node backend/src/scripts/checkNeo4jData.js

# Test auto-sync functionality
node backend/src/scripts/testAutoSync.js
```

---

## 🐛 Troubleshooting

### MongoDB không kết nối được
```bash
# Kiểm tra connection string trong .env
# Kiểm tra IP whitelist (nếu dùng Atlas)
# Test connection:
node backend/src/scripts/seedData.js
```

### Neo4j không kết nối được
```bash
# Kiểm tra Neo4j đang chạy
# Neo4j Desktop: Start database
# Docker: docker ps | grep neo4j

# Test connection:
node backend/src/scripts/checkNeo4jData.js
```

### Backend không start được
```bash
# Kiểm tra port 5000 có bị chiếm không
netstat -ano | findstr :5000

# Kiểm tra .env file đã config đúng chưa
# Kiểm tra MongoDB connection
```

### Frontend không gọi được API
```bash
# Kiểm tra VITE_API_URL trong frontend/.env
# Kiểm tra backend đang chạy: http://localhost:5000
# Kiểm tra CORS trong browser console
```

### Recommendations không hoạt động
```bash
# 1. Check Neo4j có data chưa
node backend/src/scripts/checkNeo4jData.js

# 2. Nếu chưa có, sync data
node backend/src/scripts/syncToNeo4j.js

# 3. Test recommendations
node backend/src/scripts/testRecommendations.js
```

---

## 📊 So sánh MongoDB vs Neo4j

| Tiêu chí | MongoDB | Neo4j |
|----------|---------|-------|
| **Mục đích** | Database chính | Tối ưu recommendations |
| **Dữ liệu** | Toàn bộ | Skills + Relationships |
| **CRUD** | ✅ Full support | ❌ Chỉ đọc |
| **Match Score** | ❌ Không có | ✅ 0-100% |
| **Graph Traversal** | ❌ Chậm | ✅ Nhanh |
| **Speed** | 44ms | **31ms** ⚡ |
| **Độ chính xác** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 📚 Tài liệu tham khảo

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Neo4j Documentation](https://neo4j.com/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)

Chi tiết về scripts: `backend/src/scripts/README.md`

---

## 👥 Contributors

- **Nguyễn Duy Thông** - Developer

---

## 📄 License

MIT License

---

## 🎉 Kết luận

Hệ thống JobLink kết hợp sức mạnh của **MongoDB** (lưu trữ linh hoạt) và **Neo4j** (graph traversal nhanh) để tạo ra một nền tảng tuyển dụng hiện đại với khả năng gợi ý thông minh và chính xác.

**Happy Coding! 🚀**
