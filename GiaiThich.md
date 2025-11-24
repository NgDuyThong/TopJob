# 📚 GIẢI THÍCH CHI TIẾT HỆ THỐNG TUYỂN DỤNG JOBLINK

## 🎯 TỔNG QUAN HỆ THỐNG

JobLink là một hệ thống tuyển dụng trực tuyến hiện đại, kết nối ứng viên và nhà tuyển dụng thông qua nền tảng web. Điểm đặc biệt của hệ thống là sử dụng **Hybrid Database Architecture** - kết hợp MongoDB (database quan hệ) và Neo4j (graph database) để tối ưu hóa chức năng gợi ý việc làm và tìm kiếm ứng viên phù hợp.

### Mục đích chính:
- **Ứng viên**: Tìm việc làm phù hợp với kỹ năng, nhận gợi ý thông minh
- **Nhà tuyển dụng**: Đăng tin tuyển dụng, tìm ứng viên phù hợp
- **Admin**: Quản trị hệ thống, người dùng, thống kê

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

### 1. CÔNG NGHỆ SỬ DỤNG

#### Frontend (React + Vite)
```
- React 19.1.1: Framework UI chính
- React Router v7: Điều hướng trang
- Redux Toolkit: Quản lý state toàn cục
- Axios: HTTP client để gọi API
- TailwindCSS: Styling framework
- Socket.io-client: Real-time communication
- html2pdf.js: Export CV sang PDF
```

#### Backend (Node.js + Express)
```
- Express 5.1.0: Web framework
- Mongoose 8.19.2: MongoDB ODM
- Neo4j-driver 6.0.1: Neo4j graph database driver
- JWT (jsonwebtoken): Authentication
- Bcrypt: Mã hóa password
- Multer: Upload file (CV)
- Socket.io: Real-time notifications
- Nodemailer: Gửi email
```

#### Databases
```
- MongoDB: Database chính (lưu trữ toàn bộ dữ liệu)
- Neo4j: Graph database (tối ưu recommendations)
```


### 2. KIẾN TRÚC HYBRID DATABASE

Đây là điểm đặc biệt nhất của hệ thống - sử dụng 2 databases song song:

