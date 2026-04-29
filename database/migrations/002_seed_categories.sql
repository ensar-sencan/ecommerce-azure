-- ============================================================
-- Migration 002: Seed Categories
-- ============================================================

INSERT INTO Categories (name, parentId) VALUES
('Elektronik',      NULL),
('Giyim',           NULL),
('Ev & Yaşam',      NULL),
('Spor & Outdoor',  NULL),
('Kitap & Hobi',    NULL);

-- Sub-categories (Elektronik = 1)
INSERT INTO Categories (name, parentId) VALUES
('Akıllı Telefon',  1),
('Bilgisayar',      1),
('Tablet',          1),
('Ses Sistemleri',  1),
('Aksesuarlar',     1);

-- Sub-categories (Giyim = 2)
INSERT INTO Categories (name, parentId) VALUES
('Erkek',           2),
('Kadın',           2),
('Çocuk',           2),
('Spor Giyim',      2);

-- Sub-categories (Ev & Yaşam = 3)
INSERT INTO Categories (name, parentId) VALUES
('Mutfak',          3),
('Mobilya',         3),
('Dekorasyon',      3),
('Bahçe',           3);
