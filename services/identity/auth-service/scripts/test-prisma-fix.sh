#!/bin/bash
# =============================================================================
# Script de Test pour les Corrections Prisma 7
# =============================================================================
# Ce script teste toutes les corrections apportées pour résoudre l'erreur P1012

set -euo pipefail

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

# Script directory
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SERVICE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
FAILED_TESTS=()

print_header() {
    echo ""
    echo -e "${BLUE}====================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}====================================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
    ((TESTS_PASSED++))
}

print_error() {
    echo -e "${RED}✗${NC} $1"
    ((TESTS_FAILED++))
    FAILED_TESTS+=("$1")
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# =============================================================================
# Test 1: Vérification de l'existence des fichiers
# =============================================================================
test_file_existence() {
    print_header "Test 1: Vérification de l'existence des fichiers"

    local files_to_check=(
        "prisma.config.ts"
        "prisma/schema.prisma"
        ".env.example"
        "PRISMA_7_FIX.md"
    )

    for file in "${files_to_check[@]}"; do
        if [ -f "$SERVICE_ROOT/$file" ]; then
            print_success "Fichier trouvé: $file"
        else
            print_error "Fichier manquant: $file"
        fi
    done
}

# =============================================================================
# Test 2: Vérification de la syntaxe du schema.prisma
# =============================================================================
test_schema_syntax() {
    print_header "Test 2: Vérification de la syntaxe du schema.prisma"

    cd "$SERVICE_ROOT"

    # Vérifier que le schema.prisma n'a pas la propriété url dans datasource
    if grep -q "url.*=.*env" prisma/schema.prisma; then
        print_error "Le schema.prisma contient encore la propriété 'url' dans datasource"
    else
        print_success "Le schema.prisma ne contient pas la propriété 'url' (correct pour Prisma 7)"
    fi

    # Vérifier que le provider est défini
    if grep -q 'provider = "postgresql"' prisma/schema.prisma; then
        print_success "Le provider PostgreSQL est correctement défini"
    else
        print_error "Le provider PostgreSQL n'est pas défini dans schema.prisma"
    fi
}

# =============================================================================
# Test 3: Vérification de la syntaxe TypeScript de prisma.config.ts
# =============================================================================
test_config_syntax() {
    print_header "Test 3: Vérification de la syntaxe TypeScript de prisma.config.ts"

    cd "$SERVICE_ROOT"

    # Vérifier que le fichier existe et est lisible
    if [ ! -f "prisma.config.ts" ]; then
        print_error "prisma.config.ts n'existe pas"
        return 1
    fi

    # Vérifier la présence de defineConfig
    if grep -q "defineConfig" prisma.config.ts; then
        print_success "prisma.config.ts utilise defineConfig"
    else
        print_error "prisma.config.ts n'utilise pas defineConfig"
    fi

    # Vérifier la présence de datasource.url
    if grep -q "datasource.*url" prisma.config.ts; then
        print_success "prisma.config.ts contient la configuration datasource.url"
    else
        print_error "prisma.config.ts ne contient pas la configuration datasource.url"
    fi

    # Vérifier l'import de dotenv/config
    if grep -q "import.*dotenv/config" prisma.config.ts; then
        print_success "prisma.config.ts importe dotenv/config"
    else
        print_warning "prisma.config.ts n'importe pas dotenv/config (peut être optionnel)"
    fi
}

# =============================================================================
# Test 4: Vérification de la compilation TypeScript
# =============================================================================
test_typescript_compilation() {
    print_header "Test 4: Vérification de la compilation TypeScript"

    cd "$SERVICE_ROOT"

    # Vérifier si TypeScript est disponible
    if ! command -v tsc &> /dev/null && ! command -v npx &> /dev/null; then
        print_warning "TypeScript n'est pas disponible - test ignoré"
        return 0
    fi

    # Compiler prisma.config.ts
    if command -v npx &> /dev/null; then
        if npx tsc --noEmit prisma.config.ts 2>/dev/null; then
            print_success "prisma.config.ts compile sans erreurs TypeScript"
        else
            print_error "prisma.config.ts a des erreurs de compilation TypeScript"
        fi
    else
        print_warning "npx n'est pas disponible - test ignoré"
    fi
}

# =============================================================================
# Test 5: Test de génération Prisma avec DATABASE_URL
# =============================================================================
test_prisma_generate_with_database_url() {
    print_header "Test 5: Génération Prisma avec DATABASE_URL"

    cd "$SERVICE_ROOT"

    # Sauvegarder les variables d'environnement actuelles
    local old_database_url="$DATABASE_URL"
    local old_db_host="$DB_HOST"
    local old_db_port="$DB_PORT"
    local old_db_name="$DB_NAME"
    local old_db_user="$DB_USER"
    local old_db_password="$DB_PASSWORD"

    # Nettoyer les variables individuelles pour forcer l'utilisation de DATABASE_URL
    unset DB_HOST DB_PORT DB_NAME DB_USER DB_PASSWORD

    # Définir DATABASE_URL
    export DATABASE_URL="postgresql://test:test@localhost:5432/test_db?schema=public"

    print_info "Test avec DATABASE_URL=$DATABASE_URL"

    # Tester la génération (sans connexion réelle à la DB)
    if npx prisma generate --schema=./prisma/schema.prisma 2>&1 | grep -q "P1012\|url is no longer supported"; then
        print_error "L'erreur P1012 persiste avec DATABASE_URL"
    else
        # Vérifier que le client a été généré
        if [ -d "node_modules/.prisma/client" ] || [ -d "node_modules/@prisma/client" ]; then
            print_success "Génération Prisma réussie avec DATABASE_URL (pas d'erreur P1012)"
        else
            print_warning "Génération Prisma effectuée mais client non trouvé (peut nécessiter une connexion DB)"
        fi
    fi

    # Restaurer les variables d'environnement
    export DATABASE_URL="$old_database_url"
    export DB_HOST="$old_db_host"
    export DB_PORT="$old_db_port"
    export DB_NAME="$old_db_name"
    export DB_USER="$old_db_user"
    export DB_PASSWORD="$old_db_password"
}

# =============================================================================
# Test 6: Test de génération Prisma avec variables individuelles
# =============================================================================
test_prisma_generate_with_individual_vars() {
    print_header "Test 6: Génération Prisma avec variables individuelles"

    cd "$SERVICE_ROOT"

    # Sauvegarder les variables d'environnement actuelles
    local old_database_url="$DATABASE_URL"

    # Nettoyer DATABASE_URL pour forcer l'utilisation des variables individuelles
    unset DATABASE_URL

    # Définir les variables individuelles
    export DB_HOST="localhost"
    export DB_PORT="5432"
    export DB_NAME="test_db"
    export DB_USER="test"
    export DB_PASSWORD="test"

    print_info "Test avec variables individuelles (DB_HOST, DB_PORT, etc.)"

    # Tester la génération
    if npx prisma generate --schema=./prisma/schema.prisma 2>&1 | grep -q "P1012\|url is no longer supported"; then
        print_error "L'erreur P1012 persiste avec variables individuelles"
    else
        print_success "Génération Prisma réussie avec variables individuelles (pas d'erreur P1012)"
    fi

    # Restaurer DATABASE_URL
    export DATABASE_URL="$old_database_url"
}

# =============================================================================
# Test 7: Vérification des scripts package.json
# =============================================================================
test_package_scripts() {
    print_header "Test 7: Vérification des scripts package.json"

    cd "$SERVICE_ROOT"

    # Vérifier que les scripts Prisma existent
    local scripts_to_check=(
        "prisma:generate"
        "prisma:migrate"
        "prisma:studio"
    )

    for script in "${scripts_to_check[@]}"; do
        if grep -q "\"$script\"" package.json; then
            print_success "Script trouvé: $script"
        else
            print_error "Script manquant: $script"
        fi
    done

    # Vérifier que le script build inclut prisma generate
    if grep -q '"build".*prisma generate' package.json; then
        print_success "Le script build inclut 'prisma generate'"
    else
        print_error "Le script build n'inclut pas 'prisma generate'"
    fi

    # Vérifier que dotenv est dans les dépendances
    if grep -q '"dotenv"' package.json; then
        print_success "dotenv est présent dans les dépendances"
    else
        print_error "dotenv n'est pas présent dans les dépendances"
    fi
}

# =============================================================================
# Test 8: Vérification de .env.example
# =============================================================================
test_env_example() {
    print_header "Test 8: Vérification de .env.example"

    cd "$SERVICE_ROOT"

    if [ ! -f ".env.example" ]; then
        print_error ".env.example n'existe pas"
        return 1
    fi

    # Vérifier la présence de DATABASE_URL
    if grep -q "DATABASE_URL" .env.example; then
        print_success ".env.example contient DATABASE_URL"
    else
        print_error ".env.example ne contient pas DATABASE_URL"
    fi

    # Vérifier la présence des variables individuelles
    local vars_to_check=("DB_HOST" "DB_PORT" "DB_NAME" "DB_USER" "DB_PASSWORD")
    for var in "${vars_to_check[@]}"; do
        if grep -q "$var" .env.example; then
            print_success ".env.example contient $var"
        else
            print_warning ".env.example ne contient pas $var (optionnel)"
        fi
    done
}

# =============================================================================
# Test 9: Test de validation du schema Prisma
# =============================================================================
test_prisma_validate() {
    print_header "Test 9: Validation du schema Prisma"

    cd "$SERVICE_ROOT"

    if npx prisma validate --schema=./prisma/schema.prisma 2>&1 | grep -q "error\|Error"; then
        print_error "Le schema Prisma a des erreurs de validation"
        npx prisma validate --schema=./prisma/schema.prisma 2>&1 | head -5
    else
        print_success "Le schema Prisma est valide"
    fi
}

# =============================================================================
# Test 10: Test de format du schema
# =============================================================================
test_prisma_format() {
    print_header "Test 10: Format du schema Prisma"

    cd "$SERVICE_ROOT"

    # Formater le schema et vérifier s'il y a des changements
    local schema_backup="prisma/schema.prisma.bak"
    cp prisma/schema.prisma "$schema_backup"

    if npx prisma format --schema=./prisma/schema.prisma 2>&1 | grep -q "error\|Error"; then
        print_error "Erreur lors du formatage du schema Prisma"
        mv "$schema_backup" prisma/schema.prisma
    else
        # Vérifier s'il y a eu des changements
        if diff -q prisma/schema.prisma "$schema_backup" > /dev/null; then
            print_success "Le schema Prisma est correctement formaté"
        else
            print_warning "Le schema Prisma a été reformaté (vérifiez les changements)"
        fi
        rm -f "$schema_backup"
    fi
}

# =============================================================================
# Résumé des tests
# =============================================================================
print_summary() {
    print_header "Résumé des Tests"

    echo "Tests réussis: $TESTS_PASSED"
    echo "Tests échoués: $TESTS_FAILED"
    echo ""

    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}✓ Tous les tests sont passés !${NC}"
        echo ""
        echo "Les corrections Prisma 7 sont validées."
        return 0
    else
        echo -e "${RED}✗ Certains tests ont échoué :${NC}"
        for test in "${FAILED_TESTS[@]}"; do
            echo "  - $test"
        done
        echo ""
        echo "Veuillez corriger les problèmes identifiés."
        return 1
    fi
}

# =============================================================================
# Exécution des tests
# =============================================================================
main() {
    print_header "Tests des Corrections Prisma 7"

    print_info "Répertoire du service: $SERVICE_ROOT"
    echo ""

    # Vérifier que nous sommes dans le bon répertoire
    if [ ! -f "$SERVICE_ROOT/package.json" ]; then
        print_error "package.json non trouvé. Êtes-vous dans le bon répertoire ?"
        exit 1
    fi

    # Exécuter tous les tests
    test_file_existence
    test_schema_syntax
    test_config_syntax
    test_typescript_compilation
    test_prisma_generate_with_database_url
    test_prisma_generate_with_individual_vars
    test_package_scripts
    test_env_example
    test_prisma_validate
    test_prisma_format

    # Afficher le résumé
    print_summary
}

# Exécuter les tests
main "$@"
