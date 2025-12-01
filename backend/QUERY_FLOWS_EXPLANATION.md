# GIẢI THÍCH LUỒNG HOẠT ĐỘNG CỦA 12 TRUY VẤN CHÍNH

## NHÓM 1: TÌM KIẾM VÀ GỢI Ý (3 truy vấn)

### 1. Tìm kiếm việc làm với nhiều bộ lọc (MongoDB)

**Mục đích:** Giúp ứng viên tìm việc làm phù hợp với nhiều tiêu chí

**Luồng hoạt động:**
```
Bước 1: Ứng viên vào trang tìm kiếm việc làm
Bước 2: Nhập các tiêu chí tìm kiếm:
   - Từ khóa (title, description)
   - Địa điểm (location)
   - Loại công việc (jobType: full-time, part-time...)
   - Mức lương (salaryMin, salaryMax)
   - Kinh nghiệm (experienceLevel)
   - Kỹ năng (skills)
   
Bước 3: Frontend gửi request đến API với query params
Bước 4: Backend xây dựng MongoDB query với $and, $or, $regex
Bước 5: Thực hiện aggregation pipeline:
   - $match: Lọc theo các điều kiện
   - $lookup: Join với collection companies để lấy thông tin công ty
   - $sort: Sắp xếp theo độ phù hợp hoặc ngày đăng
   - $skip/$limit: Phân trang
   
Bước 6: Trả về danh sách công việc kèm thông tin công ty
Bước 7: Frontend hiển thị kết quả dạng danh sách hoặc lưới
```

**Ví dụ thực tế:**
- Ứng viên tìm: "Frontend Developer" ở "Hà Nội", lương > 15 triệu
- Hệ thống tìm tất cả job có title chứa "Frontend", location = "Hà Nội", salary >= 15000000


### 2. Gợi ý việc làm phù hợp cho ứng viên (Neo4j)

**Mục đích:** Đề xuất công việc phù hợp dựa trên profile và hành vi của ứng viên

**Luồng hoạt động:**
```
Bước 1: Ứng viên đăng nhập vào hệ thống
Bước 2: Hệ thống phân tích profile ứng viên:
   - Skills (kỹ năng)
   - Experience (kinh nghiệm)
   - Education (học vấn)
   - Preferences (sở thích: location, salary, jobType)
   
Bước 3: Hệ thống phân tích hành vi:
   - Các job đã xem (VIEWED relationship)
   - Các job đã lưu (SAVED relationship)
   - Các job đã apply (APPLIED relationship)
   
Bước 4: Neo4j thực hiện Cypher query:
   - Tìm các job có skills trùng khớp
   - Tìm các job mà ứng viên tương tự đã apply
   - Tính điểm phù hợp (matching score)
   
Bước 5: Sắp xếp theo điểm phù hợp giảm dần
Bước 6: Lấy thông tin chi tiết từ MongoDB
Bước 7: Hiển thị danh sách gợi ý trên trang chủ

**Ví dụ thực tế:**
- Ứng viên A có skills: [React, Node.js, MongoDB]
- Đã xem job về "Full-stack Developer"
- Hệ thống gợi ý: Jobs yêu cầu React/Node.js, jobs mà ứng viên tương tự đã apply


### 3. Tìm ứng viên phù hợp cho công việc (Neo4j)

**Mục đích:** Giúp nhà tuyển dụng tìm ứng viên phù hợp với vị trí tuyển dụng

**Luồng hoạt động:**
```
Bước 1: Nhà tuyển dụng đăng tin tuyển dụng với yêu cầu:
   - Required skills (kỹ năng bắt buộc)
   - Experience level (mức kinh nghiệm)
   - Education (học vấn)
   - Location (địa điểm)
   
Bước 2: Nhà tuyển dụng click "Tìm ứng viên phù hợp"
Bước 3: Neo4j thực hiện matching:
   - Tìm ứng viên có skills match với job requirements (v)
   - Tính % skills phù hợp (v)
   - Kiểm tra experience level
   - Kiểm tra location preference
   
Bước 4: Tính điểm phù hợp (matching score):
   - Skills match: 50%
   - Experience match: 30%
   - Location match: 20%
   
