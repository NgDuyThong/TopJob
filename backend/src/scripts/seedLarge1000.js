import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

import Account from '../models/Account.js';
import Candidate from '../models/Candidate.js';
import Employer from '../models/Employer.js';
import JobPost from '../models/JobPost.js';
import Application from '../models/Application.js';

// Vietnamese names - Expanded
const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Trương', 'Đinh', 'Đoàn', 'Lưu'];
const middleNames = ['Văn', 'Thị', 'Minh', 'Thu', 'Anh', 'Đức', 'Hồng', 'Thanh', 'Quang', 'Hải', 'Tuấn', 'Phương', 'Thùy', 'Ngọc', 'Bảo', 'Khánh', 'Hoàng', 'Tùng', 'Linh', 'Kim'];
const lastNames = ['Anh', 'Bình', 'Chi', 'Dũng', 'Hà', 'Hòa', 'Hương', 'Linh', 'Long', 'Mai', 'Nam', 'Phúc', 'Quân', 'Sơn', 'Tâm', 'Thảo', 'Trung', 'Tú', 'Việt', 'Xuân', 'Yến', 'Uyên', 'Khoa', 'Hiếu', 'Đạt'];

const companies = [
  'FPT Software', 'VNG Corporation', 'Vietcombank', 'BIDV', 'Techcombank', 'VIB', 
  'VinGroup', 'Viettel', 'VNPT', 'MobiFone', 'Masan Group', 'Vinamilk',
  'TechcomBank', 'MB Bank', 'ACB', 'SHB', 'VPBank', 'Sacombank',
  'Vietjet Air', 'Vietnam Airlines', 'Bamboo Airways', 'Grab Vietnam',
  'Shopee Vietnam', 'Lazada Vietnam', 'Tiki', 'Sendo',
  'VNG Games', 'Garena Vietnam', 'Gameloft', 'Riot Games Vietnam',
  'Samsung Vietnam', 'LG Vietnam', 'Honda Vietnam', 'Toyota Vietnam',
  'Nestle Vietnam', 'Unilever Vietnam', 'P&G Vietnam', 'Coca-Cola Vietnam',
  'Agribank', 'VietinBank', 'HDBank', 'TPBank', 'SeABank', 'MSB',
  'Tan Hiep Phat', 'Trung Nguyen', 'Bach Hoa Xanh', 'Mobile World'
];

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
const streets = ['Lê Lợi', 'Trần Hưng Đạo', 'Nguyễn Huệ', 'Hai Bà Trưng', 'Võ Văn Tần', 'Lý Thường Kiệt', 'Hoàng Văn Thụ', 'Điện Biên Phủ'];
const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'TypeScript', 'Vue.js', 'Angular', 'Spring Boot', 'Django'];
const companySizes = ['1-10 nhân viên', '10-50 nhân viên', '50-100 nhân viên', '100-500 nhân viên', '500+ nhân viên'];
const levels = ['Intern', 'Junior', 'Senior', 'Manager'];
const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const workModes = ['On-site', 'Remote', 'Hybrid'];
const educationLevels = ['Trung cấp', 'Cao đẳng', 'Đại học', 'Thạc sĩ', 'Tiến sĩ'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

function generateVietnameseName() {
  return `${randomItem(firstNames)} ${randomItem(middleNames)} ${randomItem(lastNames)}`;
}

// Convert Vietnamese name to username (remove accents)
function nameToUsername(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/\s+/g, '.');
}

function generateEmail(name, index) {
  const username = nameToUsername(name);
  return `${username}${index}@gmail.com`;
}

function generateUsername(name, index) {
  const username = nameToUsername(name);
  return `${username}${index}`;
}

