import api from './api';

export const mesaService = {
  listar: async () => {
    const response = await api.get('/mesas');
    return response.data;
  },

  criar: async (numero, localizacao) => {
    const response = await api.post('/mesas', { numero, localizacao });
    return response.data;
  },

  editar: async (mesaId, dados) => {
    const response = await api.put(`/mesas/${mesaId}`, dados);
    return response.data;
  },

  deletar: async (mesaId) => {
    const response = await api.delete(`/mesas/${mesaId}`);
    return response.data;
  },

  gerarNovoQRCode: async (mesaId) => {
    const response = await api.post(`/mesas/${mesaId}/novo-qrcode`);
    return response.data;
  },
};
