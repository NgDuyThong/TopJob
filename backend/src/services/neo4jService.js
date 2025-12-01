import neo4j from 'neo4j-driver';
import { driver } from '../config/neo4j.js';

class Neo4jService {
  // ==================== ACCOUNT OPERATIONS ====================
  
  /**
   * Tạo Account node và liên kết với Candidate/Employer
   */
  async createAccount(accountData, profileData, role) {
    const session = driver().session();
    try {
      const query = `
        MERGE (a:Account {MaTK: $accountId})
        SET a.TenDangNhap = $username,
            a.LoaiTK = $role,
            a.TrangThaiTK = $status,
            a.NgayTao = datetime($createdAt)
        WITH a
        ${role === 'candidate' ? `
          MERGE (c:Candidate {MaUV: $profileId})
          SET c.HoTen = $fullName,
              c.Email = $email,
              c.SDT = $phone,
              c.HocVan = $education,
              c.KinhNghiem = $experience,
              c.MoTaBanThan = $bio
          MERGE (a)-[:BELONGS_TO {CreatedDate: datetime()}]->(c)
          RETURN a, c
        ` : `
          MERGE (e:Employer {MaNTD: $profileId})
          SET e.TenCongTy = $companyName,
              e.Email = $email,
              e.SDT = $phone,
              e.LinhVuc = $industry,
              e.MoTaCongTy = $description,
              e.Website = $website,
              e.DiaChi = $address,
              e.QuyMo = $size
          MERGE (a)-[:BELONGS_TO {CreatedDate: datetime()}]->(e)
          RETURN a, e
        `}
      `;
      
      const params = {
        accountId: accountData._id.toString(),
        username: accountData.email,
        role: role,
        status: accountData.status || 'active',
        createdAt: accountData.createdAt?.toISOString() || new Date().toISOString(),
        profileId: profileData._id.toString(),
        email: profileData.email,
        phone: profileData.phone || '',
        fullName: profileData.fullName || '',
        education: profileData.education || '',
        experience: profileData.experience || 0,
        bio: profileData.bio || '',
        companyName: profileData.companyName || '',
        industry: profileData.industry || '',
        description: profileData.description || '',
        website: profileData.website || '',
        address: profileData.address || '',
        size: profileData.companySize || ''
      };
      
      const result = await session.run(query, params);
      return result.records[0]?.get('a').properties;
    } finally {
      await session.close();
    }
  }

  // ==================== CANDIDATE OPERATIONS ====================
  
  /**
   * Tạo hoặc cập nhật Candidate node
   */
  async createOrUpdateCandidate(candidateData) {
    const session = driver().session();
    try {
      const query = `
        MERGE (c:Candidate {MaUV: $id})
        SET c.HoTen = $hoTen,
            c.Email = $email,
            c.SDT = $sdt,
            c.NgaySinh = $ngaySinh,
            c.GioiTinh = $gioiTinh,
            c.HocVan = $hocVan,
            c.KinhNghiem = $kinhNghiem,
            c.MoTaBanThan = $moTa,
            c.MucLuongMongMuon = $mucLuong,
            c.NgonNgu = $ngonNgu,
            c.updatedAt = datetime()
        RETURN c
      `;
      
      const result = await session.run(query, {
        id: candidateData._id.toString(),
        hoTen: candidateData.fullName || '',
        email: candidateData.email || '',
        sdt: candidateData.phone || '',
        ngaySinh: candidateData.dateOfBirth || '',
        gioiTinh: candidateData.gender || '',
        hocVan: candidateData.education || '',
        kinhNghiem: candidateData.experience || 0,
        moTa: candidateData.bio || '',
        mucLuong: candidateData.expectedSalary || 0,
        ngonNgu: candidateData.languages?.join(', ') || ''
      });
      
      return result.records[0]?.get('c').properties;
    } finally {
      await session.close();
    }
  }

