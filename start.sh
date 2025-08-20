#!/bin/bash

echo "🚀 JITS Timer - Iniciando..."
echo ""

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

# Matar processos que possam estar usando a porta
echo "🔄 Limpando processos anteriores..."
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "tsx" 2>/dev/null || true

# Definir variáveis de ambiente
export PORT=3000
export NODE_ENV=development

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "🌐 URLs de acesso:"
echo "   • Aplicação Principal: http://localhost:3000"
echo "   • Controle Mobile: http://localhost:3000/mobile"
echo "   • Display TV: http://localhost:3000/tv"
echo "   • Perfil: http://localhost:3000/profile"
echo ""
echo "🔧 APIs disponíveis:"
echo "   • Timer atual: http://localhost:3000/api/timer/current"
echo "   • Configurar timer: POST http://localhost:3000/api/timer/config"
echo "   • Controlar timer: POST http://localhost:3000/api/timer/control"
echo ""
echo "📱 Para parar o servidor: Ctrl+C"
echo ""

# Iniciar o servidor
npm run dev
