# Deploy no Vercel 🚀

## Configuração para Vercel

### 1. Pré-requisitos

- Conta no Vercel (gratuita)
- Projeto no GitHub conectado ao Vercel
- Vercel CLI instalado (opcional)

### 2. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Vercel Dashboard:

```
VITE_FIREBASE_API_KEY=AIzaSyCD2L9pWh9Ww97wqf6wROX5eJfz6PvGAc0
VITE_FIREBASE_PROJECT_ID=jits-timer
VITE_FIREBASE_APP_ID=1:743576123702:web:f62c5e99355cd592d09b97
VITE_FIREBASE_MESSAGING_SENDER_ID=743576123702
VITE_FIREBASE_MEASUREMENT_ID=G-7D5J1EMLJ3
NODE_ENV=production
```

### 3. Configuração do Build

O arquivo `vercel.json` já está configurado com:
- Build do servidor: `server/index.ts`
- Build do cliente: `package.json` → `dist/public`
- Rotas configuradas para API e WebSocket

### 4. Domínios Autorizados no Firebase

No Firebase Console:
1. Vá para Authentication → Settings → Authorized domains
2. Adicione seu domínio do Vercel (ex: `your-app.vercel.app`)

### 5. Deploy via Dashboard

1. **Conecte o repositório**:
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório do GitHub

2. **Configure o projeto**:
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

3. **Configure as variáveis de ambiente**:
   - Vá em Settings → Environment Variables
   - Adicione todas as variáveis do Firebase

4. **Deploy**:
   - Clique em "Deploy"

### 6. Deploy via CLI (Opcional)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Para produção
vercel --prod
```

### 7. Problemas Comuns

**Erro: "Build failed"**
- ✅ Verifique se o `package.json` tem o script `build`
- ✅ Verifique se todas as dependências estão instaladas

**Erro: "Firebase not initialized"**
- ✅ Verifique se as variáveis de ambiente estão configuradas
- ✅ Verifique se o domínio está autorizado no Firebase

**Erro: "WebSocket connection failed"**
- ✅ Vercel não suporta WebSockets em planos gratuitos
- ✅ Considere usar Netlify ou Railway para WebSocket

### 8. URLs de Acesso

Após o deploy:
- **Aplicação Principal**: `https://your-app.vercel.app`
- **Controle Mobile**: `https://your-app.vercel.app/mobile`
- **Display TV**: `https://your-app.vercel.app/tv`
- **Configurações**: `https://your-app.vercel.app/profile`

### 9. Limitações do Vercel

⚠️ **Importante**: Vercel não suporta WebSockets em planos gratuitos
- Para funcionalidade completa, considere:
  - Netlify (suporta WebSockets)
  - Railway
  - Heroku
  - DigitalOcean

### 10. Teste

Após o deploy, teste:
- ✅ Login com Google
- ✅ Criação de perfil da academia
- ✅ Funcionamento do timer (sem WebSocket)
- ✅ Testes de som

## Alternativa Recomendada

Para funcionalidade completa com WebSockets, use **Netlify**:
- Suporta WebSockets
- Deploy mais simples
- Melhor para aplicações em tempo real
