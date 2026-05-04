const sql = require('mssql');

// Azure SQL connection with detailed error handling
const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000,
  },
  authentication: {
    type: 'default',
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
      console.log('Attempting database connection with config:', {
        server: config.server,
        database: config.database,
        user: config.user,
        port: config.port,
      });
      pool = await sql.connect(config);
      console.log('✅ Database connection successful');
    } catch (err) {
      console.error('❌ Database connection error details:', {
        message: err.message,
        code: err.code,
        number: err.number,
        state: err.state,
        class: err.class,
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        passwordLength: process.env.DB_PASSWORD?.length,
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