```
┌─────────────────────────────────────────────────────────┐
│                    USER ACTIONS                         │
│  (Đăng ký, Cập nhật, Tạo job, Apply, etc.)            │
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

#### Tại sao dùng 2 databases?

**MongoDB (Primary Database):**
- Lưu trữ toàn bộ dữ liệu: Users, Jobs, Applications, Employers, Candidates
- Xử lý tất cả CRUD operations (Create, Read, Update, Delete)
- Schema linh hoạt, dễ mở rộng
- Tốc độ truy vấn thông thường tốt

**Neo4j (Secondary Database):**
- Chỉ lưu Skills và Relationships (quan hệ giữa các entities)
- Tối ưu cho Graph Traversal (duyệt đồ thị)
- Tính toán Match Score chính xác hơn
- Nhanh hơn MongoDB khi tìm kiếm theo mối quan hệ phức tạp

**Cơ chế Auto-Sync:**
Mỗi khi có thay đổi trong MongoDB, hệ thống tự động sync sang Neo4j:
- Tạo candidate mới → Sync sang Neo4j
- Cập nhật skills → Sync relationships
- Tạo job post → Sync required skills
- Xóa job → Xóa trong Neo4j


---

## 📊 CẤU TRÚC DỮ LIỆU

### 1. MONGODB MODELS

#### Account Model (Tài khoản)
```javascript
{
  username: String,           // Email đăng nhập
  password: String,           // Mật khẩu đã hash (bcrypt)
  type: String,               // 'candidate' | 'employer' | 'admin'
  status: String,             // 'active' | 'locked' | 'pending'
  candidateId: ObjectId,      // Ref to Candidate (nếu là ứng viên)
  employerId: ObjectId,       // Ref to Employer (nếu là nhà tuyển dụng)
  createdAt: Date,
  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

**Chức năng:**
- Quản lý authentication (đăng nhập/đăng ký)
- Phân quyền người dùng (candidate/employer/admin)
- Liên kết với profile tương ứng

#### Candidate Model (Ứng viên)
```javascript
{
  fullName: String,
  email: String,
  phone: String,
  gender: String,
  birthDate: Date,
  education: String,          // Trình độ học vấn
  experience: String,         // Kinh nghiệm làm việc
  skills: [{                  // Danh sách kỹ năng
    name: String,
    level: String             // 'basic' | 'intermediate' | 'advanced'
  }],
  summary: String,            // Giới thiệu bản thân
  cv: {                       // CV Builder data
    personal: {...},
    experience: [...],
    education: [...],
    projects: [...],
    languages: [...],
    certifications: [...]
  },
  applications: [ObjectId],   // Danh sách đơn đã nộp
  savedJobs: [{               // Việc làm đã lưu
    jobId: ObjectId,
    savedAt: Date
  }],
  createdAt: Date
}
```

**Chức năng:**
- Lưu thông tin cá nhân ứng viên
- Quản lý kỹ năng (quan trọng cho matching)
- CV Builder: Tạo CV online
- Lưu việc làm yêu thích
- Theo dõi đơn ứng tuyển


#### Employer Model (Nhà tuyển dụng)
```javascript
{
  companyName: String,
  field: String,              // Lĩnh vực kinh doanh
  email: String,
  phone: String,
  address: String,
  description: String,        // Mô tả công ty
  companySize: String,        // '1-10' | '10-50' | '50-100' | '100-500' | '500+'
  website: String,
  savedCandidates: [ObjectId], // Ứng viên đã lưu
  jobPosts: [{                // Danh sách jobs đã đăng
    jobId: ObjectId,
    title: String,
    deadline: Date
  }],
  createdAt: Date
}
```

**Chức năng:**
- Lưu thông tin công ty
- Quản lý tin tuyển dụng
- Lưu ứng viên tiềm năng

#### JobPost Model (Tin tuyển dụng)
```javascript
{
  employerId: ObjectId,       // Ref to Employer
  title: String,              // Tiêu đề công việc
  description: String,        // Mô tả chi tiết
  position: {                 // Thông tin vị trí
    title: String,
    level: String,            // 'Intern' | 'Junior' | 'Senior' | 'Manager'
    type: String,             // 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
    workMode: String          // 'On-site' | 'Remote' | 'Hybrid'
  },
  skillsRequired: [{          // Kỹ năng yêu cầu (quan trọng cho matching)
    name: String,
    level: String
  }],
  location: {
    city: String,
    address: String
  },
  salary: String,             // Mức lương
  language: String,           // Ngôn ngữ yêu cầu
  datePosted: Date,
  deadline: Date,             // Hạn nộp đơn
  status: String,             // 'open' | 'closed'
  views: Number,              // Số lượt xem
  applicationsCount: Number   // Số đơn ứng tuyển
}
```

**Chức năng:**
- Lưu thông tin tin tuyển dụng
- Yêu cầu kỹ năng (dùng cho matching với Neo4j)
- Theo dõi lượt xem và số đơn ứng tuyển


#### Application Model (Đơn ứng tuyển)
```javascript
{
  candidateId: ObjectId,      // Ref to Candidate
  jobpostId: ObjectId,        // Ref to JobPost
  resumeFile: String,         // Đường dẫn file CV
  coverLetter: String,        // Thư xin việc
  submitDate: Date,           // Ngày nộp đơn
  status: {                   // Trạng thái đơn
    name: String,             // 'Submitted' | 'Reviewed' | 'Interviewed' | 'Rejected' | 'Hired'
    updatedAt: Date
  },
  viewedHistory: [{           // Lịch sử xem của employer
    employerId: ObjectId,
    viewedAt: Date
  }],
  jobSummary: {               // Thông tin job (cached)
    title: String,
    employerName: String
  },
  candidateSummary: {         // Thông tin candidate (cached)
    fullName: String,
    email: String
  }
}
```

**Chức năng:**
- Quản lý đơn ứng tuyển
- Theo dõi trạng thái xử lý
- Lưu lịch sử xem của nhà tuyển dụng
- Cache thông tin để tránh populate nhiều lần

---

### 2. NEO4J GRAPH SCHEMA

Neo4j lưu trữ dữ liệu dưới dạng Graph (đồ thị) với Nodes (nút) và Relationships (quan hệ).

#### Nodes (Các nút)

**Account Node:**
```cypher
(:Account {
  MaTK: String,           // Account ID từ MongoDB
  TenDangNhap: String,    // Username
  LoaiTK: String,         // 'candidate' | 'employer' | 'admin'
  TrangThaiTK: String,    // 'active' | 'locked'
  NgayTao: DateTime
})
```

**Candidate Node:**
```cypher
(:Candidate {
  MaUV: String,           // Candidate ID từ MongoDB
  HoTen: String,
  Email: String,
  SDT: String,
  HocVan: String,
  KinhNghiem: Number,
  MoTaBanThan: String
})
```

**Employer Node:**
```cypher
(:Employer {
  MaNTD: String,          // Employer ID từ MongoDB
  TenCongTy: String,
  Email: String,
  LinhVuc: String,
  QuyMo: String
})
```


**JobPost Node:**
```cypher
(:JobPost {
  MaBTD: String,          // Job ID từ MongoDB
  TieuDe: String,
  MucLuong: Number,
  KinhNghiem: Number,
  TrangThai: String,
  NgayDang: DateTime
})
```

**Skill Node:**
```cypher
(:Skill {
  MaKN: String,           // Skill ID
  TenKyNang: String,      // Tên kỹ năng (JavaScript, React, etc.)
  MucDo: String           // 'Cơ bản' | 'Trung bình' | 'Thành thạo'
})
```

**Position Node:**
```cypher
(:Position {
  MaVT: String,
  TenViTri: String,       // 'Developer', 'Designer', etc.
  CapBac: String          // 'Junior', 'Senior', etc.
})
```

**Location Node:**
```cypher
(:Location {
  MaDD: String,
  TenDiaDiem: String      // 'TP.HCM', 'Hà Nội', etc.
})
```

**Application Node:**
```cypher
(:Application {
  MaHS: String,           // Application ID từ MongoDB
  NgayNop: DateTime,
  TrangThai: String,
  TepCV: String
})
```

**Status Node:**
```cypher
(:Status {
  MaTT: String,
  TenTrangThai: String    // 'Đã nộp', 'Đã xem', 'Phỏng vấn', etc.
})
```


#### Relationships (Các quan hệ)

```cypher
// Account liên kết với Candidate/Employer
(Account)-[:BELONGS_TO]->(Candidate)
(Account)-[:BELONGS_TO]->(Employer)

// Candidate có kỹ năng
(Candidate)-[:HAS_SKILL {Level: String, YearsExperience: Number}]->(Skill)

// Job yêu cầu kỹ năng
(JobPost)-[:REQUIRES_SKILL {LevelRequired: String, MinYears: Number}]->(Skill)

// Employer đăng job
(Employer)-[:POSTED {PostDate: DateTime, IsActive: Boolean}]->(JobPost)

// Job thuộc vị trí và địa điểm
(JobPost)-[:FOR_POSITION]->(Position)
(JobPost)-[:LOCATED_AT]->(Location)

// Candidate nộp đơn
(Candidate)-[:SUBMITTED {SubmitDate: DateTime}]->(Application)
(Application)-[:APPLIED_TO]->(JobPost)
(Application)-[:HAS_STATUS]->(Status)

// Employer xem đơn
(Employer)-[:VIEWED {ViewedDate: DateTime, ViewCount: Number}]->(Application)
```

**Ý nghĩa của Graph Structure:**
- Dễ dàng tìm kiếm theo mối quan hệ (ví dụ: tìm tất cả jobs yêu cầu skill X)
- Tính toán Match Score dựa trên số lượng skills trùng khớp
- Graph Traversal nhanh hơn JOIN trong SQL/MongoDB

---

## 🔄 LUỒNG XỬ LÝ CHÍNH

### 1. ĐĂNG KÝ TÀI KHOẢN

**Flow:**
```
User nhập thông tin
    ↓
Frontend gửi POST /api/auth/register
    ↓
Backend (authController.js)
    ↓
1. Validate dữ liệu
2. Hash password (bcrypt)
3. Tạo Account trong MongoDB
4. Tạo Candidate/Employer trong MongoDB
5. Link Account với Candidate/Employer
    ↓
Sync sang Neo4j (neo4jService.js)
    ↓
1. Tạo Account node
2. Tạo Candidate/Employer node
3. Tạo relationship BELONGS_TO
    ↓
Trả về JWT token
    ↓
Frontend lưu token vào localStorage
```

**Code flow:**
- `authController.register()` → Tạo account + profile
- `neo4jService.createAccount()` → Sync sang Neo4j
- JWT token được tạo và trả về client


### 2. ĐĂNG NHẬP

**Flow:**
```
User nhập email + password
    ↓
Frontend gửi POST /api/auth/login
    ↓
Backend (authController.js)
    ↓
1. Tìm Account theo email
2. So sánh password (bcrypt.compare)
3. Kiểm tra status (active/locked)
4. Cập nhật lastLogin
    ↓
Tạo JWT token với payload:
{
  userId: account._id,
  type: account.type,
  candidateId/employerId: profile._id
}
    ↓
Trả về token + user info
    ↓
Frontend lưu token và redirect theo role
```

**Middleware Authentication:**
```javascript
// middlewares/auth.js
verifyToken(req, res, next) {
  1. Lấy token từ header: Authorization: Bearer <token>
  2. Verify token với JWT_SECRET
  3. Decode payload → req.user
  4. next() để tiếp tục xử lý
}
```

### 3. TẠO TIN TUYỂN DỤNG (Employer)

**Flow:**
```
Employer nhập thông tin job
    ↓
Frontend gửi POST /api/jobs (với JWT token)
    ↓
Backend (jobPostController.js)
    ↓
1. Verify token → lấy employerId
2. Validate dữ liệu (deadline > now)
3. Tạo JobPost trong MongoDB
4. Cập nhật jobPosts array trong Employer
    ↓
Sync sang Neo4j (neo4jService.js)
    ↓
1. Tạo JobPost node
2. Tạo Skill nodes (nếu chưa có)
3. Tạo relationships:
   - (Employer)-[:POSTED]->(JobPost)
   - (JobPost)-[:REQUIRES_SKILL]->(Skill)
   - (JobPost)-[:FOR_POSITION]->(Position)
   - (JobPost)-[:LOCATED_AT]->(Location)
    ↓
Trả về job data
```

**Code:**
```javascript
// jobPostController.createJobPost()
const jobPost = new JobPost({...req.body, employerId: req.user.employerId});
await jobPost.save();

// Sync to Neo4j
await neo4jService.createOrUpdateJob(jobPost.toObject());
await neo4jService.addJobRequirements(jobPost._id, jobPost.skillsRequired);
```


### 4. CẬP NHẬT KỸ NĂNG (Candidate)

**Flow:**
```
Candidate cập nhật skills
    ↓
Frontend gửi PUT /api/candidates/skills
    ↓
Backend (candidateController.js)
    ↓
1. Verify token → lấy candidateId
2. Cập nhật skills array trong MongoDB
    ↓
Sync sang Neo4j (neo4jService.js)
    ↓
1. Cập nhật Candidate node
2. Xóa relationships HAS_SKILL cũ
3. Tạo Skill nodes mới (nếu chưa có)
4. Tạo relationships HAS_SKILL mới với properties:
   - Level: 'basic' | 'intermediate' | 'advanced'
   - YearsExperience: Number
    ↓
Trả về candidate data
```

**Tại sao quan trọng?**
- Skills là yếu tố chính để matching jobs
- Neo4j dùng skills để tính Match Score
- Cập nhật skills → recommendations thay đổi ngay lập tức

### 5. GỢI Ý VIỆC LÀM (Candidate) - CHỨC NĂNG QUAN TRỌNG NHẤT

**Flow:**
```
Candidate vào trang "Việc làm phù hợp"
    ↓
Frontend gửi GET /api/candidates/matching-jobs
    ↓
Backend (candidateController.searchJobsBySkills)
    ↓
Query Neo4j Graph Database
    ↓
neo4jService.recommendJobsForCandidate(candidateId)
```

**Thuật toán Neo4j (Cypher Query):**
```cypher
// 1. Tìm skills của candidate
MATCH (c:Candidate {MaUV: $candidateId})-[hs:HAS_SKILL]->(s:Skill)

// 2. Tìm jobs yêu cầu những skills đó
MATCH (j:JobPost)-[rs:REQUIRES_SKILL]->(s)
WHERE j.TrangThai = 'active'

// 3. Tính match score
WITH j, 
     COUNT(DISTINCT s) as matchingSkills,
     COLLECT(DISTINCT s.TenKyNang) as matchedSkillNames,
     AVG(CASE hs.Level 
       WHEN 'Cơ bản' THEN 1 
       WHEN 'Trung bình' THEN 2 
       WHEN 'Thành thạo' THEN 3 
       ELSE 2 END) as avgProficiency

// 4. Đếm tổng số skills required
MATCH (j)-[:REQUIRES_SKILL]->(allSkills:Skill)
WITH j, 
     matchingSkills, 
     matchedSkillNames,
     avgProficiency,
     COUNT(DISTINCT allSkills) as totalRequired,
     (matchingSkills * 1.0 / COUNT(DISTINCT allSkills)) as matchScore
WHERE matchScore > 0.3

// 5. Sắp xếp theo match score
ORDER BY matchScore DESC, avgProficiency DESC
LIMIT 20
```


**Cách tính Match Score:**
```
matchScore = (số skills trùng khớp) / (tổng số skills yêu cầu)

Ví dụ:
- Job yêu cầu: JavaScript, React, Node.js, MongoDB, Docker (5 skills)
- Candidate có: JavaScript, React, Node.js, MongoDB (4 skills)
- Match Score = 4/5 = 0.8 = 80%
```

**Enrich với MongoDB:**
```javascript
// Sau khi có recommendations từ Neo4j
const jobsWithMatchScore = await Promise.all(
  recommendations.map(async (rec) => {
    // Lấy thông tin đầy đủ từ MongoDB
    const job = await JobPost.findById(rec.jobId)
      .populate('employerId', 'companyName email')
      .lean();
    
    return {
      ...job,
      matchScore: Math.round(rec.matchScore * 100), // 80%
      matchingSkillsCount: rec.matchingSkills,      // 4
      totalRequiredSkills: rec.totalRequired,       // 5
      matchingSkills: rec.matchedSkillNames         // ['JavaScript', 'React', ...]
    };
  })
);
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "690e1dad54b80223a0e233b5",
      "title": "Senior Full-stack Developer",
      "salary": "20-30 triệu",
      "location": { "city": "TP.HCM" },
      "employerId": {
        "companyName": "Tech Company"
      },
      "matchScore": 80,
      "matchingSkillsCount": 4,
      "totalRequiredSkills": 5,
      "matchingSkills": ["JavaScript", "React", "Node.js", "MongoDB"]
    }
  ],
  "source": "neo4j"
}
```

### 6. TÌM ỨNG VIÊN PHÙ HỢP (Employer)

**Flow tương tự nhưng ngược lại:**
```
Employer xem job của mình
    ↓
Click "Tìm ứng viên phù hợp"
    ↓
Frontend gửi GET /api/employers/jobs/:jobId/matching-candidates
    ↓
Backend (employerController.getMatchingCandidates)
    ↓
Query Neo4j
    ↓
neo4jService.findMatchingCandidates(jobId)
```

**Thuật toán:**
```cypher
// 1. Tìm skills required của job
MATCH (j:JobPost {MaBTD: $jobId})-[rs:REQUIRES_SKILL]->(s:Skill)

// 2. Tìm candidates có những skills đó
MATCH (c:Candidate)-[hs:HAS_SKILL]->(s)

// 3. Tính match score
WITH c,
     COUNT(DISTINCT s) as matchingSkills,
     COLLECT(DISTINCT s.TenKyNang) as matchedSkillNames,
     AVG(CASE hs.Level 
       WHEN 'Cơ bản' THEN 1 
       WHEN 'Trung bình' THEN 2 
       WHEN 'Thành thạo' THEN 3 
       ELSE 2 END) as avgProficiency

// 4. Kiểm tra đã apply chưa
OPTIONAL MATCH (c)-[:SUBMITTED]->(app:Application)-[:APPLIED_TO]->(j)

RETURN c, matchScore, hasApplied
ORDER BY matchScore DESC
```


### 7. NỘP ĐƠN ỨNG TUYỂN

**Flow:**
```
Candidate chọn job và upload CV
    ↓
Frontend gửi POST /api/applications (multipart/form-data)
    ↓
Backend (applicationController.js)
    ↓
1. Multer middleware xử lý file upload
2. Lưu file vào /backend/uploads/
3. Tạo Application trong MongoDB
4. Cập nhật applications array trong Candidate
5. Tăng applicationsCount trong JobPost
    ↓
Sync sang Neo4j
    ↓
1. Tạo Application node
2. Tạo relationships:
   - (Candidate)-[:SUBMITTED]->(Application)
   - (Application)-[:APPLIED_TO]->(JobPost)
   - (Application)-[:HAS_STATUS]->(Status)
    ↓
Gửi email thông báo (Nodemailer)
    ↓
Trả về application data
```

**File Upload với Multer:**
```javascript
// middlewares/upload.js
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Chỉ cho phép PDF
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file PDF'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB
});
```

### 8. CẬP NHẬT TRẠNG THÁI ĐƠN (Employer)

**Flow:**
```
Employer xem đơn ứng tuyển
    ↓
Chọn trạng thái mới (Reviewed/Interviewed/Rejected/Hired)
    ↓
Frontend gửi PUT /api/employers/applications/:id/status
    ↓
Backend (employerController.updateApplicationStatus)
    ↓
1. Verify quyền (job phải thuộc employer này)
2. Cập nhật status trong Application
3. Thêm vào viewedHistory
    ↓
Gửi email thông báo cho candidate
    ↓
Trả về application data
```


---

## 🔍 CÁC TRUY VẤN QUAN TRỌNG

### 1. TRUY VẤN MONGODB

#### Tìm kiếm jobs theo filters
```javascript
// jobPostController.searchJobPosts()
const filters = {
  status: { $in: ['open', 'active'] },
  deadline: { $gt: new Date() }
};

if (location) {
  filters['location.city'] = new RegExp(location, 'i');
}

if (skills) {
  const skillsList = skills.split(',');
  filters['skillsRequired.name'] = { 
    $in: skillsList.map(skill => new RegExp(skill, 'i'))
  };
}

const jobs = await JobPost.find(filters)
  .populate('employerId', 'companyName')
  .sort({ datePosted: -1 })
  .skip((page - 1) * limit)
  .limit(parseInt(limit));
```

#### Lấy đơn ứng tuyển của candidate
```javascript
// candidateController.getCandidateApplications()
const applications = await Application.find({ 
  candidateId: req.user.candidateId 
})
.populate('jobpostId')
.sort({ submitDate: -1 });
```

#### Lấy đơn ứng tuyển của một job
```javascript
// employerController.getJobApplications()
const applications = await Application.find({ 
  jobpostId: req.params.jobId 
})
.populate('candidateId', 'fullName email phone education experience skills')
.sort({ submitDate: -1 });
```

#### Tìm kiếm ứng viên theo skills
```javascript
// employerController.searchCandidates()
const filters = {};

if (skills) {
  const skillArray = skills.split(',');
  filters['skills.name'] = { 
    $in: skillArray.map(skill => new RegExp(skill, 'i'))
  };
}

const candidates = await Candidate.find(filters)
  .select('fullName email phone education experience skills')
  .limit(50);
```


### 2. TRUY VẤN NEO4J (CYPHER)

#### Gợi ý jobs cho candidate
```cypher
// neo4jService.recommendJobsForCandidate()
MATCH (c:Candidate {MaUV: $candidateId})-[hs:HAS_SKILL]->(s:Skill)
MATCH (j:JobPost)-[rs:REQUIRES_SKILL]->(s)
WHERE j.TrangThai = 'active'

WITH j, 
     COUNT(DISTINCT s) as matchingSkills,
     COLLECT(DISTINCT s.TenKyNang) as matchedSkillNames,
     AVG(CASE hs.Level 
       WHEN 'Cơ bản' THEN 1 
       WHEN 'Trung bình' THEN 2 
       WHEN 'Thành thạo' THEN 3 
       ELSE 2 END) as avgProficiency

MATCH (j)-[:REQUIRES_SKILL]->(allSkills:Skill)
WITH j, 
     matchingSkills, 
     matchedSkillNames,
     avgProficiency,
     COUNT(DISTINCT allSkills) as totalRequired,
     (matchingSkills * 1.0 / COUNT(DISTINCT allSkills)) as matchScore
WHERE matchScore > 0.3

OPTIONAL MATCH (e:Employer)-[:POSTED]->(j)
OPTIONAL MATCH (j)-[:LOCATED_AT]->(loc:Location)
OPTIONAL MATCH (j)-[:FOR_POSITION]->(pos:Position)

RETURN j.MaBTD as jobId,
       j.TieuDe as title,
       j.MucLuong as salary,
       e.TenCongTy as companyName,
       loc.TenDiaDiem as location,
       matchScore,
       matchingSkills,
       totalRequired,
       matchedSkillNames
ORDER BY matchScore DESC, avgProficiency DESC
LIMIT 20
```

#### Tìm candidates phù hợp cho job
```cypher
// neo4jService.findMatchingCandidates()
MATCH (j:JobPost {MaBTD: $jobId})-[rs:REQUIRES_SKILL]->(s:Skill)
MATCH (c:Candidate)-[hs:HAS_SKILL]->(s)

WITH c,
     COUNT(DISTINCT s) as matchingSkills,
     COLLECT(DISTINCT s.TenKyNang) as matchedSkillNames,
     AVG(CASE hs.Level 
       WHEN 'Cơ bản' THEN 1 
       WHEN 'Trung bình' THEN 2 
       WHEN 'Thành thạo' THEN 3 
       ELSE 2 END) as avgProficiency

MATCH (j:JobPost {MaBTD: $jobId})-[:REQUIRES_SKILL]->(allSkills:Skill)
WITH c,
     matchingSkills,
     matchedSkillNames,
     avgProficiency,
     COUNT(DISTINCT allSkills) as totalRequired,
     (matchingSkills * 1.0 / COUNT(DISTINCT allSkills)) as matchScore
WHERE matchScore > 0.4

OPTIONAL MATCH (c)-[:SUBMITTED]->(app:Application)-[:APPLIED_TO]->(j:JobPost {MaBTD: $jobId})

RETURN c.MaUV as candidateId,
       c.HoTen as name,
       c.Email as email,
       matchScore,
       matchingSkills,
       totalRequired,
       matchedSkillNames,
       CASE WHEN app IS NOT NULL THEN true ELSE false END as hasApplied
ORDER BY matchScore DESC, avgProficiency DESC
LIMIT 20
```


#### Phân tích skills của candidate
```cypher
// neo4jService.analyzeSkills()

// 1. Lấy skills hiện tại
MATCH (c:Candidate {MaUV: $candidateId})-[hs:HAS_SKILL]->(s:Skill)
RETURN s.TenKyNang as skill, 
       hs.Level as level, 
       hs.YearsExperience as years
ORDER BY hs.YearsExperience DESC

// 2. Gợi ý skills nên học (skills xuất hiện nhiều trong jobs)
MATCH (c:Candidate {MaUV: $candidateId})-[:HAS_SKILL]->(mySkills:Skill)
MATCH (j:JobPost)-[:REQUIRES_SKILL]->(mySkills)
WHERE j.TrangThai = 'active'
MATCH (j)-[:REQUIRES_SKILL]->(recommendedSkill:Skill)
WHERE NOT (c)-[:HAS_SKILL]->(recommendedSkill)
WITH recommendedSkill, COUNT(DISTINCT j) as jobCount
RETURN recommendedSkill.TenKyNang as skill, 
       jobCount
ORDER BY jobCount DESC
LIMIT 10

// 3. Skill gaps (skills cần nâng cấp level)
MATCH (c:Candidate {MaUV: $candidateId})-[hs:HAS_SKILL]->(s:Skill)
MATCH (j:JobPost)-[rs:REQUIRES_SKILL]->(s)
WHERE j.TrangThai = 'active'
  AND rs.LevelRequired > hs.Level
WITH s.TenKyNang as skill, 
     hs.Level as currentLevel,
     rs.LevelRequired as requiredLevel,
     COUNT(DISTINCT j) as jobCount
RETURN skill, currentLevel, requiredLevel, jobCount
ORDER BY jobCount DESC
```

#### Tìm jobs tương tự
```cypher
// neo4jService.findSimilarJobs()
MATCH (j1:JobPost {MaBTD: $jobId})-[:REQUIRES_SKILL]->(s:Skill)<-[:REQUIRES_SKILL]-(j2:JobPost)
WHERE j1 <> j2 AND j2.TrangThai = 'active'

WITH j2, COUNT(DISTINCT s) as commonSkills, COLLECT(DISTINCT s.TenKyNang) as skills

OPTIONAL MATCH (e:Employer)-[:POSTED]->(j2)
OPTIONAL MATCH (j2)-[:FOR_POSITION]->(pos:Position)
OPTIONAL MATCH (j2)-[:LOCATED_AT]->(loc:Location)

RETURN j2.MaBTD as jobId,
       j2.TieuDe as title,
       e.TenCongTy as companyName,
       commonSkills,
       skills
ORDER BY commonSkills DESC
LIMIT 5
```

#### Thống kê database
```cypher
// neo4jService.getStats()
MATCH (a:Account) WITH COUNT(a) as accounts
MATCH (c:Candidate) WITH accounts, COUNT(c) as candidates
MATCH (e:Employer) WITH accounts, candidates, COUNT(e) as employers
MATCH (j:JobPost) WITH accounts, candidates, employers, COUNT(j) as jobs
MATCH (s:Skill) WITH accounts, candidates, employers, jobs, COUNT(s) as skills
MATCH (app:Application) WITH accounts, candidates, employers, jobs, skills, COUNT(app) as applications

MATCH ()-[r:HAS_SKILL]->() 
WITH accounts, candidates, employers, jobs, skills, applications, COUNT(r) as candidateSkills

MATCH ()-[r2:REQUIRES_SKILL]->() 
WITH accounts, candidates, employers, jobs, skills, applications, candidateSkills, COUNT(r2) as jobRequirements

RETURN accounts, candidates, employers, jobs, skills, applications,
       candidateSkills, jobRequirements
```


---

## 📡 API ENDPOINTS

### Authentication APIs
```
POST   /api/auth/register          # Đăng ký tài khoản
POST   /api/auth/login             # Đăng nhập
POST   /api/auth/validate-token    # Validate JWT token
```

### Candidate APIs (Yêu cầu authentication)
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

### Employer APIs (Yêu cầu authentication)
```
GET    /api/employers/profile                           # Lấy profile
PUT    /api/employers/profile                           # Cập nhật profile
GET    /api/employers/jobs                              # Danh sách jobs đã đăng
GET    /api/employers/jobs/:jobId/matching-candidates   # Tìm ứng viên (Neo4j) ⭐
GET    /api/employers/jobs/:jobId/applications          # Đơn ứng tuyển của job
GET    /api/employers/applications/:id                  # Chi tiết đơn
PUT    /api/employers/applications/:id/status           # Cập nhật trạng thái
GET    /api/employers/saved-candidates                  # Ứng viên đã lưu
POST   /api/employers/candidates/:id/save               # Lưu ứng viên
DELETE /api/employers/candidates/:id/unsave             # Bỏ lưu
GET    /api/employers/search-candidates                 # Tìm kiếm ứng viên
```

### Job Post APIs (Public + Protected)
```
GET    /api/jobs                   # Lấy tất cả jobs (public)
GET    /api/jobs/search            # Tìm kiếm jobs (public)
GET    /api/jobs/recent            # Jobs mới nhất (public)
GET    /api/jobs/:id               # Chi tiết job (public)
POST   /api/jobs                   # Tạo job (Employer only)
PUT    /api/jobs/:id               # Cập nhật job (Employer only)
DELETE /api/jobs/:id               # Xóa job (Employer only)
POST   /api/jobs/:id/views         # Tăng lượt xem (public)
```

### Application APIs (Yêu cầu authentication)
```
POST   /api/applications           # Nộp đơn ứng tuyển (Candidate)
GET    /api/applications/:id       # Chi tiết đơn
PUT    /api/applications/:id/status # Cập nhật trạng thái (Employer)
DELETE /api/applications/:id       # Rút đơn (Candidate)
```

### Admin APIs (Admin only)
```
GET    /api/admin/accounts         # Danh sách tài khoản
PUT    /api/admin/accounts/:id     # Cập nhật tài khoản
DELETE /api/admin/accounts/:id     # Xóa tài khoản
GET    /api/admin/statistics       # Thống kê hệ thống
```


---

## 🎨 FRONTEND STRUCTURE

### Pages Structure

#### Public Pages (Không cần đăng nhập)
```
/                           # Trang chủ
/jobs                       # Danh sách việc làm
/jobs/:id                   # Chi tiết việc làm
/employers                  # Danh sách công ty
/employers/:id              # Chi tiết công ty
/login                      # Đăng nhập
/register                   # Đăng ký
```

#### Candidate Pages (Yêu cầu đăng nhập)
```
/candidate/profile          # Hồ sơ cá nhân
/candidate/cv-builder       # Tạo CV online
/candidate/recommended-jobs # Việc làm gợi ý (Neo4j)
/candidate/saved-jobs       # Việc làm đã lưu
/candidate/applications     # Đơn đã nộp
/candidate/profile-views    # Ai đã xem hồ sơ
```

#### Employer Pages (Yêu cầu đăng nhập)
```
/employer/dashboard         # Tổng quan
/employer/profile           # Thông tin công ty
/employer/jobs              # Quản lý tin tuyển dụng
/employer/jobs/create       # Đăng tin mới
/employer/jobs/:id/edit     # Sửa tin
/employer/jobs/:id/matching # Ứng viên phù hợp (Neo4j)
/employer/applications      # Quản lý đơn ứng tuyển
/employer/saved-candidates  # Ứng viên đã lưu
/employer/search-candidates # Tìm kiếm ứng viên
/employer/statistics        # Thống kê
```

#### Admin Pages
```
/admin/dashboard            # Tổng quan
/admin/accounts             # Quản lý tài khoản
/admin/statistics           # Thống kê hệ thống
```

### State Management (Redux Toolkit)

```javascript
// store/authSlice.js
{
  user: {
    id: String,
    email: String,
    type: 'candidate' | 'employer' | 'admin',
    profileId: String
  },
  token: String,
  isAuthenticated: Boolean
}

// store/jobSlice.js
{
  jobs: Array,
  currentJob: Object,
  filters: {
    location: String,
    skills: Array,
    salary: String
  },
  loading: Boolean
}

// store/applicationSlice.js
{
  applications: Array,
  currentApplication: Object,
  loading: Boolean
}
```


### Services (API Calls)

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor để thêm token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor để xử lý lỗi 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

```javascript
// services/authService.js
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  validateToken: () => api.post('/auth/validate-token')
};

// services/jobService.js
export const jobService = {
  getAllJobs: (params) => api.get('/jobs', { params }),
  searchJobs: (params) => api.get('/jobs/search', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`)
};

