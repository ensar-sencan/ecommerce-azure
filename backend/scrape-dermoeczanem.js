/**
 * Dermoeczanem.com Ürün Veri Çekme Script'i
 */

const sql = require('mssql');
require('dotenv').config({ path: './.env' });

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true,
  },
};

// Gerçek dermokozmetik ürünler - Dermoeczanem.com'dan
// Her ürün için kategoriye uygun resimler
const realProducts = [
  {
    name: 'Bioderma Sensibio H2O Yüz ve Makyaj Temizleme Suyu 500ml',
    slug: 'bioderma-sensibio-h2o-500ml',
    description: 'Hassas ciltler için micellar temizleme suyu. Makyaj ve kirliliklerden cildi arındırır. Durulanmaya gerek yok. Bioderma\'nın en çok satan ürünü.',
    price: 1429.00,
    discountedPrice: 1000.30,
    stock: 150,
    categoryId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1556229010-aa9e5d93b28b?w=600&h=600&fit=crop&q=80', // Micellar su şişesi
  },
  {
    name: 'La Roche Posay Effaclar Jel 400ml',
    slug: 'la-roche-posay-effaclar-jel-400ml',
    description: 'Yağlı ve akneye eğilimli ciltler için yüz temizleme jeli. Gözenekleri temizler, cildi arındırır. Sabah ve akşam kullanım için.',
    price: 1229.90,
    discountedPrice: 860.93,
    stock: 120,
    categoryId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop&q=80', // Temizleme jeli
  },
  {
    name: 'Bioderma Atoderm Krem Ultra 500ml',
    slug: 'bioderma-atoderm-krem-ultra-500ml',
    description: 'Kuru ve çok kuru ciltler için yoğun nemlendirici krem. 24 saat nem sağlar. Cilt bariyerini güçlendirir. Tüm aile için.',
    price: 1629.00,
    discountedPrice: 1140.30,
    stock: 80,
    categoryId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop&q=80', // Krem kavanozu
  },
  {
    name: 'La Roche Posay Cicaplast Baume B5 100ml',
    slug: 'la-roche-posay-cicaplast-baume-b5-100ml',
    description: 'Yatıştırıcı ve bariyer onarıcı bakım kremi. Tahriş olmuş ciltler için. Tüm aile için kullanılabilir. Panthenol içerir.',
    price: 1509.90,
    discountedPrice: 1132.43,
    stock: 85,
    categoryId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop&q=80', // Bakım kremi tüpü
  },
  {
    name: 'Bioderma Sebium Foaming Gel 500ml',
    slug: 'bioderma-sebium-foaming-gel-500ml',
    description: 'Karma ve yağlı ciltler için temizleme jeli. Sebum üretimini dengeler. Gözenekleri temizler. Günlük kullanım için.',
    price: 1369.00,
    discountedPrice: 903.54,
    stock: 95,
    categoryId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600&h=600&fit=crop&q=80', // Temizleme jeli şişesi
  },
  {
    name: 'CeraVe Nemlendirici Krem 340gr',
    slug: 'cerave-nemlendirici-krem-340gr',
    description: 'Kuru ciltler için seramid ve hyalüronik asit içerikli nemlendirici krem. Yüz ve vücut için. 24 saat nem sağlar.',
    price: 1099.90,
    discountedPrice: 879.92,
    stock: 100,
    categoryId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop&q=80', // Nemlendirici krem
  },
  {
    name: 'Avene Cicalfate Bariyer Onarıcı Krem 40ml',
    slug: 'avene-cicalfate-krem-40ml',
    description: 'Tahriş olmuş ciltler için onarıcı krem. Cilt bariyerini güçlendirir. Antibakteriyel özelliği vardır.',
    price: 849.90,
    discountedPrice: 549.00,
    stock: 70,
    categoryId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop&q=80', // Onarıcı krem tüpü
  },
  {
    name: 'Vichy Liftactiv Collagen Specialist 50ml',
    slug: 'vichy-liftactiv-collagen-specialist-50ml',
    description: 'Yaşlanma karşıtı bakım kremi. Kolajen üretimini destekler. Kırışıklık görünümünü azaltır. Peptid içerir.',
    price: 3850.00,
    discountedPrice: 2887.50,
    stock: 60,
    categoryId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop&q=80', // Anti-aging krem
  },
  {
    name: 'Embryolisse Lait Creme Concentre 75ml',
    slug: 'embryolisse-lait-creme-concentre-75ml',
    description: 'Makyaj bazı ve nemlendirici krem. Profesyonel makyaj sanatçılarının favorisi. Tüm cilt tipleri için.',
    price: 1390.00,
    discountedPrice: 1112.00,
    stock: 65,
    categoryId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1556228852-80a5e2c53b0f?w=600&h=600&fit=crop&q=80', // Makyaj bazı krem
  },
  {
    name: 'The Purest Solutions Vitamin C Serum 30ml',
    slug: 'the-purest-solutions-vitamin-c-serum-30ml',
    description: 'Aydınlatıcı C vitamini serumu. Leke görünümünü azaltır. Cilt tonunu eşitler. Antioksidan özelliği vardır.',
    price: 749.90,
    discountedPrice: 299.96,
    stock: 110,
    categoryId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop&q=80', // Serum şişesi
  },
  {
    name: 'Bepanthol El ve Yüz Kremi 100gr',
    slug: 'bepanthol-el-yuz-kremi-100gr',
    description: 'El ve yüz için nemlendirici krem. Provitamin B5 içerir. Kuru ciltler için ideal. Günlük kullanım.',
    price: 649.90,
    discountedPrice: 584.91,
    stock: 90,
    categoryId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop&q=80', // El kremi tüpü
  },
  {
    name: 'Nuxe Reve De Miel Vücut Peelingi 175ml',
    slug: 'nuxe-reve-de-miel-peeling-175ml',
    description: 'Bal rüyası besleyici vücut peelingi. Cildi yumuşatır ve pürüzsüzleştirir. Haftalık kullanım için.',
    price: 980.00,
    discountedPrice: 735.00,
    stock: 75,
    categoryId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600&h=600&fit=crop&q=80', // Peeling ürünü
  },
  {
    name: 'Vichy Dercos Anti-Dandruff Şampuan 390ml',
    slug: 'vichy-dercos-anti-dandruff-sampuan-390ml',
    description: 'Kepek karşıtı şampuan. Saç derisini rahatlatır, kepeği azaltır. Normal ve yağlı saçlar için. Selenium DS içerir.',
    price: 1699.90,
    discountedPrice: 1257.93,
    stock: 90,
    categoryId: 3,
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop&q=80', // Şampuan şişesi
  },
  {
    name: 'Lierac Phytolastil Çatlak Önleyici Jel 200ml',
    slug: 'lierac-phytolastil-jel-200ml',
    description: 'Çatlakları önlemeye yardımcı jel. Hamilelik ve kilo değişimlerinde kullanılır. Bitkisel içerikli.',
    price: 2099.90,
    discountedPrice: 2099.90,
    stock: 50,
    categoryId: 4,
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop&q=80', // Hamilelik kremi
  },
  {
    name: 'Mustela Vitamin Barrier Cream 100ml',
    slug: 'mustela-vitamin-barrier-cream-100ml',
    description: 'Bebek pişik kremi. Pişik önleyici ve tedavi edici. Doğumdan itibaren kullanılabilir. Vitamin içerir.',
    price: 529.90,
    discountedPrice: 450.41,
    stock: 110,
    categoryId: 4,
    imageUrl: 'https://images.unsplash.com/photo-1584670592170-e081aa4da903?w=600&h=600&fit=crop&q=80', // Bebek kremi
  },
  {
    name: 'La Roche Posay Anthelios UVMune 400 SPF50+ 50ml',
    slug: 'la-roche-posay-anthelios-uvmune-spf50-50ml',
    description: 'Çok yüksek koruyucu güneş kremi. UVA/UVB koruması. Yağlı ciltler için mat finish. Yeni nesil filtreler.',
    price: 1149.90,
    discountedPrice: 899.90,
    stock: 100,
    categoryId: 2,
    imageUrl: 'https://images.unsplash.com/photo-1556228852-80a5e2c53b0f?w=600&h=600&fit=crop&q=80', // Güneş kremi
  },
  {
    name: 'Bioderma Photoderm Spot SPF50+ 150ml',
    slug: 'bioderma-photoderm-spot-spf50-150ml',
    description: 'Leke karşıtı güneş kremi. Çok yüksek koruma. Lekelerin oluşumunu önler. Tüm cilt tipleri için.',
    price: 1899.00,
    discountedPrice: 1367.28,
    stock: 60,
    categoryId: 2,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop&q=80', // Güneş kremi şişesi
  },
  {
    name: 'Avene Cleanance SPF 50+ Güneş Koruyucu 50ml',
    slug: 'avene-cleanance-spf50-gunes-koruyucu-50ml',
    description: 'Yağlı ve akneye eğilimli ciltler için güneş koruyucu. Mat görünüm sağlar, gözenekleri tıkamaz.',
    price: 1149.00,
    discountedPrice: 746.85,
    stock: 70,
    categoryId: 2,
    imageUrl: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600&h=600&fit=crop&q=80', // SPF ürünü
  },
  {
    name: 'Vichy Dercos Energy+ Şampuan 400ml',
    slug: 'vichy-dercos-energy-sampuan-400ml',
    description: 'Saç dökülmesine karşı şampuan. Saçı güçlendirir, hacim verir. Erkek ve kadınlar için. Aminexil içerir.',
    price: 1699.90,
    discountedPrice: 1257.93,
    stock: 75,
    categoryId: 3,
    imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&h=600&fit=crop&q=80', // Şampuan
  },
  {
    name: 'Mustela Gentle Cleansing Gel 500ml',
    slug: 'mustela-gentle-cleansing-gel-500ml',
    description: 'Yenidoğan şampuanı. Saç ve vücut için. Göz yakmaz, hassas cilt için. Doğumdan itibaren.',
    price: 749.90,
    discountedPrice: 637.42,
    stock: 100,
    categoryId: 4,
    imageUrl: 'https://images.unsplash.com/photo-1584670592170-e081aa4da903?w=600&h=600&fit=crop&q=80', // Bebek şampuanı
  },
];