  /**
   * Thêm skills cho candidate
   */
  async addCandidateSkills(candidateId, skills) {
    const session = driver().session();
    try {
      const query = `
        MATCH (c:Candidate {MaUV: $candidateId})
        UNWIND $skills as skill
        MERGE (s:Skill {MaKN: skill.id, TenKyNang: skill.name})
        SET s.MucDo = skill.level
        MERGE (c)-[r:HAS_SKILL]->(s)
        SET r.Level = skill.level,
            r.YearsExperience = skill.years
        RETURN c, collect(s) as skills
      `;
      
      await session.run(query, {
        candidateId,
        skills: skills.map((s, index) => ({
          id: s._id?.toString() || `skill_${index}`,
          name: s.name || s,
          level: s.proficiency || s.level || 'Trung bình',
          years: s.yearsUsed || s.years || 1
        }))
      });
      
      return { success: true };
    } finally {
      await session.close();
    }
  }

  // ==================== JOB OPERATIONS ====================
  
  /**
   * Tạo hoặc cập nhật JobPost node với đầy đủ relationships
   */
  async createOrUpdateJob(jobData) {
    const session = driver().session();
    try {
      const query = `
        MERGE (j:JobPost {MaBTD: $id})
        SET j.TieuDe = $tieuDe,
            j.MoTa = $moTa,
            j.KinhNghiem = $kinhNghiem,
            j.MucLuong = $mucLuong,
            j.HanNop = $hanNop,
            j.NgayDang = datetime($ngayDang),
            j.TrangThai = $trangThai,
            j.DiaChi = $diaChi,
            j.ThanhPho = $thanhPho,
            j.ViTri = $viTri,
            j.CapBac = $capBac,
            j.LoaiCongViec = $loaiCongViec,
            j.HinhThucLamViec = $hinhThucLamViec,
            j.NgonNgu = $ngonNgu,
            j.LuotXem = $luotXem,
            j.SoLuongUngTuyen = $soLuongUngTuyen,
            j.MaNTD = $employerId,
            j.updatedAt = datetime()
        RETURN j
      `;
      
      const result = await session.run(query, {
        id: jobData._id.toString(),
        tieuDe: jobData.title || '',
        moTa: jobData.description || '',
        kinhNghiem: jobData.position?.level || '',
        mucLuong: jobData.salary || 'Thỏa thuận',
        hanNop: jobData.deadline?.toISOString() || '',
        ngayDang: jobData.datePosted?.toISOString() || new Date().toISOString(),
        trangThai: jobData.status || 'open',
        diaChi: jobData.location?.address || '',
        thanhPho: jobData.location?.city || '',
        viTri: jobData.position?.title || jobData.title || '',
        capBac: jobData.position?.level || '',
        loaiCongViec: jobData.position?.type || 'Full-time',
        hinhThucLamViec: jobData.position?.workMode || 'On-site',
        ngonNgu: jobData.language || '',
        luotXem: jobData.views || 0,
        soLuongUngTuyen: jobData.applicationsCount || 0,
        employerId: jobData.employerId?.toString() || ''
      });
      
      return result.records[0]?.get('j').properties;
    } finally {
      await session.close();
    }
  }

  /**
   * Thêm required skills cho job
   */
  async addJobRequirements(jobId, skills) {
    const session = driver().session();
    try {
      const query = `
        MATCH (j:JobPost {MaBTD: $jobId})
        UNWIND $skills as skill
        MERGE (s:Skill {MaKN: skill.id, TenKyNang: skill.name})
        SET s.MucDo = skill.level
        MERGE (j)-[r:REQUIRES_SKILL]->(s)
        SET r.LevelRequired = skill.level,
            r.MinYears = skill.minYears
        RETURN j, collect(s) as skills
      `;
      
      await session.run(query, {
        jobId,
        skills: skills.map((s, index) => ({
          id: s._id?.toString() || `skill_${index}`,
          name: s.name || s,
          level: s.level || s.importance || 'Trung bình',
          minYears: s.minYears || s.years || 1
        }))
      });
      
      return { success: true };
    } finally {
      await session.close();
    }
  }

