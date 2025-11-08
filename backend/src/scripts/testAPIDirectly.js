import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function testAPI() {
  console.log('🧪 Testing API Endpoints Directly\n');
  console.log('='.repeat(70));
  
  const baseURL = `http://localhost:${process.env.PORT || 5000}/api`;
  
  try {
    // Test 1: Check if server is running
    console.log('TEST 1: Check Server Status');
    console.log('-'.repeat(70));
    
    try {
      const healthCheck = await fetch(`${baseURL}/../health`);
      if (healthCheck.ok) {
        console.log('✅ Server is running');
      }
    } catch (error) {
      console.log('❌ Server is NOT running!');
      console.log('   Please start server: npm run dev');
      process.exit(1);
    }
    
    // Test 2: Login to get token
    console.log('\nTEST 2: Login to get JWT token');
    console.log('-'.repeat(70));
    
    const loginResponse = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'candidate1',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed. Using test account...');
      console.log('   Username: candidate1, Password: password123');
      console.log('   Make sure you have seeded data: node src/scripts/seedData.js');
      process.exit(1);
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful');
    console.log(`   Token: ${token.substring(0, 20)}...`);
    
    // Test 3: Call matching-jobs API
    console.log('\nTEST 3: Call /api/candidates/matching-jobs');
    console.log('-'.repeat(70));
    
    const jobsResponse = await fetch(`${baseURL}/candidates/matching-jobs`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!jobsResponse.ok) {
      console.log('❌ API call failed');
      const error = await jobsResponse.text();
      console.log('   Error:', error);
      process.exit(1);
    }
    
    const jobsData = await jobsResponse.json();
    
    console.log('✅ API call successful');
    console.log(`   Status: ${jobsData.status}`);
    console.log(`   Source: ${jobsData.source || 'NOT SPECIFIED'}`);
    console.log(`   Jobs found: ${jobsData.data?.length || 0}`);
    
    if (jobsData.source === 'neo4j') {
      console.log('\n🎉 CONFIRMED: API is using Neo4j!');
      
      if (jobsData.data && jobsData.data.length > 0) {
        const firstJob = jobsData.data[0];
        console.log('\n📋 Sample Job:');
        console.log(`   Title: ${firstJob.title}`);
        console.log(`   Match Score: ${firstJob.matchScore}%`);
        console.log(`   Matching Skills: ${firstJob.matchingSkillsCount}/${firstJob.totalRequiredSkills}`);
        console.log(`   Skills: ${firstJob.matchingSkills?.join(', ')}`);
      }
    } else {
      console.log('\n⚠️  WARNING: API is NOT using Neo4j!');
      console.log('   Response does not have "source": "neo4j"');
      console.log('   This means MongoDB is being used instead');
    }
    
    // Test 4: Test employer API
    console.log('\n' + '='.repeat(70));
    console.log('TEST 4: Test Employer API (if available)');
    console.log('-'.repeat(70));
    
    // Login as employer
    const employerLogin = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'employer1',
        password: 'password123'
      })
    });
    
    if (employerLogin.ok) {
      const employerData = await employerLogin.json();
      const employerToken = employerData.token;
      console.log('✅ Employer login successful');
      
      // Get employer's jobs
      const jobsListResponse = await fetch(`${baseURL}/employers/jobs`, {
        headers: { 'Authorization': `Bearer ${employerToken}` }
      });
      
      if (jobsListResponse.ok) {
        const jobsList = await jobsListResponse.json();
        if (jobsList.data && jobsList.data.length > 0) {
          const jobId = jobsList.data[0]._id;
          console.log(`   Testing with job: ${jobsList.data[0].title}`);
          
          // Test matching candidates
          const candidatesResponse = await fetch(
            `${baseURL}/employers/jobs/${jobId}/matching-candidates`,
            { headers: { 'Authorization': `Bearer ${employerToken}` } }
          );
          
          if (candidatesResponse.ok) {
            const candidatesData = await candidatesResponse.json();
            console.log(`✅ Matching candidates API works`);
            console.log(`   Source: ${candidatesData.source || 'NOT SPECIFIED'}`);
            console.log(`   Candidates found: ${candidatesData.data?.length || 0}`);
            
            if (candidatesData.source === 'neo4j') {
              console.log('🎉 CONFIRMED: Employer API is using Neo4j!');
            } else {
              console.log('⚠️  WARNING: Employer API is NOT using Neo4j!');
            }
          }
        }
      }
    } else {
      console.log('⚠️  Employer test skipped (no employer account)');
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ API TEST COMPLETED!');
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

testAPI();
