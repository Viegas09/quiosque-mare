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
        const { tipo, pedidoId } = data;

        if (tipo === 'quiosque') {
          socket.join('quiosque');
          console.log(`🏪 Quiosque conectado: ${socket.id}`);
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

  // Métodos auxiliares para emitir eventos

  emitirNovoPedido(pedido) {
    this.io.to('quiosque').emit('pedido:novo', {
      pedido,
      timestamp: new Date()
    });
  }

  emitirStatusAtualizado(pedidoId, status, statusAntigo) {
    // Notificar cliente específico
    this.io.to(`pedido:${pedidoId}`).emit('pedido:status_atualizado', {
      pedidoId,
      status,
      statusAntigo,
      timestamp: new Date()
    });

    // Notificar quiosque
    this.io.to('quiosque').emit('pedido:status_atualizado', {
      pedidoId,
      status,
      timestamp: new Date()
    });
  }

  emitirPedidoPronto(pedidoId) {
    this.io.to(`pedido:${pedidoId}`).emit('pedido:pronto', {
      pedidoId,
      timestamp: new Date()
    });
  }

  emitirProdutoDisponibilidadeAlterada(produtoId, disponivel) {
    this.io.emit('produto:disponibilidade_alterada', {
      produtoId,
      disponivel,
      timestamp: new Date()
    });
  }
}

module.exports = SocketManager;
