# 🔧 Correções para Deploy - Netlify

## Problemas Identificados e Resolvidos

### 1. ❌ Erro: "vite: not found"
**Causa**: Vite estava em `devDependencies`, mas Netlify não instala devDependencies em produção

**✅ Solução**:
- Movido `vite: ^5.4.19` para `dependencies`
- Movido `@vitejs/plugin-react: ^4.3.2` para `dependencies`
- Adicionado `NPM_FLAGS = "--production=false"` no `netlify.toml`

### 2. ❌ Erro: "No matching version found for drizzle-kit@^0.29.3"
**Causa**: Versão do drizzle-kit não existia no npm registry

**✅ Solução**:
- Atualizado `drizzle-kit` para `^0.31.4`
- Atualizado `esbuild` para `^0.25.9`
- Atualizado `typescript` para `^5.9.2`

## Arquivos Modificados

### `package.json`
```diff
- "vite": "^5.4.19" (em devDependencies)
+ "vite": "^5.4.19" (em dependencies)
+ "@vitejs/plugin-react": "^4.3.2" (em dependencies)
- "drizzle-kit": "^0.29.3"
+ "drizzle-kit": "^0.31.4"
- "esbuild": "^0.22.8"
+ "esbuild": "^0.25.9"
- "typescript": "^5.7.2"
+ "typescript": "^5.9.2"
```

### `netlify.toml`
```diff
[build.environment]
  NODE_ENV = "production"
+ NPM_FLAGS = "--production=false"
```

## Status do Build

✅ **Build local funcionando**:
```bash
npm run build
# ✓ 1738 modules transformed
# ✓ built in 2.06s
# ⚡ Done in 9ms
```

## Próximos Passos

1. **Commit das mudanças**:
   ```bash
   git add .
   git commit -m "Fix Netlify deploy: update dependencies and move Vite to production"
   git push
   ```

2. **Deploy no Netlify**:
   - O deploy automático deve funcionar agora
   - Configure as variáveis de ambiente do Firebase
   - Adicione o domínio no Firebase Console

## Teste Pós-Deploy

Após o deploy bem-sucedido, teste:
- ✅ Login com Google
- ✅ Criação de perfil da academia
- ✅ Funcionamento do timer
- ✅ Sincronização entre dispositivos
- ✅ Testes de som

## URLs Esperadas

- **Aplicação Principal**: `https://your-app.netlify.app`
- **Controle Mobile**: `https://your-app.netlify.app/mobile`
- **Display TV**: `https://your-app.netlify.app/tv`
- **Configurações**: `https://your-app.netlify.app/profile`