function generatePhone() {
  const prefixes = ['090', '091', '093', '094', '096', '097', '098', '099', '032', '033', '034', '035', '036', '037', '038', '039', '086', '088'];
  return `${randomItem(prefixes)}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
}

async function clearDatabase() {
  console.log('🗑️  Xóa dữ liệu cũ...');
  await Promise.all([
    Account.deleteMany({}),
    Candidate.deleteMany({}),
    Employer.deleteMany({}),
    JobPost.deleteMany({}),
    Application.deleteMany({})
  ]);
  console.log('✅ Đã xóa xong\n');
}

async function seedCandidates(startIndex, count, hashedPassword) {
  console.log(`👥 Tạo ${count} Candidates (${startIndex + 1} - ${startIndex + count})...`);
  
  const candidateDocs = [];
  const candidateAccountDocs = [];
  
  for (let i = 0; i < count; i++) {
    const name = generateVietnameseName();
    const email = generateEmail(name, startIndex + i + 1);
    const username = generateUsername(name, startIndex + i + 1);
    
    candidateAccountDocs.push({
      username: username,
      email: email,
      password: hashedPassword,
      type: 'candidate',
      status: 'active'
    });
    
    candidateDocs.push({
      fullName: name,
      email: email,
      phone: generatePhone(),
      address: `${Math.floor(Math.random() * 500) + 1} ${randomItem(streets)}, ${randomItem(cities)}`,
      birthDate: new Date(1985 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      gender: Math.random() > 0.5 ? 'Nam' : 'Nữ',
      skills: randomItems(skills, Math.floor(Math.random() * 5) + 3).map(skill => ({
        name: skill,
        level: randomItem(['basic', 'intermediate', 'advanced'])
      })),
      experience: `${Math.floor(Math.random() * 10)} năm`,
      education: randomItem(educationLevels),
      desiredPosition: randomItem(Object.values(jobTitles).flat()),
      desiredSalary: `${Math.floor(Math.random() * 20) + 10}-${Math.floor(Math.random() * 30) + 30} triệu VNĐ`
    });
  }
  
  const insertedAccounts = await Account.insertMany(candidateAccountDocs);
  candidateDocs.forEach((doc, idx) => {
    doc.accountId = insertedAccounts[idx]._id;
  });
  
  const insertedCandidates = await Candidate.insertMany(candidateDocs);
  console.log(`  ✓ Đã tạo ${insertedCandidates.length} candidates\n`);
  
  return insertedCandidates;
}

async function seedEmployers(startIndex, count, hashedPassword) {
  console.log(`🏢 Tạo ${count} Employers (${startIndex + 1} - ${startIndex + count})...`);
  
  const employerDocs = [];
  const employerAccountDocs = [];
  
  for (let i = 0; i < count; i++) {
    const companyIndex = startIndex + i;
    const baseCompany = randomItem(companies);
    const companyName = companyIndex < 50 ? baseCompany : `${baseCompany} Chi nhánh ${companyIndex}`;
    const email = `hr${companyIndex + 1}@${nameToUsername(baseCompany)}${companyIndex}.vn`;
    const username = `company${companyIndex + 1}`;
    
    employerAccountDocs.push({
      username: username,
      email: email,
      password: hashedPassword,
      type: 'employer',
      status: 'active'
    });
    
    employerDocs.push({
      companyName: companyName,
      email: email,
      phone: generatePhone(),
      address: `Tầng ${Math.floor(Math.random() * 20) + 1}, ${Math.floor(Math.random() * 500) + 1} ${randomItem(streets)}, ${randomItem(cities)}`,
      website: `https://www.${nameToUsername(baseCompany)}${companyIndex}.vn`,
      field: randomItem(Object.keys(jobTitles)),
      description: `${companyName} là công ty hàng đầu trong lĩnh vực ${randomItem(Object.keys(jobTitles))}. Chúng tôi cung cấp môi trường làm việc chuyên nghiệp, năng động và nhiều cơ hội phát triển.`,
      companySize: randomItem(companySizes),
      foundedYear: 1990 + Math.floor(Math.random() * 35)
    });
  }
  
  const insertedAccounts = await Account.insertMany(employerAccountDocs);
  employerDocs.forEach((doc, idx) => {
    doc.accountId = insertedAccounts[idx]._id;
  });
  
  const insertedEmployers = await Employer.insertMany(employerDocs);
  console.log(`  ✓ Đã tạo ${insertedEmployers.length} employers\n`);
  
  return insertedEmployers;
}

async function seedJobPosts(employers, startIndex, count) {
  console.log(`💼 Tạo ${count} Job Posts (${startIndex + 1} - ${startIndex + count})...`);
  
  const jobPostDocs = [];
  
  for (let i = 0; i < count; i++) {
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
      language: randomItem(['Tiếng Việt', 'Tiếng Anh', 'Tiếng Việt, Tiếng Anh', 'Tiếng Anh, Tiếng Trung']),
      deadline: new Date(Date.now() + Math.floor(Math.random() * 90 + 30) * 24 * 60 * 60 * 1000),
      status: 'open',
      datePosted: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      views: Math.floor(Math.random() * 1000),
      applicationsCount: Math.floor(Math.random() * 50)
    });
  }
  
  const insertedJobPosts = await JobPost.insertMany(jobPostDocs);
  console.log(`  ✓ Đã tạo ${insertedJobPosts.length} job posts\n`);
  
  return insertedJobPosts;
}

