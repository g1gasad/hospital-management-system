import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

// Set default output format to return objects instead of arrays
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Oracle configuration
const oracleConfig = {
  user: process.env.ORACLE_USER || 'system',
  password: process.env.ORACLE_PASSWORD || 'oracle',
  connectString: process.env.ORACLE_CONNECT_STRING || 'localhost:1521:xe'
};

// Initialize Oracle Client
try {
  oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_PATH || 'C:\\instantclient_21_12' });
} catch (err) {
  console.log('Oracle Client initialization note:', err.message);
}

// Connection pool configuration
let pool;

export async function initializePool() {
  try {
    pool = await oracledb.createPool({
      user: oracleConfig.user,
      password: oracleConfig.password,
      connectString: oracleConfig.connectString,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
      poolTimeout: 60
    });
    console.log('✓ Oracle Connection Pool Created Successfully');
    return pool;
  } catch (err) {
    console.error('✗ Error creating Oracle Connection Pool:', err.message);
    throw err;
  }
}

export async function getConnection() {
  try {
    if (!pool) {
      await initializePool();
    }
    return await pool.getConnection();
  } catch (err) {
    console.error('✗ Error getting connection from pool:', err.message);
    throw err;
  }
}

export async function closePool() {
  try {
    if (pool) {
      await pool.close();
      console.log('✓ Oracle Connection Pool Closed');
    }
  } catch (err) {
    console.error('✗ Error closing pool:', err.message);
  }
}

export default {
  initializePool,
  getConnection,
  closePool
};
