import api from './api';

export const produtoService = {
  // Listar todos os produtos
  listar: async () => {
    const response = await api.get('/produtos');
    return response.data;
  },

  // Toggle disponibilidade
  toggleDisponibilidade: async (produtoId) => {
    const response = await api.patch(`/produtos/${produtoId}/disponibilidade`);
    return response.data;
  },

  // Atualizar produto
  atualizar: async (produtoId, dados) => {
    const response = await api.put(`/produtos/${produtoId}`, dados);
    return response.data;
  },
};
