import api from './api';

export const pedidoService = {
  // Listar pedidos
  listar: async (filtros = {}) => {
    const params = new URLSearchParams();
    
    if (filtros.status) {
      params.append('status', filtros.status);
    }
    
    if (filtros.mesaId) {
      params.append('mesaId', filtros.mesaId);
    }

    const response = await api.get(`/pedidos?${params.toString()}`);
    return response.data;
  },

  // Buscar pedido por ID
  buscarPorId: async (pedidoId) => {
    const response = await api.get(`/pedidos/${pedidoId}`);
    return response.data;
  },

  // Atualizar status do pedido
  atualizarStatus: async (pedidoId, novoStatus) => {
    const response = await api.patch(`/pedidos/${pedidoId}/status`, {
      status: novoStatus,
    });
    return response.data;
  },

  // Buscar estatísticas do dashboard
  buscarEstatisticas: async () => {
    const response = await api.get('/pedidos/dashboard/stats');
    return response.data;
  },
};
