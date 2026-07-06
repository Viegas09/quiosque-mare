# 📸 GUIA VISUAL DO SISTEMA - QUIOSQUE DE PRAIA

## 🎨 COMO FICAM AS TELAS

---

## 📱 APP DO CLIENTE (Mobile)

### TELA 1: ENTRADA
```
┌─────────────────────────────┐
│                             │
│      🏖️ Quiosque           │
│  Bem-vindo ao nosso         │
│       quiosque!             │
│                             │
│  ┌─────────────────────┐   │
│  │  📷 QR Code         │   │
│  │                     │   │
│  │  Escanear QR Code   │   │
│  │  Use a câmera       │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  # Número           │   │
│  │                     │   │
│  │  Digitar Número     │   │
│  │  Digite o número    │   │
│  └─────────────────────┘   │
│                             │
└─────────────────────────────┘
```
- Fundo: Gradiente azul
- 2 cards brancos grandes
- Ícones coloridos (azul e verde)

### TELA 2: CARDÁPIO
```
┌─────────────────────────────┐
│ Cardápio    Mesa 1     🛒 3 │
│ Guarda-sol 1                │
├─────────────────────────────┤
│ Todos  🥤  🍹  🍤  🍟  🍽️ │
├─────────────────────────────┤
│                             │
│ ┌───────────────────────┐   │
│ │ Água Mineral          │   │
│ │ Água mineral 500ml    │   │
│ │ R$ 5,00      ⏱️ 2min  │   │
│ │  [-]  1  [+]  Adicionar│  │
│ └───────────────────────┘   │
│                             │
│ ┌───────────────────────┐   │
│ │ Caipirinha            │   │
│ │ Limão, vodka, cachaça │   │
│ │ R$ 18,00     ⏱️ 5min  │   │
│ │  [-]  1  [+]  Adicionar│  │
│ └───────────────────────┘   │
│                             │
│ [mais produtos...]          │
│                             │
├─────────────────────────────┤
│ 🛒 3 itens - R$ 45,00       │
└─────────────────────────────┘
```
- Header azul fixo
- Filtros de categoria
- Cards de produtos
- Botão flutuante do carrinho

### TELA 3: CARRINHO
```
┌─────────────────────────────┐
│ ← Carrinho                  │
│ Mesa 1 - 3 itens            │
├─────────────────────────────┤
│                             │
│ ┌───────────────────────┐   │
│ │ 2x Água Mineral    🗑️ │   │
│ │ R$ 5,00 cada          │   │
│ │  [-]  2  [+]          │   │
│ │           R$ 10,00    │   │
│ └───────────────────────┘   │
│                             │
│ ┌───────────────────────┐   │
│ │ 1x Caipirinha      🗑️ │   │
│ │ R$ 18,00 cada         │   │
│ │ Obs: Sem gelo         │   │
│ │  [-]  1  [+]          │   │
│ │           R$ 18,00    │   │
│ └───────────────────────┘   │
│                             │
│ ┌───────────────────────┐   │
│ │ Resumo do Pedido      │   │
│ │ Subtotal    R$ 45,00  │   │
│ │ Taxa        R$ 0,00   │   │
│ │ ─────────────────     │   │
│ │ TOTAL       R$ 45,00  │   │
│ └───────────────────────┘   │
│                             │
├─────────────────────────────┤
│ Finalizar - R$ 45,00        │
└─────────────────────────────┘
```
- Cards brancos por item
- Controles de quantidade
- Resumo destacado
- Botão verde grande

### TELA 4: PAGAMENTO PIX
```
┌─────────────────────────────┐
│      Pagamento PIX          │
│                             │
│  ┌─────────────────────┐   │
│  │                     │   │
│  │   [QR CODE AQUI]    │   │
│  │                     │   │
│  │                     │   │
│  └─────────────────────┘   │
│                             │
│  Como pagar:                │
│  1. Abra o app do banco     │
│  2. Escolha PIX             │
│  3. Escaneie o QR Code      │
│  4. Confirme o pagamento    │
│                             │
│  [Copiar Código PIX]        │
│                             │
│  ⏳ Aguardando              │
│     confirmação...          │
│                             │
└─────────────────────────────┘
```
- QR Code grande
- Instruções claras
- Loading animado
- Confirma automaticamente

### TELA 5: ACOMPANHAMENTO
```
┌─────────────────────────────┐
│ Acompanhar Pedido           │
│ Pedido #A1B2C3              │
├─────────────────────────────┤
│                             │
│       👨‍🍳                    │
│   Em Preparação             │
│ Tempo estimado: 15 minutos  │
│                             │
│ Status do Pedido:           │
│ ✅ Pedido Realizado         │
│ 🟡 Em Preparação            │
│ ⚪ Pronto                   │
│ ⚪ Entregue                 │
│                             │
│ Itens do Pedido:            │
│ 2x Água Mineral  R$ 10,00   │
│ 1x Caipirinha    R$ 18,00   │
│                             │
│ Total: R$ 45,00             │
│                             │
│ Mesa: 1                     │
│ Local: Guarda-sol 1         │
│                             │
│ [Fazer Novo Pedido]         │
│                             │
└─────────────────────────────┘
```
- Ícone grande do status
- Timeline visual
- Atualiza em tempo real
- Notifica quando pronto

---

## 💻 DASHBOARD DO QUIOSQUE (Desktop)

