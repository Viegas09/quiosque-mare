import api from './api';

export const produtoService = {
  // Cardápio público de um quiosque, filtrado automaticamente pela mesa
  // (a mesa já sabe a qual quiosque pertence)
  listarPublico: async (mesaId) => {
    const response = await api.get(`/produtos/publico-mesa/${mesaId}`);
    return response.data;
  },

};