  /**
   * Xóa JobPost node và tất cả relationships
   */
  async deleteJob(jobId) {
    const session = driver().session();
    try {
      const query = `
        MATCH (j:JobPost {MaBTD: $jobId})
        DETACH DELETE j
        RETURN count(j) as deleted
      `;
      
      const result = await session.run(query, { jobId });
      const deleted = result.records[0]?.get('deleted').toNumber() || 0;
      
      return { success: deleted > 0, deleted };
    } finally {
      await session.close();
    }
  }

  // ==================== EMPLOYER OPERATIONS ====================
  
  /**
   * Tạo hoặc cập nhật Employer node
   */
  async createOrUpdateCompany(employerData) {
    const session = driver().session();
    try {
      const query = `
        MERGE (e:Employer {MaNTD: $id})
        SET e.TenCongTy = $tenCongTy,
            e.Email = $email,
            e.SDT = $sdt,
            e.LinhVuc = $linhVuc,
            e.MoTaCongTy = $moTa,
            e.Website = $website,
            e.DiaChi = $diaChi,
            e.QuyMo = $quyMo,
            e.updatedAt = datetime()
        RETURN e
      `;
      
      const result = await session.run(query, {
        id: employerData._id.toString(),
        tenCongTy: employerData.companyName || '',
        email: employerData.email || '',
        sdt: employerData.phone || '',
        linhVuc: employerData.industry || 'Technology',
        moTa: employerData.description || '',
        website: employerData.website || '',
        diaChi: employerData.address || '',
        quyMo: employerData.companySize || 'Medium'
      });
      
      return result.records[0]?.get('e').properties;
    } finally {
      await session.close();
    }
  }

  // ==================== APPLICATION OPERATIONS ====================
  
  /**
   * Tạo Application node và relationships
   */
  async createApplication(applicationData, candidateId, jobId) {
    const session = driver().session();
    try {
      const query = `
        // Tạo Application node
        CREATE (app:Application {
          MaHS: $appId,
          NgayNop: datetime($ngayNop),
          TrangThai: $trangThai,
          TepCV: $tepCV,
          ThuGioiThieu: $thuGioiThieu
        })
        
        // Link Candidate -> Application (nếu candidate tồn tại)
        WITH app
        OPTIONAL MATCH (c:Candidate {MaUV: $candidateId})
        FOREACH (x IN CASE WHEN c IS NOT NULL THEN [1] ELSE [] END |
          CREATE (c)-[s:SUBMITTED {SubmitDate: datetime($ngayNop)}]->(app)
        )
        
        // Link Application -> JobPost (nếu job tồn tại)
        WITH app
        OPTIONAL MATCH (j:JobPost {MaBTD: $jobId})
        FOREACH (x IN CASE WHEN j IS NOT NULL THEN [1] ELSE [] END |
          CREATE (app)-[:APPLIED_TO]->(j)
        )
        
        // Link Application -> Status (luôn tạo)
        WITH app
        MERGE (st:Status {MaTT: $statusId, TenTrangThai: $trangThai})
        CREATE (app)-[:HAS_STATUS]->(st)
        
        RETURN app
      `;
      
      const result = await session.run(query, {
        appId: applicationData._id.toString(),
        ngayNop: applicationData.submitDate?.toISOString() || new Date().toISOString(),
        trangThai: applicationData.status?.name || 'Submitted',
        tepCV: applicationData.resumeFile || '',
        thuGioiThieu: applicationData.coverLetter || '',
        candidateId: candidateId.toString(),
        jobId: jobId.toString(),
        statusId: `status_${applicationData.status?.name || 'Submitted'}`
      });
      
      return result.records[0]?.get('app').properties;
    } finally {
      await session.close();
    }
  }

