import { driver } from '../config/neo4j.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function checkData() {
  const session = driver().session();
  try {
    console.log('🔍 Checking Neo4j Data\n');
    
    // Count nodes
    const counts = await session.run(`
      MATCH (c:Candidate) WITH count(c) as candidates
      MATCH (j:JobPost) WITH candidates, count(j) as jobs
      MATCH (s:Skill) WITH candidates, jobs, count(s) as skills
      MATCH (e:Employer) WITH candidates, jobs, skills, count(e) as employers
      RETURN candidates, jobs, skills, employers
    `);
    
    const stats = counts.records[0];
    console.log('📊 Node Counts:');
    console.log(`  Candidates: ${stats.get('candidates').toNumber()}`);
    console.log(`  Jobs: ${stats.get('jobs').toNumber()}`);
    console.log(`  Skills: ${stats.get('skills').toNumber()}`);
    console.log(`  Employers: ${stats.get('employers').toNumber()}\n`);
    
    // Check relationships
    const hasSkillCount = await session.run(`MATCH ()-[r:HAS_SKILL]->() RETURN count(r) as count`);
    const requiresSkillCount = await session.run(`MATCH ()-[r:REQUIRES_SKILL]->() RETURN count(r) as count`);
    const postedCount = await session.run(`MATCH ()-[r:POSTED]->() RETURN count(r) as count`);
    
    console.log('🔗 Relationship Counts:');
    console.log(`  HAS_SKILL: ${hasSkillCount.records[0]?.get('count').toNumber() || 0}`);
    console.log(`  REQUIRES_SKILL: ${requiresSkillCount.records[0]?.get('count').toNumber() || 0}`);
    console.log(`  POSTED: ${postedCount.records[0]?.get('count').toNumber() || 0}\n`);
    
    // Sample candidate with skills
    const sampleCandidate = await session.run(`
      MATCH (c:Candidate)-[hs:HAS_SKILL]->(s:Skill)
      WITH c, collect(s.TenKyNang) as skills
      WHERE size(skills) > 0
      RETURN c.MaUV as id, c.HoTen as name, skills
      LIMIT 1
    `);
    
    if (sampleCandidate.records.length > 0) {
      const cand = sampleCandidate.records[0];
      console.log('👤 Sample Candidate:');
      console.log(`  Name: ${cand.get('name')}`);
      console.log(`  ID: ${cand.get('id')}`);
      console.log(`  Skills: ${cand.get('skills').join(', ')}\n`);
    }
    
    // Sample job with requirements
    const sampleJob = await session.run(`
      MATCH (j:JobPost)-[rs:REQUIRES_SKILL]->(s:Skill)
      WITH j, collect(s.TenKyNang) as skills
      WHERE size(skills) > 0
      RETURN j.MaBTD as id, j.TieuDe as title, skills
      LIMIT 1
    `);
    
    if (sampleJob.records.length > 0) {
      const job = sampleJob.records[0];
      console.log('💼 Sample Job:');
      console.log(`  Title: ${job.get('title')}`);
      console.log(`  ID: ${job.get('id')}`);
      console.log(`  Required Skills: ${job.get('skills').join(', ')}\n`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await session.close();
    process.exit(0);
  }
}

checkData();
