const sql = require('mssql');

// Azure SQL connection with connection string support
let config;

if (process.env.DB_CONNECTION_STRING) {
  // Use connection string if provided
  config = process.env.DB_CONNECTION_STRING;
  console.log('Using connection string for database');
} else {
  // Use individual parameters
  config = {
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
}

let pool;

async function getPool() {
  if (!pool) {
    try {
      console.log('Attempting database connection...');
      pool = await sql.connect(config);
      console.log('✅ Database connection successful');
    } catch (err) {
      console.error('❌ Database connection failed:', err.message);
      console.error('Error code:', err.code);
      console.error('Error number:', err.number);
      
      // Try alternative connection method
      if (!process.env.DB_CONNECTION_STRING && err.code === 'ELOGIN') {
        console.log('Trying alternative connection string format...');
        const altConfig = `Server=tcp:${process.env.DB_SERVER},${process.env.DB_PORT};Database=${process.env.DB_NAME};User Id=${process.env.DB_USER};Password=${process.env.DB_PASSWORD};Encrypt=true;TrustServerCertificate=false;Connection Timeout=30;`;
        try {
          pool = await sql.connect(altConfig);
          console.log('✅ Alternative connection successful');
        } catch (altErr) {
          console.error('❌ Alternative connection also failed:', altErr.message);
          throw altErr;
        }
      } else {
        throw err;
      }
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
