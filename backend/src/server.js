require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const SocketManager = require('./sockets/socketManager');
const socketMiddleware = require('./middlewares/socketMiddleware');
const { limiteGeral } = require('./middlewares/rateLimiters');

// Importar rotas
const mesaRoutes = require('./routes/mesaRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const sessaoRoutes = require('./routes/sessaoRoutes');

// Inicializar app
const app = express();
const server = http.createServer(app);

// Origens permitidas — se SOCKET_CORS_ORIGIN não estiver definida, cai para
// as URLs padrão de desenvolvimento (Vite). NUNCA usar '*' aqui: o navegador
// rejeita a combinação de origin '*' com credentials:true.
const allowedOrigins = process.env.SOCKET_CORS_ORIGIN
  ? process.env.SOCKET_CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

// Configurar Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Inicializar gerenciador de sockets
const socketManager = new SocketManager(io);

// Middlewares
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting — o app é acessado publicamente via QR code, então merece
// um limite básico contra abuso. O limite mais rígido de criação de pedido
// é aplicado só na rota específica, dentro de pedidoRoutes.js.
app.use('/api', limiteGeral);

// Middleware para disponibilizar io nos controllers
app.use(socketMiddleware(io));

// Rotas
app.use('/api/mesas', mesaRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/sessoes', sessaoRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Quiosque Praia funcionando!',
    timestamp: new Date()
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Quiosque de Praia',
    version: '1.0.0',
    endpoints: {
      mesas: '/api/mesas',
      produtos: '/api/produtos',
      pedidos: '/api/pedidos',
      sessoes: '/api/sessoes'
    }
  });
});

// Rota 404 (só é alcançada se nenhuma rota acima respondeu)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Middleware central de erro — diferencia erro de entrada (400) de erro
// inesperado de servidor (500), em vez de tudo virar 500 genérico.
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err.stack);

  // Erro de validação criado explicitamente nos controllers (utils/ValidationError)
  if (err.name === 'ValidationError' && err.statusCode) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  // Erro de validação do Mongoose (schema)
  if (err.name === 'ValidationError') {
    const mensagens = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: mensagens.join('; ') });
  }

  // ID inválido do MongoDB (ex: /api/pedidos/abc123)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: `Valor inválido para ${err.path}` });
  }

  // Violação de índice único (ex: número de mesa duplicado)
  if (err.code === 11000) {
    const campo = Object.keys(err.keyPattern || {})[0] || 'campo';
    return res.status(409).json({ success: false, message: `Já existe um registro com esse ${campo}` });
  }

  // Erro inesperado
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Conectar ao banco e iniciar servidor
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log('');
      console.log('🏖️  ========================================');
      console.log('🏖️   SISTEMA DE QUIOSQUE DE PRAIA');
      console.log('🏖️  ========================================');
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`🔌 WebSocket pronto`);
      console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log('🏖️  ========================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Encerramento gracioso — fecha o servidor HTTP e a conexão com o Mongo
// antes de derrubar o processo, em vez de matar conexões abruptamente.
const shutdown = (signal) => {
  console.log(`\n🛑 ${signal} recebido. Encerrando servidor...`);
  server.close(async () => {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    console.log('✅ Servidor e conexão com o banco encerrados.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Erro não tratado:', err);
  server.close(() => process.exit(1));
});

// Iniciar
startServer();

module.exports = { app, server, io };
