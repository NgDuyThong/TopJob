import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Account from '../models/Account.js';

// Load environment variables
dotenv.config();

const createAdminAccount = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Account.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log('Username: admin');
      console.log('You can reset the password by deleting this account first.');
      process.exit(0);
    }

    // Create admin account
    const adminAccount = new Account({
      username: 'admin',
      password: 'admin123', // Will be hashed automatically by pre-save hook
      type: 'admin',
      status: 'active'
    });

    await adminAccount.save();

    console.log('✅ Admin account created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Username: admin');
    console.log('🔑 Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
    process.exit(1);
  }
};

createAdminAccount();
