import mysql from 'mysql2/promise'

// Lazy-initialized connection pool for Vercel serverless
let pool: mysql.Pool | null = null

// Database connection configuration
function getDbConfig() {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lestylist_db',
    waitForConnections: true,
    connectionLimit: 5, // Lower limit for serverless
    maxIdle: 5,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  }
}

// Get or create connection pool (lazy initialization)
function getPool() {
  if (!pool) {
    pool = mysql.createPool(getDbConfig())
  }
  return pool
}

// Test connection
export async function testConnection() {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    console.log('✅ MySQL Database Connected Successfully!')
    connection.release()
    return true
  } catch (error) {
    console.error('❌ Database Connection Error:', error)
    return false
  }
}

// Execute query helper
export async function query(sql: string, params?: any[]) {
  try {
    const pool = getPool()
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error('Database Query Error:', error)
    throw error
  }
}

// Get connection from pool
export async function getConnection() {
  const pool = getPool()
  return await pool.getConnection()
}

// Export pool getter for advanced usage
export function getDbPool() {
  return getPool()
}

export default getPool()