// services/candidateService.js
export const candidateService = {
  getProfile: () => api.get('/candidates/profile'),
  updateProfile: (data) => api.put('/candidates/profile', data),
  updateSkills: (skills) => api.put('/candidates/skills', { skills }),
  getMatchingJobs: () => api.get('/candidates/matching-jobs'),
  getSavedJobs: () => api.get('/candidates/saved-jobs'),
  saveJob: (jobId) => api.post(`/candidates/saved-jobs/${jobId}`),
  unsaveJob: (jobId) => api.delete(`/candidates/saved-jobs/${jobId}`)
};

// services/applicationService.js
export const applicationService = {
  apply: (formData) => api.post('/applications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getApplications: () => api.get('/candidates/applications'),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  withdrawApplication: (id) => api.delete(`/applications/${id}`)
};
```


---

## 🔐 BẢO MẬT VÀ AUTHENTICATION

### 1. JWT Authentication Flow

```
1. User đăng nhập
   ↓
2. Backend verify credentials
   ↓
3. Tạo JWT token với payload:
   {
     userId: account._id,
     type: account.type,
     candidateId/employerId: profile._id,
     iat: issued_at_timestamp,
     exp: expiration_timestamp
   }
   ↓
4. Sign token với JWT_SECRET
   ↓
5. Trả về token cho client
   ↓
6. Client lưu token vào localStorage
   ↓
7. Mọi request sau đó gửi kèm token trong header:
   Authorization: Bearer <token>
   ↓
8. Backend verify token với middleware
   ↓
9. Decode payload → req.user
   ↓
10. Controller xử lý request
```

### 2. Password Security

```javascript
// Hash password khi đăng ký
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Verify password khi đăng nhập
const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
```

### 3. Authorization (Phân quyền)

```javascript
// middlewares/auth.js
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// middlewares/checkRole.js
export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.type)) {
      return res.status(403).json({ 
        message: 'Không có quyền truy cập' 
      });
    }
    next();
  };
};

