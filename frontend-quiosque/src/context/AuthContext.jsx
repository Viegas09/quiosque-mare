import { useState, useEffect } from 'react';
import { AuthContext } from './authContextInstance';
import { authService } from '../services/authService';

const carregarContaSalva = () => {
  try {
    const contaSalva = localStorage.getItem('conta');
    return contaSalva ? JSON.parse(contaSalva) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [conta, setConta] = useState(carregarContaSalva);
  const [carregando, setCarregando] = useState(true);

  // Ao abrir o app, se já existe um token salvo, confirma com o backend
  // que ele ainda é válido (o token pode ter expirado nos 30 dias).
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setCarregando(false);
      return;
    }

    authService.me()
      .then((res) => {
        if (res.success) {
          setConta(res.conta);
          localStorage.setItem('conta', JSON.stringify(res.conta));
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('conta');
        setConta(null);
      })
      .finally(() => setCarregando(false));
  }, []);

  const login = async (email, senha) => {
    const res = await authService.login(email, senha);
    if (res.success) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('conta', JSON.stringify(res.conta));
      setConta(res.conta);
    }
    return res;
  };

  const registrar = async (nomeQuiosque, email, senha) => {
    const res = await authService.registrar(nomeQuiosque, email, senha);
    if (res.success) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('conta', JSON.stringify(res.conta));
      setConta(res.conta);

      // Vincula automaticamente qualquer dado criado antes do sistema de
      // contas existir (mesas/produtos originais) — só tem efeito na
      // primeira conta a rodar isso; nas seguintes não faz nada.
      try {
        await authService.migrarDadosLegado();
      } catch {
        // não bloqueia o cadastro se a migração falhar por algum motivo
      }
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('conta');
    setConta(null);
  };

  return (
    <AuthContext.Provider value={{ conta, carregando, autenticado: !!conta, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
