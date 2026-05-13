-- Ürün resimlerini güncelle - via.placeholder.com yerine NULL kullan
-- Frontend emoji ile gösterecek

UPDATE Products 
SET imageUrl = NULL
WHERE imageUrl LIKE '%via.placeholder.com%';

PRINT '✅ Ürün resimleri güncellendi (NULL yapıldı)';

-- Kontrol
SELECT name, imageUrl FROM Products;
