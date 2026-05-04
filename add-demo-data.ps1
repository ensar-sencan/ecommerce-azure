# Demo Verilerini API Üzerinden Ekleme

$baseUrl = "https://ecommerce-azure.onrender.com"

Write-Host "🚀 Demo Verilerini Ekliyorum..." -ForegroundColor Cyan

# 1. Seller hesabı oluştur
Write-Host "`n1. Seller hesabı oluşturuluyor..." -ForegroundColor Yellow
try {
    $sellerBody = @{
        name = "Demo Satıcı"
        email = "seller@demo.com"
        password = "Demo1234"
        role = "seller"
    } | ConvertTo-Json

    $sellerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $sellerBody -ContentType "application/json"
    Write-Host "✅ Seller hesabı oluşturuldu" -ForegroundColor Green
    $sellerToken = $sellerResponse.token
    Write-Host "Email: seller@demo.com | Şifre: Demo1234"
} catch {
    Write-Host "⚠️ Seller zaten var veya hata: $($_.Exception.Message)" -ForegroundColor Yellow
    # Eğer seller varsa login dene
    try {
        $loginBody = @{
            email = "seller@demo.com"
            password = "Demo1234"
        } | ConvertTo-Json
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
        $sellerToken = $loginResponse.token
        Write-Host "✅ Seller ile giriş yapıldı" -ForegroundColor Green
    } catch {
        Write-Host "❌ Seller login başarısız" -ForegroundColor Red
        exit
    }
}

# 2. Ürünleri ekle
Write-Host "`n2. Ürünler ekleniyor..." -ForegroundColor Yellow

$products = @(
    @{
        name = "La Roche-Posay Effaclar Duo+"
        description = "Akne ve sivilce karşıtı bakım kremi. Yağlı ve akneye eğilimli ciltler için özel formül."
        price = 289.90
        stock = 50
        categoryId = 1
    },
    @{
        name = "CeraVe Nemlendirici Krem"
        description = "Kuru ve çok kuru ciltler için nemlendirici krem. Seramid içerir, 24 saat nem sağlar."
        price = 199.90
        stock = 75
        categoryId = 1
    },
    @{
        name = "The Ordinary Niacinamide 10% + Zinc 1%"
        description = "Gözenek görünümünü azaltır, cildi dengelemeye yardımcı olur."
        price = 149.90
        stock = 100
        categoryId = 1
    },
    @{
        name = "Vichy Liftactiv Supreme"
        description = "Yaşlanma karşıtı gündüz kremi. Kırışıklıkları azaltır, cildi sıkılaştırır."
        price = 459.90
        stock = 30
        categoryId = 1
    },
    @{
        name = "Bioderma Sensibio H2O"
        description = "Hassas ciltler için misel su. Makyaj temizleyici ve yüz temizleme suyu."
        price = 179.90
        stock = 120
        categoryId = 1
    },
    @{
        name = "La Roche-Posay Anthelios SPF 50+"
        description = "Çok yüksek koruyucu güneş kremi. UVA/UVB koruması. Yağlı ciltler için."
        price = 329.90
        stock = 80
        categoryId = 2
    },
    @{
        name = "Avene Cleanance SPF 50+"
        description = "Akneye eğilimli ciltler için güneş koruyucu. Mat görünüm sağlar."
        price = 299.90
        stock = 60
        categoryId = 2
    },
    @{
        name = "Eucerin Sun Oil Control SPF 50+"
        description = "Yağlı ve karma ciltler için güneş koruyucu. 8 saat mat etki."
        price = 279.90
        stock = 70
        categoryId = 2
    },
    @{
        name = "Vichy Dercos Anti-Dandruff Şampuan"
        description = "Kepek karşıtı şampuan. Saç derisini rahatlatır, kepeği azaltır."
        price = 189.90
        stock = 90
        categoryId = 3
    },
    @{
        name = "Supradyn Energy 30 Film Tablet"
        description = "Multivitamin ve mineral takviyesi. Enerji ve bağışıklık desteği."
        price = 129.90
        stock = 150
        categoryId = 5
    },
    @{
        name = "Omega-3 Balık Yağı 1000mg"
        description = "Kalp ve beyin sağlığı için omega-3 desteği. 100 kapsül."
        price = 179.90
        stock = 120
        categoryId = 5
    },
    @{
        name = "Mustela Bebek Pişik Kremi"
        description = "Pişik önleyici ve tedavi edici krem. Bebek cildi için güvenli."
        price = 159.90
        stock = 110
        categoryId = 4
    },
    @{
        name = "Sensodyne Diş Macunu Hassas Dişler"
        description = "Hassas dişler için özel formül diş macunu. Günlük koruma."
        price = 69.90
        stock = 200
        categoryId = 6
    },
    @{
        name = "Listerine Ağız Çalkalama Suyu"
        description = "Ağız hijyeni için antiseptik ağız çalkalama suyu. 500ml."
        price = 79.90
        stock = 180
        categoryId = 6
    }
)

$headers = @{
    "Authorization" = "Bearer $sellerToken"
    "Content-Type" = "application/json"
}

$successCount = 0
foreach ($product in $products) {
    try {
        $productBody = $product | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/api/products" -Method Post -Body $productBody -Headers $headers
        Write-Host "  ✅ $($product.name) eklendi" -ForegroundColor Green
        $successCount++
    } catch {
        Write-Host "  ❌ $($product.name) eklenemedi: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n✅ $successCount / $($products.Count) ürün başarıyla eklendi!" -ForegroundColor Cyan

# 3. Ürünleri kontrol et
Write-Host "`n3. Ürünler kontrol ediliyor..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/products" -Method Get
    Write-Host "✅ Toplam $($response.total) ürün var" -ForegroundColor Green
} catch {
    Write-Host "❌ Ürünler kontrol edilemedi" -ForegroundColor Red
}

Write-Host "`n🎉 Demo verileri hazır!" -ForegroundColor Cyan
Write-Host "`n📋 Test Hesapları:" -ForegroundColor Yellow
Write-Host "Seller: seller@demo.com / Demo1234" -ForegroundColor White
Write-Host "`n🌐 Frontend: https://green-ground-037b99003.7.azurestaticapps.net" -ForegroundColor Cyan
Write-Host "🔧 Backend: https://ecommerce-azure.onrender.com" -ForegroundColor Cyan
