import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { driver, testConnection } from '../config/neo4j.js';
import neo4jService from '../services/neo4jService.js';
import Candidate from '../models/Candidate.js';
import Employer from '../models/Employer.js';
import JobPost from '../models/JobPost.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const syncToNeo4j = async () => {
  try {
    console.log('🚀 Starting sync to Neo4j...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Test Neo4j connection
    await testConnection();

    // Clear existing Neo4j data (optional - comment out if you want to keep existing data)
    console.log('\n🗑️  Clearing existing Neo4j data...');
    await neo4jService.clearAllData();
    console.log('✅ Neo4j data cleared');

    // ==================== SYNC COMPANIES ====================
    console.log('\n📊 Syncing Companies...');
    const employers = await Employer.find();
    let companyCount = 0;

    for (const employer of employers) {
      await neo4jService.createOrUpdateCompany(employer);
      companyCount++;
    }
    console.log(`✅ Synced ${companyCount} companies`);

    // ==================== SYNC CANDIDATES ====================
    console.log('\n👥 Syncing Candidates...');
    const candidates = await Candidate.find();
    let candidateCount = 0;

    for (const candidate of candidates) {
      // Create candidate node
      await neo4jService.createOrUpdateCandidate(candidate);

      // Add skills if available
      if (candidate.skills && candidate.skills.length > 0) {
        await neo4jService.addCandidateSkills(
          candidate._id.toString(),
          candidate.skills
        );
      }

      candidateCount++;
      if (candidateCount % 10 === 0) {
        console.log(`  Processed ${candidateCount}/${candidates.length} candidates...`);
      }
    }
    console.log(`✅ Synced ${candidateCount} candidates`);

    // ==================== SYNC JOBS ====================
    console.log('\n💼 Syncing Jobs...');
    const jobs = await JobPost.find({ status: { $in: ['active', 'open'] } }).populate('employerId');
    let jobCount = 0;

    for (const job of jobs) {
      // Convert to plain object
      const jobData = job.toObject();

      // Create job node
      await neo4jService.createOrUpdateJob(jobData);

      // Add required skills if available
      if (jobData.skillsRequired && jobData.skillsRequired.length > 0) {
        await neo4jService.addJobRequirements(
          jobData._id.toString(),
          jobData.skillsRequired
        );
      }

      jobCount++;
      if (jobCount % 10 === 0) {
        console.log(`  Processed ${jobCount}/${jobs.length} jobs...`);
      }
    }
    console.log(`✅ Synced ${jobCount} jobs`);

    // ==================== SYNC APPLICATIONS ====================
    console.log('\n📄 Syncing Applications...');
    const Application = (await import('../models/Application.js')).default;
    const applications = await Application.find();

    let appCount = 0;
    for (const app of applications) {
      // Application model có candidateId và jobpostId (chữ thường)
      if (app.candidateId && app.jobpostId) {
        try {
          await neo4jService.createApplication(
            app.toObject(),
            app.candidateId.toString(),
            app.jobpostId.toString()
          );
          appCount++;

          if (appCount % 10 === 0) {
            console.log(`  Processed ${appCount}/${applications.length} applications...`);
          }
        } catch (error) {
          // Skip nếu candidate hoặc job không tồn tại trong Neo4j
          console.log(`  Skipped application ${app._id}: ${error.message}`);
        }
      }
    }
    console.log(`✅ Synced ${appCount} applications`);

    // ==================== STATS ====================
    console.log('\n📈 Neo4j Database Stats:');
    const stats = await neo4jService.getStats();
    console.log(`  - Candidates: ${stats.candidates}`);
    console.log(`  - Jobs: ${stats.jobs}`);
    console.log(`  - Skills: ${stats.skills}`);
    console.log(`  - Companies: ${stats.companies}`);
    console.log(`  - Candidate Skills: ${stats.candidateSkills}`);
    console.log(`  - Job Requirements: ${stats.jobRequirements}`);

    console.log('\n✅ Sync completed successfully!');
  } catch (error) {
    console.error('❌ Error during sync:', error);
  } finally {
    await mongoose.connection.close();
    await driver().close();
    process.exit(0);
  }
};

// Run sync
syncToNeo4j();
