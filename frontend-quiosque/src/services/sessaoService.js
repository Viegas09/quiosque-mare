import api from './api';

export const sessaoService = {
  // Listar sessões
  listar: async (filtros = {}) => {
    const params = new URLSearchParams();
    
    if (filtros.status) {
      params.append('status', filtros.status);
    }

    const response = await api.get(`/sessoes?${params.toString()}`);
    return response.data;
  },

  // Buscar sessão ativa da mesa
  buscarSessaoAtiva: async (mesaId) => {
    const response = await api.get(`/sessoes/mesa/${mesaId}`);
    return response.data;
  },

  // Fechar conta
  fecharConta: async (mesaId) => {
    const response = await api.post(`/sessoes/mesa/${mesaId}/fechar`);
    return response.data;
  },
};
