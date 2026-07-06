import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
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
      
      // Identificar como quiosque
      this.socket.emit('identificar', { tipo: 'quiosque' });
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
