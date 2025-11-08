import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { driver } from '../config/neo4j.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function verifyNeo4jUsage() {
  console.log('🔍 VERIFICATION: Kiểm tra xem API đang dùng MongoDB hay Neo4j\n');
  console.log('='.repeat(70));
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
    
    // Test Neo4j connection
    const session = driver().session();
    try {
      await session.run('RETURN 1');
      console.log('✅ Neo4j connected\n');
    } finally {
      await session.close();
    }
    
    // Import models and services
    const Candidate = (await import('../models/Candidate.js')).default;
    const JobPost = (await import('../models/JobPost.js')).default;
    const neo4jService = (await import('../services/neo4jService.js')).default;
    
    console.log('='.repeat(70));
    console.log('TEST 1: Candidate - searchJobsBySkills');
    console.log('='.repeat(70));
    
    const candidate = await Candidate.findOne();
    if (!candidate) {
      console.log('❌ No candidate found');
      return;
    }
    
    console.log(`\n📋 Testing with: ${candidate.fullName} (${candidate._id})`);
    console.log(`Skills: ${candidate.skills.map(s => s.name).join(', ')}\n`);
    
    // Method 1: Call Neo4j directly
    console.log('🔹 Method 1: Direct Neo4j Query');
    const startNeo4j = Date.now();
    const neo4jResults = await neo4jService.recommendJobsForCandidate(
      candidate._id.toString(),
      5
    );
    const neo4jTime = Date.now() - startNeo4j;
    
    console.log(`   ⏱️  Time: ${neo4jTime}ms`);
    console.log(`   📊 Results: ${neo4jResults.length} jobs`);
    if (neo4jResults.length > 0) {
      console.log(`   ✅ Neo4j is WORKING`);
      console.log(`   Sample: ${neo4jResults[0].title} (${neo4jResults[0].matchScore * 100}% match)`);
    }
    
    // Method 2: MongoDB equivalent (for comparison)
    console.log('\n🔹 Method 2: MongoDB Query (Old Method)');
    const startMongo = Date.now();
    const candidateSkills = candidate.skills.map(s => s.name);
    const mongoResults = await JobPost.find({
      status: 'active',
      'skillsRequired.name': { $in: candidateSkills }
    }).limit(5).lean();
    const mongoTime = Date.now() - startMongo;
    
    console.log(`   ⏱️  Time: ${mongoTime}ms`);
    console.log(`   📊 Results: ${mongoResults.length} jobs`);
    console.log(`   ⚠️  MongoDB does NOT calculate match score`);
    
    console.log('\n📊 COMPARISON:');
    console.log(`   Neo4j: ${neo4jTime}ms with match scores`);
    console.log(`   MongoDB: ${mongoTime}ms without match scores`);
    console.log(`   Speed difference: ${mongoTime > neo4jTime ? 'Neo4j faster' : 'MongoDB faster'}`);
    
    console.log('\n' + '='.repeat(70));
    console.log('TEST 2: Employer - getMatchingCandidates');
    console.log('='.repeat(70));
    
    const job = await JobPost.findOne({ status: 'active' });
    if (!job) {
      console.log('❌ No active job found');
      return;
    }
    
    console.log(`\n📋 Testing with: ${job.title} (${job._id})`);
    const jobSkills = job.skillsRequired || [];
    console.log(`Required Skills: ${jobSkills.map(s => s.name || s).join(', ')}\n`);
    
    // Method 1: Call Neo4j directly
    console.log('🔹 Method 1: Direct Neo4j Query');
    const startNeo4j2 = Date.now();
    const neo4jCandidates = await neo4jService.findMatchingCandidates(
      job._id.toString(),
      5
    );
    const neo4jTime2 = Date.now() - startNeo4j2;
    
    console.log(`   ⏱️  Time: ${neo4jTime2}ms`);
    console.log(`   📊 Results: ${neo4jCandidates.length} candidates`);
    if (neo4jCandidates.length > 0) {
      console.log(`   ✅ Neo4j is WORKING`);
      console.log(`   Sample: ${neo4jCandidates[0].name} (${neo4jCandidates[0].matchScore * 100}% match)`);
    }
    
    // Method 2: MongoDB equivalent (for comparison)
    console.log('\n🔹 Method 2: MongoDB Query (Old Method)');
    const startMongo2 = Date.now();
    const requiredSkills = jobSkills.map(s => s.name || s);
    const mongoCandidates = await Candidate.find({
      'skills.name': { $in: requiredSkills }
    }).limit(5).lean();
    const mongoTime2 = Date.now() - startMongo2;
    
    console.log(`   ⏱️  Time: ${mongoTime2}ms`);
    console.log(`   📊 Results: ${mongoCandidates.length} candidates`);
    console.log(`   ⚠️  MongoDB does NOT calculate match score`);
    
    console.log('\n📊 COMPARISON:');
    console.log(`   Neo4j: ${neo4jTime2}ms with match scores`);
    console.log(`   MongoDB: ${mongoTime2}ms without match scores`);
    console.log(`   Speed difference: ${mongoTime2 > neo4jTime2 ? 'Neo4j faster' : 'MongoDB faster'}`);
    
    console.log('\n' + '='.repeat(70));
    console.log('🎯 FINAL VERDICT');
    console.log('='.repeat(70));
    
    console.log('\n✅ CONFIRMED: API đang sử dụng Neo4j nếu:');
    console.log('   1. Response có field "source": "neo4j"');
    console.log('   2. Response có "matchScore" (0-100)');
    console.log('   3. Response có "matchingSkills" array');
    console.log('   4. Console log hiển thị "[Neo4j]"');
    
    console.log('\n❌ API đang dùng MongoDB nếu:');
    console.log('   1. Response KHÔNG có field "source"');
    console.log('   2. Response KHÔNG có "matchScore"');
    console.log('   3. Chỉ có danh sách jobs/candidates thông thường');
    
    console.log('\n📝 Cách kiểm tra khi gọi API:');
    console.log('   1. Mở Browser DevTools > Network tab');
    console.log('   2. Gọi API /api/candidates/matching-jobs');
    console.log('   3. Xem response, nếu có "source": "neo4j" → Đang dùng Neo4j ✅');
    console.log('   4. Xem Backend console, nếu có log "[Neo4j]" → Đang dùng Neo4j ✅');
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ VERIFICATION COMPLETE!');
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

verifyNeo4jUsage();
