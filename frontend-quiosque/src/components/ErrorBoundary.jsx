import { Component } from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * Captura erros de render em qualquer componente abaixo dele e mostra uma
 * tela de recuperação, em vez de deixar o painel inteiro em branco.
 * Erros em handlers assíncronos (fetch, socket, etc.) não passam por aqui —
 * isso é uma limitação do React, não deste componente.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { temErro: false };
  }

  static getDerivedStateFromError() {
    return { temErro: true };
  }

  componentDidCatch(error, info) {
    console.error('Erro capturado pelo ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.temErro) {
      return (
        <div className="min-h-screen bg-areia-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-xl">
            <h1 className="text-xl font-display font-semibold text-tinta mb-2">
              Algo deu errado no painel
            </h1>
            <p className="text-gray-600 mb-6">
              Tivemos um problema ao carregar esta tela. Tente voltar ao painel principal — os pedidos continuam sendo recebidos normalmente no servidor.
            </p>
            <button
              onClick={() => window.location.assign('/')}
              className="w-full bg-mare-700 text-white py-3 rounded-xl font-semibold hover:bg-mare-600 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Voltar ao painel
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
