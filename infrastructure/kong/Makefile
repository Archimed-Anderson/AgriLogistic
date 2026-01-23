.PHONY: help validate diff sync reload backup test health metrics test-auth test-rate-limit logs clean

# Configuration
KONG_ADMIN_URL := http://localhost:8001
KONG_PROXY_URL := http://localhost:8000
KONG_CONFIG := /kong/kong.yml

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

help: ## Afficher l'aide
	@echo "$(BLUE)Kong DB-less Management Commands:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-18s$(NC) %s\n", $$1, $$2}'

validate: ## Valider la configuration YAML
	@echo "$(BLUE)🔍 Validation de kong.yml...$(NC)"
	@docker exec kong-deck deck validate --state $(KONG_CONFIG) || echo "$(YELLOW)⚠️  Kong Deck pas encore démarré$(NC)"
	@echo "$(GREEN)✅ Validation via Kong...$(NC)"
	@docker run --rm -v $$(pwd)/kong:/kong kong:3.4 kong config parse /kong/kong.yml

diff: ## Afficher les différences avec la config actuelle
	@echo "$(BLUE)📊 Différences entre fichier et Kong running:$(NC)"
	@docker exec kong-deck deck diff --state $(KONG_CONFIG) --kong-addr $(KONG_ADMIN_URL) || echo "$(YELLOW)⚠️  Deck ou Kong pas démarré$(NC)"

sync: validate ## Synchroniser la configuration avec Kong
	@echo "$(BLUE)🔄 Synchronisation de la configuration...$(NC)"
	@docker exec kong-deck deck sync --state $(KONG_CONFIG) --kong-addr $(KONG_ADMIN_URL)
	@echo "$(GREEN)✅ Configuration synchronisée!$(NC)"

reload: sync ## Alias pour sync
	@echo "$(GREEN)♻️  Kong configuration rechargée!$(NC)"

backup: ## Sauvegarder la configuration actuelle de Kong
	@echo "$(BLUE)💾 Backup de la configuration...$(NC)"
	@docker exec kong-deck deck dump --output-file /kong/kong.backup.$$(date +%Y%m%d_%H%M%S).yml --kong-addr $(KONG_ADMIN_URL)
	@echo "$(GREEN)✅ Backup créé!$(NC)"

test: ## Tester les endpoints Kong
	@echo "$(BLUE)🧪 Tests des endpoints...$(NC)"
	@echo "\n$(YELLOW)📍 Health Check:$(NC)"
	@curl -s $(KONG_ADMIN_URL)/status | jq '.database.reachable' || echo "null (DB-less mode)"
	@echo "\n$(YELLOW)📍 Services:$(NC)"
	@curl -s $(KONG_ADMIN_URL)/services | jq '.data[].name' || echo "Erreur"
	@echo "\n$(YELLOW)📍 Routes:$(NC)"
	@curl -s $(KONG_ADMIN_URL)/routes | jq '.data[].name' || echo "Erreur"
	@echo "\n$(YELLOW)📍 Plugins:$(NC)"
	@curl -s $(KONG_ADMIN_URL)/plugins | jq '.data[].name' || echo "Erreur"
	@echo "\n$(GREEN)✅ Tests terminés!$(NC)"

health: ## Vérifier la santé de Kong
	@echo "$(BLUE)🏥 Kong Health Check:$(NC)"
	@curl -s $(KONG_ADMIN_URL)/status | jq '.'

metrics: ## Afficher les métriques Prometheus
	@echo "$(BLUE)📊 Métriques Prometheus:$(NC)"
	@curl -s $(KONG_PROXY_URL)/metrics | head -n 50

test-auth: ## Tester l'authentification JWT
	@echo "$(BLUE)🔐 Test JWT Authentication:$(NC)"
	@echo "\n$(YELLOW)1️⃣  Sans token (devrait retourner 401):$(NC)"
	@curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" $(KONG_PROXY_URL)/api/v1/products
	@echo "\n$(YELLOW)2️⃣  Avec token JWT:$(NC)"
	@echo "   Générer via: curl -X POST $(KONG_PROXY_URL)/api/v1/auth/login"

test-rate-limit: ## Tester le rate limiting
	@echo "$(BLUE)⏱️  Test Rate Limiting:$(NC)"
	@for i in $$(seq 1 105); do \
		STATUS=$$(curl -s -o /dev/null -w "%{http_code}" $(KONG_PROXY_URL)/api/v1/auth/health || echo "000"); \
		if [ "$$STATUS" = "429" ]; then \
			echo "$(GREEN)✅ Rate limit déclenché après $$i requêtes$(NC)"; \
			break; \
		fi; \
		if [ $$i -eq 105 ]; then \
			echo "$(YELLOW)⚠️  Rate limit non atteint après 105 requêtes$(NC)"; \
		fi; \
	done

logs: ## Voir les logs Kong
	@docker logs -f kong-gateway

install-deck: ## Installer Kong Deck CLI localement
	@echo "$(BLUE)📥 Installation de Kong Deck...$(NC)"
	@echo "$(YELLOW)Visitez: https://docs.konghq.com/deck/latest/installation/$(NC)"

clean: ## Nettoyer les backups anciens (>30 jours)
	@find kong -name "kong.backup.*.yml" -mtime +30 -delete 2>/dev/null || true
	@echo "$(GREEN)🧹 Anciens backups supprimés$(NC)"

status: ## Afficher le statut complet
	@echo "$(BLUE)╔════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║   Kong Gateway Status$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)🐳 Docker Containers:$(NC)"
	@docker ps --filter "name=kong" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
	@echo ""
	@echo "$(YELLOW)📊 Kong Info:$(NC)"
	@curl -s $(KONG_ADMIN_URL)/ | jq '{version:.version, hostname:.hostname, timers:.timers}'
	@echo ""
	@echo "$(YELLOW)📈 Kong Stats:$(NC)"
	@curl -s $(KONG_ADMIN_URL)/status | jq '{server:.server, database:.database}'

quick-test: ## Test rapide (health + services)
	@echo "$(BLUE)⚡ Quick Test$(NC)"
	@curl -s $(KONG_ADMIN_URL)/status > /dev/null && echo "$(GREEN)✅ Kong Admin API$(NC)" || echo "$(RED)❌ Kong Admin API$(NC)"
	@curl -s $(KONG_ADMIN_URL)/services | jq -e '.data | length > 0' > /dev/null && echo "$(GREEN)✅ Services configurés$(NC)" || echo "$(YELLOW)⚠️  Aucun service$(NC)"
	@curl -s $(KONG_PROXY_URL)/metrics > /dev/null && echo "$(GREEN)✅ Métriques disponibles$(NC)" || echo "$(YELLOW)⚠️  Métriques indisponibles$(NC)"
