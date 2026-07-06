import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCarrinho } from '../context/useCarrinho';
import Header from '../components/Header';

const Carrinho = () => {
  const navigate = useNavigate();
  const {
    itens,
    mesa,
    removerItem,
    atualizarQuantidade,
    calcularTotal,
    quantidadeTotal,
  } = useCarrinho();

  if (!mesa) {
    navigate('/');
    return null;
  }

  if (itens.length === 0) {
    return (
      <div className="min-h-screen bg-areia-50">
        <Header title="Carrinho" onBack={() => navigate('/cardapio')} sticky={false} />

        <div className="max-w-4xl mx-auto p-8 text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Seu carrinho está vazio
          </h2>
          <p className="text-gray-600 mb-6">
            Adicione itens do cardápio para começar seu pedido
          </p>
          <button
            onClick={() => navigate('/cardapio')}
            className="bg-mare-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-mare-700 transition-colors"
          >
            Ver Cardápio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-areia-50 pb-32">
      {/* Header */}
      <Header
        title="Carrinho"
        subtitle={`Mesa ${mesa.numero} - ${quantidadeTotal()} ${quantidadeTotal() === 1 ? 'item' : 'itens'}`}
        onBack={() => navigate('/cardapio')}
      />

      {/* Itens do Carrinho */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="space-y-3">
          {itens.map((item, index) => (
            <div key={`${item.produto._id}-${index}`} className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.produto.nome}</h3>
                  <p className="text-sm text-gray-600">
                    R$ {item.produto.preco.toFixed(2)} cada
                  </p>
                  {item.observacoes && (
                    <p className="text-sm text-gray-500 italic mt-1">
                      Obs: {item.observacoes}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removerItem(item.produto._id, item.observacoes)}
                  className="text-coral-600 hover:text-coral-700 p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center border border-areia-200 rounded-lg">
                  <button
                    onClick={() =>
                      atualizarQuantidade(
                        item.produto._id,
                        item.observacoes,
                        item.quantidade - 1
                      )
                    }
                    className="p-2 hover:bg-areia-100 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 font-semibold">{item.quantidade}</span>
                  <button
                    onClick={() =>
                      atualizarQuantidade(
                        item.produto._id,
                        item.observacoes,
                        item.quantidade + 1
                      )
                    }
                    className="p-2 hover:bg-areia-100 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <span className="text-lg font-bold text-mare-600">
                  R$ {item.subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Resumo do Pedido</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>R$ {calcularTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Taxa de serviço</span>
              <span>R$ 0,00</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-xl font-bold text-gray-800">
                <span>Total</span>
                <span>R$ {calcularTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Finalizar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors"
          >
            Finalizar Pedido - R$ {calcularTotal().toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrinho;
