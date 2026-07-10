import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    // Guarda qual pedido está sendo acompanhado no momento — necessário
    // pra re-entrar na sala automaticamente se o socket cair e reconectar
    // (ex: a instância do Render "dormir" por inatividade e voltar depois).
    // Sem isso, depois de uma reconexão o cliente fica "mudo": identificado
    // de novo, mas fora da sala pedido:<id>, e nunca mais recebe eventos
    // desse pedido até recarregar a página manualmente.
    this.pedidoAtual = null;
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket conectado:', this.socket.id);
      this.connected = true;
      
      // Identificar como cliente
      this.socket.emit('identificar', { tipo: 'cliente' });

      // Se já estávamos acompanhando um pedido antes de cair, reentra na
      // sala automaticamente — cobre reconexões (ex: instância do Render
      // "dormindo" e voltando), não só a conexão inicial.
      if (this.pedidoAtual) {
        this.socket.emit('pedido:acompanhar', this.pedidoAtual);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket desconectado');
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Acompanhar pedido específico
  acompanharPedido(pedidoId) {
    this.pedidoAtual = pedidoId;
    if (this.socket) {
      this.socket.emit('pedido:acompanhar', pedidoId);
    }
  }

  // Parar de acompanhar pedido
  pararAcompanhar(pedidoId) {
    if (this.pedidoAtual === pedidoId) {
      this.pedidoAtual = null;
    }
    if (this.socket) {
      this.socket.emit('pedido:parar_acompanhar', pedidoId);
    }
  }

  // Escutar evento de atualização de status
  onStatusAtualizado(callback) {
    if (this.socket) {
      this.socket.on('pedido:status_atualizado', callback);
    }
  }

  // Escutar evento de pedido pronto
  onPedidoPronto(callback) {
    if (this.socket) {
      this.socket.on('pedido:pronto', callback);
    }
  }

  // Escutar evento de pagamento aprovado
  onPagamentoAprovado(callback) {
    if (this.socket) {
      this.socket.on('pedido:pagamento_aprovado', callback);
    }
  }

  // Remover listener
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

// Singleton
const socketService = new SocketService();

export default socketService;
