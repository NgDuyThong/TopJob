import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Import models
import Account from '../models/Account.js';
import Candidate from '../models/Candidate.js';
import Employer from '../models/Employer.js';
import JobPost from '../models/JobPost.js';
import Application from '../models/Application.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('🌱 Starting to seed data...');

    // Clear existing data
    await Account.deleteMany({});
    await Candidate.deleteMany({});
    await Employer.deleteMany({});
    await JobPost.deleteMany({});
    await Application.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Create sample employers
    const employers = [
      {
        companyName: 'FPT Software',
        field: 'Công nghệ thông tin',
        email: 'hr@fpt.com',
        phone: '024 7300 1866',
        address: '17 Duy Tân, Cầu Giấy, Hà Nội',
        description: 'Công ty phần mềm hàng đầu Việt Nam',
        website: 'https://fpt-software.com',
        companySize: '500+ nhân viên'
      },
      {
        companyName: 'Vietcombank',
        field: 'Ngân hàng',
        email: 'hr@vietcombank.com',
        phone: '024 3934 3934',
        address: '198 Trần Quang Khải, Hoàn Kiếm, Hà Nội',
        description: 'Ngân hàng thương mại cổ phần Ngoại thương Việt Nam',
        website: 'https://vietcombank.com.vn',
        companySize: '500+ nhân viên'
      },
      {
        companyName: 'VinGroup',
        field: 'Bất động sản',
        email: 'hr@vingroup.net',
        phone: '024 3974 9999',
        address: '7 Điện Biên Phủ, Ba Đình, Hà Nội',
        description: 'Tập đoàn đa ngành hàng đầu Việt Nam',
        website: 'https://vingroup.net',
        companySize: '500+ nhân viên'
      },
      {
        companyName: 'Shopee Vietnam',
        field: 'Thương mại điện tử',
        email: 'hr@shopee.vn',
        phone: '028 3820 8888',
        address: 'Tầng 4, Tòa nhà Viettel, 285 Cách Mạng Tháng 8, Q10, TP.HCM',
        description: 'Nền tảng thương mại điện tử hàng đầu Đông Nam Á',
        website: 'https://shopee.vn',
        companySize: '100-500 nhân viên'
      }
    ];

    const createdEmployers = await Employer.insertMany(employers);
    console.log('✅ Created employers');

    // Create sample candidates
    const candidates = [
      {
        fullName: 'Nguyễn Văn An',
        email: 'nguyenvanan@gmail.com',
        phone: '0123456789',
        gender: 'Nam',
        birthDate: new Date('1995-05-15'),
        education: 'Đại học Bách Khoa Hà Nội - Công nghệ thông tin',
        experience: '3 năm kinh nghiệm phát triển web',
        skills: [
          { name: 'JavaScript', level: 'advanced' },
          { name: 'React', level: 'advanced' },
          { name: 'Node.js', level: 'intermediate' }
        ],
        summary: 'Lập trình viên frontend với 3 năm kinh nghiệm, chuyên về React và JavaScript'
      },
      {
        fullName: 'Trần Thị Bình',
        email: 'tranthibinh@gmail.com',
        phone: '0987654321',
        gender: 'Nữ',
        birthDate: new Date('1992-08-20'),
        education: 'Đại học Kinh tế Quốc dân - Kế toán',
        experience: '5 năm kinh nghiệm kế toán',
        skills: [
          { name: 'Kế toán', level: 'advanced' },
          { name: 'Excel', level: 'advanced' },
          { name: 'SAP', level: 'intermediate' }
        ],
        summary: 'Kế toán viên với 5 năm kinh nghiệm, thành thạo các phần mềm kế toán'
      },
      {
        fullName: 'Lê Minh Cường',
        email: 'leminhcuong@gmail.com',
        phone: '0369852147',
        gender: 'Nam',
        birthDate: new Date('1990-12-10'),
        education: 'Đại học Ngoại thương - Marketing',
        experience: '7 năm kinh nghiệm marketing',
        skills: [
          { name: 'Digital Marketing', level: 'advanced' },
          { name: 'SEO', level: 'advanced' },
          { name: 'Google Ads', level: 'advanced' }
        ],
        summary: 'Chuyên viên marketing với 7 năm kinh nghiệm, chuyên về digital marketing'
      }
    ];

    const createdCandidates = await Candidate.insertMany(candidates);
    console.log('✅ Created candidates');

    // Create accounts
    const accounts = [
      {
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        type: 'admin',
        status: 'active'
      },
      {
        username: 'employer1',
        password: await bcrypt.hash('employer123', 10),
        type: 'employer',
        status: 'active',
        employerId: createdEmployers[0]._id
      },
      {
        username: 'employer2',
        password: await bcrypt.hash('employer123', 10),
        type: 'employer',
        status: 'active',
        employerId: createdEmployers[1]._id
      },
      {
        username: 'candidate1',
        password: await bcrypt.hash('candidate123', 10),
        type: 'candidate',
        status: 'active',
        candidateId: createdCandidates[0]._id
      },
      {
        username: 'candidate2',
        password: await bcrypt.hash('candidate123', 10),
        type: 'candidate',
        status: 'active',
        candidateId: createdCandidates[1]._id
      }
    ];

    const createdAccounts = await Account.insertMany(accounts);
    console.log('✅ Created accounts');

    // Create sample job posts
    const jobPosts = [
      {
        employerId: createdEmployers[0]._id,
        title: 'Frontend Developer (React)',
        description: 'Chúng tôi đang tìm kiếm một Frontend Developer có kinh nghiệm với React để tham gia vào đội ngũ phát triển sản phẩm. Bạn sẽ làm việc với các công nghệ hiện đại và có cơ hội phát triển nghề nghiệp trong môi trường năng động.',
        position: {
          title: 'Frontend Developer',
          level: 'Senior',
          type: 'Full-time',
          workMode: 'Hybrid'
        },
        skillsRequired: [
          { name: 'React', level: 'advanced' },
          { name: 'JavaScript', level: 'advanced' },
          { name: 'TypeScript', level: 'intermediate' },
          { name: 'CSS', level: 'advanced' }
        ],
        location: {
          city: 'Hà Nội',
          address: '17 Duy Tân, Cầu Giấy, Hà Nội'
        },
        salary: '15-25 triệu VNĐ',
        language: 'Tiếng Việt',
        deadline: new Date('2024-12-31'),
        status: 'open'
      },
      {
        employerId: createdEmployers[1]._id,
        title: 'Kế toán viên',
        description: 'Tìm kiếm kế toán viên có kinh nghiệm để tham gia vào đội ngũ tài chính. Công việc bao gồm xử lý các giao dịch tài chính, lập báo cáo và đảm bảo tuân thủ các quy định kế toán.',
        position: {
          title: 'Kế toán viên',
          level: 'Junior',
          type: 'Full-time',
          workMode: 'On-site'
        },
        skillsRequired: [
          { name: 'Kế toán', level: 'intermediate' },
          { name: 'Excel', level: 'advanced' },
          { name: 'SAP', level: 'basic' }
        ],
        location: {
          city: 'Hà Nội',
          address: '198 Trần Quang Khải, Hoàn Kiếm, Hà Nội'
        },
        salary: '8-12 triệu VNĐ',
        language: 'Tiếng Việt',
        deadline: new Date('2024-12-25'),
        status: 'open'
      },
      {
        employerId: createdEmployers[2]._id,
        title: 'Marketing Manager',
        description: 'Chúng tôi cần một Marketing Manager có kinh nghiệm để phát triển và thực hiện các chiến lược marketing. Bạn sẽ chịu trách nhiệm quản lý đội ngũ marketing và đảm bảo đạt được các mục tiêu kinh doanh.',
        position: {
          title: 'Marketing Manager',
          level: 'Manager',
          type: 'Full-time',
          workMode: 'Hybrid'
        },
        skillsRequired: [
          { name: 'Digital Marketing', level: 'advanced' },
          { name: 'SEO', level: 'advanced' },
          { name: 'Google Ads', level: 'advanced' },
          { name: 'Facebook Ads', level: 'intermediate' }
        ],
        location: {
          city: 'Hà Nội',
          address: '7 Điện Biên Phủ, Ba Đình, Hà Nội'
        },
        salary: '20-30 triệu VNĐ',
        language: 'Tiếng Việt',
        deadline: new Date('2024-12-20'),
        status: 'open'
      },
      {
        employerId: createdEmployers[3]._id,
        title: 'Backend Developer (Node.js)',
        description: 'Tìm kiếm Backend Developer có kinh nghiệm với Node.js để phát triển các API và microservices. Bạn sẽ làm việc trong môi trường startup năng động với cơ hội học hỏi nhiều công nghệ mới.',
        position: {
          title: 'Backend Developer',
          level: 'Senior',
          type: 'Full-time',
          workMode: 'Remote'
        },
        skillsRequired: [
          { name: 'Node.js', level: 'advanced' },
          { name: 'MongoDB', level: 'intermediate' },
          { name: 'Express.js', level: 'advanced' },
          { name: 'Docker', level: 'basic' }
        ],
        location: {
          city: 'TP Hồ Chí Minh',
          address: 'Tầng 4, Tòa nhà Viettel, 285 Cách Mạng Tháng 8, Q10, TP.HCM'
        },
        salary: '18-28 triệu VNĐ',
        language: 'Tiếng Việt',
        deadline: new Date('2024-12-28'),
        status: 'open'
      },
      {
        employerId: createdEmployers[0]._id,
        title: 'UI/UX Designer',
        description: 'Chúng tôi đang tìm kiếm một UI/UX Designer sáng tạo để thiết kế các giao diện người dùng đẹp và trải nghiệm người dùng tốt. Bạn sẽ làm việc với đội ngũ phát triển để tạo ra các sản phẩm digital chất lượng cao.',
        position: {
          title: 'UI/UX Designer',
          level: 'Junior',
          type: 'Full-time',
          workMode: 'Hybrid'
        },
        skillsRequired: [
          { name: 'Figma', level: 'advanced' },
          { name: 'Adobe XD', level: 'intermediate' },
          { name: 'Photoshop', level: 'intermediate' },
          { name: 'Sketch', level: 'basic' }
        ],
        location: {
          city: 'Hà Nội',
          address: '17 Duy Tân, Cầu Giấy, Hà Nội'
        },
        salary: '10-18 triệu VNĐ',
        language: 'Tiếng Việt',
        deadline: new Date('2024-12-22'),
        status: 'open'
      }
    ];

    const createdJobPosts = await JobPost.insertMany(jobPosts);
    console.log('✅ Created job posts');

    // Create sample applications
    const applications = [
      {
        candidateId: createdCandidates[0]._id,
        jobpostId: createdJobPosts[0]._id,
        resumeFile: 'resume_nguyen_van_an.pdf',
        coverLetter: 'Tôi rất quan tâm đến vị trí Frontend Developer tại công ty. Với 3 năm kinh nghiệm làm việc với React, tôi tin rằng mình có thể đóng góp tích cực cho dự án.',
        status: {
          name: 'Submitted',
          updatedAt: new Date()
        },
        jobSummary: {
          title: createdJobPosts[0].title,
          employerName: createdEmployers[0].companyName
        },
        candidateSummary: {
          fullName: createdCandidates[0].fullName,
          email: createdCandidates[0].email
        }
      },
      {
        candidateId: createdCandidates[1]._id,
        jobpostId: createdJobPosts[1]._id,
        resumeFile: 'resume_tran_thi_binh.pdf',
        coverLetter: 'Tôi có 5 năm kinh nghiệm trong lĩnh vực kế toán và rất mong muốn được làm việc tại ngân hàng uy tín như Vietcombank.',
        status: {
          name: 'Reviewed',
          updatedAt: new Date()
        },
        jobSummary: {
          title: createdJobPosts[1].title,
          employerName: createdEmployers[1].companyName
        },
        candidateSummary: {
          fullName: createdCandidates[1].fullName,
          email: createdCandidates[1].email
        }
      },
      {
        candidateId: createdCandidates[2]._id,
        jobpostId: createdJobPosts[2]._id,
        resumeFile: 'resume_le_minh_cuong.pdf',
        coverLetter: 'Với 7 năm kinh nghiệm marketing và thành thạo digital marketing, tôi tin rằng mình có thể giúp công ty đạt được các mục tiêu kinh doanh.',
        status: {
          name: 'Interviewed',
          updatedAt: new Date()
        },
        jobSummary: {
          title: createdJobPosts[2].title,
          employerName: createdEmployers[2].companyName
        },
        candidateSummary: {
          fullName: createdCandidates[2].fullName,
          email: createdCandidates[2].email
        }
      }
    ];

    const createdApplications = await Application.insertMany(applications);
    console.log('✅ Created applications');

    // Update job posts with applications count
    for (let i = 0; i < createdJobPosts.length; i++) {
      const jobId = createdJobPosts[i]._id;
      const applicationsCount = await Application.countDocuments({ jobpostId: jobId });
      await JobPost.findByIdAndUpdate(jobId, { applicationsCount });
    }

    // Update employers with job posts
    for (let i = 0; i < createdEmployers.length; i++) {
      const employerId = createdEmployers[i]._id;
      const jobPosts = await JobPost.find({ employerId }).select('_id title deadline');
      await Employer.findByIdAndUpdate(employerId, { jobPosts });
    }

    console.log('🎉 Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${createdEmployers.length} employers created`);
    console.log(`- ${createdCandidates.length} candidates created`);
    console.log(`- ${createdAccounts.length} accounts created`);
    console.log(`- ${createdJobPosts.length} job posts created`);
    console.log(`- ${createdApplications.length} applications created`);
    
    console.log('\n🔑 Test accounts:');
    console.log('Admin: username=admin, password=admin123');
    console.log('Employer: username=employer1, password=employer123');
    console.log('Candidate: username=candidate1, password=candidate123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
connectDB().then(() => {
  seedData();
});