// Sử dụng:
router.get('/admin/accounts', verifyToken, checkRole('admin'), getAccounts);
router.post('/jobs', verifyToken, checkRole('employer'), createJob);
```

### 4. File Upload Security

```javascript
// Chỉ cho phép PDF, giới hạn kích thước
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file PDF'));
    }
  },
  limits: { 
    fileSize: 5 * 1024 * 1024 // Max 5MB
  }
});
```


---

## 🔄 REAL-TIME FEATURES (Socket.io)

### Setup

```javascript
// Backend: server.js
import { Server } from 'socket.io';

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL }
});

// Socket handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join room theo userId
  socket.on('join', (userId) => {
    socket.join(userId);
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
```

### Use Cases

**1. Thông báo đơn ứng tuyển mới (Employer):**
```javascript
// Khi candidate nộp đơn
io.to(employerId).emit('new-application', {
  jobId: application.jobpostId,
  candidateName: candidate.fullName,
  applicationId: application._id
});
```

**2. Thông báo cập nhật trạng thái (Candidate):**
```javascript
// Khi employer cập nhật trạng thái đơn
io.to(candidateId).emit('application-status-updated', {
  applicationId: application._id,
  status: application.status.name,
  jobTitle: job.title
});
```

**3. Frontend nhận thông báo:**
```javascript
// Frontend: useSocket.js
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL);

socket.on('connect', () => {
  socket.emit('join', userId);
});

socket.on('new-application', (data) => {
  toast.info(`Đơn ứng tuyển mới cho ${data.jobTitle}`);
  // Refresh applications list
});

socket.on('application-status-updated', (data) => {
  toast.success(`Trạng thái đơn đã cập nhật: ${data.status}`);
  // Refresh applications list
});
```

---

## 📧 EMAIL NOTIFICATIONS (Nodemailer)

### Setup

```javascript
// utils/emailService.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // App password
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    console.log('Email sent to:', to);
  } catch (error) {
    console.error('Email error:', error);
  }
};
```

### Email Templates

**1. Xác nhận đăng ký:**
```javascript
await sendEmail(
  user.email,
  'Chào mừng đến với JobLink',
  `<h1>Xin chào ${user.fullName}</h1>
   <p>Tài khoản của bạn đã được tạo thành công!</p>`
);
```

**2. Thông báo đơn ứng tuyển:**
```javascript
await sendEmail(
  employer.email,
  'Đơn ứng tuyển mới',
  `<h1>Bạn có đơn ứng tuyển mới</h1>
   <p>Ứng viên: ${candidate.fullName}</p>
   <p>Vị trí: ${job.title}</p>`
);
```

**3. Cập nhật trạng thái:**
```javascript
await sendEmail(
  candidate.email,
  'Cập nhật trạng thái đơn ứng tuyển',
  `<h1>Trạng thái đơn đã thay đổi</h1>
   <p>Vị trí: ${job.title}</p>
   <p>Trạng thái: ${application.status.name}</p>`
);
```


---

## 🚀 DEPLOYMENT & SCRIPTS

### Database Scripts

#### 1. Seed Data (MongoDB)
```bash
node backend/src/scripts/seedData.js
```
- Tạo dữ liệu mẫu: accounts, candidates, employers, jobs, applications
- Dùng để test hệ thống

#### 2. Init Neo4j
```bash
node backend/src/scripts/initNeo4j.js
```
- Tạo constraints và indexes trong Neo4j
- Đảm bảo uniqueness cho các nodes

#### 3. Sync MongoDB → Neo4j
```bash
node backend/src/scripts/syncToNeo4j.js
```
- Đồng bộ toàn bộ dữ liệu từ MongoDB sang Neo4j
- Chạy khi:
  - Clone project lần đầu
  - Import data trực tiếp vào MongoDB
  - Neo4j bị mất dữ liệu

#### 4. Test Recommendations
```bash
node backend/src/scripts/testRecommendations.js
```
- Test chức năng gợi ý jobs và candidates
- Kiểm tra match score

#### 5. Check Neo4j Data
```bash
node backend/src/scripts/checkNeo4jData.js
```
- Kiểm tra số lượng nodes và relationships
- Verify data đã sync chưa

### Environment Variables

**Backend (.env):**
```env
# Server
PORT=5000
NODE_ENV=development

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

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```


### Chạy Project

**Development:**
```bash
# Backend
cd backend
npm install
npm run dev        # Chạy với nodemon (auto-reload)

