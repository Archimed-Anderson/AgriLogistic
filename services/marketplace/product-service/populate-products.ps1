# Populate Product Service with sample data
Write-Host "🌾 Populating Product Service with sample agricultural products..." -ForegroundColor Cyan

$baseUrl = "http://localhost:3002/products"
$created = 0
$failed = 0

# Product 1: Blé
Write-Host "`nCreating: Blé tendre biologique..." -ForegroundColor Yellow
try {
    $body = @{
        name = "Blé tendre biologique"
        description = "Blé tendre de qualité supérieure cultivé selon les normes biologiques européennes"
        shortDescription = "Blé tendre bio pour panification"
        category = "Céréales"
        price = 285.50
        unit = "tonne"
        stock = 150
        sku = "CER-BLE-001"
        images = @("https://via.placeholder.com/400")
        tags = @("bio", "céréales")
        specifications = @{}
        sellerId = "550e8400-e29b-41d4-a716-446655440001"
        sellerName = "Ferme Durand"
        organic = $true
        featured = $true
    } | ConvertTo-Json -Compress
    
    $response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Success" -ForegroundColor Green
    $created++
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $failed++
}

# Product 2: Tomates
Write-Host "`nCreating: Tomates cerises..." -ForegroundColor Yellow
try {
    $body = @{
        name = "Tomates cerises en grappe"
        description = "Tomates cerises rouges cultivées en serre chauffée"
        shortDescription = "Tomates cerises fraîches"
        category = "Légumes"
        price = 4.50
        unit = "kg"
        stock = 500
        sku = "LEG-TOM-001"
        images = @("https://via.placeholder.com/400")
        tags = @("légumes", "tomates")
        specifications = @{}
        sellerId = "550e8400-e29b-41d4-a716-446655440002"
        sellerName = "Maraîchers de Provence"
        organic = $false
        featured = $true
    } | ConvertTo-Json -Compress
    
    $response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Success" -ForegroundColor Green
    $created++
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $failed++
}

# Product 3: Maïs
Write-Host "`nCreating: Maïs grain..." -ForegroundColor Yellow
try {
    $body = @{
        name = "Maïs grain humide"
        description = "Maïs grain destiné à l'alimentation animale"
        shortDescription = "Maïs grain pour fourrage"
        category = "Fourrage"
        price = 195.00
        unit = "tonne"
        stock = 300
        sku = "FOU-MAI-001"
        images = @("https://via.placeholder.com/400")
        tags = @("fourrage", "maïs")
        specifications = @{}
        sellerId = "550e8400-e29b-41d4-a716-446655440003"
        sellerName = "Coopérative Agricole"
        organic = $false
        featured = $false
    } | ConvertTo-Json -Compress
    
    $response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Success" -ForegroundColor Green
    $created++
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $failed++
}

# Product 4: Pommes
Write-Host "`nCreating: Pommes Golden..." -ForegroundColor Yellow
try {
    $body = @{
        name = "Pommes Golden bio"
        description = "Pommes Golden Delicious issues de l'agriculture biologique"
        shortDescription = "Pommes Golden bio croquantes"
        category = "Fruits"
        price = 2.80
        unit = "kg"
        stock = 2000
        sku = "FRU-POM-001"
        images = @("https://via.placeholder.com/400")
        tags = @("bio", "fruits", "pommes")
        specifications = @{}
        sellerId = "550e8400-e29b-41d4-a716-446655440004"
        sellerName = "Vergers de Normandie"
        organic = $true
        featured = $true
    } | ConvertTo-Json -Compress
    
    $response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Success" -ForegroundColor Green
    $created++
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $failed++
}

# Product 5: Lait
Write-Host "`nCreating: Lait cru bio..." -ForegroundColor Yellow
try {
    $body = @{
        name = "Lait cru de vache bio"
        description = "Lait cru entier provenant de vaches nourries à l'herbe"
        shortDescription = "Lait cru bio pour transformation"
        category = "Produits laitiers"
        price = 0.48
        unit = "litre"
        stock = 5000
        sku = "LAI-CRU-001"
        images = @("https://via.placeholder.com/400")
        tags = @("bio", "lait")
        specifications = @{}
        sellerId = "550e8400-e29b-41d4-a716-446655440005"
        sellerName = "Ferme Laitière"
        organic = $true
        featured = $false
    } | ConvertTo-Json -Compress
    
    $response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Success" -ForegroundColor Green
    $created++
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $failed++
}

# Product 6: Oeufs
Write-Host "`nCreating: Oeufs plein air..." -ForegroundColor Yellow
try {
    $body = @{
        name = "Oeufs de poules plein air"
        description = "Oeufs extra-frais de poules élevées en plein air"
        shortDescription = "Oeufs plein air extra-frais"
        category = "Œufs"
        price = 0.35
        unit = "unité"
        stock = 10000
        sku = "OEU-PLI-001"
        images = @("https://via.placeholder.com/400")
        tags = @("oeufs", "plein air")
        specifications = @{}
        sellerId = "550e8400-e29b-41d4-a716-446655440006"
        sellerName = "Élevage Avicole"
        organic = $false
        featured = $true
    } | ConvertTo-Json -Compress
    
    $response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Success" -ForegroundColor Green
    $created++
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $failed++
}

# Product 7: Miel
Write-Host "`nCreating: Miel de lavande..." -ForegroundColor Yellow
try {
    $body = @{
        name = "Miel de lavande"
        description = "Miel de lavande fine récolté sur les plateaux de Provence"
        shortDescription = "Miel de lavande AOC"
        category = "Produits transformés"
        price = 12.50
        unit = "kg"
        stock = 200
        sku = "TRA-MIE-001"
        images = @("https://via.placeholder.com/400")
        tags = @("miel", "lavande")
        specifications = @{}
        sellerId = "550e8400-e29b-41d4-a716-446655440007"
        sellerName = "Rucher des Lavandes"
        organic = $true
        featured = $true
    } | ConvertTo-Json -Compress
    
    $response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Success" -ForegroundColor Green
    $created++
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $failed++
}

# Product 8: Semences
Write-Host "`nCreating: Semences tournesol..." -ForegroundColor Yellow
try {
    $body = @{
        name = "Semences de tournesol bio"
        description = "Semences certifiées de tournesol oléique pour culture biologique"
        shortDescription = "Semences tournesol bio"
        category = "Semences"
        price = 85.00
        unit = "sac"
        stock = 50
        sku = "SEM-TOU-001"
        images = @("https://via.placeholder.com/400")
        tags = @("semences", "tournesol", "bio")
        specifications = @{}
        sellerId = "550e8400-e29b-41d4-a716-446655440008"
        sellerName = "Semencier Bio France"
        organic = $true
        featured = $false
    } | ConvertTo-Json -Compress
    
    $response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Success" -ForegroundColor Green
    $created++
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $failed++
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ Created: $created products" -ForegroundColor Green
Write-Host "❌ Failed: $failed products" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
