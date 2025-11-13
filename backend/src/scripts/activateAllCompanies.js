import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Account from '../models/Account.js';

// Load environment variables
dotenv.config();

const activateAllCompanies = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all employer accounts that are locked
    const lockedAccounts = await Account.find({
      type: 'employer',
      status: 'locked'
    });

    console.log(`Found ${lockedAccounts.length} locked employer accounts`);

    if (lockedAccounts.length === 0) {
      console.log('No locked accounts to activate');
      process.exit(0);
    }

    // Update all to active
    const result = await Account.updateMany(
      {
        type: 'employer',
        status: 'locked'
      },
      {
        $set: { status: 'active' }
      }
    );

    console.log('✅ Successfully activated all company accounts!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Updated ${result.modifiedCount} accounts`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // List activated accounts
    const activatedAccounts = await Account.find({
      type: 'employer',
      status: 'active'
    }).populate('employerId', 'companyName');

    console.log('\n📋 Active company accounts:');
    activatedAccounts.forEach((account, index) => {
      console.log(`${index + 1}. ${account.employerId?.companyName || account.username} (${account.username})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error activating accounts:', error);
    process.exit(1);
  }
};

activateAllCompanies();
