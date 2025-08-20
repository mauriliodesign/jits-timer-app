#!/bin/bash

echo "🧪 Testando aplicação em produção..."

# URL da aplicação
URL="https://jits-4c73068nx-maurilios-projects-67760c0e.vercel.app"

echo "📱 URL: $URL"

# Testar se a página principal carrega
echo "🔍 Testando página principal..."
curl -s "$URL" | grep -q "Jiu-jitsu Timer" && echo "✅ Página principal carregando" || echo "❌ Erro na página principal"

# Testar se o elemento root existe
echo "🔍 Verificando elemento #root..."
curl -s "$URL" | grep -q 'id="root"' && echo "✅ Elemento #root encontrado" || echo "❌ Elemento #root não encontrado"

# Testar API
echo "🔍 Testando API..."
API_RESPONSE=$(curl -s "$URL/api/timer/current")
echo "📡 API Response: $API_RESPONSE"

# Testar se Firebase config está presente
echo "🔍 Verificando configuração Firebase..."
curl -s "$URL" | grep -q "VITE_FIREBASE_API_KEY" && echo "✅ Firebase config presente" || echo "❌ Firebase config ausente"

echo "✅ Teste concluído!"
echo ""
echo "🎯 Para testar manualmente:"
echo "1. Acesse: $URL"
echo "2. Abra o console do navegador (F12)"
echo "3. Verifique se não há erros"
echo "4. Teste o login e funcionalidades"
