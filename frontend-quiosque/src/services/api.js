import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Anexa o token salvo (se existir) em toda requisição, sem precisar
// passar isso manualmente em cada chamada de serviço.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('✅ Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.message);

    // Sessão expirada ou inválida — limpa e manda pro login, exceto se o
    // próprio 401 já veio da tela de login (senha errada, por exemplo).
    const isRotaAuth = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/registro');
    if (error.response?.status === 401 && !isRotaAuth) {
      localStorage.removeItem('token');
      localStorage.removeItem('conta');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
