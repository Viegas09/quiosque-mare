import { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Hash, Loader2 } from 'lucide-react';
import { mesaService } from '../services/mesaService';
import { useCarrinho } from '../context/useCarrinho';
import Logo from '../components/Logo';

// html5-qrcode é uma biblioteca pesada — só vale baixá-la se a pessoa
// realmente escolher escanear um QR code, não em toda visita à tela inicial.
const QRScanner = lazy(() => import('../components/QRScanner'));

const Entrada = () => {
  const navigate = useNavigate();
  const { definirMesa } = useCarrinho();
  const [modo, setModo] = useState(null); // 'qr' ou 'numero'
  const [numeroMesa, setNumeroMesa] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleQRCodeScan = async (token) => {
    setLoading(true);
    setErro('');

    try {
      const response = await mesaService.buscarPorQRCode(token);
      
      if (response.success) {
        definirMesa(response.mesa);
        navigate('/cardapio');
      } else {
        setErro('Mesa não encontrada');
      }
    } catch (error) {
      console.error('Erro ao buscar mesa:', error);
      setErro('Erro ao buscar mesa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleNumeroSubmit = async (e) => {
    e.preventDefault();
    
    if (!numeroMesa.trim()) {
      setErro('Digite o número da mesa');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const response = await mesaService.buscarPorNumero(numeroMesa);
      
      if (response.success) {
        definirMesa(response.mesa);
        navigate('/cardapio');
      } else {
        setErro('Mesa não encontrada');
      }
    } catch (error) {
      console.error('Erro ao buscar mesa:', error);
      setErro('Mesa não encontrada. Verifique o número.');
    } finally {
      setLoading(false);
    }
  };

  if (modo === 'qr') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-mare-600 to-mare-800 p-4">
        <div className="max-w-md mx-auto pt-8">
          <button
            onClick={() => setModo(null)}
            className="text-white mb-4 flex items-center gap-2"
          >
            ← Voltar
          </button>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Escaneie o QR Code
            </h2>

            <Suspense
              fallback={
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-white" size={32} />
                </div>
              }
            >
              <QRScanner onScan={handleQRCodeScan} />
            </Suspense>

            {loading && (
              <div className="mt-4 flex justify-center">
                <Loader2 className="animate-spin text-mare-600" size={32} />
              </div>
            )}

            {erro && (
              <div className="mt-4 p-3 bg-coral-100 text-coral-700 rounded-lg text-center">
                {erro}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (modo === 'numero') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-mare-600 to-mare-800 p-4">
        <div className="max-w-md mx-auto pt-8">
          <button
            onClick={() => setModo(null)}
            className="text-white mb-4 flex items-center gap-2"
          >
            ← Voltar
          </button>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Digite o número da mesa
            </h2>

            <form onSubmit={handleNumeroSubmit} className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={numeroMesa}
                onChange={(e) => setNumeroMesa(e.target.value)}
                placeholder="Ex: 5"
                className="w-full text-center text-3xl font-bold p-4 border-2 border-areia-200 rounded-xl focus:border-mare-600 focus:outline-none"
                autoFocus
                disabled={loading}
              />

              {erro && (
                <div className="p-3 bg-coral-100 text-coral-700 rounded-lg text-center text-sm">
                  {erro}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-mare-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-mare-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Buscando...
                  </>
                ) : (
                  'Continuar'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Tela de escolha
  return (
    <div className="min-h-screen bg-gradient-to-b from-mare-600 to-mare-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Logo variant="mark" size={56} light />
          </div>
          <h1 className="text-4xl font-display font-semibold text-white mb-2">Maré</h1>
          <p className="text-aqua-100 text-lg">Sua praia, sem fila.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setModo('qr')}
            className="w-full bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="bg-mare-100 p-4 rounded-xl">
                <QrCode size={40} className="text-mare-600" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-xl font-bold text-gray-800">Escanear QR Code</h3>
                <p className="text-gray-600 text-sm">Use a câmera do celular</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setModo('numero')}
            className="w-full bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-xl">
                <Hash size={40} className="text-green-500" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-xl font-bold text-gray-800">Digitar Número</h3>
                <p className="text-gray-600 text-sm">Digite o número da mesa</p>
              </div>
            </div>
          </button>
        </div>

        <p className="text-center text-aqua-100 text-sm mt-8">
          Escolha como deseja começar seu pedido
        </p>
      </div>
    </div>
  );
};

export default Entrada;
