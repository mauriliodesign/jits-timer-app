# Deploy no Netlify 🚀

## Configuração para Netlify

### 1. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Netlify Dashboard:

```
VITE_FIREBASE_API_KEY=AIzaSyCD2L9pWh9Ww97wqf6wROX5eJfz6PvGAc0
VITE_FIREBASE_PROJECT_ID=jits-timer
VITE_FIREBASE_APP_ID=1:743576123702:web:f62c5e99355cd592d09b97
VITE_FIREBASE_MESSAGING_SENDER_ID=743576123702
VITE_FIREBASE_MEASUREMENT_ID=G-7D5J1EMLJ3
NODE_ENV=production
```

### 2. Configuração do Build

O arquivo `netlify.toml` já está configurado com:
- Build command: `npm run build`
- Publish directory: `dist`
- NODE_ENV: `development` (para instalar todas as dependências)
- NPM flags: vazio (instala todas as dependências)

### 3. Domínios Autorizados no Firebase

No Firebase Console:
1. Vá para Authentication → Settings → Authorized domains
2. Adicione seu domínio do Netlify (ex: `your-app.netlify.app`)

### 4. Deploy

1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente
3. Deploy automático será executado

### 5. Problemas Comuns

**Erro: "vite: not found"**
- ✅ Resolvido: Vite movido para dependencies
- ✅ NODE_ENV configurado para "development" para instalar todas as dependências

**Erro: "No matching version found for drizzle-kit"**
- ✅ Resolvido: Atualizado para versão ^0.31.4
- ✅ Esbuild atualizado para ^0.25.9
- ✅ TypeScript atualizado para ^5.9.2

**Erro: "Firebase not initialized"**
- ✅ Verifique se as variáveis de ambiente estão configuradas
- ✅ Verifique se o domínio está autorizado no Firebase

### 6. URLs de Acesso

Após o deploy:
- **Aplicação Principal**: `https://your-app.netlify.app`
- **Controle Mobile**: `https://your-app.netlify.app/mobile`
- **Display TV**: `https://your-app.netlify.app/tv`
- **Configurações**: `https://your-app.netlify.app/profile`

### 7. Teste

Após o deploy, teste:
- ✅ Login com Google
- ✅ Criação de perfil da academia
- ✅ Funcionamento do timer
- ✅ Sincronização entre dispositivos
- ✅ Testes de som
