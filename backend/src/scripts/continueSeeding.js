import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

import Candidate from '../models/Candidate.js';
import Employer from '../models/Employer.js';
import JobPost from '../models/JobPost.js';
import Application from '../models/Application.js';

const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'TypeScript', 'Vue.js', 'Angular', 'Spring Boot', 'Django'];
const jobTitles = {
  'Lập trình viên': [
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 
    'Mobile Developer', 'iOS Developer', 'Android Developer',
    'DevOps Engineer', 'Software Engineer', 'System Analyst',
    'React Developer', 'Vue.js Developer', 'Angular Developer',
    'Node.js Developer', 'Python Developer', 'Java Developer',
    '.NET Developer', 'PHP Developer', 'Go Developer'
  ],
  'Marketing': [
    'Digital Marketing Manager', 'SEO Specialist', 'Content Marketing Manager',
    'Social Media Manager', 'Marketing Executive', 'Brand Manager',
    'Performance Marketing Manager', 'Growth Hacker', 'Marketing Coordinator',
    'Product Marketing Manager', 'Email Marketing Specialist', 'PPC Specialist'
  ],
  'Kế toán': [
    'Kế toán viên', 'Kế toán trưởng', 'Kế toán tổng hợp',
    'Kiểm toán viên', 'Kế toán thuế', 'Kế toán chi phí',
    'Kế toán công nợ', 'Kế toán ngân hàng', 'Kế toán thanh toán'
  ],
  'Nhân sự': [
    'HR Manager', 'Nhân viên nhân sự', 'Tuyển dụng viên',
    'HR Executive', 'HR Business Partner', 'Talent Acquisition Specialist',
    'Chuyên viên đào tạo', 'Chuyên viên C&B', 'HR Generalist'
  ],
  'Bán hàng': [
    'Sales Manager', 'Sales Executive', 'Business Development Manager',
    'Account Manager', 'Sales Representative', 'Key Account Manager',
    'Telesales', 'B2B Sales', 'B2C Sales', 'Sales Coordinator'
  ],
  'Thiết kế': [
    'UI/UX Designer', 'Graphic Designer', 'Product Designer',
    'Web Designer', 'Motion Designer', '3D Designer',
    'Brand Designer', 'Visual Designer', 'Illustrator'
  ],
  'Kỹ thuật': [
    'Kỹ sư cơ khí', 'Kỹ sư điện', 'Kỹ sư xây dựng',
    'Kỹ sư QA/QC', 'Kỹ sư công nghệ thông tin', 'Technical Leader',
    'Kỹ sư điện tử', 'Kỹ sư tự động hóa', 'Kỹ sư sản xuất'
  ],
  'Quản lý': [
    'Project Manager', 'Product Manager', 'Operations Manager',
    'General Manager', 'Department Manager', 'Team Leader',
    'Program Manager', 'Portfolio Manager', 'Scrum Master'
  ]
};
const cities = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Nha Trang', 'Huế', 'Vũng Tàu', 'Biên Hòa', 'Thủ Đức'];
const levels = ['Intern', 'Junior', 'Senior', 'Manager'];
const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const workModes = ['On-site', 'Remote', 'Hybrid'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

async function continueSeeding() {
  try {
    console.log('🔍 Kết nối MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Kết nối thành công!\n');

    // Get existing data
    const employers = await Employer.find();
    const candidates = await Candidate.find();
    let allJobPosts = await JobPost.find();
    
    console.log('📊 Dữ liệu hiện tại:');
    console.log(`  Candidates: ${candidates.length}`);
    console.log(`  Employers: ${employers.length}`);
    console.log(`  Job Posts: ${allJobPosts.length}`);
    console.log(`  Applications: ${await Application.countDocuments()}\n`);

    // === STEP 1: Add 500 more job posts ===
    if (allJobPosts.length < 1500) {
      const needed = 1500 - allJobPosts.length;
      console.log(`💼 Thêm ${needed} Job Posts...`);
      
      const jobPostDocs = [];
      for (let i = 0; i < needed; i++) {
        const employer = randomItem(employers);
        const category = randomItem(Object.keys(jobTitles));
        const positionTitle = randomItem(jobTitles[category]);
        const salaryMin = Math.floor(Math.random() * 20) + 10;
        const salaryMax = salaryMin + Math.floor(Math.random() * 20) + 10;
        
        jobPostDocs.push({
          employerId: employer._id,
          title: positionTitle,
          description: `${employer.companyName} đang tìm kiếm ${positionTitle} có kinh nghiệm để gia nhập đội ngũ của chúng tôi.\n\nMô tả công việc:\n- Phát triển và duy trì hệ thống\n- Làm việc nhóm với các thành viên khác\n- Tham gia các dự án quan trọng\n\nĐây là cơ hội tuyệt vời để phát triển sự nghiệp trong môi trường chuyên nghiệp và năng động.`,
          position: {
            title: positionTitle,
            level: randomItem(levels),
            type: randomItem(jobTypes),
            workMode: randomItem(workModes)
          },
          skillsRequired: randomItems(skills, Math.floor(Math.random() * 5) + 3).map(skill => ({
            name: skill,
            level: randomItem(['basic', 'intermediate', 'advanced'])
          })),
          location: {
            city: randomItem(cities),
            address: employer.address
          },
          salary: `${salaryMin}-${salaryMax} triệu VNĐ`,
          language: randomItem(['Tiếng Việt', 'Tiếng Anh', 'Tiếng Việt, Tiếng Anh']),
          deadline: new Date(Date.now() + Math.floor(Math.random() * 90 + 30) * 24 * 60 * 60 * 1000),
          status: 'open',
          datePosted: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          views: Math.floor(Math.random() * 1000),
          applicationsCount: Math.floor(Math.random() * 50)
        });
        
        if ((i + 1) % 100 === 0) {
          console.log(`  ✓ Đã chuẩn bị ${i + 1}/${needed} job posts`);
        }
      }
      
      console.log(`  Đang insert ${jobPostDocs.length} job posts...`);
      const insertedJobPosts = await JobPost.insertMany(jobPostDocs);
      allJobPosts = [...allJobPosts, ...insertedJobPosts];
      console.log(`  ✓ Đã tạo ${insertedJobPosts.length} job posts\n`);
    }

    // === STEP 2: Create 1200 applications ===
    console.log('📝 Tạo 1200 Applications...');
    const BATCH_SIZE = 200;
    let totalApplications = 0;
    
    for (let batch = 0; batch < 6; batch++) {
      const applicationDocs = [];
      
      for (let i = 0; i < BATCH_SIZE; i++) {
        const candidate = randomItem(candidates);
        const jobPost = randomItem(allJobPosts);
        const employer = employers.find(e => e._id.equals(jobPost.employerId));
        
        applicationDocs.push({
          candidateId: candidate._id,
          jobpostId: jobPost._id,
          resumeFile: `resumes/resume_${candidate._id}_${Date.now()}_${totalApplications + i}.pdf`,
          coverLetter: `Kính gửi ${employer.companyName},\n\nTôi là ${candidate.fullName}, với ${candidate.experience} kinh nghiệm trong lĩnh vực ${candidate.desiredPosition}. Tôi rất quan tâm đến vị trí ${jobPost.title} tại công ty quý vị.\n\nVới các kỹ năng ${candidate.skills.map(s => s.name).join(', ')}, tôi tin rằng mình có thể đóng góp tích cực cho sự phát triển của công ty.\n\nRất mong được gặp và trao đổi thêm.\n\nTrân trọng,\n${candidate.fullName}`,
          status: {
            name: randomItem(['Submitted', 'Reviewed', 'Interviewed', 'Rejected', 'Hired']),
            updatedAt: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000)
          },
          jobSummary: {
            title: jobPost.title,
            employerName: employer.companyName
          },
          candidateSummary: {
            fullName: candidate.fullName,
            email: candidate.email
          },
          submitDate: new Date(Date.now() - Math.floor(Math.random() * 40) * 24 * 60 * 60 * 1000)
        });
      }
      
      await Application.insertMany(applicationDocs);
      totalApplications += BATCH_SIZE;
      console.log(`  ✓ Đã tạo ${totalApplications}/1200 applications`);
    }

    // === FINAL STATISTICS ===
    console.log('\n' + '='.repeat(60));
    console.log('📊 THỐNG KÊ CUỐI CÙNG');
    console.log('='.repeat(60));
    
    const finalCounts = {
      accounts: await mongoose.connection.db.collection('accounts').countDocuments(),
      candidates: await Candidate.countDocuments(),
      employers: await Employer.countDocuments(),
      jobposts: await JobPost.countDocuments(),
      applications: await Application.countDocuments()
    };
    
    console.log(`Accounts:     ${finalCounts.accounts.toString().padStart(6)}`);
    console.log(`Candidates:   ${finalCounts.candidates.toString().padStart(6)}`);
    console.log(`Employers:    ${finalCounts.employers.toString().padStart(6)}`);
    console.log(`Job Posts:    ${finalCounts.jobposts.toString().padStart(6)}`);
    console.log(`Applications: ${finalCounts.applications.toString().padStart(6)}`);
    console.log('='.repeat(60));

    // Job distribution
    console.log('\n📊 PHÂN BỐ JOB POSTS THEO NGÀNH NGHỀ:');
    console.log('='.repeat(60));
    for (const category of Object.keys(jobTitles)) {
      const titles = jobTitles[category];
      const count = await JobPost.countDocuments({
        'position.title': { $in: titles }
      });
      console.log(`${category.padEnd(20)}: ${count.toString().padStart(4)} jobs`);
    }
    console.log('='.repeat(60));

    await mongoose.connection.close();
    console.log('\n✅ HOÀN THÀNH! Database đã có 1000+ documents cho mỗi collection!\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ LỖI:', error.message);
    console.error(error);
    process.exit(1);
  }
}

continueSeeding();