  /**
   * Employer xem application
   */
  async employerViewApplication(employerId, applicationId) {
    const session = driver().session();
    try {
      const query = `
        MATCH (e:Employer {MaNTD: $employerId})
        MATCH (app:Application {MaHS: $applicationId})
        MERGE (e)-[v:VIEWED]->(app)
        ON CREATE SET v.ViewedDate = datetime(), v.ViewCount = 1
        ON MATCH SET v.ViewedDate = datetime(), v.ViewCount = v.ViewCount + 1
        RETURN v
      `;
      
      await session.run(query, {
        employerId: employerId.toString(),
        applicationId: applicationId.toString()
      });
      
      return { success: true };
    } finally {
      await session.close();
    }
  }

  /**
   * Cập nhật status của application
   */
  async updateApplicationStatus(applicationId, newStatus) {
    const session = driver().session();
    try {
      const query = `
        MATCH (app:Application {MaHS: $applicationId})
        SET app.TrangThai = $newStatus
        
        // Xóa relationship cũ với Status
        WITH app
        OPTIONAL MATCH (app)-[oldRel:HAS_STATUS]->(oldStatus:Status)
        DELETE oldRel
        
        // Tạo relationship mới với Status
        WITH app
        MERGE (st:Status {MaTT: $statusId, TenTrangThai: $newStatus})
        CREATE (app)-[:HAS_STATUS]->(st)
        
        RETURN app
      `;
      
      await session.run(query, {
        applicationId: applicationId.toString(),
        newStatus: newStatus,
        statusId: `status_${newStatus}`
      });
      
      return { success: true };
    } finally {
      await session.close();
    }
  }

  /**
   * Xóa Application node và tất cả relationships
   */
  async deleteApplication(applicationId) {
    const session = driver().session();
    try {
      const query = `
        MATCH (app:Application {MaHS: $applicationId})
        DETACH DELETE app
        RETURN count(app) as deleted
      `;
      
      const result = await session.run(query, { 
        applicationId: applicationId.toString() 
      });
      const deleted = result.records[0]?.get('deleted').toNumber() || 0;
      
      return { success: deleted > 0, deleted };
    } finally {
      await session.close();
    }
  }

  // ==================== RECOMMENDATION ALGORITHMS ====================
  
