const sql = require('mssql');
require('dotenv').config({ path: './.env' });

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

async function addSellerStats() {
  try {
    console.log('🔄 Azure SQL Database\'e bağlanılıyor...');
    await sql.connect(config);
    console.log('✅ Bağlantı başarılı!\n');

    const sellerId = 3; // seller@demo.com

    // Önce mevcut verileri temizle
    console.log('🗑️  Mevcut SellerStats verileri temizleniyor...');
    await sql.query`DELETE FROM SellerStats WHERE sellerId = ${sellerId}`;
    console.log('✅ Temizlendi\n');

    // Seller'ın ürünlerini al
    console.log('📦 Seller\'ın ürünleri alınıyor...');
    const productsResult = await sql.query`
      SELECT id, name, price FROM Products WHERE sellerId = ${sellerId}
    `;
    const products = productsResult.recordset;
    console.log(`✅ ${products.length} ürün bulundu\n`);

    if (products.length === 0) {
      console.log('⚠️  Seller\'ın hiç ürünü yok!');
      return;
    }

    // Her ürün için rastgele istatistik ekle
    console.log('📊 Her ürün için istatistikler ekleniyor...');
    for (const product of products) {
      const sales = Math.floor(Math.random() * 200 + 50);
      const revenue = sales * product.price * (0.8 + Math.random() * 0.4); // Fiyatın %80-120'si
      const views = Math.floor(Math.random() * 5000 + 1000);

      await sql.query`
        INSERT INTO SellerStats (sellerId, productId, sales, revenue, views)
        VALUES (${sellerId}, ${product.id}, ${sales}, ${revenue}, ${views})
      `;
      
      console.log(`  ✓ ${product.name}: ${sales} satış, ₺${revenue.toFixed(2)} gelir, ${views} görüntülenme`);
    }

    // Özet bilgi
    console.log('\n📈 ÖZET:');
    const summaryResult = await sql.query`
      SELECT 
        COUNT(*) as productCount,
        SUM(sales) as totalSales,
        SUM(revenue) as totalRevenue,
        SUM(views) as totalViews
      FROM SellerStats
      WHERE sellerId = ${sellerId}
    `;
    
    const summary = summaryResult.recordset[0];
    console.log(`  • Toplam Ürün: ${summary.productCount}`);
    console.log(`  • Toplam Satış: ${summary.totalSales}`);
    console.log(`  • Toplam Gelir: ₺${Number(summary.totalRevenue).toLocaleString('tr-TR')}`);
    console.log(`  • Toplam Görüntülenme: ${summary.totalViews}`);

    console.log('\n🎉 SellerStats verileri başarıyla eklendi!');
    
  } catch (err) {
    console.error('❌ Hata:', err.message);
  } finally {
    await sql.close();
  }
}

addSellerStats();
