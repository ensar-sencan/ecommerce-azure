-- Dermoeczanem.com Tarzında Demo Ürünler
-- Slug kolonları ile birlikte

-- Seller ID'sini bul
DECLARE @sellerId INT;
SELECT @sellerId = id FROM Users WHERE email = 'seller@demo.com';

IF @sellerId IS NULL
BEGIN
    PRINT 'Hata: Seller bulunamadı!';
    RETURN;
END

-- Ürünleri ekle (slug ile)
INSERT INTO Products (sellerId, categoryId, name, slug, description, price, discountedPrice, discountRate, stock, imageUrl, isFeatured, freeShipping, createdAt)
VALUES 
-- Cilt Bakımı
(@sellerId, 1, 'La Roche-Posay Effaclar Duo+ 40ml', 'la-roche-posay-effaclar-duo-40ml', 'Akne ve sivilce karşıtı bakım kremi. Yağlı ve akneye eğilimli ciltler için özel formül. Gözenekleri temizler, lekeleri azaltır.', 289.90, 259.90, 10, 50, 'https://via.placeholder.com/400x400?text=Effaclar+Duo', 1, 1, GETUTCDATE()),
(@sellerId, 1, 'CeraVe Nemlendirici Krem 454g', 'cerave-nemlendirici-krem-454g', 'Kuru ve çok kuru ciltler için nemlendirici krem. 3 temel seramid ve hyaluronik asit içerir. 24 saat nem sağlar.', 199.90, 179.90, 10, 75, 'https://via.placeholder.com/400x400?text=CeraVe+Krem', 1, 1, GETUTCDATE()),
(@sellerId, 1, 'The Ordinary Niacinamide 10% + Zinc 1% 30ml', 'the-ordinary-niacinamide-zinc-30ml', 'Gözenek görünümünü azaltır, cildi dengelemeye yardımcı olur. Yağlı ve karma ciltler için ideal.', 149.90, 134.90, 10, 100, 'https://via.placeholder.com/400x400?text=Niacinamide', 1, 0, GETUTCDATE()),
(@sellerId, 1, 'Vichy Liftactiv Supreme 50ml', 'vichy-liftactiv-supreme-50ml', 'Yaşlanma karşıtı gündüz kremi. Kırışıklıkları azaltır, cildi sıkılaştırır. Tüm cilt tipleri için.', 459.90, 413.90, 10, 30, 'https://via.placeholder.com/400x400?text=Liftactiv', 0, 1, GETUTCDATE()),
(@sellerId, 1, 'Bioderma Sensibio H2O 500ml', 'bioderma-sensibio-h2o-500ml', 'Hassas ciltler için misel su. Makyaj temizleyici ve yüz temizleme suyu. Durulanmaya gerek yok.', 179.90, 161.90, 10, 120, 'https://via.placeholder.com/400x400?text=Bioderma+H2O', 1, 1, GETUTCDATE()),

-- Güneş Koruyucu
(@sellerId, 2, 'La Roche-Posay Anthelios UVMune 400 SPF 50+ 50ml', 'la-roche-posay-anthelios-uvmune-spf50-50ml', 'Çok yüksek koruyucu güneş kremi. UVA/UVB koruması. Yağlı ciltler için mat finish.', 329.90, 296.90, 10, 80, 'https://via.placeholder.com/400x400?text=Anthelios', 1, 1, GETUTCDATE()),
(@sellerId, 2, 'Avene Cleanance Solaire SPF 50+ 50ml', 'avene-cleanance-solaire-spf50-50ml', 'Akneye eğilimli ciltler için güneş koruyucu. Mat görünüm sağlar, gözenekleri tıkamaz.', 299.90, 269.90, 10, 60, 'https://via.placeholder.com/400x400?text=Avene+SPF', 0, 1, GETUTCDATE()),
(@sellerId, 2, 'Eucerin Sun Oil Control SPF 50+ 50ml', 'eucerin-sun-oil-control-spf50-50ml', 'Yağlı ve karma ciltler için güneş koruyucu. 8 saat mat etki. Sebum kontrol teknolojisi.', 279.90, 251.90, 10, 70, 'https://via.placeholder.com/400x400?text=Eucerin+Sun', 0, 0, GETUTCDATE()),

