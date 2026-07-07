import api from './api';

export const mesaService = {
  // Buscar mesa por QR Code token
  buscarPorQRCode: async (token) => {
    const response = await api.get(`/mesas/qrcode/${token}`);
    return response.data;
  },

  // Buscar mesa por número, dentro de um quiosque específico (slug)
  buscarPorSlugENumero: async (slug, numero) => {
    const response = await api.get(`/mesas/${slug}/numero/${numero}`);
    return response.data;
  },
};
