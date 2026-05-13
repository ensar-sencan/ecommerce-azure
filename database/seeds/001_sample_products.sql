-- Demo Ürünleri Ekleme (Dermoeczanem.com benzeri)
-- Önce bir seller kullanıcısı oluşturalım

-- Seller kullanıcısı ekle
INSERT INTO Users (name, email, password, role, createdAt)
VALUES ('Demo Satıcı', 'seller@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYfNVAtEZiK', 'seller', GETUTCDATE());
-- Şifre: Demo1234

DECLARE @sellerId INT = SCOPE_IDENTITY();

-- Cilt Bakımı Ürünleri
INSERT INTO Products (name, description, price, stock, categoryId, sellerId, imageUrl, createdAt)
VALUES 
('La Roche-Posay Effaclar Duo+', 'Akne ve sivilce karşıtı bakım kremi. Yağlı ve akneye eğilimli ciltler için özel formül.', 289.90, 50, 1, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/effaclar.jpg', GETUTCDATE()),
('CeraVe Nemlendirici Krem', 'Kuru ve çok kuru ciltler için nemlendirici krem. Seramid içerir, 24 saat nem sağlar.', 199.90, 75, 1, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/cerave.jpg', GETUTCDATE()),
('The Ordinary Niacinamide 10% + Zinc 1%', 'Gözenek görünümünü azaltır, cildi dengelemeye yardımcı olur.', 149.90, 100, 1, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/ordinary-niacinamide.jpg', GETUTCDATE()),
('Vichy Liftactiv Supreme', 'Yaşlanma karşıtı gündüz kremi. Kırışıklıkları azaltır, cildi sıkılaştırır.', 459.90, 30, 1, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/vichy-liftactiv.jpg', GETUTCDATE()),
('Bioderma Sensibio H2O', 'Hassas ciltler için misel su. Makyaj temizleyici ve yüz temizleme suyu.', 179.90, 120, 1, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/bioderma.jpg', GETUTCDATE());

-- Güneş Koruyucu Ürünler
INSERT INTO Products (name, description, price, stock, categoryId, sellerId, imageUrl, createdAt)
VALUES 
('La Roche-Posay Anthelios SPF 50+', 'Çok yüksek koruyucu güneş kremi. UVA/UVB koruması. Yağlı ciltler için.', 329.90, 80, 2, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/anthelios.jpg', GETUTCDATE()),
('Avene Cleanance SPF 50+', 'Akneye eğilimli ciltler için güneş koruyucu. Mat görünüm sağlar.', 299.90, 60, 2, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/avene-cleanance.jpg', GETUTCDATE()),
('Eucerin Sun Oil Control SPF 50+', 'Yağlı ve karma ciltler için güneş koruyucu. 8 saat mat etki.', 279.90, 70, 2, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/eucerin-sun.jpg', GETUTCDATE());

-- Saç Bakımı Ürünleri
INSERT INTO Products (name, description, price, stock, categoryId, sellerId, imageUrl, createdAt)
VALUES 
('Vichy Dercos Anti-Dandruff Şampuan', 'Kepek karşıtı şampuan. Saç derisini rahatlatır, kepeği azaltır.', 189.90, 90, 3, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/dercos-shampoo.jpg', GETUTCDATE()),
('Phyto Phytophanere Saç Güçlendirici', 'Saç ve tırnak güçlendirici takviye. 120 kapsül.', 399.90, 40, 3, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/phyto.jpg', GETUTCDATE()),
('Klorane Kinin ve B Vitaminli Şampuan', 'Saç dökülmesine karşı şampuan. Saçı güçlendirir.', 169.90, 85, 3, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/klorane.jpg', GETUTCDATE());

-- Vitamin ve Takviyeler
INSERT INTO Products (name, description, price, stock, categoryId, sellerId, imageUrl, createdAt)
VALUES 
('Supradyn Energy 30 Film Tablet', 'Multivitamin ve mineral takviyesi. Enerji ve bağışıklık desteği.', 129.90, 150, 5, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/supradyn.jpg', GETUTCDATE()),
('Sambucol Kara Mürver Şurubu', 'Bağışıklık sistemi desteği. Kara mürver özlü şurup.', 149.90, 100, 5, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/sambucol.jpg', GETUTCDATE()),
('Omega-3 Balık Yağı 1000mg', 'Kalp ve beyin sağlığı için omega-3 desteği. 100 kapsül.', 179.90, 120, 5, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/omega3.jpg', GETUTCDATE());

-- Bebek Bakımı
INSERT INTO Products (name, description, price, stock, categoryId, sellerId, imageUrl, createdAt)
VALUES 
('Mustela Bebek Pişik Kremi', 'Pişik önleyici ve tedavi edici krem. Bebek cildi için güvenli.', 159.90, 110, 4, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/mustela.jpg', GETUTCDATE()),
('Bübchen Bebek Şampuanı', 'Göz yakmayan bebek şampuanı. Hassas cilt için.', 89.90, 140, 4, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/bubchen.jpg', GETUTCDATE()),
('Chicco Bebek Nemlendirici', 'Bebek cilt bakım kremi. Doğal içerikli, hipoalerjenik.', 119.90, 95, 4, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/chicco.jpg', GETUTCDATE());

-- Ağız Bakımı
INSERT INTO Products (name, description, price, stock, categoryId, sellerId, imageUrl, createdAt)
VALUES 
('Sensodyne Diş Macunu Hassas Dişler', 'Hassas dişler için özel formül diş macunu. Günlük koruma.', 69.90, 200, 6, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/sensodyne.jpg', GETUTCDATE()),
('Listerine Ağız Çalkalama Suyu', 'Ağız hijyeni için antiseptik ağız çalkalama suyu. 500ml.', 79.90, 180, 6, @sellerId, 'https://ecommercestore2026.blob.core.windows.net/product-images/listerine.jpg', GETUTCDATE());

PRINT 'Demo ürünleri başarıyla eklendi!';
PRINT 'Seller Email: test@gmail.com';
PRINT 'Seller Password: 12345678';
