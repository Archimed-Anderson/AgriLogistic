# 🧪 AgriLogistic 4.0 - Testing Guide

## Quick Test Commands

Use these curl commands to test each service after starting them.

---

## 🚜 Agri-Rentals Service (Port 3007)

### List all rentals
```bash
curl http://localhost:3007/rentals
```

### Create a rental
```bash
curl -X POST http://localhost:3007/rentals \
  -H "Content-Type: application/json" \
  -d '{
    "equipmentType": "Tractor",
    "model": "John Deere 5075E",
    "pricePerDay": 50,
    "ownerId": "farmer123"
  }'
```

### Get available equipment
```bash
curl http://localhost:3007/rentals/equipment/available
```

---

## 💳 AgriCredit Service (Port 3008)

### Create loan application
```bash
curl -X POST http://localhost:3008/credit/applications \
  -H "Content-Type: application/json" \
  -d '{
    "farmerId": "farmer123",
    "amount": 500,
    "purpose": "Seeds and fertilizer",
    "cropType": "Maize"
  }'
```

### Calculate Agri-Score
```bash
curl http://localhost:3008/credit/scoring/farmer123
```

### Get portfolio stats
```bash
curl http://localhost:3008/credit/portfolio/stats
```

---

## ❄️ Cold Chain Service (Port 3009)

### Create storage unit
```bash
curl -X POST http://localhost:3009/coldchain/storage \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Mini-chambre froide",
    "capacity": 5,
    "location": "Dakar Hub",
    "targetTemperature": 3
  }'
```

### Get temperature history
```bash
curl "http://localhost:3009/coldchain/storage/storage123/temperature?hours=24"
```

### Get breach rate
```bash
curl http://localhost:3009/coldchain/stats/breach-rate
```

---

## 🤝 Agri-Coop Service (Port 3010)

### Create cooperative
```bash
curl -X POST http://localhost:3010/coop \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cooperative Agricole de Thiès",
    "region": "Thiès",
    "foundingMembers": 25
  }'
```

### Create vote
```bash
curl -X POST http://localhost:3010/coop/coop123/votes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Achat groupé de semences",
    "options": ["Oui", "Non"],
    "description": "Proposition d achat groupé pour économiser 20%"
  }'
```

### Distribute CTT tokens
```bash
curl -X POST http://localhost:3010/coop/coop123/tokens/distribute \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "farmer123",
    "tonnesDelivered": 5
  }'
```

---

## 🔬 Vision AI Service (Port 3011)

### Diagnose disease (with image upload)
```bash
curl -X POST http://localhost:3011/vision/diagnose \
  -F "image=@/path/to/leaf_image.jpg" \
  -F "cropType=Maize" \
  -F "farmerId=farmer123"
```

### List all diagnoses
```bash
curl http://localhost:3011/vision/diagnoses
```

### Get model accuracy
```bash
curl http://localhost:3011/vision/stats/accuracy
```

### Get epidemic alerts
```bash
curl "http://localhost:3011/vision/stats/epidemics?region=Dakar"
```

---

## 🌦️ Weather Service (Port 3012)

### Get current weather
```bash
curl "http://localhost:3012/weather/current?lat=14.7167&lng=-17.4677"
```

### Get 14-day forecast
```bash
curl "http://localhost:3012/weather/forecast?lat=14.7167&lng=-17.4677&days=14"
```

### Get hyperlocal forecast (1km²)
```bash
curl "http://localhost:3012/weather/hyperlocal?lat=14.7167&lng=-17.4677"
```

### Get agronomic recommendations
```bash
curl http://localhost:3012/weather/agronomic/farm123
```

### Get evapotranspiration (ET0)
```bash
curl "http://localhost:3012/weather/evapotranspiration?lat=14.7167&lng=-17.4677"
```

### Get Growing Degree Days
```bash
curl "http://localhost:3012/weather/growing-degree-days?lat=14.7167&lng=-17.4677&crop=Maize"
```

---

## 🧪 PowerShell Test Script

Create a file `test-services.ps1`:

```powershell
# Test all services
$services = @(
    @{Name="Rentals"; Port=3007; Endpoint="/rentals"},
    @{Name="Credit"; Port=3008; Endpoint="/credit/portfolio/stats"},
    @{Name="Cold Chain"; Port=3009; Endpoint="/coldchain/stats/breach-rate"},
    @{Name="Coop"; Port=3010; Endpoint="/coop"},
    @{Name="Vision AI"; Port=3011; Endpoint="/vision/stats/accuracy"},
    @{Name="Weather"; Port=3012; Endpoint="/weather/current?lat=14.7167&lng=-17.4677"}
)

Write-Host "🧪 Testing AgriLogistic 4.0 Services..." -ForegroundColor Cyan
Write-Host ""

foreach ($service in $services) {
    $url = "http://localhost:$($service.Port)$($service.Endpoint)"
    Write-Host "Testing $($service.Name) Service..." -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host " ✅ OK" -ForegroundColor Green
        } else {
            Write-Host " ⚠️ Status: $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host " ❌ FAILED" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor DarkRed
    }
}

Write-Host ""
Write-Host "✨ Test complete!" -ForegroundColor Green
```

Run with:
```powershell
.\test-services.ps1
```

---

## 📊 Expected Responses

All services return JSON responses with placeholder data:

### Success Response (200 OK)
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response (4xx/5xx)
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

---

## 🔍 Debugging Tips

### Check if service is running
```powershell
# Check if port is listening
Test-NetConnection -ComputerName localhost -Port 3007
```

### View service logs
Services started with `npm run start:dev` will show logs in their terminal windows.

### Common Issues

1. **Port already in use**
   - Stop the conflicting process
   - Or change the port in `main.ts`

2. **Module not found**
   - Run `npm install` in the service directory

3. **TypeScript errors**
   - Check `tsconfig.json` configuration
   - Ensure all dependencies are installed

---

## 🚀 Next Steps

1. **Install Postman** for easier API testing
2. **Create Postman Collection** with all endpoints
3. **Add authentication** to test protected endpoints
4. **Implement real business logic** to replace placeholders

---

**Happy Testing! 🎉**
