# MongoDB Queries cho Reports

## 1. Dashboard Statistics (Thống kê tổng quan)

### Endpoint: GET /api/admin/reports/dashboard

```javascript
// 1. Tổng số users
db.accounts.countDocuments()

// 2. Tổng số candidates
db.accounts.countDocuments({ type: 'candidate' })

// 3. Tổng số employers
db.accounts.countDocuments({ type: 'employer' })

// 4. Tổng số jobs
db.jobposts.countDocuments()

// 5. Jobs đang active
db.jobposts.countDocuments({ status: 'open' })

// 6. Tổng số applications
db.applications.countDocuments()

// 7. Applications đang pending
db.applications.countDocuments({ 'status.name': 'Submitted' })

// 8. Tổng số views của tất cả jobs
db.jobposts.aggregate([
  {
    $group: {
      _id: null,
      totalViews: { $sum: '$views' },
      totalJobs: { $sum: 1 }
    }
  }
])
```

## 2. User Registration Trend (Xu hướng đăng ký người dùng)

### Endpoint: GET /api/admin/reports?type=users&startDate=2025-01-01&endDate=2025-12-31

```javascript
// Báo cáo theo ngày
db.accounts.aggregate([
  {
    $match: {
      createdAt: {
        $gte: new Date('2025-01-01T00:00:00.000Z'),
        $lte: new Date('2025-12-31T23:59:59.999Z')
      }
    }
  },
  {
    $group: {
      _id: {
        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
      },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  },
  {
    $project: {
      _id: 0,
      date: '$_id',
      count: 1
    }
  }
])

// Báo cáo theo tháng
db.accounts.aggregate([
  {
    $match: {
      createdAt: {
        $gte: new Date('2025-01-01T00:00:00.000Z'),
        $lte: new Date('2025-12-31T23:59:59.999Z')
      }
    }
  },
  {
    $group: {
      _id: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { '_id.year': 1, '_id.month': 1 }
  }
])
```

## 3. Time Range Summary (Báo cáo tổng hợp theo thời gian)

### Endpoint: GET /api/admin/reports/summary?startDate=2025-01-01&endDate=2025-12-31

```javascript
// 1. Tổng số users mới trong khoảng thời gian
db.accounts.countDocuments({
  createdAt: {
    $gte: new Date('2025-01-01T00:00:00.000Z'),
    $lte: new Date('2025-12-31T23:59:59.999Z')
  }
})

// 2. Tổng số jobs mới
db.jobposts.countDocuments({
  datePosted: {
    $gte: new Date('2025-01-01T00:00:00.000Z'),
    $lte: new Date('2025-12-31T23:59:59.999Z')
  }
})

// 3. Tổng số applications mới
db.applications.countDocuments({
  submitDate: {
    $gte: new Date('2025-01-01T00:00:00.000Z'),
    $lte: new Date('2025-12-31T23:59:59.999Z')
  }
})

// 4. Nhóm users theo role (type)
db.accounts.aggregate([
  {
    $match: {
      createdAt: {
        $gte: new Date('2025-01-01T00:00:00.000Z'),
        $lte: new Date('2025-12-31T23:59:59.999Z')
      }
    }
  },
  {
    $group: {
      _id: '$type',
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      role: '$_id',
      count: 1
    }
  }
])

// 5. Nhóm jobs theo status
db.jobposts.aggregate([
  {
    $match: {
      datePosted: {
        $gte: new Date('2025-01-01T00:00:00.000Z'),
        $lte: new Date('2025-12-31T23:59:59.999Z')
      }
    }
  },
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      status: '$_id',
      count: 1
    }
  }
])

// Tổng hợp tất cả trong một query với $facet
db.accounts.aggregate([
  {
    $facet: {
      "newUsers": [
        {
          $match: {
            createdAt: {
              $gte: new Date('2025-01-01T00:00:00.000Z'),
              $lte: new Date('2025-12-31T23:59:59.999Z')
            }
          }
        },
        { $count: "total" }
      ],
      "usersByRole": [
        {
          $match: {
            createdAt: {
              $gte: new Date('2025-01-01T00:00:00.000Z'),
              $lte: new Date('2025-12-31T23:59:59.999Z')
            }
          }
        },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]
    }
  }
])
```

## Test Queries

### Tạo dữ liệu test (nếu cần)

```javascript
// Insert test accounts
db.accounts.insertMany([
  {
    email: 'candidate1@test.com',
    type: 'candidate',
    createdAt: new Date('2025-11-01')
  },
  {
    email: 'employer1@test.com',
    type: 'employer',
    createdAt: new Date('2025-11-15')
  }
])

// Insert test job posts
db.jobposts.insertMany([
  {
    title: 'Test Job 1',
    status: 'open',
    views: 100,
    datePosted: new Date('2025-11-10')
  },
  {
    title: 'Test Job 2',
    status: 'closed',
    views: 50,
    datePosted: new Date('2025-11-20')
  }
])

// Insert test applications
db.applications.insertMany([
  {
    status: { name: 'Submitted' },
    submitDate: new Date('2025-11-12')
  },
  {
    status: { name: 'Reviewed' },
    submitDate: new Date('2025-11-18')
  }
])
```

## Giải thích

1. **Dashboard Statistics**: Sử dụng `countDocuments()` và `aggregate()` để lấy thống kê tổng quan không phụ thuộc vào thời gian.

2. **User Registration Trend**: Sử dụng `$dateToString` để nhóm theo ngày, `$year` và `$month` để nhóm theo tháng.

3. **Time Range Summary**: Kết hợp `countDocuments()` với date range filter và `aggregate()` để nhóm theo các trường khác nhau.

4. **Performance**: Sử dụng `Promise.all()` trong backend để chạy các queries song song, tối ưu thời gian phản hồi.
