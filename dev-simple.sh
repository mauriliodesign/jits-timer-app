#!/bin/bash

echo "🚀 Iniciando JITS Timer - Versão Simplificada"
echo "=============================================="

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

echo "🔧 Iniciando servidor de desenvolvimento..."
echo ""
echo "📱 URLs disponíveis:"
echo "   • Página inicial: http://localhost:5173/simple-home"
echo "   • Controle: http://localhost:5173/simple"
echo "   • Exibição TV: http://localhost:5173/tv-simple"
echo ""
echo "💡 Dica: Abra o controle no seu celular e a exibição TV em uma tela grande!"
echo ""

# Iniciar o servidor de desenvolvimento
npm run dev
