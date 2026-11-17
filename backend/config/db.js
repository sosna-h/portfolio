const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;
let isConnected = false;

// Fallback in-memory store in case MySQL is temporarily stopped
const fallbackStorage = {
  contact_messages: [],
  projects: []
};

async function initDatabase() {
  try {
    // Attempt connecting to the specific database
    pool = mysql.createPool(dbConfig);
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    isConnected = true;
    console.log(`[DB] Connected successfully to MySQL (${dbConfig.database} on ${dbConfig.host}:${dbConfig.port})`);
    return pool;
  } catch (err) {
    if (err.code === 'ER_BAD_DB_ERROR') {
      console.warn(`[DB] Database "${dbConfig.database}" does not exist. Attempting auto-creation...`);
      try {
        const rootConn = await mysql.createConnection({
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password
        });
        await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await rootConn.end();
        console.log(`[DB] Database "${dbConfig.database}" created successfully.`);
        pool = mysql.createPool(dbConfig);
        isConnected = true;
        return pool;
      } catch (createErr) {
        console.error('[DB] Failed to auto-create database:', createErr.message);
      }
    }

    console.warn(`[DB] MySQL connection notice: ${err.message}. Operating with resilient database handler.`);
    isConnected = false;
    return null;
  }
}

function getPool() {
  return pool;
}

function isDbOnline() {
  return isConnected;
}

function getFallbackStorage() {
  return fallbackStorage;
}

module.exports = {
  dbConfig,
  initDatabase,
  getPool,
  isDbOnline,
  getFallbackStorage
};
