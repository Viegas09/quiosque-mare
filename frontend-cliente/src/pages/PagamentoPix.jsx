import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Loader2, Copy, Check } from 'lucide-react';
import socketService from '../services/socket';

const carregarPagamentoSalvo = (pedidoId) => {
  try {
    const dadosSalvos = localStorage.getItem('pagamentoPix');
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      if (dados.pedidoId === pedidoId) {
        return dados;
      }
    }
  } catch (error) {
    console.error('Erro ao carregar dados do pagamento PIX:', error);
  }
  return null;
};

const PagamentoPix = () => {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  const [pagamentoData] = useState(() => carregarPagamentoSalvo(pedidoId));
  const [copiado, setCopiado] = useState(false);
  const [aguardandoPagamento, setAguardandoPagamento] = useState(true);

  useEffect(() => {
    // Conectar socket para ouvir confirmação
    socketService.connect();
    socketService.acompanharPedido(pedidoId);

    // Listener para pagamento aprovado
    const handlePagamentoAprovado = (data) => {
      if (data.pedidoId === pedidoId) {
        setAguardandoPagamento(false);
        localStorage.removeItem('pagamentoPix');
        
        setTimeout(() => {
          navigate(`/acompanhar/${pedidoId}`);
        }, 2000);
      }
    };

    socketService.onPagamentoAprovado(handlePagamentoAprovado);

    return () => {
      socketService.off('pedido:pagamento_aprovado', handlePagamentoAprovado);
    };
  }, [pedidoId, navigate]);

  const copiarCodigoPix = () => {
    if (pagamentoData?.qrCode) {
      navigator.clipboard.writeText(pagamentoData.qrCode);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  if (!pagamentoData) {
    return (
      <div className="min-h-screen bg-areia-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-mare-600" size={48} />
      </div>
    );
  }

  if (!aguardandoPagamento) {
    return (
      <div className="min-h-screen bg-areia-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-xl">
          <div className="mb-6">
            <CheckCircle size={80} className="mx-auto text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Pagamento Confirmado!
          </h2>
          <p className="text-gray-600 mb-6">
            Seu pedido foi recebido e está sendo preparado
          </p>
          <div className="animate-pulse text-mare-600">
            Redirecionando...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-areia-50 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Pagamento PIX
          </h2>

          {/* QR Code */}
          <div className="bg-white p-4 rounded-xl border-2 border-areia-200 mb-6">
            {pagamentoData.qrCodeBase64 ? (
              <img
                src={`data:image/png;base64,${pagamentoData.qrCodeBase64}`}
                alt="QR Code PIX"
                className="w-full max-w-xs mx-auto"
              />
            ) : (
              <div className="aspect-square bg-areia-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">QR Code não disponível</p>
              </div>
            )}
          </div>

          {/* Instruções */}
          <div className="space-y-4 mb-6">
            <div className="bg-mare-50 p-4 rounded-lg">
              <h3 className="font-bold text-mare-900 mb-2">Como pagar:</h3>
              <ol className="text-sm text-mare-800 space-y-1 list-decimal list-inside">
                <li>Abra o app do seu banco</li>
                <li>Escolha pagar com PIX</li>
                <li>Escaneie o QR Code acima</li>
                <li>Confirme o pagamento</li>
              </ol>
            </div>

            {/* Botão Copiar Código */}
            <button
              onClick={copiarCodigoPix}
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
            >
              {copiado ? (
                <>
                  <Check size={20} />
                  Código Copiado!
                </>
              ) : (
                <>
                  <Copy size={20} />
                  Copiar Código PIX
                </>
              )}
            </button>
          </div>

          {/* Status */}
          <div className="text-center py-4 border-t">
            <Loader2 className="animate-spin text-mare-600 mx-auto mb-2" size={32} />
            <p className="text-gray-600 font-medium">
              Aguardando confirmação do pagamento...
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Isso pode levar alguns segundos
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          Você será redirecionado automaticamente após o pagamento
        </p>
      </div>
    </div>
  );
};

export default PagamentoPix;
