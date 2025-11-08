import dotenv from 'dotenv';
import { driver, testConnection } from '../config/neo4j.js';

dotenv.config();

const initNeo4j = async () => {
  const session = driver.session();
  
  try {
    console.log('🚀 Initializing Neo4j database...\n');

    // Test connection
    await testConnection();

    // ==================== CREATE CONSTRAINTS ====================
    console.log('\n📋 Creating constraints...');

    // Account constraints
    try {
      await session.run(`
        CREATE CONSTRAINT account_id IF NOT EXISTS
        FOR (a:Account) REQUIRE a.MaTK IS UNIQUE
      `);
      console.log('✅ Account MaTK constraint created');
    } catch (error) {
      console.log('⚠️  Account constraint already exists');
    }

    // Candidate constraints
    try {
      await session.run(`
        CREATE CONSTRAINT candidate_id IF NOT EXISTS
        FOR (c:Candidate) REQUIRE c.MaUV IS UNIQUE
      `);
      console.log('✅ Candidate MaUV constraint created');
    } catch (error) {
      console.log('⚠️  Candidate constraint already exists');
    }

    // Employer constraints
    try {
      await session.run(`
        CREATE CONSTRAINT employer_id IF NOT EXISTS
        FOR (e:Employer) REQUIRE e.MaNTD IS UNIQUE
      `);
      console.log('✅ Employer MaNTD constraint created');
    } catch (error) {
      console.log('⚠️  Employer constraint already exists');
    }

    // JobPost constraints
    try {
      await session.run(`
        CREATE CONSTRAINT job_id IF NOT EXISTS
        FOR (j:JobPost) REQUIRE j.MaBTD IS UNIQUE
      `);
      console.log('✅ JobPost MaBTD constraint created');
    } catch (error) {
      console.log('⚠️  JobPost constraint already exists');
    }

    // Skill constraints
    try {
      await session.run(`
        CREATE CONSTRAINT skill_id IF NOT EXISTS
        FOR (s:Skill) REQUIRE s.MaKN IS UNIQUE
      `);
      console.log('✅ Skill MaKN constraint created');
    } catch (error) {
      console.log('⚠️  Skill constraint already exists');
    }

    // Application constraints
    try {
      await session.run(`
        CREATE CONSTRAINT application_id IF NOT EXISTS
        FOR (app:Application) REQUIRE app.MaHS IS UNIQUE
      `);
      console.log('✅ Application MaHS constraint created');
    } catch (error) {
      console.log('⚠️  Application constraint already exists');
    }

    // Position constraints
    try {
      await session.run(`
        CREATE CONSTRAINT position_id IF NOT EXISTS
        FOR (pos:Position) REQUIRE pos.MaVT IS UNIQUE
      `);
      console.log('✅ Position MaVT constraint created');
    } catch (error) {
      console.log('⚠️  Position constraint already exists');
    }

    // Location constraints
    try {
      await session.run(`
        CREATE CONSTRAINT location_id IF NOT EXISTS
        FOR (loc:Location) REQUIRE loc.MaDD IS UNIQUE
      `);
      console.log('✅ Location MaDD constraint created');
    } catch (error) {
      console.log('⚠️  Location constraint already exists');
    }

    // Status constraints
    try {
      await session.run(`
        CREATE CONSTRAINT status_id IF NOT EXISTS
        FOR (st:Status) REQUIRE st.MaTT IS UNIQUE
      `);
      console.log('✅ Status MaTT constraint created');
    } catch (error) {
      console.log('⚠️  Status constraint already exists');
    }

    // ==================== CREATE INDEXES ====================
    console.log('\n📊 Creating indexes...');

    // Index on Candidate HoTen
    try {
      await session.run(`
        CREATE INDEX candidate_name IF NOT EXISTS
        FOR (c:Candidate) ON (c.HoTen)
      `);
      console.log('✅ Candidate HoTen index created');
    } catch (error) {
      console.log('⚠️  Candidate name index already exists');
    }

    // Index on Candidate Email
    try {
      await session.run(`
        CREATE INDEX candidate_email IF NOT EXISTS
        FOR (c:Candidate) ON (c.Email)
      `);
      console.log('✅ Candidate Email index created');
    } catch (error) {
      console.log('⚠️  Candidate email index already exists');
    }

    // Index on JobPost TieuDe
    try {
      await session.run(`
        CREATE INDEX job_title IF NOT EXISTS
        FOR (j:JobPost) ON (j.TieuDe)
      `);
      console.log('✅ JobPost TieuDe index created');
    } catch (error) {
      console.log('⚠️  JobPost title index already exists');
    }

    // Index on JobPost TrangThai
    try {
      await session.run(`
        CREATE INDEX job_status IF NOT EXISTS
        FOR (j:JobPost) ON (j.TrangThai)
      `);
      console.log('✅ JobPost TrangThai index created');
    } catch (error) {
      console.log('⚠️  JobPost status index already exists');
    }

    // Index on Employer TenCongTy
    try {
      await session.run(`
        CREATE INDEX employer_name IF NOT EXISTS
        FOR (e:Employer) ON (e.TenCongTy)
      `);
      console.log('✅ Employer TenCongTy index created');
    } catch (error) {
      console.log('⚠️  Employer name index already exists');
    }

    // Index on Skill TenKyNang
    try {
      await session.run(`
        CREATE INDEX skill_name IF NOT EXISTS
        FOR (s:Skill) ON (s.TenKyNang)
      `);
      console.log('✅ Skill TenKyNang index created');
    } catch (error) {
      console.log('⚠️  Skill name index already exists');
    }

    // Index on Application TrangThai
    try {
      await session.run(`
        CREATE INDEX application_status IF NOT EXISTS
        FOR (app:Application) ON (app.TrangThai)
      `);
      console.log('✅ Application TrangThai index created');
    } catch (error) {
      console.log('⚠️  Application status index already exists');
    }

    // ==================== VERIFY ====================
    console.log('\n🔍 Verifying database setup...');

    const constraintsResult = await session.run('SHOW CONSTRAINTS');
    console.log(`✅ Total constraints: ${constraintsResult.records.length}`);

    const indexesResult = await session.run('SHOW INDEXES');
    console.log(`✅ Total indexes: ${indexesResult.records.length}`);

    console.log('\n✅ Neo4j initialization completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure Neo4j is running');
    console.log('   2. Update .env with Neo4j credentials');
    console.log('   3. Run: node src/scripts/syncToNeo4j.js');

  } catch (error) {
    console.error('❌ Error during initialization:', error);
  } finally {
    await session.close();
    await driver.close();
    process.exit(0);
  }
};

// Run initialization
initNeo4j();
