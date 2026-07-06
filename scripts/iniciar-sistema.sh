#!/bin/bash

echo "🏖️  INICIANDO SISTEMA DE QUIOSQUE DE PRAIA"
echo "=========================================="
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -d "backend" ]; then
    echo "❌ Erro: Execute este script na pasta raiz do projeto (onde estão as pastas backend, frontend-cliente, frontend-quiosque)"
    exit 1
fi

echo "${BLUE}1. Verificando dependências...${NC}"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale em: https://nodejs.org"
    exit 1
fi

# Verificar MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB não encontrado. O sistema tentará conectar em localhost:27017"
    echo "   Se você não tem MongoDB instalado, instale ou use MongoDB Atlas"
    read -p "   Pressione ENTER para continuar..."
fi

echo "✅ Node.js encontrado: $(node --version)"
echo ""

# Backend
echo "${BLUE}2. Configurando Backend...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo "   Instalando dependências..."
    npm install --silent
fi

if [ ! -f ".env" ]; then
    echo "   Criando arquivo .env..."
    cp .env.example .env
fi

echo "   Populando banco de dados..."
npm run seed

echo "${GREEN}✅ Backend configurado!${NC}"
echo ""

# Frontend Cliente
echo "${BLUE}3. Configurando Frontend Cliente...${NC}"
cd ../frontend-cliente

if [ ! -d "node_modules" ]; then
    echo "   Instalando dependências..."
    npm install --silent
fi

if [ ! -f ".env" ]; then
    echo "   Criando arquivo .env..."
    cp .env.example .env
fi

echo "${GREEN}✅ Frontend Cliente configurado!${NC}"
echo ""

# Frontend Quiosque
echo "${BLUE}4. Configurando Frontend Quiosque...${NC}"
cd ../frontend-quiosque

if [ ! -d "node_modules" ]; then
    echo "   Instalando dependências..."
    npm install --silent
fi

if [ ! -f ".env" ]; then
    echo "   Criando arquivo .env..."
    cp .env.example .env
fi

echo "${GREEN}✅ Frontend Quiosque configurado!${NC}"
echo ""

cd ..

echo "${YELLOW}=========================================="
echo "🎉 TUDO PRONTO PARA RODAR!"
echo "==========================================${NC}"
echo ""
echo "Agora execute em 3 terminais diferentes:"
echo ""
echo "${BLUE}Terminal 1 (Backend):${NC}"
echo "   cd backend && npm run dev"
echo ""
echo "${BLUE}Terminal 2 (App Cliente):${NC}"
echo "   cd frontend-cliente && npm run dev"
echo ""
echo "${BLUE}Terminal 3 (Dashboard Quiosque):${NC}"
echo "   cd frontend-quiosque && npm run dev"
echo ""
echo "${GREEN}Depois acesse:${NC}"
echo "   📱 App Cliente: http://localhost:5173"
echo "   💻 Dashboard: http://localhost:5174"
echo "   🔌 API: http://localhost:5000"
echo ""
echo "${YELLOW}Dica: Use Mesa 1 para testar!${NC}"