# Frontend
cd frontend
npm install
npm run dev        # Chạy với Vite
```

**Production:**
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run build      # Build static files
npm run preview    # Preview production build
```

---

## 📊 SO SÁNH MONGODB VS NEO4J

### Performance Comparison

| Tiêu chí | MongoDB | Neo4j |
|----------|---------|-------|
| **Mục đích** | Database chính | Tối ưu recommendations |
| **Dữ liệu lưu trữ** | Toàn bộ | Skills + Relationships |
| **CRUD Operations** | ✅ Full support | ❌ Chỉ đọc |
| **Match Score** | ❌ Không có | ✅ 0-100% chính xác |
| **Graph Traversal** | ❌ Chậm (JOIN) | ✅ Nhanh (native) |
| **Query Speed** | ~44ms | **~31ms** ⚡ |
| **Độ chính xác gợi ý** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Scalability** | ✅ Tốt | ✅ Tốt |
| **Complexity** | ⭐⭐ | ⭐⭐⭐⭐ |

### Khi nào dùng MongoDB?
- CRUD operations (Create, Read, Update, Delete)
- Lưu trữ dữ liệu đầy đủ
- Tìm kiếm đơn giản (theo title, location, salary)
- Quản lý users, applications, jobs

### Khi nào dùng Neo4j?
- Tìm kiếm theo mối quan hệ phức tạp
- Tính toán Match Score
- Gợi ý jobs/candidates dựa trên skills
- Phân tích skills (skill gaps, recommended skills)
- Tìm jobs tương tự

