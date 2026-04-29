require('dotenv').config();

// Azure Application Insights - production monitoring
if (process.env.NODE_ENV === 'production' && process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  const appInsights = require('applicationinsights');
  appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY).start();
}

const app = require('./app');
const { getPool } = require('./config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await getPool();
    console.log('Azure SQL Database connected.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();
