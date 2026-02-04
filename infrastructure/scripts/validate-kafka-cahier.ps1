# =============================================================================
# Validation Event Bus Kafka - Cahier des charges 1.2 (PowerShell)
# Usage: .\infrastructure\scripts\validate-kafka-cahier.ps1
# Prérequis: cluster Kafka démarré (docker compose -f infrastructure/docker-compose.kafka.yml up -d)
# =============================================================================
$Broker = if ($env:KAFKA_BROKER) { $env:KAFKA_BROKER } else { "kafka-broker-1" }
$Bootstrap = if ($env:KAFKA_BOOTSTRAP) { $env:KAFKA_BOOTSTRAP } else { "localhost:9092" }

Write-Host "=== Validation Event Bus Kafka (1.2) ===" -ForegroundColor Cyan
Write-Host "Broker: $Broker, Bootstrap: $Bootstrap"
Write-Host ""

Write-Host "1. Liste des topics..." -ForegroundColor Yellow
docker exec $Broker kafka-topics --bootstrap-server localhost:9092 --list
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur: le conteneur $Broker n'existe pas ou n'est pas en cours d'exécution." -ForegroundColor Red
    Write-Host "  - Si le port 9092 est déjà utilisé (Kafka du docker-compose principal), le stack Kafka 1.2 utilise le port 19092. Lancez: docker compose -f infrastructure/docker-compose.kafka.yml up -d" -ForegroundColor Yellow
    Write-Host "  - Si le conteneur existe mais est arrêté, supprimez-le puis relancez: docker rm -f $Broker; docker compose -f infrastructure/docker-compose.kafka.yml up -d" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

Write-Host "2. Détail topics (partitions, retention)..." -ForegroundColor Yellow
docker exec $Broker kafka-topics --bootstrap-server localhost:9092 --describe
Write-Host ""

Write-Host "3. Consumer order.events (5s from beginning)..." -ForegroundColor Yellow
$job = Start-Job { docker exec kafka-broker-1 kafka-console-consumer --bootstrap-server localhost:9092 --topic order.events --from-beginning --max-messages 1 --timeout-ms 3000 2>&1 }
Wait-Job $job -Timeout 6 | Out-Null
Receive-Job $job
Remove-Job $job -Force -ErrorAction SilentlyContinue
Write-Host ""

Write-Host "4. Schema Registry (si disponible)..." -ForegroundColor Yellow
try { $r = Invoke-WebRequest -Uri "http://localhost:8081/subjects" -UseBasicParsing -TimeoutSec 2; Write-Host " Schema Registry OK ($($r.StatusCode))" } catch { Write-Host " Schema Registry non joignable (8081)" }
Write-Host ""

Write-Host "5. Kafka UI (si disponible)..." -ForegroundColor Yellow
try { $r = Invoke-WebRequest -Uri "http://localhost:8080" -UseBasicParsing -TimeoutSec 2; Write-Host " Kafka UI OK - http://localhost:8080 ($($r.StatusCode))" } catch { Write-Host " Kafka UI non joignable (8080)" }
Write-Host ""

Write-Host "=== Fin validation ===" -ForegroundColor Cyan
