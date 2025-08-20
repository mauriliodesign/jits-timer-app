# JITS Timer 🥋

Sistema de timer inteligente para academias de Jiu-Jitsu com interface dupla (controle mobile + display TV) e sincronização em tempo real.

## ✅ Status: Funcionando Localmente

O projeto está **100% funcional** localmente com todas as funcionalidades implementadas.

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 20+ 
- npm ou yarn

### Instalação Rápida

1. **Clone o repositório**
```bash
git clone <repository-url>
cd jits-timer
```

2. **Execute o script de desenvolvimento**
```bash
./start.sh
```

Ou manualmente:
```bash
npm install
PORT=3000 npm run dev
```

### URLs de Acesso

- **Aplicação Principal**: http://localhost:3000
- **Controle Mobile**: http://localhost:3000/mobile
- **Display TV**: http://localhost:3000/tv
- **Configurações**: http://localhost:3000/profile ou http://localhost:3000/config

## 🌐 Deploy para Produção

### Pré-requisitos para Produção
- Conta no Firebase Console
- Projeto Firebase configurado
- Plataforma de hosting (Vercel, Netlify, Railway, etc.)

### 1. Configurar Firebase

1. **Crie um projeto no Firebase Console**
   - Acesse [Firebase Console](https://console.firebase.google.com/)
   - Crie um novo projeto ou use um existente

2. **Configure Authentication**
   - Vá para "Authentication" → "Sign-in method"
   - Habilite "Google" como provedor
   - Configure os domínios autorizados

3. **Obtenha as credenciais**
   - Vá para "Project Settings" → "General"
   - Role até "Your apps" e clique em "Add app" → "Web"
   - Copie as credenciais de configuração

### 2. Configurar Variáveis de Ambiente

1. **Crie o arquivo `.env` para produção**
```bash
cp env.production.example .env
```

2. **Preencha as variáveis com suas credenciais reais**
```env
# Firebase Configuration for Production
VITE_FIREBASE_API_KEY=your_actual_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_actual_firebase_project_id
VITE_FIREBASE_APP_ID=your_actual_firebase_app_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_firebase_messaging_sender_id

# Server Configuration
PORT=5000
NODE_ENV=production
```

### 3. Build para Produção

Execute o script de build:
```bash
./build.sh
```

Ou manualmente:
```bash
# Instalar dependências
npm install

# Build do client
cd client && npm run build && cd ..

# Build do server
npm run build
```

### 4. Deploy

#### Opção A: Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Opção B: Netlify
```bash
# Build
npm run build

# Deploy manual via Netlify Dashboard
# Faça upload da pasta dist/
```

#### Opção C: Railway
```bash
# Conecte seu repositório ao Railway
# Configure as variáveis de ambiente no dashboard
# Deploy automático
```

### 5. Configurar Domínios Autorizados

No Firebase Console:
1. Vá para "Authentication" → "Settings" → "Authorized domains"
2. Adicione seu domínio de produção
3. Exemplo: `your-app.vercel.app` ou `your-app.netlify.app`

### 6. Testar em Produção

Após o deploy, teste:
- ✅ Login com Google
- ✅ Criação de perfil da academia
- ✅ Funcionamento do timer
- ✅ Sincronização entre dispositivos
- ✅ Testes de som

## 🏗️ Arquitetura

### Frontend
- **React 18** + TypeScript
- **Vite** para build e dev server
- **TailwindCSS** + Shadcn/UI
- **TanStack Query** para gerenciamento de estado
- **Wouter** para roteamento
- **Framer Motion** para animações

### Backend
- **Express.js** + TypeScript
- **WebSocket** para comunicação em tempo real
- **Drizzle ORM** (configurado para PostgreSQL, mas usando memória localmente)
- **Firebase Auth** (desabilitado em desenvolvimento local)

### Funcionalidades

#### 🎯 Timer Inteligente
- Rounds configuráveis (padrão: 5 rounds)
- Duração de round (padrão: 6 minutos)
- Tempo de descanso (padrão: 60 segundos)
- Estados: Running, Pausing, Resting, Complete

#### 📱 Interface Dupla
- **Mobile Control**: Interface para instrutores controlarem o timer
- **TV Display**: Interface para exibição em TV/Projetor para alunos

#### 🔄 Sincronização em Tempo Real
- WebSocket para sincronização entre dispositivos
- Broadcasting de atualizações
- Fallback polling para casos de desconexão
- Reconexão automática

#### 🔊 Sistema de Som
- Sons específicos para início/fim de round
- Som de início de descanso
- Som de conclusão do treino

## 🔧 Configuração

### Desenvolvimento Local

Para desenvolvimento local, a autenticação é automaticamente desabilitada. O sistema funciona sem Firebase.

### Variáveis de Ambiente (Opcional)

Crie um arquivo `.env` baseado no `env.example` se quiser configurar o Firebase:

```env
# Firebase Configuration (opcional para desenvolvimento local)
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 📊 APIs

### Timer
- `GET /api/timer/current` - Sessão atual
- `POST /api/timer/config` - Configurar timer
- `POST /api/timer/control` - Controlar timer (start/pause/reset)

### Perfil
- `GET /api/profile/public` - Perfil público da academia
- `GET /api/profile/:userId` - Perfil específico
- `POST /api/profile` - Criar/atualizar perfil

### WebSocket
- `ws://localhost:3000/ws` - Conexão WebSocket
- Mensagens: `timer_update`, `config_update`, `timer_control`

## 🎨 UI/UX

- **Design System**: Shadcn/UI + TailwindCSS
- **Tema**: Dark mode por padrão
- **Responsividade**: Mobile-first design
- **Acessibilidade**: Componentes acessíveis
- **Animações**: Framer Motion
- **Feedback**: Toast notifications

## 🚀 Deploy

O projeto está configurado para deploy no Replit com:
- Node.js 20
- PostgreSQL 16
- Porta 5000 (configurada no Replit)

## 📝 Scripts Disponíveis

- `npm run dev` - Desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Produção
- `npm run check` - Verificação TypeScript

## 🎯 Como Usar

1. **Iniciar o projeto**: `./start.sh` ou `PORT=3000 npm run dev`
2. **Acessar controle mobile**: http://localhost:3000/mobile
3. **Acessar display TV**: http://localhost:3000/tv
4. **Configurar timer**: Use os controles na interface mobile
5. **Configurar academia**: Acesse http://localhost:3000/config
6. **Testar sons**: Use os botões na seção de configurações
7. **Sincronização**: As mudanças aparecem automaticamente no display TV

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License
