import mysql from 'mysql2/promise'

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lestylist_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create connection pool
const pool = mysql.createPool(dbConfig)

// Test connection
export async function testConnection() {
  try {
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
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error('Database Query Error:', error)
    throw error
  }
}

// Get connection from pool
export async function getConnection() {
  return await pool.getConnection()
}

export default pool

