import { Component } from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * Captura erros de render em qualquer componente abaixo dele e mostra uma
 * tela de recuperação, em vez de deixar a tela inteira em branco.
 * Erros em handlers assíncronos (fetch, etc.) não passam por aqui — isso
 * é uma limitação do React, não deste componente.
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
        <div className="min-h-screen bg-areia-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-xl">
            <h1 className="text-xl font-display font-semibold text-tinta mb-2">
              Algo deu errado
            </h1>
            <p className="text-gray-600 mb-6">
              Tivemos um problema ao carregar esta tela. Tente novamente — se persistir, comece de novo pelo início.
            </p>
            <button
              onClick={() => window.location.assign('/')}
              className="w-full bg-mare-600 text-white py-3 rounded-xl font-semibold hover:bg-mare-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Voltar ao início
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
