# API Quiosque de Praia - Exemplos de Requisições

Base URL: http://localhost:5000

## 🪑 MESAS

### Criar Mesa
POST /api/mesas
Content-Type: application/json

{
  "numero": "1",
  "localizacao": "Guarda-sol 1"
}

### Listar Todas as Mesas
GET /api/mesas

### Buscar Mesa por QR Code Token
GET /api/mesas/qrcode/:token

### Buscar Mesa por Número
GET /api/mesas/numero/1

### Atualizar Status da Mesa
PATCH /api/mesas/:id/status
Content-Type: application/json

{
  "status": "ocupada"
}

---

## 🍹 PRODUTOS

### Criar Produto
POST /api/produtos
Content-Type: application/json

{
  "nome": "Caipirinha de Limão",
  "descricao": "Caipirinha tradicional com limão",
  "preco": 18.00,
  "categoria": "drinks",
  "disponivel": true,
  "tempoPreparoEstimado": 5
}

### Listar Produtos
GET /api/produtos

### Listar Produtos por Categoria
GET /api/produtos?categoria=bebidas

### Listar Produtos Disponíveis
GET /api/produtos?disponivel=true

### Buscar Produto por ID
GET /api/produtos/:id

### Atualizar Produto
PUT /api/produtos/:id
Content-Type: application/json

{
  "nome": "Caipirinha de Limão Premium",
  "preco": 20.00
}

### Toggle Disponibilidade
PATCH /api/produtos/:id/disponibilidade

### Listar Categorias
GET /api/produtos/categorias

---

## 🛒 PEDIDOS

### Criar Pedido
POST /api/pedidos
Content-Type: application/json

{
  "mesaId": "MESA_ID_AQUI",
  "itens": [
    {
      "produtoId": "PRODUTO_ID_AQUI",
      "quantidade": 2,
      "observacoes": "Sem gelo"
    },
    {
      "produtoId": "OUTRO_PRODUTO_ID",
      "quantidade": 1
    }
  ]
}

### Iniciar Pagamento PIX
POST /api/pedidos/:id/pagamento
Content-Type: application/json

{
  "metodoPagamento": "pix"
}

### Iniciar Pagamento com Cartão
POST /api/pedidos/:id/pagamento
Content-Type: application/json

{
  "metodoPagamento": "cartao_credito",
  "dadosCartao": {
    "token": "TOKEN_MERCADOPAGO",
    "email": "cliente@email.com",
    "payment_method_id": "visa",
    "installments": 1
  }
}

### Listar Pedidos
GET /api/pedidos

### Listar Pedidos por Status
GET /api/pedidos?status=pago,em_preparacao

### Buscar Pedido por ID
GET /api/pedidos/:id

### Atualizar Status do Pedido
PATCH /api/pedidos/:id/status
Content-Type: application/json

{
  "status": "em_preparacao"
}

Status possíveis:
- aguardando_pagamento
- pago
- em_preparacao
- pronto
- entregue
- cancelado

### Dashboard de Estatísticas
GET /api/pedidos/dashboard/stats

Retorna:
- Pedidos hoje
- Pedidos ativos
- Pedidos prontos
- Receita do dia
- Tempo médio de preparação

---

## 💰 SESSÕES (Contas)

### Buscar Sessão Ativa da Mesa
GET /api/sessoes/mesa/:mesaId

### Fechar Conta
POST /api/sessoes/mesa/:mesaId/fechar

### Listar Sessões
GET /api/sessoes

### Listar Sessões Abertas
GET /api/sessoes?status=aberta

### Relatório de Sessões
GET /api/sessoes/relatorio?dataInicio=2024-01-01&dataFim=2024-12-31

---

## 🔌 WEBSOCKET

### Conectar
```javascript
const socket = io('http://localhost:5000');
```

### Identificar como Quiosque
```javascript
socket.emit('identificar', { tipo: 'quiosque' });
```

### Identificar como Cliente
```javascript
socket.emit('identificar', { 
  tipo: 'cliente',
  pedidoId: 'ID_DO_PEDIDO'
});
```

### Acompanhar Pedido
```javascript
socket.emit('pedido:acompanhar', pedidoId);
```

### Parar de Acompanhar
```javascript
socket.emit('pedido:parar_acompanhar', pedidoId);
```

### Eventos Recebidos (Quiosque)
```javascript
// Novo pedido pago
socket.on('pedido:novo', (data) => {
  console.log('Novo pedido:', data.pedido);
});

// Status atualizado
socket.on('pedido:status_atualizado', (data) => {
  console.log('Status atualizado:', data);
});
```

### Eventos Recebidos (Cliente)
```javascript
// Status do pedido atualizado
socket.on('pedido:status_atualizado', (data) => {
  console.log('Seu pedido está:', data.status);
});

// Pedido pronto
socket.on('pedido:pronto', (data) => {
  console.log('Seu pedido está pronto!');
});

// Pagamento aprovado
socket.on('pedido:pagamento_aprovado', (data) => {
  console.log('Pagamento confirmado!');
});
```

---

## 🧪 FLUXO COMPLETO DE TESTE

### 1. Popular Banco de Dados
```bash
npm run seed
```

### 2. Buscar Mesa por Número
GET /api/mesas/numero/1
# Copiar o _id da mesa

### 3. Listar Produtos
GET /api/produtos
# Copiar _id de alguns produtos

### 4. Criar Pedido
POST /api/pedidos
{
  "mesaId": "MESA_ID_COPIADO",
  "itens": [
    {
      "produtoId": "PRODUTO_ID_1",
      "quantidade": 2
    }
  ]
}
# Copiar o _id do pedido

### 5. Simular Pagamento (em dev, marcar como pago direto)
PATCH /api/pedidos/PEDIDO_ID/status
{
  "status": "pago"
}

### 6. Iniciar Preparação
PATCH /api/pedidos/PEDIDO_ID/status
{
  "status": "em_preparacao"
}

### 7. Marcar como Pronto
PATCH /api/pedidos/PEDIDO_ID/status
{
  "status": "pronto"
}

### 8. Marcar como Entregue
PATCH /api/pedidos/PEDIDO_ID/status
{
  "status": "entregue"
}

### 9. Fechar Conta
POST /api/sessoes/mesa/MESA_ID/fechar

---

## 💡 Dicas

- Use ferramentas como Postman, Insomnia ou Thunder Client (VS Code)
- Para WebSocket, use ferramentas como Socket.io Client ou extensões do browser
- Em desenvolvimento, você pode simular pagamentos aprovados diretamente
- Configure o Mercado Pago em sandbox para testes de pagamento reais
