# Hızlı Test Scripti

$baseUrl = "https://ecommerce-azure.onrender.com"
$frontendUrl = "https://green-ground-037b99003.7.azurestaticapps.net"

Write-Host "`n🚀 E-COMMERCE PLATFORM HIZLI TEST" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n✅ TEST 1: Health Check" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "   Status: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ BAŞARISIZ: $_" -ForegroundColor Red
}

# Test 2: Kategoriler
Write-Host "`n✅ TEST 2: Kategoriler" -ForegroundColor Yellow
try {
    $categories = Invoke-RestMethod -Uri "$baseUrl/api/categories" -Method Get
    Write-Host "   Toplam Kategori: $($categories.Count)" -ForegroundColor Green
    Write-Host "   İlk 3: $($categories[0..2].name -join ', ')" -ForegroundColor White
} catch {
    Write-Host "   ❌ BAŞARISIZ: $_" -ForegroundColor Red
}

# Test 3: Ürünler
Write-Host "`n✅ TEST 3: Ürünler" -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri "$baseUrl/api/products" -Method Get
    Write-Host "   Toplam Ürün: $($products.total)" -ForegroundColor Green
    Write-Host "   Sayfa: $($products.page) / $($products.pages)" -ForegroundColor White
    Write-Host "   İlk 3 Ürün:" -ForegroundColor White
    $products.products[0..2] | ForEach-Object {
        Write-Host "     - $($_.name) - $($_.price)₺" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ BAŞARISIZ: $_" -ForegroundColor Red
}

# Test 4: Kullanıcı Kaydı
Write-Host "`n✅ TEST 4: Kullanıcı Kaydı" -ForegroundColor Yellow
try {
    $randomEmail = "test$(Get-Random)@example.com"
    $registerBody = @{
        name = "Test Kullanıcı"
        email = $randomEmail
        password = "Test1234"
        role = "customer"
    } | ConvertTo-Json

    $register = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "   ✅ Kayıt Başarılı!" -ForegroundColor Green
    Write-Host "   Email: $randomEmail" -ForegroundColor White
    Write-Host "   Token: $($register.token.Substring(0,20))..." -ForegroundColor Gray
    
    $global:testToken = $register.token
} catch {
    Write-Host "   ❌ BAŞARISIZ: $_" -ForegroundColor Red
}

# Test 5: Seller Girişi
Write-Host "`n✅ TEST 5: Seller Girişi" -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "seller@demo.com"
        password = "Demo1234"
    } | ConvertTo-Json

    $login = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "   ✅ Giriş Başarılı!" -ForegroundColor Green
    Write-Host "   Seller: $($login.user.name)" -ForegroundColor White
    Write-Host "   Role: $($login.user.role)" -ForegroundColor White
    
    $global:sellerToken = $login.token
} catch {
    Write-Host "   ❌ BAŞARISIZ: $_" -ForegroundColor Red
}

# Test 6: Tek Ürün Detayı
Write-Host "`n✅ TEST 6: Ürün Detayı" -ForegroundColor Yellow
try {
    # İlk ürünün ID'sini al
    $firstProductId = $products.products[0].id
    $product = Invoke-RestMethod -Uri "$baseUrl/api/products/$firstProductId" -Method Get
    Write-Host "   Ürün: $($product.name)" -ForegroundColor Green
    Write-Host "   Fiyat: $($product.price)₺" -ForegroundColor White
    Write-Host "   Stok: $($product.stock)" -ForegroundColor White
    Write-Host "   Kategori: $($product.category)" -ForegroundColor White
} catch {
    Write-Host "   ❌ BAŞARISIZ: $_" -ForegroundColor Red
}

# Test 7: Frontend Erişimi
Write-Host "`n✅ TEST 7: Frontend Erişimi" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $frontendUrl -Method Get -UseBasicParsing
    Write-Host "   Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Content Length: $($response.Content.Length) bytes" -ForegroundColor White
} catch {
    Write-Host "   ❌ BAŞARISIZ: $_" -ForegroundColor Red
}

# Özet
Write-Host "`n" + ("=" * 50) -ForegroundColor Cyan
Write-Host "📊 TEST ÖZETI" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "`n🌐 URL'ler:" -ForegroundColor Yellow
Write-Host "   Frontend: $frontendUrl" -ForegroundColor White
Write-Host "   Backend:  $baseUrl" -ForegroundColor White
Write-Host "`n👤 Test Hesapları:" -ForegroundColor Yellow
Write-Host "   Seller: seller@demo.com / Demo1234" -ForegroundColor White
Write-Host "   Müşteri: Yeni kayıt yapın" -ForegroundColor White
Write-Host "`n📦 Veriler:" -ForegroundColor Yellow
Write-Host "   19 Ürün" -ForegroundColor White
Write-Host "   14 Kategori" -ForegroundColor White
Write-Host "   %10 Sepette İndirim" -ForegroundColor White
Write-Host "`n✅ Testler tamamlandı!" -ForegroundColor Green
Write-Host "`nDetaylı test senaryoları için TEST-SCENARIOS.md dosyasına bakın.`n" -ForegroundColor Gray
