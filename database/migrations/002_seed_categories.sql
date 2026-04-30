-- ============================================================
-- Migration 002: Kategoriler ve Markalar (Dermoeczanem benzeri)
-- ============================================================

-- Ana Kategoriler
INSERT INTO Categories (name, slug, parentId, sortOrder) VALUES
('Cilt Bakımı',             'cilt-bakimi',              NULL, 1),
('Saç Bakımı',              'sac-bakimi',               NULL, 2),
('Güneş Bakımı',            'gunes-bakimi',             NULL, 3),
('Anne & Bebek',            'anne-bebek',               NULL, 4),
('Vitamin & Sağlık',        'vitamin-saglik',           NULL, 5),
('Makyaj',                  'makyaj',                   NULL, 6),
('Kişisel Bakım',           'kisisel-bakim',            NULL, 7),
('Ağız Bakımı',             'agiz-bakimi',              NULL, 8),
('Parfüm & Deodorant',      'parfum-deodorant',         NULL, 9),
('Dermokozmetik',           'dermokozmetik',            NULL, 10),
('Doğal & Organik Bakım',   'dogal-organik-bakim',      NULL, 11),
('Kore Kozmetik',           'kore-kozmetik',            NULL, 12),
('Aromaterapi',             'aromaterapi',              NULL, 13),
('Ev & Yaşam',              'ev-yasam',                 NULL, 14);

-- Cilt Bakımı Alt Kategorileri (parentId = 1)
INSERT INTO Categories (name, slug, parentId, sortOrder) VALUES
('Nemlendirici & Krem',     'nemlendirici-krem',        1, 1),
('Serum & Ampul',           'serum-ampul',              1, 2),
('Yüz Temizleme',           'yuz-temizleme',            1, 3),
('Tonik & Losyon',          'tonik-losyon',             1, 4),
('Göz Çevresi Bakımı',      'goz-cevresi-bakimi',       1, 5),
('Maske',                   'maske',                    1, 6),
('Peeling & Eksfolyan',     'peeling-eksfolyan',        1, 7),
('Yaşlanma Karşıtı',        'yaslanma-karsiti',         1, 8),
('Akne & Leke Bakımı',      'akne-leke-bakimi',         1, 9);

-- Saç Bakımı Alt Kategorileri (parentId = 2)
INSERT INTO Categories (name, slug, parentId, sortOrder) VALUES
('Şampuan',                 'sampuan',                  2, 1),
('Saç Kremi',               'sac-kremi',                2, 2),
('Saç Maskesi',             'sac-maskesi',              2, 3),
('Saç Serumu',              'sac-serumu',               2, 4),
('Saç Dökülmesi Karşıtı',   'sac-dokulmesi-karsiti',    2, 5),
('Kepek Karşıtı',           'kepek-karsiti',            2, 6);

-- Güneş Bakımı Alt Kategorileri (parentId = 3)
INSERT INTO Categories (name, slug, parentId, sortOrder) VALUES
('Yüz Güneş Kremi',         'yuz-gunes-kremi',          3, 1),
('Vücut Güneş Kremi',       'vucut-gunes-kremi',        3, 2),
('Çocuk Güneş Kremi',       'cocuk-gunes-kremi',        3, 3),
('Güneş Sonrası Bakım',     'gunes-sonrasi-bakim',      3, 4);

-- Markalar
INSERT INTO Brands (name, slug, description) VALUES
('La Roche-Posay',      'la-roche-posay',   'Dermatolojik cilt bakımı markası'),
('Vichy',               'vichy',            'Termal su bazlı cilt bakımı'),
('Bioderma',            'bioderma',         'Dermatolojik kozmetik markası'),
('Avène',               'avene',            'Hassas ciltler için termal su markası'),
('Ducray',              'ducray',           'Saç ve cilt bakımı uzmanı'),
('Uriage',              'uriage',           'Termal su bazlı dermokozmetik'),
('Mustela',             'mustela',          'Anne ve bebek bakım ürünleri'),
('Bioxcin',             'bioxcin',          'Saç dökülmesi karşıtı ürünler'),
('CeraVe',              'cerave',           'Seramid bazlı cilt bakımı'),
('Neutrogena',          'neutrogena',       'Dermatoloji önerilen cilt bakımı'),
('Filorga',             'filorga',          'Anti-aging cilt bakımı'),
('Neostrata',           'neostrata',        'Kimyasal peeling ve yenilenme'),
('Solgar',              'solgar',           'Vitamin ve takviye gıda'),
('Orzax',               'orzax',            'Vitamin ve mineral takviyesi'),
('Nutraxin',            'nutraxin',         'Takviye edici gıda markası');