Bước 5: Sắp xếp theo điểm giảm dần
Bước 6: Lấy thông tin chi tiết từ MongoDB
Bước 7: Hiển thị danh sách ứng viên tiềm năng
Bước 8: Nhà tuyển dụng có thể:
   - Xem profile chi tiết
   - Gửi lời mời ứng tuyển
   - Lưu ứng viên vào danh sách quan tâm
```

**Ví dụ thực tế:**
- Job yêu cầu: React, Node.js, 2+ năm kinh nghiệm
- Ứng viên A: React, Node.js, Vue.js, 3 năm → 90% match
- Ứng viên B: React, Angular, 1 năm → 60% match


---

## NHÓM 2: THỐNG KÊ VÀ BÁO CÁO (3 truy vấn)

### 4. Thống kê tổng quan hệ thống (MongoDB)

**Mục đích:** Cung cấp cái nhìn tổng quan về hoạt động của hệ thống cho Admin

**Luồng hoạt động:**
```
Bước 1: Admin đăng nhập và vào trang Dashboard
Bước 2: Frontend gọi API /api/admin/reports/dashboard
Bước 3: Backend thực hiện 8 truy vấn song song (Promise.all):
   a. Đếm tổng số users (accounts.countDocuments())
   b. Đếm số candidates (type = 'candidate')
   c. Đếm số employers (type = 'employer')
   d. Đếm tổng số jobs (jobposts.countDocuments())
   e. Đếm jobs đang active (status = 'open')
   f. Đếm tổng số applications
   g. Đếm applications pending (status.name = 'Submitted')
   h. Tính tổng views của tất cả jobs (aggregation $sum)
   
Bước 4: Tổng hợp kết quả thành object
Bước 5: Trả về cho frontend
Bước 6: Hiển thị dạng cards với icon và số liệu
```

**Ví dụ kết quả:**
```json
{
  "users": { "total": 1025, "candidates": 856, "employers": 169 },
  "jobs": { "total": 450, "active": 320, "closed": 130 },
  "applications": { "total": 3420, "pending": 856, "processed": 2564 },
  "engagement": { "totalViews": 15680, "averageViewsPerJob": 35 }
}
```


### 5. Báo cáo xu hướng đăng ký người dùng theo thời gian (MongoDB)

**Mục đích:** Phân tích xu hướng tăng trưởng người dùng theo ngày/tuần/tháng

**Luồng hoạt động:**
```
Bước 1: Admin vào trang Reports
Bước 2: Chọn khoảng thời gian (startDate, endDate)
Bước 3: Frontend gọi API /api/admin/reports?startDate=...&endDate=...
Bước 4: Backend thực hiện aggregation pipeline:
   
   Stage 1 - $match: Lọc users trong khoảng thời gian
   {
     createdAt: { $gte: startDate, $lte: endDate }
   }
   
   Stage 2 - $group: Nhóm theo ngày
   {
     _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
     count: { $sum: 1 }
   }
   
   Stage 3 - $sort: Sắp xếp theo ngày tăng dần
   { _id: 1 }
   
Bước 5: Trả về mảng [{ date: '2025-11-01', count: 15 }, ...]
Bước 6: Frontend vẽ biểu đồ cột (Bar Chart)
Bước 7: Hiển thị xu hướng tăng/giảm
```

**Ví dụ thực tế:**
- Chọn: 01/11/2025 → 30/11/2025
- Kết quả: 
  - 01/11: 12 users
  - 02/11: 15 users
  - 03/11: 8 users
  - ...
- Biểu đồ cho thấy: Tăng mạnh vào cuối tuần, giảm vào đầu tuần


### 6. Báo cáo tổng hợp theo khoảng thời gian (MongoDB)

**Mục đích:** Tổng hợp nhiều chỉ số trong một khoảng thời gian cụ thể

**Luồng hoạt động:**
```
Bước 1: Admin chọn khoảng thời gian cần báo cáo
Bước 2: Frontend gọi API /api/admin/reports/summary?startDate=...&endDate=...
Bước 3: Backend thực hiện 5 truy vấn song song:
   
   Query 1: Đếm users mới
   accounts.countDocuments({ createdAt: { $gte, $lte } })
   
   Query 2: Đếm jobs mới
   jobposts.countDocuments({ datePosted: { $gte, $lte } })
   
   Query 3: Đếm applications mới
   applications.countDocuments({ submitDate: { $gte, $lte } })
   
   Query 4: Nhóm users theo role (candidate/employer)
   accounts.aggregate([
     { $match: { createdAt: { $gte, $lte } } },
     { $group: { _id: '$type', count: { $sum: 1 } } }
   ])
   
   Query 5: Nhóm jobs theo status (open/closed)
   jobposts.aggregate([
     { $match: { datePosted: { $gte, $lte } } },
     { $group: { _id: '$status', count: { $sum: 1 } } }
   ])
   