async function seedApplications(candidates, jobPosts, employers, startIndex, count) {
  console.log(`📝 Tạo ${count} Applications (${startIndex + 1} - ${startIndex + count})...`);
  
  const applicationDocs = [];
  
  for (let i = 0; i < count; i++) {
    const candidate = randomItem(candidates);
    const jobPost = randomItem(jobPosts);
    const employer = employers.find(e => e._id.equals(jobPost.employerId));
    
    applicationDocs.push({
      candidateId: candidate._id,
      jobpostId: jobPost._id,
      resumeFile: `resumes/resume_${candidate._id}_${Date.now()}_${i}.pdf`,
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
  
  const insertedApplications = await Application.insertMany(applicationDocs);
  console.log(`  ✓ Đã tạo ${insertedApplications.length} applications\n`);
  
  return insertedApplications;
}

async function seedDatabase() {
  try {
    console.log('🔍 Kết nối MongoDB Atlas...');
    console.log('URI:', process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Kết nối thành công!\n');

    const hashedPassword = await bcrypt.hash('123456', 10);
    console.log('✅ Password đã hash: 123456\n');

    // Clear old data
    await clearDatabase();

    // Seed in batches
    const BATCH_SIZE = 250;
    let allCandidates = [];
    let allEmployers = [];
    let allJobPosts = [];

    // === BATCH 1: Seed 1200 Candidates in batches of 250 ===
    console.log('='.repeat(60));
    console.log('BƯỚC 1: TẠO 1200 CANDIDATES');
    console.log('='.repeat(60));
    for (let i = 0; i < 1200; i += BATCH_SIZE) {
      const count = Math.min(BATCH_SIZE, 1200 - i);
      const candidates = await seedCandidates(i, count, hashedPassword);
      allCandidates.push(...candidates);
    }

    // === BATCH 2: Seed 1000 Employers in batches of 250 ===
    console.log('='.repeat(60));
    console.log('BƯỚC 2: TẠO 1000 EMPLOYERS');
    console.log('='.repeat(60));
    for (let i = 0; i < 1000; i += BATCH_SIZE) {
      const count = Math.min(BATCH_SIZE, 1000 - i);
      const employers = await seedEmployers(i, count, hashedPassword);
      allEmployers.push(...employers);
    }

    // === BATCH 3: Seed 1500 Job Posts in batches of 250 ===
    console.log('='.repeat(60));
    console.log('BƯỚC 3: TẠO 1500 JOB POSTS');
    console.log('='.repeat(60));
    for (let i = 0; i < 1500; i += BATCH_SIZE) {
      const count = Math.min(BATCH_SIZE, 1500 - i);
      const jobPosts = await seedJobPosts(allEmployers, i, count);
      allJobPosts.push(...jobPosts);
    }

    // === BATCH 4: Seed 1200 Applications in batches of 250 ===
    console.log('='.repeat(60));
    console.log('BƯỚC 4: TẠO 1200 APPLICATIONS');
    console.log('='.repeat(60));
    for (let i = 0; i < 1200; i += BATCH_SIZE) {
      const count = Math.min(BATCH_SIZE, 1200 - i);
      await seedApplications(allCandidates, allJobPosts, allEmployers, i, count);
    }

    // === STATISTICS ===
    console.log('\n' + '='.repeat(60));
    console.log('📊 THỐNG KÊ CUỐI CÙNG');
    console.log('='.repeat(60));
    
    const counts = await Promise.all([
      Account.countDocuments(),
      Candidate.countDocuments(),
      Employer.countDocuments(),
      JobPost.countDocuments(),
      Application.countDocuments()
    ]);
    
    console.log(`Accounts:     ${counts[0].toString().padStart(6)}`);
    console.log(`Candidates:   ${counts[1].toString().padStart(6)}`);
    console.log(`Employers:    ${counts[2].toString().padStart(6)}`);
    console.log(`Job Posts:    ${counts[3].toString().padStart(6)}`);
    console.log(`Applications: ${counts[4].toString().padStart(6)}`);
    console.log('='.repeat(60));

    // Statistics by category
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

    // Sample data
    console.log('\n🔍 SAMPLE DATA (3 candidates đầu tiên):');
    const sampleCandidates = await Candidate.find().limit(3).populate('accountId');
    sampleCandidates.forEach((candidate, idx) => {
      console.log(`\n${idx + 1}. ${candidate.fullName}`);
      console.log(`   Email: ${candidate.email}`);
      console.log(`   Username: ${candidate.accountId.username}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ HOÀN THÀNH SEED 1000+ DOCUMENTS CHO MỖI COLLECTION!');
    console.log('💡 Tất cả username được tạo từ fullName (bỏ dấu)\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ LỖI:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();
