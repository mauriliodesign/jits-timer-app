#!/bin/bash

echo "🔥 JITS Timer - Firebase Production Setup"
echo "========================================"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI não encontrado"
    echo "📦 Instalando Firebase CLI..."
    npm install -g firebase-tools
fi

echo ""
echo "📋 Checklist de Configuração:"
echo ""
echo "1. ✅ Acesse: https://console.firebase.google.com/"
echo "2. ✅ Crie um novo projeto: 'jits-timer-prod'"
echo "3. ✅ Habilite Authentication > Google"
echo "4. ✅ Crie Firestore Database (modo produção)"
echo "5. ✅ Configure regras de segurança"
echo "6. ✅ Registre uma app web"
echo "7. ✅ Copie as credenciais"
echo ""

read -p "🤔 Já criou o projeto no Firebase Console? (y/n): " created_project

if [ "$created_project" != "y" ]; then
    echo ""
    echo "🚀 Primeiro, crie o projeto no Firebase Console:"
    echo "   https://console.firebase.google.com/"
    echo ""
    echo "📋 Siga o guia: FIREBASE_PRODUCTION_SETUP.md"
    exit 1
fi

echo ""
echo "🔑 Vamos configurar as credenciais..."
echo ""

# Collect Firebase credentials
read -p "🔥 Firebase API Key: " api_key
read -p "🏗️  Project ID: " project_id
read -p "📱 App ID: " app_id
read -p "📧 Messaging Sender ID: " sender_id

# Create production environment file
echo "📝 Criando arquivo .env.production..."

cat > .env.production << EOF
# Firebase Configuration for Production
VITE_FIREBASE_API_KEY=${api_key}
VITE_FIREBASE_AUTH_DOMAIN=${project_id}.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=${project_id}
VITE_FIREBASE_STORAGE_BUCKET=${project_id}.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=${sender_id}
VITE_FIREBASE_APP_ID=${app_id}

# Server Configuration
PORT=5000
NODE_ENV=production
EOF

echo "✅ Arquivo .env.production criado!"
echo ""

# Update firestore rules
echo "🛡️  Configurando regras do Firestore..."

cat > firestore.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Timer sessions - apenas usuários autenticados podem ler/escrever
    match /timer_sessions/{sessionId} {
      allow read, write: if request.auth != null;
    }
    
    // Academy profiles - apenas o dono pode escrever, todos podem ler
    match /academy_profiles/{profileId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
EOF

echo "✅ Regras do Firestore atualizadas em firestore.rules"
echo ""

# Initialize Firebase project
echo "🚀 Inicializando projeto Firebase..."
firebase login
firebase init firestore --project ${project_id}

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. ✅ Aplicar regras: firebase deploy --only firestore:rules"
echo "2. ✅ Testar build: NODE_ENV=production npm run build"
echo "3. ✅ Deploy: vercel --prod (ou sua plataforma preferida)"
echo ""
echo "🔗 URLs importantes:"
echo "   Firebase Console: https://console.firebase.google.com/project/${project_id}"
echo "   Firestore: https://console.firebase.google.com/project/${project_id}/firestore"
echo "   Authentication: https://console.firebase.google.com/project/${project_id}/authentication"
echo ""
echo "📖 Guia completo: FIREBASE_PRODUCTION_SETUP.md"
