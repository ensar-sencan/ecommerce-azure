const sql = require('mssql');

// Try connection string format for Azure SQL
const connectionString = process.env.DB_CONNECTION_STRING;

const config = connectionString ? connectionString : {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;

async function getPool() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log('Database connection successful');
    } catch (err) {
      console.error('Database connection error details:', {
        message: err.message,
        code: err.code,
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
      });
      throw err;
    }
  }
  return pool;
}

async function query(queryString, params = {}) {
  const pool = await getPool();
  const request = pool.request();
  Object.entries(params).forEach(([key, value]) => {
    request.input(key, value);
  });
  return request.query(queryString);
}

module.exports = { getPool, query, sql };
