import api from './api';

export const contaService = {
  // Resolve o slug da URL (ex: /quiosque-do-vini) no nome real do quiosque
  buscarPorSlug: async (slug) => {
    const response = await api.get(`/contas/${slug}`);
    return response.data;
  },
};
