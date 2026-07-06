import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, Loader2 } from 'lucide-react';
import { useCarrinho } from '../context/useCarrinho';
import { pedidoService } from '../services/pedidoService';
import Header from '../components/Header';

const Checkout = () => {
  const navigate = useNavigate();
  const { itens, mesa, calcularTotal, limparCarrinho } = useCarrinho();
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  if (!mesa || itens.length === 0) {
    navigate('/');
    return null;
  }

  const handleFinalizarPedido = async () => {
    if (!metodoPagamento) {
      setErro('Selecione um método de pagamento');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      // 1. Criar o pedido
      const dadosPedido = {
        mesaId: mesa._id,
        itens: itens.map((item) => ({
          produtoId: item.produto._id,
          quantidade: item.quantidade,
          observacoes: item.observacoes,
        })),
      };

      const responsePedido = await pedidoService.criar(dadosPedido);

      if (!responsePedido.success) {
        throw new Error('Erro ao criar pedido');
      }

      const pedidoId = responsePedido.pedido._id;

      // 2. Iniciar pagamento
      const dadosPagamento = {
        metodoPagamento,
      };

      const responsePagamento = await pedidoService.iniciarPagamento(
        pedidoId,
        dadosPagamento
      );

      if (!responsePagamento.success) {
        throw new Error('Erro ao processar pagamento');
      }

      // 3. Redirecionar baseado no método
      if (metodoPagamento === 'pix') {
        // Salvar dados do pagamento PIX
        localStorage.setItem(
          'pagamentoPix',
          JSON.stringify({
            pedidoId,
            qrCode: responsePagamento.pagamento.qrCode,
            qrCodeBase64: responsePagamento.pagamento.qrCodeBase64,
          })
        );

        limparCarrinho();
        navigate(`/pagamento-pix/${pedidoId}`);
      } else {
        // Para cartão (implementar futuramente com SDK do Mercado Pago)
        limparCarrinho();
        navigate(`/acompanhar/${pedidoId}`);
      }
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      setErro(error.message || 'Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-areia-50 pb-24">
      {/* Header */}
      <Header title="Pagamento" onBack={() => !loading && navigate('/carrinho')} />

      <div className="max-w-4xl mx-auto p-4">
        {/* Resumo do Pedido */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <h2 className="font-bold text-lg mb-4 text-gray-800">Resumo do Pedido</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Mesa {mesa.numero}</span>
              <span>{itens.length} {itens.length === 1 ? 'item' : 'itens'}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between text-xl font-bold text-gray-800">
                <span>Total</span>
                <span>R$ {calcularTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Métodos de Pagamento */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <h2 className="font-bold text-lg mb-4 text-gray-800">
            Escolha o método de pagamento
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => setMetodoPagamento('pix')}
              disabled={loading}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                metodoPagamento === 'pix'
                  ? 'border-mare-600 bg-mare-50'
                  : 'border-areia-200 hover:border-areia-200'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    metodoPagamento === 'pix' ? 'bg-mare-600' : 'bg-areia-100'
                  }`}
                >
                  <QrCode
                    size={32}
                    className={metodoPagamento === 'pix' ? 'text-white' : 'text-gray-600'}
                  />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-gray-800">PIX</h3>
                  <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                </div>
                {metodoPagamento === 'pix' && (
                  <div className="w-6 h-6 rounded-full bg-mare-600 flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                )}
              </div>
            </button>

            <button
              onClick={() => setMetodoPagamento('cartao_credito')}
              disabled={true} // Desabilitado por enquanto
              className="w-full p-4 rounded-xl border-2 border-areia-200 opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-areia-100">
                  <CreditCard size={32} className="text-gray-600" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-gray-800">Cartão de Crédito</h3>
                  <p className="text-sm text-gray-600">Em breve</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {erro && (
          <div className="bg-coral-100 text-coral-700 p-4 rounded-lg mb-6">
            {erro}
          </div>
        )}
      </div>

      {/* Botão Confirmar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleFinalizarPedido}
            disabled={loading || !metodoPagamento}
            className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processando...
              </>
            ) : (
              `Confirmar Pagamento - R$ ${calcularTotal().toFixed(2)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
