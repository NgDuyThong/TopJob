import neo4jService from '../services/neo4jService.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function testRecommendations() {
  try {
    console.log('🧪 Testing Neo4j Recommendation Functions\n');
    
    // Connect to MongoDB để lấy sample IDs
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Import models
    const Candidate = (await import('../models/Candidate.js')).default;
    const JobPost = (await import('../models/JobPost.js')).default;
    
    // Test 1: Recommend Jobs for Candidate
    console.log('📋 TEST 1: Recommend Jobs for Candidate');
    console.log('='.repeat(50));
    
    const sampleCandidate = await Candidate.findOne();
    if (sampleCandidate) {
      console.log(`Testing with Candidate: ${sampleCandidate.fullName} (${sampleCandidate._id})`);
      console.log(`Skills: ${sampleCandidate.skills.map(s => s.name).join(', ')}\n`);
      
      const jobRecommendations = await neo4jService.recommendJobsForCandidate(
        sampleCandidate._id.toString(),
        5
      );
      
      console.log(`Found ${jobRecommendations.length} matching jobs:`);
      jobRecommendations.forEach((job, idx) => {
        console.log(`\n${idx + 1}. ${job.title || 'N/A'}`);
        console.log(`   Company: ${job.companyName || 'N/A'}`);
        console.log(`   Match Score: ${(job.matchScore * 100).toFixed(1)}%`);
        console.log(`   Matching Skills: ${job.matchingSkills}/${job.totalRequired}`);
        console.log(`   Skills: ${job.matchedSkillNames.join(', ')}`);
      });
    } else {
      console.log('⚠️  No candidates found in database');
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 2: Find Matching Candidates for Job
    console.log('📋 TEST 2: Find Matching Candidates for Job');
    console.log('='.repeat(50));
    
    const sampleJob = await JobPost.findOne({ status: 'active' });
    if (sampleJob) {
      console.log(`Testing with Job: ${sampleJob.title} (${sampleJob._id})`);
      const skills = sampleJob.requiredSkills || [];
      console.log(`Required Skills: ${skills.map(s => s.name || s).join(', ')}\n`);
      
      const candidateMatches = await neo4jService.findMatchingCandidates(
        sampleJob._id.toString(),
        5
      );
      
      console.log(`Found ${candidateMatches.length} matching candidates:`);
      candidateMatches.forEach((candidate, idx) => {
        console.log(`\n${idx + 1}. ${candidate.name || 'N/A'}`);
        console.log(`   Email: ${candidate.email || 'N/A'}`);
        console.log(`   Match Score: ${(candidate.matchScore * 100).toFixed(1)}%`);
        console.log(`   Matching Skills: ${candidate.matchingSkills}/${candidate.totalRequired}`);
        console.log(`   Skills: ${candidate.matchedSkillNames.join(', ')}`);
        console.log(`   Has Applied: ${candidate.hasApplied ? 'Yes' : 'No'}`);
      });
    } else {
      console.log('⚠️  No active jobs found in database');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('\n✅ All tests completed!\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

testRecommendations();
