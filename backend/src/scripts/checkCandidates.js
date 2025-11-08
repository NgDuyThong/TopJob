import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Candidate from '../models/Candidate.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const checkCandidates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database\n');

    // Lấy 5 candidates mẫu
    const samples = await Candidate.find().limit(5);
    
    console.log('📋 Sample Candidates:\n');
    samples.forEach((candidate, idx) => {
      console.log(`Candidate ${idx + 1}:`);
      console.log(`  Name: ${candidate.name}`);
      console.log(`  Email: ${candidate.email}`);
      console.log(`  Skills: ${candidate.skills?.join(', ') || 'N/A'}`);
      console.log(`  Education: ${candidate.education?.map(e => e.degree).join(', ') || 'N/A'}`);
      console.log('');
    });

    // Tìm ứng viên có MongoDB
    console.log('\n🔍 Searching for candidates with MongoDB skill...\n');
    const mongodbCandidates = await Candidate.find({
      skills: { $regex: /mongodb/i }
    }).limit(3);
    
    console.log(`Found ${mongodbCandidates.length} candidates with MongoDB skill`);
    mongodbCandidates.forEach((candidate, idx) => {
      console.log(`\n  ${idx + 1}. ${candidate.name}`);
      console.log(`     Skills: ${candidate.skills?.join(', ')}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkCandidates();
