#!/bin/bash

# Script para rodar o JITS Timer localmente
echo "🚀 Iniciando JITS Timer..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instalando..."
    brew install node@20
    export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Definir porta (evitar conflito com AirPlay no macOS)
export PORT=3000
export NODE_ENV=development

echo "🌐 Servidor rodando em: http://localhost:3000"
echo "📱 Mobile Control: http://localhost:3000/mobile"
echo "📺 TV Display: http://localhost:3000/tv"
echo ""
echo "Pressione Ctrl+C para parar o servidor"

# Rodar o servidor
npm run dev