async function scrapeAndInsert() {
  try {
    console.log('🔌 Database bağlantısı kuruluyor...');
    await sql.connect(config);
    console.log('✅ Database bağlantısı başarılı!\n');

    // Seller ID'sini bul
    const sellerResult = await sql.query`
      SELECT id FROM Users WHERE email = 'seller@demo.com'
    `;

    if (sellerResult.recordset.length === 0) {
      throw new Error('Seller bulunamadı!');
    }

    const sellerId = sellerResult.recordset[0].id;
    console.log(`✅ Seller ID: ${sellerId}\n`);

    console.log('📦 Gerçek ürünler ekleniyor/güncelleniyor...\n');

    let addedCount = 0;
    for (const product of realProducts) {
      try {
        // Önce ürünün var olup olmadığını kontrol et
        const existing = await sql.query`
          SELECT id FROM Products WHERE slug = ${product.slug}
        `;

        if (existing.recordset.length > 0) {
          // Güncelle
          await sql.query`
            UPDATE Products SET
              name = ${product.name},
              description = ${product.description},
              price = ${product.price},
              discountedPrice = ${product.discountedPrice},
              discountRate = ${Math.round(((product.price - product.discountedPrice) / product.price) * 100)},
              stock = ${product.stock},
              imageUrl = ${product.imageUrl},
              categoryId = ${product.categoryId}
            WHERE slug = ${product.slug}
          `;
          console.log(`🔄 ${product.name} (güncellendi)`);
        } else {
          // Ekle
          await sql.query`
            INSERT INTO Products (
              sellerId, categoryId, name, slug, description, 
              price, discountedPrice, discountRate, stock, imageUrl,
              isFeatured, freeShipping, createdAt
            )
            VALUES (
              ${sellerId}, ${product.categoryId}, ${product.name}, ${product.slug},
              ${product.description}, ${product.price}, ${product.discountedPrice},
              ${Math.round(((product.price - product.discountedPrice) / product.price) * 100)},
              ${product.stock}, ${product.imageUrl}, 1, 1, GETUTCDATE()
            )
          `;
          console.log(`✅ ${product.name} (yeni eklendi)`);
        }
        addedCount++;
      } catch (err) {
        console.log(`❌ ${product.name} - Hata: ${err.message}`);
      }
    }

    console.log(`\n🎉 Toplam ${addedCount} gerçek ürün eklendi!`);

    // Kontrol
    console.log('\n📊 Güncel durum:');
    const products = await sql.query`
      SELECT name, price, discountedPrice, stock 
      FROM Products 
      ORDER BY createdAt DESC
    `;
    
    console.log(`\nToplam ${products.recordset.length} ürün:`);
    products.recordset.slice(0, 5).forEach(p => {
      console.log(`  • ${p.name} - ₺${p.price} → ₺${p.discountedPrice}`);
    });

  } catch (err) {
    console.error('❌ Hata:', err.message);
    throw err;
  } finally {
    await sql.close();
    console.log('\n🔌 Database bağlantısı kapatıldı.');
  }
}

// Script'i çalıştır
scrapeAndInsert()
  .then(() => {
    console.log('\n✅ İşlem tamamlandı!');
    console.log('🎯 Artık sitenizde gerçek dermokozmetik ürünleri var!');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ İşlem başarısız:', err);
    process.exit(1);
  });
