import api from './api';

export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    return response.data;
  },

  registrar: async (nomeQuiosque, email, senha) => {
    const response = await api.post('/auth/registro', { nomeQuiosque, email, senha });
    return response.data;
  },

  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Vincula à conta logada dados criados antes do sistema de contas existir
  // (roda automaticamente uma vez, logo após o primeiro cadastro).
  migrarDadosLegado: async () => {
    const response = await api.post('/auth/migrar-dados-legado');
    return response.data;
  },
};