Bước 4: Tổng hợp kết quả
Bước 5: Hiển thị dạng summary cards
```

**Ví dụ kết quả:**
- Thời gian: 01/11/2025 → 30/11/2025
- Tổng users mới: 450 (300 candidates, 150 employers)
- Tổng jobs mới: 120 (80 open, 40 closed)
- Tổng applications: 680


---

## NHÓM 3: QUẢN LÝ DỮ LIỆU (3 truy vấn)

### 7. Lấy danh sách công việc đã lưu của ứng viên (MongoDB)

**Mục đích:** Hiển thị các công việc mà ứng viên đã đánh dấu để xem sau

**Luồng hoạt động:**
```
Bước 1: Ứng viên đăng nhập và vào trang "Việc làm đã lưu"
Bước 2: Frontend gọi API /api/candidate/saved-jobs
Bước 3: Backend lấy candidateId từ token
Bước 4: Thực hiện aggregation pipeline:
   
   Stage 1 - $match: Lọc candidate
   { candidateId: ObjectId(candidateId) }
   
   Stage 2 - $lookup: Join với jobposts collection
   {
     from: 'jobposts',
     localField: 'jobId',
     foreignField: '_id',
     as: 'jobDetails'
   }
   
   Stage 3 - $unwind: Mở rộng mảng jobDetails
   
   Stage 4 - $lookup: Join với companies collection
   {
     from: 'companies',
     localField: 'jobDetails.companyId',
     foreignField: '_id',
     as: 'companyDetails'
   }
   
   Stage 5 - $project: Chọn các field cần thiết
   Stage 6 - $sort: Sắp xếp theo ngày lưu mới nhất
   
Bước 5: Trả về danh sách jobs với đầy đủ thông tin
Bước 6: Hiển thị dạng cards với nút "Bỏ lưu" và "Ứng tuyển"
```

**Ví dụ thực tế:**
- Ứng viên đã lưu 5 jobs
- Mỗi job hiển thị: Title, Company, Location, Salary, Ngày lưu
- Click vào job → Xem chi tiết
- Click "Bỏ lưu" → Xóa khỏi danh sách


### 8. Tìm kiếm ứng viên theo nhiều tiêu chí (MongoDB)

**Mục đích:** Giúp nhà tuyển dụng tìm ứng viên phù hợp trong database

**Luồng hoạt động:**
```
Bước 1: Nhà tuyển dụng vào trang "Tìm ứng viên"
Bước 2: Nhập các tiêu chí tìm kiếm:
   - Từ khóa (tên, title)
   - Kỹ năng (skills)
   - Kinh nghiệm (experienceYears)
   - Học vấn (education)
   - Địa điểm (location)
   
Bước 3: Frontend gọi API /api/employer/search-candidates
Bước 4: Backend xây dựng query động:
   
   const query = {};
   
   if (keyword) {
     query.$or = [
       { 'profile.fullName': { $regex: keyword, $options: 'i' } },
       { 'profile.title': { $regex: keyword, $options: 'i' } }
     ];
   }
   
   if (skills) {
     query['profile.skills'] = { $in: skills };
   }
   
   if (experienceYears) {
     query['profile.experienceYears'] = { $gte: experienceYears };
   }
   
Bước 5: Thực hiện aggregation với $match, $project, $sort
Bước 6: Phân trang kết quả
Bước 7: Trả về danh sách ứng viên
Bước 8: Hiển thị với các action:
   - Xem profile đầy đủ
   - Gửi lời mời ứng tuyển
   - Lưu vào danh sách quan tâm
