// Script để test API
import http from 'http';

const testAPI = (path, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        console.log(`\n✅ ${method} ${path}`);
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response:`, JSON.parse(body));
        resolve(body);
      });
    });

    req.on('error', (error) => {
      console.error(`\n❌ ${method} ${path}`);
      console.error(`Error:`, error.message);
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};

// Test các API
(async () => {
  try {
    console.log('🧪 Testing Backend APIs...\n');
    
    // Test health check
    await testAPI('/api/health');
    
    // Test get all jobs (public)
    await testAPI('/api/jobs');
    
    // Test get recent jobs
    await testAPI('/api/jobs/recent');
    
    console.log('\n✨ All tests completed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
})();
