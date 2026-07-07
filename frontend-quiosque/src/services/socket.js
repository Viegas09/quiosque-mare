import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  // contaId identifica de qual quiosque este painel deve receber eventos —
  // sem isso, o backend não sabe pra qual sala direcionar os pedidos.
  connect(contaId) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket conectado:', this.socket.id);
      this.connected = true;
      
      // Identificar como quiosque, já vinculado à conta logada
      this.socket.emit('identificar', { tipo: 'quiosque', contaId });
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

  // Escutar novos pedidos
  onNovoPedido(callback) {
    if (this.socket) {
      this.socket.on('pedido:novo', callback);
    }
  }

  // Escutar atualização de status
  onStatusAtualizado(callback) {
    if (this.socket) {
      this.socket.on('pedido:status_atualizado', callback);
    }
  }

  // Remover listener
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

const socketService = new SocketService();

export default socketService;