### Ví dụ so sánh

**Tìm jobs phù hợp với candidate có skills: [JavaScript, React, Node.js]**

**MongoDB (Slow):**
```javascript
// Phải query nhiều lần và tính toán trong code
const candidate = await Candidate.findById(candidateId);
const candidateSkills = candidate.skills.map(s => s.name);

const jobs = await JobPost.find({
  'skillsRequired.name': { $in: candidateSkills }
});

// Tính match score trong JavaScript (chậm)
const jobsWithScore = jobs.map(job => {
  const matchingSkills = job.skillsRequired.filter(
    req => candidateSkills.includes(req.name)
  );
  const matchScore = matchingSkills.length / job.skillsRequired.length;
  return { ...job, matchScore };
});
```

**Neo4j (Fast):**
```cypher
// Một query duy nhất, tính toán trong database
MATCH (c:Candidate {MaUV: $candidateId})-[:HAS_SKILL]->(s:Skill)
MATCH (j:JobPost)-[:REQUIRES_SKILL]->(s)
WITH j, 
     COUNT(DISTINCT s) as matching,
     SIZE((j)-[:REQUIRES_SKILL]->()) as total
RETURN j, (matching * 1.0 / total) as matchScore
ORDER BY matchScore DESC
```


---

## 🎯 TÍNH NĂNG NỔI BẬT

