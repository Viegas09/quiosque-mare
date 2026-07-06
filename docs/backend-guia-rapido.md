# 🚀 GUIA RÁPIDO - Iniciar Backend

## 📋 Pré-requisitos

- Node.js instalado (v14 ou superior)
- MongoDB instalado e rodando
- npm ou yarn

## ⚡ Quick Start (5 passos)

### 1️⃣ Instalar Dependências
```bash
cd backend
npm install
```

### 2️⃣ Configurar Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar o .env com suas configurações
# Mínimo necessário:
# - MONGODB_URI (se MongoDB não estiver no padrão)
```

### 3️⃣ Popular Banco de Dados
```bash
npm run seed
```

Isso criará:
- ✅ 15 mesas com QR Codes
- ✅ 23 produtos no cardápio

### 4️⃣ Iniciar Servidor
```bash
npm run dev
```

Você verá:
```
🏖️  ========================================
🏖️   SISTEMA DE QUIOSQUE DE PRAIA
🏖️  ========================================
🚀 Servidor rodando na porta 5000
🌐 URL: http://localhost:5000
🔌 WebSocket pronto
📊 Ambiente: development
🏖️  ========================================
```

### 5️⃣ Testar
```bash
# Em outro terminal
npm run healthcheck
```

Você verá:
```
🏥 Verificando saúde do servidor...

✅ Servidor está rodando!
✅ API configurada corretamente!
🎉 Tudo funcionando! Backend pronto para uso.
```

## 🧪 Testar Endpoints

### Opção 1: Browser
Abra no navegador:
- http://localhost:5000 → Ver info da API
- http://localhost:5000/health → Health check
- http://localhost:5000/api/produtos → Ver produtos
- http://localhost:5000/api/mesas → Ver mesas

### Opção 2: cURL
```bash
# Listar produtos
curl http://localhost:5000/api/produtos

# Listar mesas
curl http://localhost:5000/api/mesas

# Dashboard
curl http://localhost:5000/api/pedidos/dashboard/stats
```

### Opção 3: Postman/Insomnia
Importe os exemplos de `API_EXAMPLES.md`

## 🔍 Verificar se MongoDB está rodando

```bash
# Linux/Mac
ps aux | grep mongod

# Ou conecte pelo mongo shell
mongosh

# Ou pelo compass
mongodb://localhost:27017
```

## ❓ Problemas Comuns

### "Can't connect to MongoDB"
- ✅ Verifique se MongoDB está rodando
- ✅ Verifique MONGODB_URI no .env

### "Port 5000 already in use"
- ✅ Mate o processo ou mude a porta no .env

### "Module not found"
- ✅ Rode `npm install` novamente

## 📚 Próximos Passos

1. ✅ Backend rodando
2. 🔜 Criar Frontend do Cliente (React PWA)
3. 🔜 Criar Frontend do Quiosque (React Desktop)
4. 🔜 Integrar tudo com WebSocket

## 🎯 URLs Importantes

- **Servidor:** http://localhost:5000
- **Docs API:** API_EXAMPLES.md
- **Docs Completas:** README.md

## 💡 Comandos Úteis

```bash
npm run dev        # Iniciar com hot-reload
npm run start      # Iniciar produção
npm run seed       # Popular banco
npm run healthcheck # Testar servidor
```

---

**🎉 Backend pronto! Bora criar os frontends!**
