#!/bin/bash

echo "🔍 Verificando JITS Timer em Produção"
echo "===================================="

# Solicitar URL da aplicação
read -p "🌐 Digite a URL da sua aplicação (ex: https://jits-timer.vercel.app): " PROD_URL

if [ -z "$PROD_URL" ]; then
    echo "❌ URL não fornecida"
    exit 1
fi

echo ""
echo "🧪 Testando aplicação: $PROD_URL"
echo ""

# Função para testar endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    local expected_status=${3:-200}
    
    echo -n "📡 $description... "
    
    response=$(curl -s -w "%{http_code}" "$PROD_URL$endpoint" -o /tmp/response.json)
    status_code="${response: -3}"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo "✅ OK ($status_code)"
        if [ -s /tmp/response.json ]; then
            echo "   📄 Response: $(head -c 100 /tmp/response.json)..."
        fi
    else
        echo "❌ FALHOU ($status_code)"
        if [ -s /tmp/response.json ]; then
            echo "   📄 Error: $(cat /tmp/response.json)"
        fi
    fi
    echo ""
}

# Testar endpoints principais
echo "🔍 Testando APIs..."
test_endpoint "/" "Página principal"
test_endpoint "/api/timer/current" "Timer atual" "200"
test_endpoint "/api/profile/public" "Perfil público" "200"

echo "🔥 Testando Firebase..."
test_endpoint "/mobile" "Página mobile"
test_endpoint "/tv" "Página TV"
test_endpoint "/config" "Página configurações"

echo ""
echo "📊 Verificando logs da Vercel..."
echo "Execute: vercel logs --follow"
echo ""

echo "🧪 Testes manuais recomendados:"
echo "1. ✅ Abrir $PROD_URL/mobile"
echo "2. ✅ Fazer login com Google"
echo "3. ✅ Configurar academia"
echo "4. ✅ Iniciar timer"
echo "5. ✅ Abrir $PROD_URL/tv em outra aba"
echo "6. ✅ Verificar sincronização"
echo ""

echo "🔧 Se houver problemas:"
echo "1. Verificar variáveis de ambiente: vercel env ls"
echo "2. Ver logs: vercel logs"
echo "3. Verificar Firebase Console"
echo "4. Testar localmente: NODE_ENV=production npm start"
echo ""

# Limpar arquivo temporário
rm -f /tmp/response.json

echo "✅ Diagnóstico concluído!"
