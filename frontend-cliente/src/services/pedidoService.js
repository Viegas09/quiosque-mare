import api from './api';

export const pedidoService = {
  // Criar novo pedido
  criar: async (dadosPedido) => {
    const response = await api.post('/pedidos', dadosPedido);
    return response.data;
  },

  // Iniciar pagamento
  iniciarPagamento: async (pedidoId, dadosPagamento) => {
    const response = await api.post(`/pedidos/${pedidoId}/pagamento`, dadosPagamento);
    return response.data;
  },

  // Buscar pedido por ID
  buscarPorId: async (pedidoId) => {
    const response = await api.get(`/pedidos/${pedidoId}`);
    return response.data;
  },

  // Listar pedidos da mesa
  listarPorMesa: async (mesaId) => {
    const response = await api.get(`/pedidos?mesaId=${mesaId}`);
    return response.data;
  },
};