### 1. AI-Powered Job Matching (Neo4j)

**Đặc điểm:**
- Tính toán Match Score chính xác (0-100%)
- Xem xét cả proficiency level của skills
- Sắp xếp theo độ phù hợp
- Hiển thị skills trùng khớp

**Ví dụ kết quả:**
```json
{
  "title": "Senior Full-stack Developer",
  "matchScore": 85,
  "matchingSkillsCount": 6,
  "totalRequiredSkills": 7,
  "matchingSkills": ["JavaScript", "React", "Node.js", "MongoDB", "Docker", "Git"]
}
```

### 2. CV Builder

**Chức năng:**
- Tạo CV online với template đẹp
- Các section: Personal Info, Experience, Education, Projects, Skills, Languages, Certifications
- Export sang PDF (html2pdf.js)
- Lưu trữ trong database

**Cấu trúc:**
```javascript
cv: {
  personal: {
    address: String,
    linkedin: String,
    github: String,
    website: String
  },
  experience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String
  }],
  education: [...],
  projects: [...],
  languages: [...],
  certifications: [...]
}
```

### 3. Skill Analysis

**Phân tích kỹ năng của candidate:**
- **Current Skills**: Kỹ năng hiện tại và level
- **Recommended Skills**: Kỹ năng nên học (dựa trên jobs phổ biến)
- **Skill Gaps**: Kỹ năng cần nâng cấp level

**Ví dụ:**
```json
{
  "currentSkills": [
    { "skill": "JavaScript", "level": "Thành thạo", "years": 3 },
    { "skill": "React", "level": "Trung bình", "years": 2 }
  ],
  "recommendedSkills": [
    { "skill": "TypeScript", "demandInJobs": 15 },
    { "skill": "Docker", "demandInJobs": 12 }
  ],
  "skillGaps": [
    { 
      "skill": "React", 
      "currentLevel": "Trung bình", 
      "requiredLevel": "Thành thạo",
      "jobsRequiring": 8
    }
  ]
}
```


### 4. Application Tracking

**Cho Candidate:**
- Xem tất cả đơn đã nộp
- Theo dõi trạng thái: Submitted → Reviewed → Interviewed → Rejected/Hired
- Xem lịch sử cập nhật
- Rút đơn nếu cần

**Cho Employer:**
- Xem tất cả đơn của một job
- Lọc theo trạng thái
- Xem chi tiết CV và thông tin candidate
- Cập nhật trạng thái
- Lịch sử xem đơn

### 5. Saved Jobs / Saved Candidates

**Candidate lưu jobs:**
```javascript
savedJobs: [{
  jobId: ObjectId,
  savedAt: Date
}]
```

**Employer lưu candidates:**
```javascript
savedCandidates: [ObjectId]
```

### 6. Real-time Notifications

**Socket.io events:**
- `new-application`: Thông báo đơn mới cho employer
- `application-status-updated`: Thông báo cập nhật trạng thái cho candidate
- `profile-viewed`: Thông báo khi employer xem profile

### 7. Advanced Search & Filters

**Job Search Filters:**
- Keyword (title, description)
- Location (city)
- Skills required
- Salary range
- Experience level (Intern, Junior, Senior, Manager)
- Job type (Full-time, Part-time, Contract, Internship)
- Work mode (On-site, Remote, Hybrid)
- Company size

**Candidate Search Filters:**
- Keyword (name, email)
- Education level
- Experience years
- Skills
- Location

### 8. Statistics & Analytics

**Employer Dashboard:**
- Tổng số jobs đã đăng
- Tổng số đơn ứng tuyển
- Số đơn theo trạng thái
- Jobs sắp hết hạn
- Top skills được yêu cầu

**Admin Dashboard:**
- Tổng số users (candidates, employers)
- Tổng số jobs
- Tổng số applications
- Growth charts
- Popular skills
- Active jobs by location


---

## 🔧 TROUBLESHOOTING

### MongoDB không kết nối được

**Lỗi:** `MongoServerError: Authentication failed`

**Giải pháp:**
1. Kiểm tra MONGO_URI trong .env
2. Kiểm tra username/password
3. Nếu dùng Atlas: Whitelist IP address
4. Test connection: `node backend/src/scripts/seedData.js`

### Neo4j không kết nối được

**Lỗi:** `ServiceUnavailable: Connection refused`

**Giải pháp:**
1. Kiểm tra Neo4j đang chạy:
   - Neo4j Desktop: Start database
   - Docker: `docker ps | grep neo4j`
2. Kiểm tra NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD trong .env
3. Test connection: `node backend/src/scripts/checkNeo4jData.js`

### Recommendations không hoạt động

**Lỗi:** Không có jobs/candidates gợi ý

**Giải pháp:**
1. Check Neo4j có data chưa: `node backend/src/scripts/checkNeo4jData.js`
2. Nếu chưa có, sync data: `node backend/src/scripts/syncToNeo4j.js`
3. Test recommendations: `node backend/src/scripts/testRecommendations.js`
4. Kiểm tra candidate/job có skills chưa

### JWT Token expired

**Lỗi:** `401 Unauthorized - Token expired`

**Giải pháp:**
1. Đăng nhập lại
2. Token hết hạn sau 3 ngày (JWT_EXPIRES_IN)
3. Frontend tự động redirect về /login khi 401

### File upload không hoạt động

**Lỗi:** `MulterError: File too large`

**Giải pháp:**
1. Kiểm tra file size < 5MB
2. Kiểm tra file type = PDF
3. Kiểm tra thư mục /backend/uploads/ tồn tại
4. Kiểm tra quyền write vào thư mục

### CORS Error

**Lỗi:** `Access-Control-Allow-Origin`

**Giải pháp:**
1. Kiểm tra CLIENT_URL trong backend/.env
2. Kiểm tra CORS config trong server.js:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```


---

## 📈 PERFORMANCE OPTIMIZATION

### 1. Database Indexing

**MongoDB Indexes:**
```javascript
// Account
accountSchema.index({ username: 1 });
accountSchema.index({ type: 1, status: 1 });

// Candidate
candidateSchema.index({ email: 1 });
candidateSchema.index({ 'skills.name': 1 });

// Employer
employerSchema.index({ email: 1 });
employerSchema.index({ field: 1 });