### TELA 1: DASHBOARD
```
┌────────────────────────────────────────────────────────────┐
│ 🏖️ Dashboard do Quiosque          [Atualizar] [Produtos] [Contas] │
│ Segunda-feira, 19 de maio de 2026                                 │
├────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│ │ 🕐 3    │ │ 👨‍🍳 2   │ │ ✅ 1    │ │ 💰 R$   │         │
│ │ Novos   │ │ Preparo │ │ Prontos │ │ 245,00  │         │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│                                                            │
│ [Novos (3)] [Preparando (2)] [Prontos (1)]               │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Pedido #123  │  │ Pedido #124  │  │ Pedido #125  │   │
│  │ 🕐 5 min     │  │ 🕐 3 min     │  │ 🕐 1 min     │   │
│  │              │  │              │  │              │   │
│  │ 📍 Mesa 1    │  │ 📍 Mesa 3    │  │ 📍 Mesa 5    │   │
│  │ Guarda-sol 1 │  │ Mesa 3       │  │ Guarda-sol 5 │   │
│  │              │  │              │  │              │   │
│  │ 2x Água      │  │ 1x Caipirinha│  │ 3x Cerveja   │   │
│  │ 1x Caipirinha│  │ 1x Porção    │  │ 1x Petisco   │   │
│  │              │  │              │  │              │   │
│  │ R$ 45,00     │  │ R$ 68,00     │  │ R$ 85,00     │   │
│  │              │  │              │  │              │   │
│  │ [Iniciar]    │  │ [Iniciar]    │  │ [Iniciar]    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```
- Header azul com navegação
- 4 cards de estatísticas coloridos
- Abas por status
- Grid de pedidos (cards amarelos/laranja/verdes)
- Botões de ação grandes

### TELA 2: GERENCIAR PRODUTOS
```
┌────────────────────────────────────────────────────────────┐
│ ← Gerenciar Produtos                                       │
│                                                            │
│ [🔍 Buscar produtos...]  [Todas as Categorias ▼]         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Produto              Categoria   Preço    Tempo  Disponível│
│ ──────────────────────────────────────────────────────────│
│ Água Mineral         bebidas    R$ 5,00   2min   [ON] ✅ │
│ Água mineral 500ml                                         │
│                                                            │
│ Caipirinha           drinks     R$ 18,00  5min   [ON] ✅ │
│ Limão, vodka...                                           │
│                                                            │
│ Isca de Peixe        petiscos   R$ 35,00  20min  [OFF] ⚪│
│ Tilápia empanada                                          │
│                                                            │
│ [mais produtos...]                                         │
│                                                            │
│ 23 produto(s) encontrado(s)                               │
└────────────────────────────────────────────────────────────┘
```
- Tabela limpa e organizada
- Toggle para ativar/desativar
- Busca e filtros no topo
- Visual claro do status

### TELA 3: GERENCIAR CONTAS
```
┌────────────────────────────────────────────────────────────┐
│ ← Gerenciar Contas                                         │
│ 3 mesa(s) com conta aberta                                │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ Mesa 1      │  │ Mesa 3      │  │ Mesa 5      │      │
│  │ 🕐 1h 30min │  │ 🕐 45min    │  │ 🕐 20min    │      │
│  │             │  │             │  │             │      │
│  │ Total Acum. │  │ Total Acum. │  │ Total Acum. │      │
│  │ R$ 145,00   │  │ R$ 68,00    │  │ R$ 85,00    │      │
│  │             │  │             │  │             │      │
│  │ Pedidos: 3  │  │ Pedidos: 1  │  │ Pedidos: 1  │      │
│  │ Pendentes:0 │  │ Pendentes:1 │  │ Pendentes:0 │      │
│  │             │  │             │  │             │      │
│  │ ▼ Ver       │  │ ▼ Ver       │  │ ▼ Ver       │      │
│  │   Pedidos   │  │   Pedidos   │  │   Pedidos   │      │
│  │             │  │             │  │             │      │
│  │[Fechar]     │  │ 1 pedido(s) │  │[Fechar]     │      │
│  │ Conta       │  │ pendente(s) │  │ Conta       │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```
- Cards roxos por mesa
- Informações de tempo e total
- Validação de pendências
- Botão de fechar conta destacado

---

## 🎨 PALETA DE CORES

**App Cliente:**
- Azul: #3B82F6 (botões primários, header)
- Verde: #10B981 (finalizar, pronto)
- Amarelo: #F59E0B (aguardando)
- Vermelho: #EF4444 (remover, erro)
- Branco: #FFFFFF (cards)
- Cinza: #F3F4F6 (fundo)

**Dashboard Quiosque:**
- Azul: #2563EB (header)
- Amarelo: #F59E0B (novos pedidos)
- Laranja: #F97316 (em preparação)
- Verde: #10B981 (prontos)
- Roxo: #8B5CF6 (contas)
- Branco: #FFFFFF (cards)

---

## ✨ ANIMAÇÕES E INTERAÇÕES

- ✅ Transições suaves entre páginas
- ✅ Cards com hover (sombra aumenta)
- ✅ Botões com efeito de clique
- ✅ Loading spinners animados
- ✅ Toast notifications
- ✅ Progress bars para status
- ✅ Fade in para novos elementos
- ✅ Pulse animation em notificações

---

## 📱 RESPONSIVIDADE

**Mobile (< 768px):**
- 1 coluna
- Menu hamburger
- Cards full width
- Botões grandes

**Tablet (768px - 1024px):**
- 2 colunas
- Sidebar fixa
- Cards médios

**Desktop (> 1024px):**
- 3-4 colunas
- Dashboard completo
- Múltiplos cards visíveis

---

Para ver EXATAMENTE como ficou, você precisa rodar o sistema! 
Use o script que criei: `iniciar-sistema.sh`
