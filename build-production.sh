#!/bin/bash

echo "🔥 JITS Timer - Production Build"
echo "==============================="

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ Arquivo .env.production não encontrado!"
    echo "🚀 Execute primeiro: ./setup-firebase.sh"
    exit 1
fi

echo "📦 Instalando dependências..."
npm install

echo ""
echo "🧹 Limpando builds anteriores..."
rm -rf dist/
rm -rf public/assets/

echo ""
echo "🏗️  Building para produção..."

# Load production environment
export NODE_ENV=production
export $(cat .env.production | xargs)

# Build client
echo "📱 Building client..."
npm run build:static

# Build server
echo "🖥️  Building server..."
npm run build

echo ""
echo "📋 Verificando build..."

# Check if build files exist
if [ ! -d "dist/" ]; then
    echo "❌ Diretório dist/ não encontrado!"
    exit 1
fi

if [ ! -f "dist/index.js" ]; then
    echo "❌ Arquivo dist/index.js não encontrado!"
    exit 1
fi

if [ ! -d "public/" ]; then
    echo "❌ Diretório public/ não encontrado!"
    exit 1
fi

echo "✅ Build concluído com sucesso!"
echo ""
echo "📊 Estatísticas do build:"
echo "   📁 Diretório dist/: $(du -sh dist/ | cut -f1)"
echo "   📁 Diretório public/: $(du -sh public/ | cut -f1)"
echo ""
echo "🚀 Pronto para deploy!"
echo ""
echo "📋 Comandos de deploy:"
echo "   Vercel: vercel --prod"
echo "   Netlify: netlify deploy --prod --dir=public"
echo "   Railway: railway up"
echo ""
echo "🧪 Para testar localmente:"
echo "   NODE_ENV=production npm start"