// JobPost
jobPostSchema.index({ employerId: 1 });
jobPostSchema.index({ status: 1, deadline: 1 });
jobPostSchema.index({ 'location.city': 1 });
jobPostSchema.index({ 'skillsRequired.name': 1 });

// Application
applicationSchema.index({ candidateId: 1 });
applicationSchema.index({ jobpostId: 1 });
applicationSchema.index({ 'status.name': 1 });
```

**Neo4j Constraints & Indexes:**
```cypher
// Constraints (uniqueness)
CREATE CONSTRAINT account_id IF NOT EXISTS FOR (a:Account) REQUIRE a.MaTK IS UNIQUE;
CREATE CONSTRAINT candidate_id IF NOT EXISTS FOR (c:Candidate) REQUIRE c.MaUV IS UNIQUE;
CREATE CONSTRAINT employer_id IF NOT EXISTS FOR (e:Employer) REQUIRE e.MaNTD IS UNIQUE;
CREATE CONSTRAINT job_id IF NOT EXISTS FOR (j:JobPost) REQUIRE j.MaBTD IS UNIQUE;
CREATE CONSTRAINT skill_name IF NOT EXISTS FOR (s:Skill) REQUIRE s.TenKyNang IS UNIQUE;

// Indexes (performance)
CREATE INDEX skill_level IF NOT EXISTS FOR (s:Skill) ON (s.MucDo);
CREATE INDEX job_status IF NOT EXISTS FOR (j:JobPost) ON (j.TrangThai);
```

### 2. Query Optimization

**Populate chỉ fields cần thiết:**
```javascript
// ❌ Bad: Populate toàn bộ
.populate('employerId')

// ✅ Good: Chỉ lấy fields cần thiết
.populate('employerId', 'companyName email phone')
```

**Sử dụng lean() cho read-only:**
```javascript
// ❌ Bad: Trả về Mongoose document (heavy)
const jobs = await JobPost.find(filters);

// ✅ Good: Trả về plain JavaScript object (light)
const jobs = await JobPost.find(filters).lean();
```

**Pagination:**
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;

const jobs = await JobPost.find(filters)
  .skip((page - 1) * limit)
  .limit(limit);

const total = await JobPost.countDocuments(filters);
```

### 3. Caching

**Cache thông tin trong Application:**
```javascript
// Thay vì populate mỗi lần, cache thông tin
jobSummary: {
  title: job.title,
  employerName: employer.companyName
},
candidateSummary: {
  fullName: candidate.fullName,
  email: candidate.email
}
```

### 4. Lazy Loading

**Frontend chỉ load data khi cần:**
```javascript
// Load jobs khi scroll đến cuối trang
const [page, setPage] = useState(1);
const [jobs, setJobs] = useState([]);

const loadMore = async () => {
  const newJobs = await jobService.getAllJobs({ page: page + 1 });
  setJobs([...jobs, ...newJobs]);
  setPage(page + 1);
};
```


---

## 🎓 KIẾN THỨC CẦN THIẾT

### Backend Developer

**Bắt buộc:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- RESTful API design
- Async/Await & Promises
- Error handling
- Middleware pattern

**Nâng cao:**
- Neo4j & Cypher Query Language
- Graph Database concepts
- Socket.io (Real-time)
- File upload (Multer)
- Email service (Nodemailer)
- Database optimization

### Frontend Developer

**Bắt buộc:**
- React 18+ (Hooks, Context)
- React Router v6
- State management (Redux Toolkit)
- Axios (HTTP client)
- Form handling
- Authentication flow
- TailwindCSS

**Nâng cao:**
- Socket.io-client
- File upload UI
- PDF generation (html2pdf.js)
- Performance optimization
- Error boundaries
- Code splitting

### Database

**MongoDB:**
- Schema design
- Relationships (Ref, Embedded)
- Indexes
- Aggregation pipeline
- Query optimization

**Neo4j:**
- Graph concepts (Nodes, Relationships)
- Cypher Query Language
- Graph traversal
- Pattern matching
- Performance tuning

---

## 🚀 HƯỚNG PHÁT TRIỂN

### Tính năng có thể thêm:

1. **Chat giữa Candidate và Employer**
   - Real-time messaging với Socket.io
   - Lưu lịch sử chat trong MongoDB

2. **Video Interview**
   - Tích hợp WebRTC
   - Schedule interview

3. **AI Resume Parser**
   - Tự động extract thông tin từ CV
   - Sử dụng OCR hoặc NLP

4. **Advanced Analytics**
   - Dashboard với charts (Chart.js, Recharts)
   - Predictive analytics

5. **Mobile App**
   - React Native
   - Shared API với web

6. **Multi-language Support**
   - i18n (internationalization)
   - Tiếng Việt, English

7. **Payment Integration**
   - Premium features cho employers
   - Stripe, PayPal

8. **Social Login**
   - Google, Facebook, LinkedIn OAuth

9. **Notification System**
   - Push notifications
   - Email digest

10. **Job Alerts**
    - Subscribe theo skills/location
    - Email khi có job mới phù hợp


---

## 📝 KẾT LUẬN

### Điểm mạnh của hệ thống:

1. **Hybrid Database Architecture** - Kết hợp MongoDB và Neo4j để tối ưu cả lưu trữ và recommendations
2. **AI-Powered Matching** - Tính toán Match Score chính xác dựa trên skills
3. **Real-time Features** - Socket.io cho notifications tức thì
4. **Scalable Architecture** - Dễ dàng mở rộng và bảo trì
5. **Modern Tech Stack** - React 19, Express 5, MongoDB, Neo4j
6. **Security** - JWT authentication, bcrypt password hashing, file upload validation
7. **User Experience** - CV Builder, Skill Analysis, Advanced Search

### Luồng hoạt động tổng quan:

```
1. User đăng ký/đăng nhập
   ↓
2. Candidate cập nhật profile & skills
   ↓
3. Hệ thống sync sang Neo4j
   ↓
4. Employer đăng tin tuyển dụng
   ↓
5. Hệ thống sync sang Neo4j
   ↓
6. Candidate xem gợi ý việc làm (Neo4j tính Match Score)
   ↓
7. Employer xem ứng viên phù hợp (Neo4j tính Match Score)
   ↓
8. Candidate nộp đơn (upload CV)
   ↓
9. Employer nhận thông báo real-time
   ↓
10. Employer xem đơn và cập nhật trạng thái
    ↓
11. Candidate nhận thông báo real-time
```

### Tại sao dùng Hybrid Database?

**MongoDB (Primary):**
- Lưu trữ toàn bộ dữ liệu
- CRUD operations nhanh
- Schema linh hoạt
- Dễ query thông thường

**Neo4j (Secondary):**
- Tối ưu cho Graph Traversal
- Tính Match Score chính xác
- Nhanh hơn khi tìm theo relationships
- Phân tích skills tốt hơn

**Kết quả:**
- Tốc độ: Neo4j nhanh hơn ~30% cho recommendations
- Độ chính xác: Match Score 0-100% thay vì boolean match
- Scalability: Mỗi database làm việc mình giỏi nhất
- Fault-tolerant: Nếu Neo4j down, MongoDB vẫn hoạt động

---

## 📞 LIÊN HỆ & HỖ TRỢ

**Developer:** Nguyễn Duy Thông

**GitHub:** [Repository Link]

**Email:** [Contact Email]

---

**🎉 Chúc bạn thành công với hệ thống JobLink!**

