-- Basit Demo Ürünleri (imageUrl olmadan)
-- Önce seller ID'sini bulalım
DECLARE @sellerId INT;
SELECT @sellerId = id FROM Users WHERE email = 'seller@demo.com';

IF @sellerId IS NULL
BEGIN
    PRINT 'Seller bulunamadı! Önce seller hesabı oluşturun.';
    RETURN;
END

-- Ürünleri ekle
INSERT INTO Products (sellerId, categoryId, name, description, price, stock, imageUrl, createdAt)
VALUES 
(@sellerId, 1, 'La Roche-Posay Effaclar Duo+', 'Akne ve sivilce karşıtı bakım kremi', 289.90, 50, 'https://via.placeholder.com/300', GETUTCDATE()),
(@sellerId, 1, 'CeraVe Nemlendirici Krem', 'Kuru ciltler için nemlendirici', 199.90, 75, 'https://via.placeholder.com/300', GETUTCDATE()),
(@sellerId, 1, 'The Ordinary Niacinamide', 'Gözenek görünümünü azaltır', 149.90, 100, 'https://via.placeholder.com/300', GETUTCDATE()),
(@sellerId, 2, 'La Roche-Posay Anthelios SPF 50+', 'Güneş koruyucu krem', 329.90, 80, 'https://via.placeholder.com/300', GETUTCDATE()),
(@sellerId, 3, 'Vichy Dercos Şampuan', 'Kepek karşıtı şampuan', 189.90, 90, 'https://via.placeholder.com/300', GETUTCDATE()),
(@sellerId, 5, 'Supradyn Energy', 'Multivitamin takviyesi', 129.90, 150, 'https://via.placeholder.com/300', GETUTCDATE()),
(@sellerId, 4, 'Mustela Bebek Kremi', 'Bebek pişik kremi', 159.90, 110, 'https://via.placeholder.com/300', GETUTCDATE()),
(@sellerId, 6, 'Sensodyne Diş Macunu', 'Hassas dişler için', 69.90, 200, 'https://via.placeholder.com/300', GETUTCDATE());

PRINT '✅ 8 ürün başarıyla eklendi!';

-- Kontrol et
SELECT COUNT(*) AS TotalProducts FROM Products;
SELECT TOP 5 * FROM Products ORDER BY createdAt DESC;
