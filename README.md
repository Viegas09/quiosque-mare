# 🏖️ Quiosque de Praia — Mapa do Projeto

Este é o pacote único com tudo que existe até agora. Leia este arquivo primeiro.

## 📂 Estrutura

```
quiosque-praia-completo/
├── backend/              → API + WebSocket + pagamentos (Node/Express/MongoDB)
├── frontend-cliente/     → App mobile do cliente (React/Vite)
├── frontend-quiosque/    → Painel do quiosque (React/Vite)
├── docs/                 → Toda a documentação, num só lugar
│   ├── backend-guia-rapido.md
│   ├── backend-api-exemplos.md
│   ├── backend-detalhes.md
│   └── guia-visual-telas.md
└── scripts/
    └── iniciar-sistema.sh
```

Cada pasta de projeto (`backend`, `frontend-cliente`, `frontend-quiosque`) também tem seu próprio `README.md` curto — específico daquele projeto.

## ✅ Status real de cada parte

| Parte | Status | Testado rodando? |
|---|---|---|
| Backend (API + WebSocket + Mercado Pago) | Código completo | ❌ Não — nunca rodou de fato, só foi revisado |
| Frontend Cliente | Código completo, **1 bug corrigido agora** (ver abaixo) | ❌ Não |
| Frontend Quiosque | Código completo, **1 bug corrigido agora** (ver abaixo) | ❌ Não |
| Protótipo interativo (o widget no chat) | Simulação em HTML/JS isolada, não usa este código | ✅ Isso sim já "roda" |

**Importante:** nada disso foi de fato executado num servidor real ainda. O código foi gerado e revisado, mas o primeiro `npm install && npm run dev` de cada parte é o verdadeiro teste. É esperado que apareçam pequenos ajustes — é assim que qualquer projeto novo se comporta.

## 🐛 Bug que foi encontrado e já corrigido nesta organização

Ao auditar os arquivos, o `npm install` original tinha puxado **Tailwind CSS v4** nos dois frontends, mas todo o código (`tailwind.config.js`, `postcss.config.js`, `@tailwind base/components/utilities` no CSS) foi escrito no formato **v3**. Isso quebraria o build assim que você rodasse `npm run dev` — o PostCSS acusaria erro porque no v4 o plugin mudou de pacote.

**Correção aplicada:** fixei a versão em `^3.4.17` nos dois `package.json` e regenerei os `package-lock.json`. Já está corrigido nos arquivos deste pacote — não precisa fazer nada.

## ⚠️ Outras coisas que ainda não foram validadas (fique atento)

Como nada rodou de ponta a ponta ainda, esses pontos são prováveis candidatos a ajuste na primeira execução:

1. **MongoDB precisa estar rodando** — local (`mongod`) ou Atlas. O backend não sobe sem isso.
2. **Mercado Pago** — as credenciais no `.env.example` são placeholder. Sem token real, a parte de pagamento PIX vai falhar (o resto do fluxo funciona normal).
3. **CORS** — as portas padrão (5000, 5173, 5174) estão configuradas no `.env.example`, mas se você mudar alguma porta, precisa refletir em `SOCKET_CORS_ORIGIN` no backend.
4. **Versões do React/Vite** — o projeto foi criado com Vite/React bem recentes (React 19, Vite 8); em máquinas com Node mais antigo pode dar incompatibilidade — recomendo Node 20+.

## 🚀 Como rodar (ordem certa)

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env
npm run seed      # popula 15 mesas + 23 produtos
npm run dev        # http://localhost:5000

# 2. Frontend Cliente (outro terminal)
cd frontend-cliente
npm install
cp .env.example .env
npm run dev        # http://localhost:5173

# 3. Frontend Quiosque (outro terminal)
cd frontend-quiosque
npm install
cp .env.example .env
npm run dev         # http://localhost:5174
```

Ou use `scripts/iniciar-sistema.sh` para automatizar os `npm install` + `.env` + `seed`.

## 📖 Onde ler mais

- **Como testar o fluxo completo:** `docs/backend-guia-rapido.md`
- **Todos os endpoints da API com exemplos:** `docs/backend-api-exemplos.md`
- **Detalhes técnicos do backend:** `docs/backend-detalhes.md`
- **Como cada tela deveria ficar visualmente:** `docs/guia-visual-telas.md`

## 🗺️ Próximo passo recomendado

Como nada foi executado ainda, o passo mais valioso agora **não é gerar mais código** — é você rodar o backend sozinho primeiro (só ele, sem os frontends) e me colar aqui qualquer erro que aparecer no terminal. A partir de um erro real, eu conserto o que for preciso com precisão, em vez de eu tentar adivinhar problemas que ainda não aconteceram.
