/**
 * NEO4J VERSION - Chuyển đổi từ MongoDB sang Neo4j
 * So sánh performance và accuracy với MongoDB version
 */

import neo4jService from '../services/neo4jService.js';
import JobPost from '../models/JobPost.js';
import Candidate from '../models/Candidate.js';

/**
 * CHỨC NĂNG 1: GỢI Ý VIỆC LÀM PHÙ HỢP (Neo4j Version)
 * Tương đương với candidateController.getRecommendedJobs
 * 
 * MongoDB version:
 * - Query: JobPost.find() với $in operator
 * - Tính match score bằng JavaScript
 * - Sort trong memory
 * 
 * Neo4j version:
 * - Graph traversal: Candidate->HAS_SKILL->Skill<-REQUIRES_SKILL<-Job
 * - Tính match score trong Cypher query
 * - Sort trong database
 */
export const getRecommendedJobsNeo4j = async (req, res) => {
  try {
    const candidateId = req.user.role === 'candidate' 
      ? req.user.profileId 
      : req.params.candidateId;

    console.log('🔍 [Neo4j] Finding recommended jobs for candidate:', candidateId);
    const startTime = Date.now();

    // Neo4j query - tận dụng graph traversal
    const recommendations = await neo4jService.recommendJobsForCandidate(
      candidateId.toString(),
      20 // Lấy nhiều hơn để filter
    );

    const neo4jTime = Date.now() - startTime;

    if (recommendations.length === 0) {
      return res.json({
        status: 'success',
        source: 'neo4j',
        data: [],
        message: 'Chưa có việc làm phù hợp. Hãy cập nhật thêm kỹ năng của bạn!',
        performance: {
          queryTime: neo4jTime,
          resultsCount: 0
        }
      });
    }

    // Enrich với MongoDB data (giống MongoDB version)
    const enrichStartTime = Date.now();
    const jobsWithMatchScore = await Promise.all(
      recommendations.map(async (rec) => {
        const job = await JobPost.findById(rec.jobId)
          .populate('employer', 'companyName email phone industry')
          .lean();
        
        if (!job) return null;

        // Format giống MongoDB version
        return {
          ...job,
          employerId: job.employer, // Giống structure MongoDB
          matchScore: Math.round(rec.matchScore * 100), // Convert to percentage
          matchingSkillsCount: rec.matchingSkills,
          totalRequiredSkills: rec.totalRequired,
          matchingSkills: rec.matchedSkillNames,
          // Thêm thông tin Neo4j specific
          neo4jData: {
            avgProficiency: rec.avgProficiency,
            graphScore: rec.matchScore
          }
        };
      })
    );

    const enrichTime = Date.now() - enrichStartTime;
    const validJobs = jobsWithMatchScore.filter(job => job !== null);

    // Sort theo matchScore (giống MongoDB version)
    validJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      status: 'success',
      source: 'neo4j',
      data: validJobs,
      performance: {
        neo4jQueryTime: neo4jTime,
        mongoEnrichTime: enrichTime,
        totalTime: neo4jTime + enrichTime,
        resultsCount: validJobs.length
      }
    });

  } catch (error) {
    console.error('❌ [Neo4j] Error getting job recommendations:', error);
    res.status(500).json({
      status: 'error',
      source: 'neo4j',
      message: error.message
    });
  }
};

/**
 * CHỨC NĂNG 2: TÌM ỨNG VIÊN PHÙ HỢP (Neo4j Version)
 * Tương đương với employerController.getMatchingCandidates
 * 
 * MongoDB version:
 * - Query: Candidate.find() với $in operator
 * - Tính match score bằng JavaScript
 * - Sort trong memory
 * 
 * Neo4j version:
 * - Graph traversal: Job->REQUIRES_SKILL->Skill<-HAS_SKILL<-Candidate
 * - Tính match score trong Cypher query
 * - Sort trong database
 */
