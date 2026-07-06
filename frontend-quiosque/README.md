# 💻 Frontend Quiosque - Dashboard do Quiosque de Praia

Dashboard desktop para gerenciar pedidos, produtos e contas do quiosque.

## 🚀 Tecnologias

- **React 19** + **Vite** - Interface rápida
- **React Router** - Navegação
- **Tailwind CSS** - Estilização
- **Socket.io Client** - Tempo real
- **Axios** - API REST
- **Lucide React** - Ícones
- **Recharts** - Gráficos

## ⚙️ Configuração Rápida

```bash
# Instalar
npm install

# Configurar
cp .env.example .env

# Rodar
npm run dev
```

Acesse: `http://localhost:5174`

## 🎯 Funcionalidades

### 📊 Dashboard Principal
- Ver pedidos por status (Novos / Preparando / Prontos)
- Estatísticas em tempo real
- Notificação sonora para novos pedidos
- Atualização automática via WebSocket

### 🍹 Gerenciar Produtos
- Listar todos os produtos
- Toggle disponibilidade
- Filtrar por categoria
- Buscar produtos

### 💰 Gerenciar Contas
- Ver mesas com conta aberta
- Total acumulado por mesa
- Fechar conta (valida pedidos pendentes)
- Histórico de pedidos da sessão

## 🔔 Notificações

- Som quando novo pedido chega
- Atualização visual instantânea
- Badge com quantidade de pedidos

## 📱 Responsivo

- Otimizado para desktop
- Funciona em tablets
- Interface adaptável

---

Veja documentação completa no README principal do projeto.
