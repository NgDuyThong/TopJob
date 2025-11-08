# Scripts Documentation

## 📁 Available Scripts

### 🔄 Production Scripts (Quan trọng)

#### 1. `syncToNeo4j.js`
**Mục đích**: Đồng bộ dữ liệu từ MongoDB sang Neo4j

**Khi nào dùng**:
- Lần đầu setup Neo4j
- Khi có data mới trong MongoDB cần sync
- Sau khi thêm nhiều candidates/jobs mới

**Cách chạy**:
```bash
node backend/src/scripts/syncToNeo4j.js
```

**Kết quả**: Sync toàn bộ Candidates, Employers, Jobs và Skills vào Neo4j

---

#### 2. `seedData.js`
**Mục đích**: Tạo dữ liệu mẫu cho MongoDB

**Khi nào dùng**:
- Lần đầu setup database
- Cần reset và tạo lại data

**Cách chạy**:
```bash
node backend/src/scripts/seedData.js
```

---

#### 3. `initNeo4j.js`
**Mục đích**: Khởi tạo constraints và indexes cho Neo4j

**Khi nào dùng**:
- Lần đầu setup Neo4j
- Sau khi clear database

**Cách chạy**:
```bash
node backend/src/scripts/initNeo4j.js
```

---

### 🧪 Testing & Verification Scripts

#### 4. `testRecommendations.js`
**Mục đích**: Test 2 chức năng recommendation

**Cách chạy**:
```bash
node backend/src/scripts/testRecommendations.js
```

**Kết quả**: Hiển thị matching jobs và candidates với match scores

---

#### 5. `verifyNeo4jUsage.js`
**Mục đích**: Xác nhận API đang dùng Neo4j hay MongoDB

**Cách chạy**:
```bash
node backend/src/scripts/verifyNeo4jUsage.js
```

**Kết quả**: So sánh performance và confirm data source

---

#### 6. `checkNeo4jData.js`
**Mục đích**: Kiểm tra dữ liệu trong Neo4j

**Cách chạy**:
```bash
node backend/src/scripts/checkNeo4jData.js
```

**Kết quả**: Hiển thị số lượng nodes và relationships

---

## 🚀 Quick Start Guide

### Lần đầu setup:
```bash
# 1. Seed MongoDB data
node backend/src/scripts/seedData.js

# 2. Init Neo4j constraints
node backend/src/scripts/initNeo4j.js

# 3. Sync data to Neo4j
node backend/src/scripts/syncToNeo4j.js

# 4. Verify everything works
node backend/src/scripts/testRecommendations.js
```

### Khi cần update data:
```bash
# Sync lại data từ MongoDB sang Neo4j
node backend/src/scripts/syncToNeo4j.js
```

### Khi cần kiểm tra:
```bash
# Check Neo4j data
node backend/src/scripts/checkNeo4jData.js

# Verify API usage
node backend/src/scripts/verifyNeo4jUsage.js

# Test recommendations
node backend/src/scripts/testRecommendations.js
```

---

## ⚠️ Lưu ý

- Tất cả scripts đều cần file `.env` được config đúng
- Neo4j phải đang chạy trước khi chạy các scripts
- MongoDB phải có data trước khi sync sang Neo4j
