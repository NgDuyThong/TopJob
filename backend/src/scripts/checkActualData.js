import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

const checkData = async () => {
  try {
    console.log('🔍 Kết nối MongoDB Atlas...');
    console.log('URI:', process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Đã kết nối thành công!\n');

    const db = mongoose.connection.db;
    
    // Kiểm tra tất cả collections
    const collections = await db.listCollections().toArray();
    console.log('📦 Collections trong database:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    console.log('');

    // Đếm documents trong mỗi collection
    console.log('📊 Số lượng documents THỰC TẾ trong database:');
    console.log('='.repeat(50));
    
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`${col.name.padEnd(20)} : ${count.toString().padStart(6)} documents`);
    }
    
    console.log('='.repeat(50));
    console.log('');
    
    // Kiểm tra chi tiết jobposts
    const jobpostsCount = await db.collection('jobposts').countDocuments();
    console.log(`\n📋 Chi tiết JobPosts: ${jobpostsCount} documents`);
    
    if (jobpostsCount > 0) {
      // Lấy 3 samples
      const samples = await db.collection('jobposts').find().limit(3).toArray();
      console.log('\n🔍 Sample data (3 documents đầu tiên):');
      samples.forEach((doc, idx) => {
        console.log(`\nDocument ${idx + 1}:`);
        console.log(`  _id: ${doc._id}`);
        console.log(`  title: ${doc.title}`);
        console.log(`  employerId: ${doc.employerId}`);
        console.log(`  position: ${JSON.stringify(doc.position)}`);
      });
      
      // Đếm theo category
      const categoryPipeline = [
        {
          $group: {
            _id: '$position.title',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ];
      
      const categoryStats = await db.collection('jobposts').aggregate(categoryPipeline).toArray();
      console.log('\n📊 Top 10 Position Titles:');
      categoryStats.forEach(stat => {
        console.log(`  ${stat._id}: ${stat.count} jobs`);
      });
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Đã đóng kết nối');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
};

checkData();