export const getMatchingCandidatesNeo4j = async (req, res) => {
  try {
    const { jobId } = req.params;

    console.log('🔍 [Neo4j] Finding matching candidates for job:', jobId);
    const startTime = Date.now();

    // Verify job exists và thuộc về employer này
    const job = await JobPost.findOne({
      _id: jobId,
      employer: req.user.profileId
    });

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy bài đăng tuyển dụng'
      });
    }

    // Neo4j query - tận dụng graph traversal
    const matches = await neo4jService.findMatchingCandidates(jobId, 20);
    const neo4jTime = Date.now() - startTime;

    if (matches.length === 0) {
      return res.json({
        status: 'success',
        source: 'neo4j',
        data: [],
        message: 'Chưa có ứng viên phù hợp với yêu cầu công việc',
        performance: {
          queryTime: neo4jTime,
          resultsCount: 0
        }
      });
    }

    // Enrich với MongoDB data (giống MongoDB version)
    const enrichStartTime = Date.now();
    const candidatesWithScore = await Promise.all(
      matches.map(async (match) => {
        const candidate = await Candidate.findById(match.candidateId)
          .select('fullName email phone education experience skills bio')
          .lean();
        
        if (!candidate) return null;

        // Format giống MongoDB version
        return {
          _id: candidate._id,
          fullName: candidate.fullName,
          email: candidate.email,
          education: candidate.education,
          experience: candidate.experience,
          skills: candidate.skills,
          matchScore: Math.round(match.matchScore * 100), // Convert to percentage
          matchingSkills: match.matchedSkillNames.map(name => ({ name })), // Format giống MongoDB
          matchingSkillsCount: match.matchingSkills,
          totalRequiredSkills: match.totalRequired,
          // Thêm thông tin Neo4j specific
          neo4jData: {
            avgProficiency: match.avgProficiency,
            avgYearsUsed: match.avgYearsUsed,
            hasApplied: match.hasApplied,
            graphScore: match.matchScore
          }
        };
      })
    );

    const enrichTime = Date.now() - enrichStartTime;
    const validCandidates = candidatesWithScore.filter(c => c !== null);

    // Sort theo matchScore (giống MongoDB version)
    validCandidates.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      status: 'success',
      source: 'neo4j',
      data: validCandidates,
      performance: {
        neo4jQueryTime: neo4jTime,
        mongoEnrichTime: enrichTime,
        totalTime: neo4jTime + enrichTime,
        resultsCount: validCandidates.length
      }
    });

  } catch (error) {
    console.error('❌ [Neo4j] Error getting matching candidates:', error);
    res.status(500).json({
      status: 'error',
      source: 'neo4j',
      message: error.message
    });
  }
};

/**
 * SO SÁNH PERFORMANCE: MongoDB vs Neo4j
 * Chạy cả 2 queries và so sánh kết quả
 */
export const comparePerformance = async (req, res) => {
  try {
    const candidateId = req.user.profileId;
    
    console.log('⚡ Starting performance comparison...');

    // 1. MongoDB version
    const mongoStartTime = Date.now();
    const candidate = await Candidate.findById(candidateId);
    const candidateSkills = candidate.skills.map(skill => skill.name.toLowerCase());

    const matchingJobs = await JobPost.find({
      status: 'active',
      deadline: { $gt: new Date() },
      'requirements.skills': { 
        $in: candidateSkills.map(skill => new RegExp(skill, 'i'))
      }
    })
    .populate('employer', 'companyName')
    .sort({ createdAt: -1 })
    .limit(10);

    const jobsWithMatchScore = matchingJobs.map(job => {
      const matchingSkillsCount = job.requirements?.skills?.filter(
        reqSkill => candidateSkills.includes(reqSkill.toLowerCase())
      ).length || 0;
      
      const matchScore = job.requirements?.skills?.length 
        ? (matchingSkillsCount / job.requirements.skills.length) * 100 
        : 0;

      return {
        ...job.toObject(),
        matchScore: Math.round(matchScore)
      };
    });

    jobsWithMatchScore.sort((a, b) => b.matchScore - a.matchScore);
    const mongoTime = Date.now() - mongoStartTime;

    // 2. Neo4j version
    const neo4jStartTime = Date.now();
    const recommendations = await neo4jService.recommendJobsForCandidate(
      candidateId.toString(),
      10
    );
    const neo4jTime = Date.now() - neo4jStartTime;

    // So sánh kết quả
    res.json({
      comparison: {
        mongodb: {
          queryTime: mongoTime,
          resultsCount: jobsWithMatchScore.length,
          topResults: jobsWithMatchScore.slice(0, 5).map(j => ({
            title: j.title,
            matchScore: j.matchScore
          }))
        },
        neo4j: {
          queryTime: neo4jTime,
          resultsCount: recommendations.length,
          topResults: recommendations.slice(0, 5).map(r => ({
            title: r.title,
            matchScore: Math.round(r.matchScore * 100)
          }))
        },
        winner: neo4jTime < mongoTime ? 'Neo4j' : 'MongoDB',
        speedup: `${((mongoTime / neo4jTime) * 100).toFixed(0)}%`,
        conclusion: neo4jTime < mongoTime 
          ? `Neo4j nhanh hơn ${(mongoTime - neo4jTime)}ms`
          : `MongoDB nhanh hơn ${(neo4jTime - mongoTime)}ms`
      }
    });

  } catch (error) {
    console.error('❌ Error comparing performance:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
