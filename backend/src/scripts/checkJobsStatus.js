import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import JobPost from '../models/JobPost.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function checkJobs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const total = await JobPost.countDocuments();
    const open = await JobPost.countDocuments({ status: 'open' });
    const active = await JobPost.countDocuments({ status: 'active' });
    const closed = await JobPost.countDocuments({ status: 'closed' });
    
    console.log('📊 Job Status:');
    console.log(`  Total: ${total}`);
    console.log(`  Open: ${open}`);
    console.log(`  Active: ${active}`);
    console.log(`  Closed: ${closed}\n`);
    
    // Check deadline
    const now = new Date();
    const validJobs = await JobPost.countDocuments({
      status: 'open',
      deadline: { $gt: now }
    });
    
    const expiredJobs = await JobPost.countDocuments({
      status: 'open',
      deadline: { $lte: now }
    });
    
    console.log('📅 Deadline Status:');
    console.log(`  Valid (not expired): ${validJobs}`);
    console.log(`  Expired: ${expiredJobs}\n`);
    
    if (validJobs === 0) {
      console.log('⚠️  WARNING: No valid jobs found!');
      console.log('   All jobs either:');
      console.log('   - Have status != "open"');
      console.log('   - Or deadline has passed\n');
      
      // Show sample job
      const sampleJob = await JobPost.findOne().sort({ datePosted: -1 });
      if (sampleJob) {
        console.log('📋 Sample Job:');
        console.log(`  Title: ${sampleJob.title}`);
        console.log(`  Status: ${sampleJob.status}`);
        console.log(`  Deadline: ${sampleJob.deadline}`);
        console.log(`  Is Expired: ${sampleJob.deadline < now ? 'Yes' : 'No'}\n`);
      }
      
      // Fix: Update jobs to have valid deadline
      console.log('🔧 Fixing jobs...');
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30); // 30 days from now
      
      const result = await JobPost.updateMany(
        {},
        {
          $set: {
            status: 'open',
            deadline: futureDate
          }
        }
      );
      
      console.log(`✅ Updated ${result.modifiedCount} jobs`);
      console.log(`   New deadline: ${futureDate.toLocaleDateString()}\n`);
      
      // Verify
      const newValidJobs = await JobPost.countDocuments({
        status: 'open',
        deadline: { $gt: now }
      });
      console.log(`✅ Now have ${newValidJobs} valid jobs`);
    } else {
      console.log('✅ Jobs are OK!');
      
      // Show sample
      const sampleJob = await JobPost.findOne({
        status: 'open',
        deadline: { $gt: now }
      }).populate('employerId', 'companyName');
      
      if (sampleJob) {
        console.log('\n📋 Sample Valid Job:');
        console.log(`  Title: ${sampleJob.title}`);
        console.log(`  Company: ${sampleJob.employerId?.companyName || 'N/A'}`);
        console.log(`  Status: ${sampleJob.status}`);
        console.log(`  Deadline: ${sampleJob.deadline.toLocaleDateString()}`);
        console.log(`  Location: ${sampleJob.location?.city || 'N/A'}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

checkJobs();
