class SocketManager {
  constructor(io) {
    this.io = io;
    this.setupSocketEvents();
  }

  setupSocketEvents() {
    this.io.on('connection', (socket) => {
      console.log(`✅ Cliente conectado: ${socket.id}`);

      // Identificar tipo de cliente (quiosque ou cliente app)
      socket.on('identificar', (data) => {
        const { tipo, pedidoId, contaId } = data;

        if (tipo === 'quiosque') {
          if (contaId) {
            // Painel logado: só recebe eventos do próprio quiosque
            socket.join(`quiosque:${contaId}`);
            console.log(`🏪 Quiosque conectado (conta ${contaId}): ${socket.id}`);
          } else {
            // Compatibilidade: painel ainda sem login (antes da Fase 3)
            socket.join('quiosque');
            console.log(`🏪 Quiosque conectado (sem conta): ${socket.id}`);
          }
        } else if (tipo === 'cliente' && pedidoId) {
          socket.join(`pedido:${pedidoId}`);
          console.log(`👤 Cliente conectado ao pedido ${pedidoId}: ${socket.id}`);
        }
      });

      // Cliente acompanhando status do pedido
      socket.on('pedido:acompanhar', (pedidoId) => {
        socket.join(`pedido:${pedidoId}`);
        console.log(`👁️ Acompanhando pedido ${pedidoId}`);
      });

      // Cliente para de acompanhar
      socket.on('pedido:parar_acompanhar', (pedidoId) => {
        socket.leave(`pedido:${pedidoId}`);
        console.log(`👋 Parou de acompanhar pedido ${pedidoId}`);
      });

      // Quiosque solicita lista de pedidos ativos
      socket.on('quiosque:solicitar_pedidos', () => {
        // Pode emitir lista atualizada
        socket.emit('quiosque:pedidos_atualizados', {
          timestamp: new Date()
        });
      });

      // Desconexão
      socket.on('disconnect', () => {
        console.log(`❌ Cliente desconectado: ${socket.id}`);
      });

      // Erro
      socket.on('error', (error) => {
        console.error(`❌ Erro no socket ${socket.id}:`, error);
      });
    });
  }
}

module.exports = SocketManager;
