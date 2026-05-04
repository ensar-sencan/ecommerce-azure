# Test API Endpoints

$baseUrl = "https://ecommerce-azure.onrender.com"

Write-Host "Testing API Endpoints..." -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Health Check:" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✅ Health check passed" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
}

# Test 2: Categories
Write-Host "`n2. Get Categories:" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/categories" -Method Get
    Write-Host "✅ Categories retrieved: $($response.Count) categories" -ForegroundColor Green
} catch {
    Write-Host "❌ Categories failed: $_" -ForegroundColor Red
}

# Test 3: Register User
Write-Host "`n3. Register New User:" -ForegroundColor Yellow
try {
    $body = @{
        name = "Test User"
        email = "testuser$(Get-Random)@example.com"
        password = "Test1234"
        role = "customer"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ User registered successfully" -ForegroundColor Green
    Write-Host "Token: $($response.token.Substring(0,20))..."
    Write-Host "User: $($response.user.name) ($($response.user.email))"
    
    # Save token for next tests
    $global:token = $response.token
} catch {
    Write-Host "❌ Register failed: $_" -ForegroundColor Red
    Write-Host $_.Exception.Response.StatusCode
}

# Test 4: Login
Write-Host "`n4. Login:" -ForegroundColor Yellow
try {
    $body = @{
        email = "testuser@example.com"
        password = "Test1234"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Login successful" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Login failed (expected if user doesn't exist)" -ForegroundColor Yellow
}

# Test 5: Products
Write-Host "`n5. Get Products:" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/products" -Method Get
    Write-Host "✅ Products retrieved: $($response.total) products" -ForegroundColor Green
} catch {
    Write-Host "❌ Products failed: $_" -ForegroundColor Red
}

Write-Host "`n✅ API Testing Complete!" -ForegroundColor Cyan
