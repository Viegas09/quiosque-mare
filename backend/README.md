# 🏖️ Backend - Sistema de Quiosque de Praia

Backend completo do sistema de quiosque de praia com API REST, WebSocket e integração de pagamentos.

## 🚀 Tecnologias

- **Node.js** + **Express** - Framework web
- **MongoDB** + **Mongoose** - Banco de dados
- **Socket.io** - Comunicação real-time
- **Mercado Pago** - Processamento de pagamentos
- **QRCode** - Geração de QR Codes para mesas

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/          # Configurações (database)
│   ├── controllers/     # Lógica de negócio
│   ├── models/          # Schemas do MongoDB
│   ├── routes/          # Rotas da API
│   ├── services/        # Serviços externos (pagamento)
│   ├── sockets/         # Gerenciamento WebSocket
│   ├── middlewares/     # Middlewares personalizados
│   ├── utils/           # Utilitários e scripts
│   └── server.js        # Arquivo principal
├── .env.example         # Exemplo de variáveis de ambiente
└── package.json
```

## ⚙️ Configuração

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Servidor
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/quiosque-praia

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=seu_access_token_aqui
MERCADOPAGO_PUBLIC_KEY=sua_public_key_aqui

# URLs Frontend
CLIENT_URL=http://localhost:3000
QUIOSQUE_URL=http://localhost:3001
BACKEND_URL=http://localhost:5000

# WebSocket CORS
SOCKET_CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### 3. Iniciar MongoDB

Certifique-se de que o MongoDB está rodando:

```bash
# Se instalado localmente
mongod

# Ou use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Popular Banco de Dados

Execute o script de seed para criar mesas e produtos iniciais:

```bash
node src/utils/seed.js
```

### 5. Iniciar Servidor

```bash
# Modo desenvolvimento (com hot-reload)
npm run dev

# Modo produção
npm start
```

O servidor estará rodando em `http://localhost:5000`

## 📡 Endpoints da API

### Mesas

- `GET /api/mesas` - Listar todas as mesas
- `POST /api/mesas` - Criar nova mesa
- `GET /api/mesas/qrcode/:token` - Buscar mesa por QR Code
- `GET /api/mesas/numero/:numero` - Buscar mesa por número
- `PATCH /api/mesas/:id/status` - Atualizar status da mesa
- `POST /api/mesas/:id/novo-qrcode` - Gerar novo QR Code

### Produtos

- `GET /api/produtos` - Listar produtos (aceita `?categoria=bebidas&disponivel=true`)
- `GET /api/produtos/categorias` - Listar categorias
- `GET /api/produtos/:id` - Buscar produto por ID
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/:id` - Atualizar produto
- `PATCH /api/produtos/:id/disponibilidade` - Toggle disponibilidade
- `DELETE /api/produtos/:id` - Deletar produto

### Pedidos

- `POST /api/pedidos` - Criar novo pedido
- `POST /api/pedidos/:id/pagamento` - Iniciar pagamento
- `GET /api/pedidos` - Listar pedidos (aceita `?status=pago,em_preparacao`)
- `GET /api/pedidos/:id` - Buscar pedido por ID
- `PATCH /api/pedidos/:id/status` - Atualizar status
- `GET /api/pedidos/dashboard/stats` - Estatísticas do dia
- `POST /api/pedidos/webhook/mercadopago` - Webhook pagamentos

### Sessões

- `GET /api/sessoes/mesa/:mesaId` - Buscar sessão ativa da mesa
- `POST /api/sessoes/mesa/:mesaId/fechar` - Fechar conta
- `GET /api/sessoes` - Listar sessões
- `GET /api/sessoes/relatorio` - Relatório de sessões
- `GET /api/sessoes/:id` - Buscar sessão por ID

## 🔌 WebSocket

### Conexão

```javascript
const socket = io('http://localhost:5000');

// Identificar tipo de cliente
socket.emit('identificar', { 
  tipo: 'quiosque' // ou 'cliente'
});

// Cliente acompanhar pedido
socket.emit('pedido:acompanhar', pedidoId);
```

### Eventos do Servidor

**Para o Quiosque:**
- `pedido:novo` - Novo pedido pago
- `pedido:status_atualizado` - Status atualizado

**Para o Cliente:**
- `pedido:status_atualizado` - Status do seu pedido
- `pedido:pronto` - Pedido pronto
- `pedido:pagamento_aprovado` - Pagamento confirmado

**Para Todos:**
- `produto:disponibilidade_alterada` - Produto ficou disponível/indisponível

## 🎯 Fluxo de Pedido

1. **Cliente cria pedido** → `POST /api/pedidos`
   - Status: `aguardando_pagamento`

2. **Cliente inicia pagamento** → `POST /api/pedidos/:id/pagamento`
   - PIX: retorna QR Code
   - Cartão: processa imediatamente

3. **Webhook confirma pagamento** → `POST /api/pedidos/webhook/mercadopago`
   - Status: `pago`
   - Emite evento `pedido:novo` para quiosque

4. **Quiosque inicia preparação** → `PATCH /api/pedidos/:id/status`
   - Status: `em_preparacao`

5. **Quiosque marca como pronto** → `PATCH /api/pedidos/:id/status`
   - Status: `pronto`
   - Emite evento `pedido:pronto` para cliente

6. **Entrega confirmada** → `PATCH /api/pedidos/:id/status`
   - Status: `entregue`

## 🔐 Segurança

- [ ] Implementar autenticação JWT para rotas administrativas
- [ ] Validação de dados com Joi ou Zod
- [ ] Rate limiting
- [ ] Helmet para segurança de headers
- [ ] Sanitização de inputs

## 📊 Monitoramento

- Logs de todas as transações
- Métricas de tempo de preparação
- Relatórios de vendas por período

## 🧪 Testes

```bash
npm test
```

## 🚢 Deploy

### Variáveis de Ambiente para Produção

- Configure `NODE_ENV=production`
- Use MongoDB Atlas ou outro serviço gerenciado
- Configure URLs reais de frontend
- Ative SSL/TLS
- Configure webhook URL real do Mercado Pago

### Recomendações

- Use PM2 para gerenciar o processo
- Configure Nginx como proxy reverso
- Ative logs persistentes
- Configure backups automáticos do banco

## 📝 Licença

MIT

---

Desenvolvido com ☕ para quiosques de praia!
