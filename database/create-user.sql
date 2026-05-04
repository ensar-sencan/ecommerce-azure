-- Azure SQL Database'de yeni kullanıcı oluşturma
-- Bu SQL'i Azure Portal'da Query Editor'de çalıştırın

-- 1. Master database'e bağlanın ve login oluşturun
-- (Bu kısmı Azure Portal'da master database'de çalıştırın)
CREATE LOGIN renderuser WITH PASSWORD = 'RenderPass2026!';

-- 2. ecommerce-db database'ine bağlanın ve user oluşturun
-- (Bu kısmı ecommerce-db'de çalıştırın)
CREATE USER renderuser FROM LOGIN renderuser;
ALTER ROLE db_owner ADD MEMBER renderuser;

-- Kullanıcıyı kontrol edin
SELECT name, type_desc FROM sys.database_principals WHERE name = 'renderuser';
