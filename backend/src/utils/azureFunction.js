/**
 * Azure Function — Nightly Seller Stats Recalculation
 * Schedule: Her gece 02:00 UTC (cron: "0 0 2 * * *")
 *
 * Azure Function App'e bu dosyayı ayrı bir Function olarak deploy edin.
 * Timer trigger ile çalışır, sp_RecalcSellerStats stored procedure'ı çağırır.
 */

const { getPool } = require('../config/database');

module.exports = async function nightlyStatsRecalc(context) {
  context.log('Nightly SellerStats recalculation started.');
  try {
    const pool = await getPool();
    await pool.request().execute('sp_RecalcSellerStats');
    context.log('SellerStats recalculation completed successfully.');
  } catch (err) {
    context.log.error('Recalculation failed:', err.message);
    throw err;
  }
};
