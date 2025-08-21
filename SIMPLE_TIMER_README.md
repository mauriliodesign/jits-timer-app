# JITS Timer - Versão Simplificada

Esta é uma versão simplificada do JITS Timer que funciona completamente no lado do cliente, sem necessidade de servidor, WebSocket ou autenticação.

## 🚀 Como usar

### 1. Acesse a versão simplificada

- **Página inicial:** `/simple-home` ou `/simple-timer.html`
- **Controle do timer:** `/simple`
- **Exibição TV:** `/tv-simple`

### 2. Configuração

1. Abra `/simple` no seu dispositivo móvel
2. Configure:
   - **Número de rounds:** Quantos rounds de luta/descanso
   - **Tempo de luta:** Duração de cada round de luta
   - **Tempo de descanso:** Duração do descanso entre rounds

### 3. Uso

1. **Iniciar:** Clique em "Start Training" para começar
2. **Pausar:** Clique em "Pause Training" para pausar
3. **Retomar:** Clique em "Resume Training" para continuar
4. **Parar:** Clique em "Stop" para parar o timer atual
5. **Reset:** Clique em "Reset" para voltar ao estado inicial

### 4. Exibição TV

1. Abra `/tv-simple` em uma TV ou tela grande
2. A tela mostrará automaticamente o estado atual do timer
3. A sincronização acontece via localStorage

## ✨ Funcionalidades

- ✅ **Timer completo:** Contagem regressiva com transições automáticas
- ✅ **Configuração flexível:** Tempo de luta, descanso e número de rounds
- ✅ **Controles:** Start, pause, resume, stop, reset
- ✅ **Sincronização:** Entre controle e exibição TV via localStorage
- ✅ **Persistência:** Configurações salvas automaticamente
- ✅ **Efeitos sonoros:** Sons para início/fim de round e descanso
- ✅ **Interface responsiva:** Funciona em mobile e desktop
- ✅ **Offline:** Funciona sem internet

## 🔧 Tecnologias

- **React + TypeScript:** Interface do usuário
- **localStorage:** Persistência e sincronização
- **CSS/Tailwind:** Estilização
- **Web Audio API:** Efeitos sonoros

## 📱 URLs

| Função | URL |
|--------|-----|
| Página inicial | `/simple-home` |
| Controle | `/simple` |
| Exibição TV | `/tv-simple` |

## 🎯 Diferenças da versão original

| Aspecto | Versão Original | Versão Simplificada |
|---------|----------------|-------------------|
| Servidor | Requer servidor Node.js | Sem servidor |
| WebSocket | Sincronização em tempo real | localStorage |
| Autenticação | Firebase Auth | Sem autenticação |
| Banco de dados | Firestore | localStorage |
| Deploy | Vercel/Heroku | Qualquer servidor estático |
| Complexidade | Alta | Baixa |

## 🚀 Deploy

Para fazer deploy da versão simplificada:

1. **Build:** `npm run build`
2. **Servir:** Use qualquer servidor estático (nginx, Apache, etc.)
3. **Ou:** Faça upload dos arquivos para GitHub Pages, Netlify, Vercel, etc.

## 🔄 Migração

Para migrar da versão original para a simplificada:

1. Use as URLs `/simple*` em vez das URLs originais
2. As configurações não são migradas automaticamente
3. Configure novamente os tempos e rounds

## 🐛 Solução de problemas

### Timer não sincroniza entre dispositivos
- Certifique-se de que ambos estão na mesma URL
- Verifique se o localStorage está habilitado
- Recarregue a página

### Efeitos sonoros não funcionam
- Clique em qualquer lugar da página primeiro (política do navegador)
- Verifique se o som está habilitado no dispositivo

### Configurações não são salvas
- Verifique se o localStorage está habilitado
- Limpe o cache do navegador se necessário

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se está usando as URLs corretas (`/simple*`)
2. Teste em modo incógnito para isolar problemas de cache
3. Verifique o console do navegador para erros
