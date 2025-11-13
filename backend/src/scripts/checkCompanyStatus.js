import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Account from '../models/Account.js';
import Employer from '../models/Employer.js';

// Load environment variables
dotenv.config();

const checkCompanyStatus = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all employers
    const employers = await Employer.find({}).limit(10);
    console.log(`\nFound ${employers.length} employers (showing first 10):\n`);

    for (const employer of employers) {
      const account = await Account.findOne({ employerId: employer._id });
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Company: ${employer.companyName}`);
      console.log(`Employer ID: ${employer._id}`);
      console.log(`Account ID: ${account?._id || 'NOT FOUND'}`);
      console.log(`Account Status: ${account?.status || 'NO ACCOUNT'}`);
      console.log(`Account Type: ${account?.type || 'N/A'}`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Summary:');
    const statusCounts = await Account.aggregate([
      { $match: { type: 'employer' } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    statusCounts.forEach(item => {
      console.log(`${item._id}: ${item.count} accounts`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkCompanyStatus();