  /**
   * Gợi ý jobs phù hợp cho candidate (theo schema mới)
   */
  async recommendJobsForCandidate(candidateId, limit = 10) {
    const session = driver().session();
    try {
      const query = `
        // Bước 1: Tìm skills của candidate
        MATCH (c:Candidate {MaUV: $candidateId})
        
        // Kiểm tra candidate có tồn tại không
        WITH c
        WHERE c IS NOT NULL
        
        // Tìm skills của candidate
        MATCH (c)-[hs:HAS_SKILL]->(s:Skill)
        
        // Bước 2: Tìm jobs yêu cầu những skills đó
        MATCH (j:JobPost)-[rs:REQUIRES_SKILL]->(s)
        WHERE j.TrangThai = 'active' OR j.TrangThai = 'open'
        
        // Bước 3: Tính toán match score cho mỗi job
        WITH j, 
             COUNT(DISTINCT s) as matchingSkills,
             COLLECT(DISTINCT s.TenKyNang) as matchedSkillNames,
             COLLECT(DISTINCT hs) as candidateSkillRels
        
        // Tính average proficiency (xử lý cả tiếng Việt và tiếng Anh)
        WITH j,
             matchingSkills,
             matchedSkillNames,
             REDUCE(total = 0.0, rel IN candidateSkillRels | 
               total + CASE 
                 WHEN rel.Level IN ['Thành thạo', 'advanced', 'Advanced'] THEN 3.0
                 WHEN rel.Level IN ['Trung bình', 'intermediate', 'Intermediate'] THEN 2.0
                 WHEN rel.Level IN ['Cơ bản', 'basic', 'Basic'] THEN 1.0
                 ELSE 2.0
               END
             ) / SIZE(candidateSkillRels) as avgProficiency
        
        // Bước 4: Đếm tổng số skills required của job
        WITH j, matchingSkills, matchedSkillNames, avgProficiency
        MATCH (j)-[:REQUIRES_SKILL]->(allSkills:Skill)
        WITH j, 
             matchingSkills, 
             matchedSkillNames,
             avgProficiency,
             COUNT(DISTINCT allSkills) as totalRequired
        
        // Tính match score (tỷ lệ skills phù hợp)
        WITH j,
             matchingSkills,
             matchedSkillNames,
             avgProficiency,
             totalRequired,
             toFloat(matchingSkills) / toFloat(totalRequired) as matchScore
        
        // Lọc chỉ lấy jobs có match score > 30%
        WHERE matchScore > 0.3
        
        // Bước 5: Lấy thông tin bổ sung (employer, location, position)
        OPTIONAL MATCH (e:Employer)-[:POSTED]->(j)
        OPTIONAL MATCH (j)-[:LOCATED_AT]->(loc:Location)
        OPTIONAL MATCH (j)-[:FOR_POSITION]->(pos:Position)
        
        // Bước 6: Return kết quả
        RETURN j.MaBTD as jobId,
               j.TieuDe as title,
               j.MucLuong as salary,
               j.KinhNghiem as experience,
               COALESCE(e.TenCongTy, 'N/A') as companyName,
               COALESCE(loc.TenDiaDiem, 'N/A') as location,
               COALESCE(pos.CapBac, 'N/A') as level,
               matchScore,
               matchingSkills,
               totalRequired,
               matchedSkillNames,
               avgProficiency
        
        // Sắp xếp: Ưu tiên match score cao, proficiency cao, job mới
        ORDER BY matchScore DESC, avgProficiency DESC
        LIMIT $limit
      `;
      
      const result = await session.run(query, { 
        candidateId: candidateId.toString(), 
        limit: neo4j.int(limit) 
      });
      
      // Xử lý kết quả
      if (!result.records || result.records.length === 0) {
        return [];
      }
      
      return result.records.map(record => ({
        jobId: record.get('jobId'),
        title: record.get('title'),
        salary: record.get('salary'),
        experience: record.get('experience'),
        companyName: record.get('companyName'),
        location: record.get('location'),
        level: record.get('level'),
        matchScore: record.get('matchScore'),
        matchingSkills: record.get('matchingSkills').toNumber(),
        totalRequired: record.get('totalRequired').toNumber(),
        matchedSkillNames: record.get('matchedSkillNames'),
        avgProficiency: record.get('avgProficiency')
      }));
    } catch (error) {
      console.error('❌ Error in recommendJobsForCandidate:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * Tìm candidates phù hợp cho job (theo schema mới)
   */
  async findMatchingCandidates(jobId, limit = 10) {
    const session = driver().session();
    try {
      const query = `
        // Bước 1: Tìm job và skills required
        MATCH (j:JobPost {MaBTD: $jobId})
        WHERE j IS NOT NULL
        
        // Tìm skills required của job
        MATCH (j)-[rs:REQUIRES_SKILL]->(s:Skill)
        
        // Bước 2: Tìm candidates có những skills đó
        MATCH (c:Candidate)-[hs:HAS_SKILL]->(s)
        
        // Bước 3: Tính toán match score cho mỗi candidate
        WITH c, j,
             COUNT(DISTINCT s) as matchingSkills,
             COLLECT(DISTINCT s.TenKyNang) as matchedSkillNames,
             COLLECT(DISTINCT hs) as candidateSkillRels
        
        // Tính average proficiency và years experience
        WITH c, j,
             matchingSkills,
             matchedSkillNames,
             REDUCE(total = 0.0, rel IN candidateSkillRels | 
               total + CASE 
                 WHEN rel.Level IN ['Thành thạo', 'advanced', 'Advanced'] THEN 3.0
                 WHEN rel.Level IN ['Trung bình', 'intermediate', 'Intermediate'] THEN 2.0
                 WHEN rel.Level IN ['Cơ bản', 'basic', 'Basic'] THEN 1.0
                 ELSE 2.0
               END
             ) / SIZE(candidateSkillRels) as avgProficiency,
             REDUCE(total = 0.0, rel IN candidateSkillRels | 
               total + COALESCE(rel.YearsExperience, 1.0)
             ) / SIZE(candidateSkillRels) as avgYearsUsed
        
        // Bước 4: Đếm tổng số skills required của job
        WITH c, j, matchingSkills, matchedSkillNames, avgProficiency, avgYearsUsed
        MATCH (j)-[:REQUIRES_SKILL]->(allSkills:Skill)
        WITH c, j,
             matchingSkills,
             matchedSkillNames,
             avgProficiency,
             avgYearsUsed,
             COUNT(DISTINCT allSkills) as totalRequired
        
        // Tính match score
        WITH c, j,
             matchingSkills,
             matchedSkillNames,
             avgProficiency,
             avgYearsUsed,
             totalRequired,
             toFloat(matchingSkills) / toFloat(totalRequired) as matchScore
        
        // Lọc chỉ lấy candidates có match score > 40%
        WHERE matchScore > 0.4
        
        // Bước 5: Kiểm tra candidate đã apply chưa
        OPTIONAL MATCH (c)-[:SUBMITTED]->(app:Application)-[:APPLIED_TO]->(j)
        
        // Bước 6: Return kết quả
        RETURN c.MaUV as candidateId,
               COALESCE(c.HoTen, 'N/A') as name,
               COALESCE(c.Email, 'N/A') as email,
               COALESCE(c.SDT, 'N/A') as phone,
               COALESCE(c.KinhNghiem, 0) as experience,
               COALESCE(c.HocVan, 'N/A') as education,
               matchScore,
               matchingSkills,
               totalRequired,
               matchedSkillNames,
               avgProficiency,
               avgYearsUsed,
               CASE WHEN app IS NOT NULL THEN true ELSE false END as hasApplied
        
        // Sắp xếp: Ưu tiên match score cao, proficiency cao, experience nhiều
        ORDER BY matchScore DESC, avgProficiency DESC, experience DESC
        LIMIT $limit
      `;
      
      const result = await session.run(query, { 
        jobId: jobId.toString(), 
        limit: neo4j.int(limit) 
      });
      
      // Xử lý kết quả
      if (!result.records || result.records.length === 0) {
        return [];
      }
      
      return result.records.map(record => ({
        candidateId: record.get('candidateId'),
        name: record.get('name'),
        email: record.get('email'),
        phone: record.get('phone'),
        experience: record.get('experience'),
        education: record.get('education'),
        matchScore: record.get('matchScore'),
        matchingSkills: record.get('matchingSkills').toNumber(),
        totalRequired: record.get('totalRequired').toNumber(),
        matchedSkillNames: record.get('matchedSkillNames'),
        avgProficiency: record.get('avgProficiency'),
        avgYearsUsed: record.get('avgYearsUsed'),
        hasApplied: record.get('hasApplied')
      }));
    } catch (error) {
      console.error('❌ Error in findMatchingCandidates:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * Phân tích skills của candidate (theo schema mới)
   */
  async analyzeSkills(candidateId) {
    const session = driver().session();
    try {
      // Get current skills
      const currentSkillsQuery = `
        MATCH (c:Candidate {MaUV: $candidateId})-[hs:HAS_SKILL]->(s:Skill)
        RETURN s.TenKyNang as skill, 
               s.MucDo as skillLevel,
               hs.Level as level, 
               hs.YearsExperience as years
        ORDER BY hs.YearsExperience DESC
      `;
      
      const currentSkillsResult = await session.run(currentSkillsQuery, { candidateId });
      const currentSkills = currentSkillsResult.records.map(r => ({
        skill: r.get('skill'),
        level: r.get('level') || r.get('skillLevel'),
        years: r.get('years')
      }));

      // Get recommended skills (skills xuất hiện nhiều trong jobs nhưng candidate chưa có)
      const recommendedSkillsQuery = `
        MATCH (c:Candidate {MaUV: $candidateId})-[:HAS_SKILL]->(mySkills:Skill)
        MATCH (j:JobPost)-[:REQUIRES_SKILL]->(mySkills)
        WHERE j.TrangThai = 'active'
        MATCH (j)-[:REQUIRES_SKILL]->(recommendedSkill:Skill)
        WHERE NOT (c)-[:HAS_SKILL]->(recommendedSkill)
        WITH recommendedSkill, COUNT(DISTINCT j) as jobCount
        RETURN recommendedSkill.TenKyNang as skill, 
               recommendedSkill.MucDo as level,
               jobCount
        ORDER BY jobCount DESC
        LIMIT 10
      `;
      
      const recommendedSkillsResult = await session.run(recommendedSkillsQuery, { candidateId });
      const recommendedSkills = recommendedSkillsResult.records.map(r => ({
        skill: r.get('skill'),
        level: r.get('level'),
        demandInJobs: r.get('jobCount').toNumber()
      }));

      // Get skill gaps (skills required ở level cao hơn)
      const skillGapsQuery = `
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
        LIMIT 5
      `;
      
      const skillGapsResult = await session.run(skillGapsQuery, { candidateId });
      const skillGaps = skillGapsResult.records.map(r => ({
        skill: r.get('skill'),
        currentLevel: r.get('currentLevel'),
        requiredLevel: r.get('requiredLevel'),
        jobsRequiring: r.get('jobCount').toNumber()
      }));

      return {
        currentSkills,
        recommendedSkills,
        skillGaps,
        totalSkills: currentSkills.length
      };
    } finally {
      await session.close();
    }
  }

  /**
   * Tìm jobs tương tự (theo schema mới)
   */
  async findSimilarJobs(jobId, limit = 5) {
    const session = driver().session();
    try {
      const query = `
        // Tìm jobs có chung skills
        MATCH (j1:JobPost {MaBTD: $jobId})-[:REQUIRES_SKILL]->(s:Skill)<-[:REQUIRES_SKILL]-(j2:JobPost)
        WHERE j1 <> j2 AND j2.TrangThai = 'active'
        
        WITH j2, COUNT(DISTINCT s) as commonSkills, COLLECT(DISTINCT s.TenKyNang) as skills
        
        // Lấy thông tin employer, position, location
        OPTIONAL MATCH (e:Employer)-[:POSTED]->(j2)
        OPTIONAL MATCH (j2)-[:FOR_POSITION]->(pos:Position)
        OPTIONAL MATCH (j2)-[:LOCATED_AT]->(loc:Location)
        
        RETURN j2.MaBTD as jobId,
               j2.TieuDe as title,
               j2.MucLuong as salary,
               e.TenCongTy as companyName,
               pos.CapBac as level,
               loc.TenDiaDiem as location,
               commonSkills,
               skills
        ORDER BY commonSkills DESC, j2.NgayDang DESC
        LIMIT $limit
      `;
      
      const result = await session.run(query, { 
        jobId, 
        limit: neo4j.int(limit) 
      });
      
      return result.records.map(record => ({
        jobId: record.get('jobId'),
        title: record.get('title'),
        salary: record.get('salary'),
        companyName: record.get('companyName'),
        level: record.get('level'),
        location: record.get('location'),
        commonSkills: record.get('commonSkills').toNumber(),
        skills: record.get('skills')
      }));
    } finally {
      await session.close();
    }
  }

  // ==================== UTILITY OPERATIONS ====================
  
  /**
   * Xóa tất cả data (dùng cho testing)
   */
  async clearAllData() {
    const session = driver().session();
    try {
      await session.run('MATCH (n) DETACH DELETE n');
      return { success: true, message: 'All data cleared' };
    } finally {
      await session.close();
    }
  }

  /**
   * Lấy thống kê database (theo schema mới)
   */
  async getStats() {
    const session = driver().session();
    try {
      const query = `
        OPTIONAL MATCH (a:Account)
        WITH COUNT(a) as accounts
        OPTIONAL MATCH (c:Candidate)
        WITH accounts, COUNT(c) as candidates
        OPTIONAL MATCH (e:Employer)
        WITH accounts, candidates, COUNT(e) as employers
        OPTIONAL MATCH (j:JobPost)
        WITH accounts, candidates, employers, COUNT(j) as jobs
        OPTIONAL MATCH (s:Skill)
        WITH accounts, candidates, employers, jobs, COUNT(s) as skills
        OPTIONAL MATCH (app:Application)
        WITH accounts, candidates, employers, jobs, skills, COUNT(app) as applications
        OPTIONAL MATCH (pos:Position)
        WITH accounts, candidates, employers, jobs, skills, applications, COUNT(pos) as positions
        OPTIONAL MATCH (loc:Location)
        WITH accounts, candidates, employers, jobs, skills, applications, positions, COUNT(loc) as locations
        OPTIONAL MATCH (st:Status)
        WITH accounts, candidates, employers, jobs, skills, applications, positions, locations, COUNT(st) as statuses
        
        OPTIONAL MATCH ()-[r:HAS_SKILL]->() 
        WITH accounts, candidates, employers, jobs, skills, applications, positions, locations, statuses, COUNT(r) as candidateSkills
        
        OPTIONAL MATCH ()-[r2:REQUIRES_SKILL]->() 
        WITH accounts, candidates, employers, jobs, skills, applications, positions, locations, statuses, candidateSkills, COUNT(r2) as jobRequirements
        
        OPTIONAL MATCH ()-[r3:SUBMITTED]->() 
        WITH accounts, candidates, employers, jobs, skills, applications, positions, locations, statuses, candidateSkills, jobRequirements, COUNT(r3) as submissions
        
        OPTIONAL MATCH ()-[r4:POSTED]->() 
        WITH accounts, candidates, employers, jobs, skills, applications, positions, locations, statuses, candidateSkills, jobRequirements, submissions, COUNT(r4) as posts
        
        OPTIONAL MATCH ()-[r5:VIEWED]->() 
        WITH accounts, candidates, employers, jobs, skills, applications, positions, locations, statuses, candidateSkills, jobRequirements, submissions, posts, COUNT(r5) as views
        
        RETURN accounts, candidates, employers, jobs, skills, applications, positions, locations, statuses,
               candidateSkills, jobRequirements, submissions, posts, views
      `;
      
      const result = await session.run(query);
      
      if (!result.records || result.records.length === 0) {
        return {
          nodes: {},
          relationships: {},
          total: { nodes: 0, relationships: 0 }
        };
      }
      
      const record = result.records[0];
      
      return {
        nodes: {
          accounts: record.get('accounts').toNumber(),
          candidates: record.get('candidates').toNumber(),
          employers: record.get('employers').toNumber(),
          jobs: record.get('jobs').toNumber(),
          skills: record.get('skills').toNumber(),
          applications: record.get('applications').toNumber(),
          positions: record.get('positions').toNumber(),
          locations: record.get('locations').toNumber(),
          statuses: record.get('statuses').toNumber()
        },
        relationships: {
          candidateSkills: record.get('candidateSkills').toNumber(),
          jobRequirements: record.get('jobRequirements').toNumber(),
          submissions: record.get('submissions').toNumber(),
          posts: record.get('posts').toNumber(),
          views: record.get('views').toNumber()
        },
        total: {
          nodes: record.get('accounts').toNumber() + 
                 record.get('candidates').toNumber() + 
                 record.get('employers').toNumber() + 
                 record.get('jobs').toNumber() + 
                 record.get('skills').toNumber() + 
                 record.get('applications').toNumber() + 
                 record.get('positions').toNumber() + 
                 record.get('locations').toNumber() + 
                 record.get('statuses').toNumber(),
          relationships: record.get('candidateSkills').toNumber() + 
                        record.get('jobRequirements').toNumber() + 
                        record.get('submissions').toNumber() + 
                        record.get('posts').toNumber() + 
                        record.get('views').toNumber()
        }
      };
    } finally {
      await session.close();
    }
  }
}

export default new Neo4jService();