-- Saç Bakımı
(@sellerId, 3, 'Vichy Dercos Anti-Dandruff Şampuan 390ml', 'vichy-dercos-anti-dandruff-sampuan-390ml', 'Kepek karşıtı şampuan. Saç derisini rahatlatır, kepeği azaltır. Yağlı saçlar için.', 189.90, 170.90, 10, 90, 'https://via.placeholder.com/400x400?text=Dercos+Shampoo', 0, 1, GETUTCDATE()),
(@sellerId, 3, 'Phyto Phytophanere Saç ve Tırnak Güçlendirici 120 Kapsül', 'phyto-phytophanere-120-kapsul', 'Saç ve tırnak güçlendirici takviye. Biotin, çinko ve B vitaminleri içerir. 4 aylık kür.', 399.90, 359.90, 10, 40, 'https://via.placeholder.com/400x400?text=Phytophanere', 0, 1, GETUTCDATE()),
(@sellerId, 3, 'Klorane Kinin ve B Vitaminli Şampuan 400ml', 'klorane-kinin-b-vitaminli-sampuan-400ml', 'Saç dökülmesine karşı şampuan. Saçı güçlendirir, hacim verir. Erkek ve kadınlar için.', 169.90, 152.90, 10, 85, 'https://via.placeholder.com/400x400?text=Klorane', 0, 0, GETUTCDATE()),

-- Vitamin ve Takviyeler
(@sellerId, 5, 'Supradyn Energy 30 Film Tablet', 'supradyn-energy-30-tablet', 'Multivitamin ve mineral takviyesi. Enerji ve bağışıklık desteği. 12 vitamin, 8 mineral.', 129.90, 116.90, 10, 150, 'https://via.placeholder.com/400x400?text=Supradyn', 0, 0, GETUTCDATE()),
(@sellerId, 5, 'Sambucol Kara Mürver Şurubu 120ml', 'sambucol-kara-murver-surubu-120ml', 'Bağışıklık sistemi desteği. Kara mürver özlü şurup. Çocuk ve yetişkinler için.', 149.90, 134.90, 10, 100, 'https://via.placeholder.com/400x400?text=Sambucol', 0, 0, GETUTCDATE()),
(@sellerId, 5, 'Omega-3 Balık Yağı 1000mg 100 Kapsül', 'omega-3-balik-yagi-1000mg-100-kapsul', 'Kalp ve beyin sağlığı için omega-3 desteği. EPA ve DHA içerir. Ağır metal testli.', 179.90, 161.90, 10, 120, 'https://via.placeholder.com/400x400?text=Omega-3', 0, 1, GETUTCDATE()),

-- Bebek Bakımı
(@sellerId, 4, 'Mustela Bebek Pişik Kremi 100ml', 'mustela-bebek-pisik-kremi-100ml', 'Pişik önleyici ve tedavi edici krem. Bebek cildi için güvenli. Doğumdan itibaren kullanılabilir.', 159.90, 143.90, 10, 110, 'https://via.placeholder.com/400x400?text=Mustela', 0, 1, GETUTCDATE()),
(@sellerId, 4, 'Bübchen Bebek Şampuanı 400ml', 'bubchen-bebek-sampuani-400ml', 'Göz yakmayan bebek şampuanı. Hassas cilt için. Parabensiz, sabun içermez.', 89.90, 80.90, 10, 140, 'https://via.placeholder.com/400x400?text=Bubchen', 0, 0, GETUTCDATE()),
(@sellerId, 4, 'Chicco Bebek Nemlendirici 100ml', 'chicco-bebek-nemlendirici-100ml', 'Bebek cilt bakım kremi. Doğal içerikli, hipoalerjenik. Yüz ve vücut için.', 119.90, 107.90, 10, 95, 'https://via.placeholder.com/400x400?text=Chicco', 0, 0, GETUTCDATE()),

-- Ağız Bakımı
(@sellerId, 6, 'Sensodyne Diş Macunu Hassas Dişler 75ml', 'sensodyne-dis-macunu-hassas-disler-75ml', 'Hassas dişler için özel formül diş macunu. Günlük koruma. Florür içerir.', 69.90, 62.90, 10, 200, 'https://via.placeholder.com/400x400?text=Sensodyne', 0, 0, GETUTCDATE()),
(@sellerId, 6, 'Listerine Ağız Çalkalama Suyu 500ml', 'listerine-agiz-calkalama-suyu-500ml', 'Ağız hijyeni için antiseptik ağız çalkalama suyu. Nane aromalı. Günde 2 kez kullanım.', 79.90, 71.90, 10, 180, 'https://via.placeholder.com/400x400?text=Listerine', 0, 0, GETUTCDATE());

PRINT '✅ 20 ürün başarıyla eklendi!';
PRINT 'Tüm ürünlerde %10 sepette indirim var.';
PRINT 'Öne çıkan ürünler: Effaclar, CeraVe, Niacinamide, Bioderma, Anthelios';

-- Kontrol
SELECT COUNT(*) AS ToplamUrun FROM Products;
SELECT TOP 5 name, price, discountedPrice, stock FROM Products ORDER BY createdAt DESC;
