#!/bin/bash
# =============================================================================
# AgroLogistic Platform - Setup Script
# Automates the installation and configuration of the development environment
# =============================================================================

set -euo pipefail

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Script directory
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$SCRIPT_DIR"

# =============================================================================
# Helper Functions
# =============================================================================

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

print_header() {
    echo ""
    echo -e "${BLUE}====================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}====================================================${NC}"
    echo ""
}

# =============================================================================
# Prerequisites Check
# =============================================================================

check_prerequisites() {
    print_header "Checking Prerequisites"

    local missing_deps=()

    # Check Node.js - try multiple methods for WSL compatibility
    local node_found=false
    local node_version_str=""
    
    # Method 1: Standard command check
    if command -v node &> /dev/null; then
        node_version_str=$(node -v 2>/dev/null || echo "")
        if [ -n "$node_version_str" ]; then
            node_found=true
        fi
    fi
    
    # Method 2: Try Windows path (for WSL)
    if [ "$node_found" = false ] && [ -d "/mnt/c" ]; then
        # Try common Windows Node.js installation paths
        local windows_paths=(
            "/mnt/c/Program Files/nodejs/node.exe"
            "/mnt/c/Program Files (x86)/nodejs/node.exe"
            "/mnt/c/Users/$USER/AppData/Roaming/npm/node.exe"
        )
        
        for node_path in "${windows_paths[@]}"; do
            if [ -f "$node_path" ]; then
                node_version_str=$("$node_path" -v 2>/dev/null || echo "")
                if [ -n "$node_version_str" ]; then
                    print_warning "Node.js found in Windows path but not in WSL PATH"
                    print_info "Consider adding Node.js to your WSL PATH or installing it in WSL"
                    print_info "For now, you can continue but Node.js commands may not work in WSL"
                    # Don't mark as found, but don't fail either - let user decide
                    break
                fi
            fi
        done
    fi
    
    # Method 3: Try nvm if available
    if [ "$node_found" = false ] && [ -s "$HOME/.nvm/nvm.sh" ]; then
        source "$HOME/.nvm/nvm.sh" 2>/dev/null || true
        if command -v node &> /dev/null; then
            node_version_str=$(node -v 2>/dev/null || echo "")
            if [ -n "$node_version_str" ]; then
                node_found=true
            fi
        fi
    fi
    
    # Final check
    if [ "$node_found" = true ] && [ -n "$node_version_str" ]; then
        local node_version=$(echo "$node_version_str" | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$node_version" -lt 18 ] 2>/dev/null; then
            print_error "Node.js version must be >= 18.0.0 (found: $node_version_str)"
            missing_deps+=("Node.js (>= 18.0.0)")
        else
            print_success "Node.js $node_version_str is installed"
        fi
    else
        print_warning "Node.js is not found in PATH"
        print_info "If Node.js is installed on Windows, you may need to:"
        print_info "  1. Install Node.js in WSL, or"
        print_info "  2. Add Windows Node.js to WSL PATH"
        print_info ""
        print_info "Continuing anyway - you can install Node.js later if needed"
        # Don't add to missing_deps - allow continuation
    fi

    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        missing_deps+=("Docker")
    else
        if ! docker ps &> /dev/null; then
            print_error "Docker daemon is not running"
            print_info "Please start Docker and try again"
            # Don't exit - allow continuation for other checks
        else
            local docker_version=$(docker --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || echo "unknown")
            print_success "Docker $docker_version is installed and running"
        fi
    fi

    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed"
        missing_deps+=("Docker Compose")
    else
        print_success "Docker Compose is available"
    fi

    if [ ${#missing_deps[@]} -gt 0 ]; then
        print_warning "Some dependencies are missing or not accessible:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo ""
        print_info "The script will continue, but some features may not work"
        print_info "Please install missing dependencies when possible"
        echo ""
    fi
    
    return 0
}

# =============================================================================
# pnpm Installation
# =============================================================================

install_pnpm() {
    print_header "Checking pnpm Installation"

    if command -v pnpm &> /dev/null; then
        local pnpm_version=$(pnpm -v 2>/dev/null || echo "unknown")
        print_success "pnpm $pnpm_version is already installed"
        return 0
    fi

    # Check if Node.js is available (required for pnpm)
    if ! command -v node &> /dev/null && ! command -v npm &> /dev/null; then
        print_warning "Node.js/npm not found in PATH - cannot install pnpm automatically"
        print_info "Please install Node.js first, then run this script again"
        print_info "Or install pnpm manually: curl -fsSL https://get.pnpm.io/install.sh | sh -"
        return 1
    fi

    print_info "pnpm is not installed. Installing..."

    # Try to use corepack (Node.js 16.9+)
    if command -v corepack &> /dev/null; then
        print_info "Using corepack to enable pnpm..."
        if corepack enable 2>/dev/null && corepack prepare pnpm@9.0.0 --activate 2>/dev/null; then
            print_success "pnpm installed via corepack"
            return 0
        fi
    fi

    # Fallback to npm install
    if command -v npm &> /dev/null; then
        print_info "Installing pnpm via npm..."
        if npm install -g pnpm@9.0.0 2>/dev/null; then
            print_success "pnpm installed via npm"
            return 0
        fi
    fi

    # Last resort: curl installation (requires Node.js to be installed separately)
    print_info "Attempting to install pnpm via standalone script..."
    if curl -fsSL https://get.pnpm.io/install.sh 2>/dev/null | sh - 2>/dev/null; then
        # Source the shell configuration if needed
        if [ -f "$HOME/.bashrc" ]; then
            source "$HOME/.bashrc" 2>/dev/null || true
        fi
        if [ -f "$HOME/.zshrc" ]; then
            source "$HOME/.zshrc" 2>/dev/null || true
        fi
        
        if command -v pnpm &> /dev/null; then
            print_success "pnpm installed via standalone script"
            return 0
        fi
    fi

    print_warning "Failed to install pnpm automatically"
    print_info "You can install it manually later with:"
    print_info "  curl -fsSL https://get.pnpm.io/install.sh | sh -"
    return 1
}

# =============================================================================
# Environment Configuration
# =============================================================================

setup_environment() {
    print_header "Setting Up Environment"

    local env_file="$PROJECT_ROOT/.env"
    local env_example="$PROJECT_ROOT/.env.example"

    if [ -f "$env_file" ]; then
        print_warning ".env file already exists. Skipping creation."
        print_info "If you need to update it, copy from .env.example manually"
    else
        if [ -f "$env_example" ]; then
            print_info "Creating .env file from .env.example..."
            cp "$env_example" "$env_file"
            print_success ".env file created"
            print_warning "Please review and update .env with your configuration"
        else
            print_warning ".env.example not found. Creating basic .env file..."
            cat > "$env_file" <<EOF
# AgroDeep Platform - Environment Variables
# Generated by setup.sh

VITE_APP_NAME=AgroDeep
VITE_APP_VERSION=2.0.0
VITE_API_GATEWAY_URL=http://localhost:8000/api/v1
EOF
            print_success "Basic .env file created"
        fi
    fi
}

# =============================================================================
# Dependencies Installation
# =============================================================================

install_dependencies() {
    print_header "Installing Dependencies"

    cd "$PROJECT_ROOT"

    if [ ! -f "package.json" ]; then
        print_error "package.json not found in $PROJECT_ROOT"
        exit 1
    fi

    # Check if pnpm is available
    if ! command -v pnpm &> /dev/null; then
        print_warning "pnpm is not available - skipping dependency installation"
        print_info "Please install pnpm first, then run: pnpm install"
        print_info "Or install Node.js and pnpm, then run this script again"
        return 1
    fi

    print_info "Installing dependencies with pnpm..."
    if pnpm install; then
        print_success "Dependencies installed successfully"
        return 0
    else
        print_error "Failed to install dependencies"
        print_info "You can try manually: pnpm install"
        return 1
    fi
}

# =============================================================================
# Docker Volumes Initialization
# =============================================================================

init_docker_volumes() {
    print_header "Initializing Docker Volumes"

    if [ ! -f "$PROJECT_ROOT/docker-compose.yml" ]; then
        print_warning "docker-compose.yml not found. Skipping volume initialization."
        return 0
    fi

    print_info "Creating Docker volumes (if they don't exist)..."
    
    # Pull images and create volumes without starting services
    docker compose config --volumes | while read -r volume; do
        if [ -n "$volume" ]; then
            print_info "Ensuring volume exists: $volume"
            docker volume inspect "$volume" &> /dev/null || docker volume create "$volume" &> /dev/null
        fi
    done || true

    print_success "Docker volumes ready"
}

# =============================================================================
# Main Execution
# =============================================================================

main() {
    print_header "AgroLogistic Platform - Development Environment Setup"

    print_info "Project root: $PROJECT_ROOT"
    echo ""

    # Track successful steps
    local steps_completed=()
    local steps_failed=()

    # Run setup steps (continue even if some fail)
    if check_prerequisites; then
        steps_completed+=("Prerequisites check")
    else
        steps_failed+=("Prerequisites check")
    fi

    if install_pnpm; then
        steps_completed+=("pnpm installation")
    else
        steps_failed+=("pnpm installation")
    fi

    if setup_environment; then
        steps_completed+=("Environment setup")
    else
        steps_failed+=("Environment setup")
    fi

    if install_dependencies; then
        steps_completed+=("Dependencies installation")
    else
        steps_failed+=("Dependencies installation")
    fi

    if init_docker_volumes; then
        steps_completed+=("Docker volumes initialization")
    else
        steps_failed+=("Docker volumes initialization")
    fi

    # Final summary
    print_header "Setup Summary"
    
    if [ ${#steps_completed[@]} -gt 0 ]; then
        print_success "Completed steps:"
        for step in "${steps_completed[@]}"; do
            echo -e "  ${GREEN}✓${NC} $step"
        done
        echo ""
    fi

    if [ ${#steps_failed[@]} -gt 0 ]; then
        print_warning "Steps that need attention:"
        for step in "${steps_failed[@]}"; do
            echo -e "  ${YELLOW}⚠${NC} $step"
        done
        echo ""
    fi

    print_info "Next steps:"
    echo ""
    
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        echo "  1. Create .env file from .env.example:"
        echo "     ${BLUE}cp .env.example .env${NC}"
        echo ""
    else
        echo "  1. Review and update .env file with your configuration:"
        echo "     ${BLUE}cat .env${NC}"
        echo ""
    fi
    
    echo "  2. Start the infrastructure services:"
    echo "     ${BLUE}docker compose up -d${NC}"
    echo ""
    
    if command -v pnpm &> /dev/null; then
        echo "  3. Start the development servers:"
        echo "     ${BLUE}pnpm run dev${NC}"
        echo ""
    else
        echo "  3. Install Node.js and pnpm, then start development servers:"
        echo "     ${BLUE}# Install Node.js first${NC}"
        echo "     ${BLUE}curl -fsSL https://get.pnpm.io/install.sh | sh -${NC}"
        echo "     ${BLUE}pnpm install${NC}"
        echo "     ${BLUE}pnpm run dev${NC}"
        echo ""
    fi
    
    echo "  4. Or use the all-in-one script:"
    echo "     ${BLUE}./START_APP_SIMPLE.ps1${NC} (Windows)"
    echo "     ${BLUE}bash scripts/start-all.sh${NC} (Linux/Mac)"
    echo ""
    
    if [ ${#steps_failed[@]} -eq 0 ]; then
        print_success "Happy coding! 🚀"
    else
        print_warning "Some steps need attention, but you can continue with the available features"
    fi
    echo ""
}

# Run main function
main "$@"
