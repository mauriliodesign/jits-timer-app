# 🔥 Correção de Permissões do Firestore

## 🚨 Erro Atual
```
PERMISSION_DENIED: Missing or insufficient permissions
```

## 🔧 Solução

### 1. **Acessar Firebase Console**
1. Vá para [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto: `jits-timer`
3. No menu lateral, clique em **"Firestore Database"**

### 2. **Configurar Regras de Segurança**
1. Clique na aba **"Rules"**
2. Substitua o conteúdo atual por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Timer sessions - permitir leitura e escrita para todos (modo de teste)
    match /timer_sessions/{sessionId} {
      allow read, write: if true;
    }
    
    // Academy profiles - permitir leitura e escrita para todos (modo de teste)
    match /academy_profiles/{userId} {
      allow read, write: if true;
    }
  }
}
```

3. Clique em **"Publish"**

### 3. **Verificar Configuração**
1. Aguarde alguns segundos para as regras serem aplicadas
2. Teste a aplicação novamente
3. O erro de permissões deve desaparecer

## ⚠️ Importante

**Estas regras são para desenvolvimento/teste.** Para produção, configure regras mais restritivas baseadas na autenticação do usuário.

## 🎯 Resultado Esperado

Após aplicar as regras:
- ✅ Firebase inicializa corretamente
- ✅ Dados são salvos no Firestore
- ✅ Perfis de academia são criados
- ✅ Sessões de timer são persistidas
- ✅ Sem erros de permissões