```

**Ví dụ thực tế:**
- Tìm: "Frontend Developer" với skills "React, TypeScript", 2+ năm
- Kết quả: 15 ứng viên phù hợp
- Sắp xếp theo: Độ phù hợp, Kinh nghiệm, Ngày cập nhật profile


### 9. Lấy đơn ứng tuyển của công việc với thông tin chi tiết (MongoDB)

**Mục đích:** Hiển thị tất cả đơn ứng tuyển cho một công việc cụ thể

**Luồng hoạt động:**
```
Bước 1: Nhà tuyển dụng vào trang quản lý job
Bước 2: Click vào một job để xem danh sách ứng viên
Bước 3: Frontend gọi API /api/employer/jobs/:jobId/applications
Bước 4: Backend thực hiện aggregation pipeline phức tạp:
   
   Stage 1 - $match: Lọc applications của job này
   { jobId: ObjectId(jobId) }
   
   Stage 2 - $lookup: Join với candidates collection
   {
     from: 'accounts',
     localField: 'candidateId',
     foreignField: '_id',
     as: 'candidateInfo'
   }
   
   Stage 3 - $unwind: Mở rộng candidateInfo
   
   Stage 4 - $lookup: Join với profiles collection (nếu tách riêng)
   
   Stage 5 - $addFields: Thêm các field tính toán
   {
     matchingScore: { /* tính điểm phù hợp */ },
     daysAgo: { $divide: [{ $subtract: [new Date(), '$submitDate'] }, 86400000] }
   }
   
   Stage 6 - $project: Chọn fields cần thiết
   Stage 7 - $sort: Sắp xếp theo status, submitDate
   
Bước 5: Trả về danh sách applications với đầy đủ thông tin
Bước 6: Hiển thị dạng bảng hoặc cards với:
   - Thông tin ứng viên (ảnh, tên, title)
   - CV/Resume
   - Trạng thái (Submitted, Reviewed, Interview, Rejected, Accepted)
   - Ngày nộp
   - Actions (Xem CV, Đổi trạng thái, Gửi email)
```

**Ví dụ thực tế:**
- Job "Senior React Developer" có 25 applications
- Hiển thị theo tabs: All (25), New (10), Reviewed (8), Interview (5), Rejected (2)
- Click vào ứng viên → Xem profile + CV chi tiết


---

## NHÓM 4: XỬ LÝ GIAO DỊCH (3 truy vấn)

### 10. Nộp đơn ứng tuyển với validation phức tạp (MongoDB)

**Mục đích:** Xử lý việc ứng viên nộp đơn ứng tuyển với nhiều kiểm tra

**Luồng hoạt động:**
```
Bước 1: Ứng viên xem chi tiết job và click "Ứng tuyển"
Bước 2: Điền form ứng tuyển:
   - Chọn CV (upload hoặc chọn có sẵn)
   - Cover letter
   - Thông tin liên hệ
   
Bước 3: Frontend gọi API POST /api/applications
Bước 4: Backend thực hiện validation chain:
   
   Check 1: Kiểm tra job còn tồn tại và đang open
   const job = await JobPost.findById(jobId);
   if (!job || job.status !== 'open') throw Error('Job not available');
   
   Check 2: Kiểm tra đã apply chưa (tránh duplicate)
   const existing = await Application.findOne({ 
     candidateId, 
     jobId 
   });
   if (existing) throw Error('Already applied');
   
   Check 3: Kiểm tra profile đã đầy đủ chưa
   const candidate = await Account.findById(candidateId);
   if (!candidate.profile.resume) throw Error('Please upload resume first');
   
   Check 4: Kiểm tra file CV hợp lệ
   if (resumeFile) {
     // Validate file type, size
   }
   
Bước 5: Tạo application document
const application = await Application.create({
  candidateId,
  jobId,
  companyId: job.companyId,
  resumeFile,
  coverLetter,
  status: { name: 'Submitted', date: new Date() },
  submitDate: new Date()
});

Bước 6: Cập nhật số lượng applications của job
await JobPost.findByIdAndUpdate(jobId, {
  $inc: { applicationsCount: 1 }
});

