# 🔥 Firebase - Configuração para Produção

## 📋 **Checklist de Configuração**

- [ ] 1. Criar projeto Firebase
- [ ] 2. Configurar Authentication (Google)
- [ ] 3. Configurar Firestore Database
- [ ] 4. Configurar regras de segurança
- [ ] 5. Obter credenciais de produção
- [ ] 6. Configurar variáveis de ambiente
- [ ] 7. Testar em ambiente de produção
- [ ] 8. Deploy final

## 🎯 **1. Criar Projeto Firebase**

### Acesse o Firebase Console
1. Vá para [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Criar um projeto"**
3. Nome do projeto: `jits-timer-prod` (ou outro nome)
4. Habilite Google Analytics (opcional)
5. Clique em **"Criar projeto"**

## 🔐 **2. Configurar Authentication**

### Habilitar Google Authentication
1. No Firebase Console, vá para **"Authentication"**
2. Clique na aba **"Sign-in method"**
3. Clique em **"Google"**
4. **Habilite** o provedor Google
5. Configure o **email de suporte** do projeto
6. Clique em **"Salvar"**

### Configurar Domínios Autorizados
1. Na aba **"Settings"** > **"Authorized domains"**
2. Adicione seus domínios de produção:
   - `your-app.vercel.app`
   - `your-app.netlify.app`
   - `your-custom-domain.com`

## 🗄️ **3. Configurar Firestore Database**

### Criar Database
1. Vá para **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Iniciar no modo de produção"**
4. Selecione uma **localização** (ex: us-central1)
5. Clique em **"Concluído"**

### Criar Coleções Necessárias
O sistema criará automaticamente as coleções:
- `timer_sessions` - Sessões do timer
- `academy_profiles` - Perfis das academias

## 🛡️ **4. Configurar Regras de Segurança**

### Regras do Firestore
```javascript
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
```

### Aplicar as Regras
1. No Firestore, vá para **"Regras"**
2. Substitua as regras padrão pelas regras acima
3. Clique em **"Publicar"**

## 🔑 **5. Obter Credenciais**

### Configurar App Web
1. No Firebase Console, vá para **"Visão geral do projeto"**
2. Clique no ícone **"Web"** (`</>`)
3. Nome do app: `JITS Timer`
4. **NÃO** configure Firebase Hosting por enquanto
5. Clique em **"Registrar app"**

### Copiar Credenciais
```javascript
// Suas credenciais aparecerão assim:
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "jits-timer-prod.firebaseapp.com",
  projectId: "jits-timer-prod",
  storageBucket: "jits-timer-prod.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345",
  measurementId: "G-XXXXXXXXXX"
};
```

## 🌐 **6. Configurar Variáveis de Ambiente**

### Criar arquivo `.env.production`
```env
# Firebase Configuration for Production
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=jits-timer-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=jits-timer-prod
VITE_FIREBASE_STORAGE_BUCKET=jits-timer-prod.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789012345
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Server Configuration
PORT=5000
NODE_ENV=production
```

### Para Vercel/Netlify
Configure as mesmas variáveis no dashboard da plataforma:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `NODE_ENV=production`

## 🚀 **7. Scripts de Deploy**

### Build para Produção
```bash
#!/bin/bash
# build-production.sh

echo "🔥 Building JITS Timer for Production with Firebase..."

# Set production environment
export NODE_ENV=production

# Build the application
npm run build

echo "✅ Production build completed!"
echo "📱 Ready for deployment"
```

### Deploy para Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Configurar variáveis de ambiente
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_APP_ID
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add NODE_ENV

# Deploy
vercel --prod
```

## 🧪 **8. Testes de Produção**

### Checklist de Testes
- [ ] Login com Google funciona
- [ ] Criação de perfil da academia
- [ ] Timer inicia e para corretamente
- [ ] Sincronização entre dispositivos
- [ ] Persistência dos dados no Firestore
- [ ] Sons funcionam corretamente
- [ ] Interface responsiva em mobile/desktop

### URLs de Teste
Após deploy, teste:
- `https://your-app.vercel.app/` - Página inicial
- `https://your-app.vercel.app/mobile` - Controle mobile
- `https://your-app.vercel.app/tv` - Display TV
- `https://your-app.vercel.app/config` - Configurações

## 🔧 **9. Troubleshooting**

### Problemas Comuns

#### 1. Erro de Domínio Não Autorizado
```
Error: This domain is not authorized
```
**Solução**: Adicionar domínio em Firebase Console > Authentication > Settings > Authorized domains

#### 2. Erro de Permissão Firestore
```
Error: Missing or insufficient permissions
```
**Solução**: Verificar regras do Firestore e autenticação

#### 3. Variáveis de Ambiente Não Carregam
```
Error: Firebase configuration missing
```
**Solução**: Verificar se todas as variáveis estão definidas na plataforma de deploy

## 📊 **10. Monitoramento**

### Firebase Console
- **Authentication**: Monitorar logins
- **Firestore**: Verificar uso de dados
- **Performance**: Analisar performance da app

### Logs de Produção
- Verificar logs no Vercel/Netlify
- Monitorar erros JavaScript
- Acompanhar métricas de uso

## 🎯 **Próximos Passos**

1. **Configurar Analytics** para métricas de uso
2. **Implementar backup** dos dados Firestore
3. **Configurar alertas** para erros críticos
4. **Otimizar performance** para produção
5. **Implementar PWA** para instalação mobile

---

## 📝 **Comandos Rápidos**

```bash
# Desenvolvimento local
./dev-local.sh

# Build para produção
NODE_ENV=production npm run build

# Deploy Vercel
vercel --prod

# Verificar status
curl https://your-app.vercel.app/api/timer/current
```

## 🆘 **Suporte**

Se encontrar problemas:
1. Verificar logs do Firebase Console
2. Verificar logs da plataforma de deploy
3. Testar localmente com `NODE_ENV=production`
4. Verificar documentação do Firebase
