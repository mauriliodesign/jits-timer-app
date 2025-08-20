# 🚀 Guia de Deploy - JITS Timer com Firebase

## 📋 **Pré-requisitos**

- [x] Firebase configurado (execute `./setup-firebase.sh`)
- [x] Arquivo `.env.production` criado
- [x] Build testado localmente

## 🎯 **1. Deploy no Vercel (Recomendado)**

### Instalação e Configuração
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login no Vercel
vercel login

# Configurar projeto
vercel
```

### Configurar Variáveis de Ambiente
```bash
# Adicionar variáveis do Firebase
vercel env add VITE_FIREBASE_API_KEY production
vercel env add VITE_FIREBASE_PROJECT_ID production
vercel env add VITE_FIREBASE_APP_ID production
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
vercel env add NODE_ENV production
```

### Deploy
```bash
# Build e deploy
./build-production.sh
vercel --prod
```

### Configurar Domínio no Firebase
1. Após deploy, copie a URL: `https://your-app.vercel.app`
2. No Firebase Console > Authentication > Settings
3. Adicione a URL em "Authorized domains"

---

## 🌐 **2. Deploy no Netlify**

### Instalação e Configuração
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Login no Netlify
netlify login

# Inicializar projeto
netlify init
```

### Configurar Build Settings
```bash
# netlify.toml
[build]
  publish = "public"
  command = "./build-production.sh"

[build.environment]
  NODE_ENV = "production"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/server/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Deploy
```bash
# Configurar variáveis de ambiente
netlify env:set VITE_FIREBASE_API_KEY "your_api_key"
netlify env:set VITE_FIREBASE_PROJECT_ID "your_project_id"
netlify env:set VITE_FIREBASE_APP_ID "your_app_id"
netlify env:set VITE_FIREBASE_MESSAGING_SENDER_ID "your_sender_id"
netlify env:set NODE_ENV "production"

# Deploy
netlify deploy --prod
```

---

## 🚂 **3. Deploy no Railway**

### Configuração
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login no Railway
railway login

# Criar projeto
railway new
```

### Configurar Variáveis
```bash
# Adicionar variáveis do Firebase
railway variables set VITE_FIREBASE_API_KEY=your_api_key
railway variables set VITE_FIREBASE_PROJECT_ID=your_project_id
railway variables set VITE_FIREBASE_APP_ID=your_app_id
railway variables set VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
railway variables set NODE_ENV=production
railway variables set PORT=5000
```

### Deploy
```bash
# Deploy
railway up
```

---

## 📦 **4. Deploy Manual (VPS/Server)**

### Pré-requisitos no Servidor
```bash
# Instalar Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 (opcional)
npm i -g pm2
```

### Upload e Configuração
```bash
# No servidor
git clone your-repository
cd jits-timer

# Copiar variáveis de ambiente
cp .env.production .env

# Build
./build-production.sh

# Iniciar
npm start

# Ou com PM2
pm2 start dist/index.js --name "jits-timer"
```

---

## 🧪 **Testes Pós-Deploy**

### Checklist de Verificação
```bash
# 1. Verificar se a aplicação está online
curl https://your-app.vercel.app/api/timer/current

# 2. Testar autenticação
# Abrir https://your-app.vercel.app e fazer login

# 3. Testar funcionalidades
# - Login com Google ✅
# - Criação de perfil ✅
# - Timer funcionando ✅
# - Sincronização TV/Mobile ✅
# - WebSocket funcionando ✅
```

### URLs de Teste
- **Aplicação**: `https://your-app.vercel.app/`
- **Controle Mobile**: `https://your-app.vercel.app/mobile`
- **Display TV**: `https://your-app.vercel.app/tv`
- **Configurações**: `https://your-app.vercel.app/config`
- **API Status**: `https://your-app.vercel.app/api/timer/current`

---

## 🔧 **Troubleshooting**

### Problemas Comuns

#### 1. **Erro de CORS**
```
Access to fetch blocked by CORS policy
```
**Solução**: Verificar domínios autorizados no Firebase

#### 2. **Variáveis de Ambiente Não Carregam**
```
Firebase configuration missing
```
**Solução**: 
- Verificar se todas as variáveis estão definidas
- Reiniciar deploy após adicionar variáveis

#### 3. **WebSocket Não Conecta**
```
WebSocket connection failed
```
**Solução**:
- Verificar se a plataforma suporta WebSocket
- Testar com polling como fallback

#### 4. **Build Falha**
```
Build failed with exit code 1
```
**Solução**:
- Verificar logs de build
- Testar build localmente primeiro
- Verificar dependências

### Logs e Debugging
```bash
# Vercel
vercel logs

# Netlify
netlify logs

# Railway
railway logs

# Manual
pm2 logs jits-timer
```

---

## 📊 **Monitoramento**

### Métricas Importantes
- **Uptime**: Disponibilidade da aplicação
- **Response Time**: Tempo de resposta da API
- **Error Rate**: Taxa de erros
- **User Sessions**: Sessões ativas de usuários

### Ferramentas de Monitoramento
- **Vercel Analytics**: Métricas automáticas
- **Firebase Console**: Monitoramento de auth e Firestore
- **Google Analytics**: Métricas de uso (opcional)

---

## 🎯 **Comandos Rápidos**

```bash
# Setup Firebase
./setup-firebase.sh

# Build para produção
./build-production.sh

# Deploy Vercel
vercel --prod

# Testar localmente em modo produção
NODE_ENV=production npm start

# Verificar status
curl https://your-app.vercel.app/api/timer/current
```

---

## 📈 **Otimizações para Produção**

### Performance
- [x] Build otimizado
- [x] Compressão de assets
- [x] Cache de recursos estáticos
- [x] Lazy loading de componentes

### Segurança
- [x] HTTPS obrigatório
- [x] Regras Firestore restritivas
- [x] Validação de entrada
- [x] Rate limiting (plataforma)

### Monitoramento
- [x] Logs estruturados
- [x] Error tracking
- [x] Performance monitoring
- [x] Uptime monitoring

---

## 🆘 **Suporte**

Se encontrar problemas durante o deploy:

1. **Verificar logs** da plataforma
2. **Testar localmente** com `NODE_ENV=production`
3. **Verificar Firebase Console** para erros
4. **Consultar documentação** da plataforma de deploy