Bước 7: Tạo notification cho employer
await Notification.create({
  userId: job.employerId,
  type: 'NEW_APPLICATION',
  message: `${candidate.name} applied for ${job.title}`
});

Bước 8: Gửi email xác nhận cho candidate
await sendEmail({
  to: candidate.email,
  subject: 'Application Submitted Successfully',
  template: 'application-confirmation'
});

Bước 9: Trả về success response
Bước 10: Frontend hiển thị thông báo thành công và redirect
```

**Ví dụ thực tế:**
- Ứng viên apply job "Frontend Developer"
- Upload CV mới hoặc dùng CV có sẵn
- Viết cover letter
- Submit → Nhận email xác nhận
- Nhà tuyển dụng nhận notification


### 11. Lấy danh sách đơn ứng tuyển của ứng viên (MongoDB)

**Mục đích:** Hiển thị tất cả đơn ứng tuyển mà ứng viên đã nộp

**Luồng hoạt động:**
```
Bước 1: Ứng viên đăng nhập và vào trang "Đơn ứng tuyển của tôi"
Bước 2: Frontend gọi API /api/candidate/applications
Bước 3: Backend lấy candidateId từ token
Bước 4: Thực hiện aggregation pipeline:
   
   Stage 1 - $match: Lọc applications của candidate
   { candidateId: ObjectId(candidateId) }
   
   Stage 2 - $lookup: Join với jobposts
   {
     from: 'jobposts',
     localField: 'jobId',
     foreignField: '_id',
     as: 'jobDetails'
   }
   
   Stage 3 - $unwind: Mở rộng jobDetails
   
   Stage 4 - $lookup: Join với companies
   {
     from: 'companies',
     localField: 'companyId',
     foreignField: '_id',
     as: 'companyDetails'
   }
   
   Stage 5 - $unwind: Mở rộng companyDetails
   
   Stage 6 - $addFields: Thêm fields tính toán
   {
     statusColor: {
       $switch: {
         branches: [
           { case: { $eq: ['$status.name', 'Submitted'] }, then: 'blue' },
           { case: { $eq: ['$status.name', 'Reviewed'] }, then: 'yellow' },
           { case: { $eq: ['$status.name', 'Interview'] }, then: 'purple' },
           { case: { $eq: ['$status.name', 'Accepted'] }, then: 'green' },
           { case: { $eq: ['$status.name', 'Rejected'] }, then: 'red' }
         ],
         default: 'gray'
       }
     },
     daysAgo: { /* tính số ngày từ khi nộp */ }
   }
   
   Stage 7 - $sort: Sắp xếp theo submitDate giảm dần
   Stage 8 - $skip/$limit: Phân trang
   
Bước 5: Trả về danh sách applications
Bước 6: Frontend hiển thị dạng bảng với:
   - Tên công việc
   - Công ty
   - Ngày nộp
   - Trạng thái (với màu sắc)
   - Actions (Xem chi tiết, Rút đơn)
```

**Ví dụ thực tế:**
- Ứng viên đã nộp 12 đơn
- Hiển thị theo tabs: All (12), Pending (5), Interview (3), Accepted (2), Rejected (2)
- Mỗi đơn hiển thị timeline: Submitted → Reviewed → Interview → Result


### 12. Rút đơn ứng tuyển với rollback operations (MongoDB)

**Mục đích:** Cho phép ứng viên rút đơn ứng tuyển và rollback các thay đổi liên quan

**Luồng hoạt động:**
```
Bước 1: Ứng viên vào trang "Đơn ứng tuyển của tôi"
Bước 2: Click nút "Rút đơn" trên một application
Bước 3: Hiển thị modal xác nhận: "Bạn có chắc muốn rút đơn?"
Bước 4: Ứng viên xác nhận
Bước 5: Frontend gọi API DELETE /api/applications/:applicationId
Bước 6: Backend bắt đầu transaction (để đảm bảo tính toàn vẹn):

   === START TRANSACTION ===
   
   Step 1: Kiểm tra quyền sở hữu
   const application = await Application.findById(applicationId);
   if (application.candidateId !== currentUserId) {
     throw Error('Unauthorized');
   }
   
   Step 2: Kiểm tra trạng thái có cho phép rút không
   if (['Accepted', 'Rejected'].includes(application.status.name)) {
     throw Error('Cannot withdraw at this stage');
   }
   
   Step 3: Xóa application
   await Application.findByIdAndDelete(applicationId);
   
   Step 4: Giảm số lượng applications của job
   await JobPost.findByIdAndUpdate(application.jobId, {
     $inc: { applicationsCount: -1 }
   });
   
   Step 5: Xóa notifications liên quan
   await Notification.deleteMany({
     relatedId: applicationId,
     type: 'NEW_APPLICATION'
   });
   
   Step 6: Xóa file CV nếu đã upload riêng
   if (application.resumeFile) {
     await deleteFile(application.resumeFile);
   }
   
   Step 7: Tạo notification cho employer
   await Notification.create({
     userId: application.employerId,
     type: 'APPLICATION_WITHDRAWN',
     message: `${candidate.name} withdrew application for ${job.title}`
   });
   
   Step 8: Gửi email xác nhận
   await sendEmail({
     to: candidate.email,
     subject: 'Application Withdrawn',
     template: 'application-withdrawn'
   });
   
   === COMMIT TRANSACTION ===
   
