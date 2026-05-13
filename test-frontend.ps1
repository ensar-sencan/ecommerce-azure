# Frontend Test Script
Write-Host ""
Write-Host "FRONTEND TEST BASLIYOR" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Test 1: Ana Sayfa
Write-Host ""
Write-Host "Test 1: Ana Sayfa (localhost:3000)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "OK Ana sayfa calisiyor - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "HATA Ana sayfa hatasi: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Urunler Sayfasi
Write-Host ""
Write-Host "Test 2: Urunler Sayfasi (localhost:3000/products)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/products" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "OK Urunler sayfasi calisiyor - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "HATA Urunler sayfasi hatasi: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Backend API
Write-Host ""
Write-Host "Test 3: Backend API (products endpoint)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://ecommerce-azure.onrender.com/api/products?limit=5" -Method GET
    Write-Host "OK Backend API calisiyor - $($response.products.Count) urun geldi" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ilk 3 Urun:" -ForegroundColor White
    $response.products | Select-Object -First 3 | ForEach-Object {
        Write-Host "  - $($_.name) - TL$($_.price)" -ForegroundColor Gray
    }
} catch {
    Write-Host "HATA Backend API hatasi: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Kategoriler
Write-Host ""
Write-Host "Test 4: Kategoriler" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://ecommerce-azure.onrender.com/api/categories" -Method GET
    Write-Host "OK Kategoriler calisiyor - $($response.Count) kategori" -ForegroundColor Green
} catch {
    Write-Host "HATA Kategoriler hatasi: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "TEST TAMAMLANDI!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tarayicida test etmek icin:" -ForegroundColor Yellow
Write-Host "   1. http://localhost:3000 - Ana sayfa" -ForegroundColor White
Write-Host "   2. http://localhost:3000/products - Urunler (19 urun gorunmeli)" -ForegroundColor White
Write-Host "   3. http://localhost:3000/auth/login - Giris" -ForegroundColor White
Write-Host ""
Write-Host "Test hesabi:" -ForegroundColor Yellow
Write-Host "   Email: seller@demo.com" -ForegroundColor White
Write-Host "   Sifre: Demo1234" -ForegroundColor White
Write-Host ""
