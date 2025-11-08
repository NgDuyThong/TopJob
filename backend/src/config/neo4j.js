import neo4j from 'neo4j-driver';

// Lazy initialization - chỉ tạo driver khi cần
let driver = null;

const getDriver = () => {
  if (!driver) {
    driver = neo4j.driver(
      process.env.NEO4J_URI || 'bolt://localhost:7687',
      neo4j.auth.basic(
        process.env.NEO4J_USER || 'neo4j',
        process.env.NEO4J_PASSWORD || 'password'
      )
    );
  }
  return driver;
};

// Test connection
const testConnection = async () => {
  const currentDriver = getDriver();
  const session = currentDriver.session();
  try {
    const result = await session.run('RETURN "Connection successful" as message');
    console.log('✅ Neo4j connected:', result.records[0].get('message'));
  } catch (error) {
    console.error('❌ Neo4j connection failed:', error.message);
  } finally {
    await session.close();
  }
};

// Close driver on app termination
const closeDriver = async () => {
  if (driver) {
    await driver.close();
    console.log('Neo4j driver closed');
    driver = null;
  }
};

export { getDriver as driver, testConnection, closeDriver };