Bước 7: Nếu có lỗi ở bất kỳ step nào → ROLLBACK toàn bộ
Bước 8: Trả về success response
Bước 9: Frontend cập nhật UI (xóa application khỏi danh sách)
Bước 10: Hiển thị thông báo "Đã rút đơn thành công"
```

**Ví dụ thực tế:**
- Ứng viên đã apply job "Frontend Developer"
- Sau 2 ngày, quyết định rút đơn
- Click "Rút đơn" → Xác nhận
- Hệ thống:
  - Xóa application
  - Giảm applicationsCount của job từ 25 → 24
  - Xóa notification của employer
  - Gửi email xác nhận cho cả 2 bên

**Tại sao cần rollback?**
- Đảm bảo tính toàn vẹn dữ liệu
- Nếu step 3 thành công nhưng step 4 fail → Dữ liệu sẽ không đồng bộ
- Transaction đảm bảo: Hoặc tất cả thành công, hoặc không có gì thay đổi


---

## TÓM TẮT KIẾN TRÚC HỆ THỐNG

### Phân chia trách nhiệm giữa MongoDB và Neo4j:

**MongoDB (Document Database):**
- Lưu trữ dữ liệu chính: Users, Jobs, Applications, Companies
- Xử lý CRUD operations
- Thống kê và báo cáo
- Tìm kiếm với nhiều bộ lọc
- Quản lý transactions

**Neo4j (Graph Database):**
- Lưu trữ relationships: VIEWED, SAVED, APPLIED, HAS_SKILL, REQUIRES_SKILL
- Tính toán matching score
- Gợi ý thông minh (recommendations)
- Phân tích mạng lưới kết nối
- Tìm kiếm dựa trên graph patterns

### Luồng dữ liệu tổng quát:

```
1. User Action (Frontend)
   ↓
2. API Request (HTTP/REST)
   ↓
3. Authentication & Authorization (JWT)
   ↓
4. Business Logic (Controllers)
   ↓
5. Data Access Layer
   ├─→ MongoDB (for data storage)
   └─→ Neo4j (for relationships)
   ↓
6. Response Processing
   ↓
7. JSON Response (Frontend)
   ↓
8. UI Update (React)
```

### Ưu điểm của kiến trúc hybrid:

1. **Performance:** MongoDB nhanh cho CRUD, Neo4j nhanh cho graph queries
2. **Scalability:** Mỗi database scale độc lập
3. **Flexibility:** Chọn database phù hợp cho từng use case
4. **Maintainability:** Tách biệt concerns, dễ maintain

### Các pattern được sử dụng:

1. **Repository Pattern:** Tách logic truy vấn database
2. **Service Layer:** Business logic tách biệt khỏi controllers
3. **DTO Pattern:** Data Transfer Objects cho API responses
4. **Transaction Pattern:** Đảm bảo data consistency
5. **Aggregation Pipeline:** Xử lý dữ liệu phức tạp trong MongoDB
6. **Cypher Queries:** Graph traversal trong Neo4j

