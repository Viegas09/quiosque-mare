import api from './api';

export const produtoService = {
  // Listar todos os produtos
  listar: async (filtros = {}) => {
    const params = new URLSearchParams();
    
    if (filtros.categoria) {
      params.append('categoria', filtros.categoria);
    }
    
    if (filtros.disponivel !== undefined) {
      params.append('disponivel', filtros.disponivel);
    }

    const response = await api.get(`/produtos?${params.toString()}`);
    return response.data;
  },

  // Buscar produto por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  },

  // Listar categorias
  listarCategorias: async () => {
    const response = await api.get('/produtos/categorias');
    return response.data;
  },
};
