import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Account from '../models/Account.js';

// Load environment variables
dotenv.config();

const createAdmin1Account = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin1 already exists
    const existingAdmin = await Account.findOne({ username: 'admin1' });
    if (existingAdmin) {
      console.log('⚠️  Admin1 account already exists!');
      console.log('Username: admin1');
      console.log('You can reset the password by deleting this account first.');
      process.exit(0);
    }

    // Create admin1 account
    const admin1Account = new Account({
      username: 'admin1',
      password: 'admin1234', // Will be hashed automatically by pre-save hook
      type: 'admin',
      status: 'active'
    });

    await admin1Account.save();

    console.log('✅ Admin1 account created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Username: admin1');
    console.log('🔑 Password: admin1234');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin1 account:', error);
    process.exit(1);
  }
};

createAdmin1Account();
