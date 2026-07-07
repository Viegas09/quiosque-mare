import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Loader2 } from 'lucide-react';
import { produtoService } from '../services/produtoService';
import { useCarrinho } from '../context/useCarrinho';
import Header from '../components/Header';

const categoriasMap = {
  bebidas: { nome: 'Bebidas', emoji: '🥤' },
  drinks: { nome: 'Drinks', emoji: '🍹' },
  petiscos: { nome: 'Petiscos', emoji: '🍤' },
  porcoes: { nome: 'Porções', emoji: '🍟' },
  pratos: { nome: 'Pratos', emoji: '🍽️' },
  sobremesas: { nome: 'Sobremesas', emoji: '🍨' },
};

const Cardapio = () => {
  const navigate = useNavigate();
  const { mesa, adicionarItem, quantidadeTotal, calcularTotal } = useCarrinho();
  const [produtos, setProdutos] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!mesa) {
      navigate('/');
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const response = await produtoService.listarPublico(mesa._id);

        if (response.success) {
          setProdutos(response.produtos);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setErro('Erro ao carregar cardápio');
      } finally {
        setLoading(false);
      }
    })();
  }, [mesa, navigate]);

  const produtosFiltrados =
    categoriaAtiva === 'todos'
      ? produtos
      : produtos.filter((p) => p.categoria === categoriaAtiva);

  const categorias = Object.keys(categoriasMap).filter((cat) =>
    produtos.some((p) => p.categoria === cat)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-areia-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-mare-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-areia-50 pb-24">
      {/* Header */}
      <Header
        title="Cardápio"
        subtitle={`Mesa ${mesa?.numero} - ${mesa?.localizacao}`}
        rightSlot={
          <button
            onClick={() => navigate('/carrinho')}
            className="relative bg-white text-mare-600 p-3 rounded-full shadow-lg hover:bg-mare-50 transition-colors"
          >
            <ShoppingCart size={24} />
            {quantidadeTotal() > 0 && (
              <span className="absolute -top-2 -right-2 bg-coral-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {quantidadeTotal()}
              </span>
            )}
          </button>
        }
      />

      {/* Filtro de Categorias */}
      <div className="bg-white p-4 shadow sticky top-16 z-10 overflow-x-auto">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <button
            onClick={() => setCategoriaAtiva('todos')}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-colors ${
              categoriaAtiva === 'todos'
                ? 'bg-mare-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaAtiva(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-colors ${
                categoriaAtiva === cat
                  ? 'bg-mare-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {categoriasMap[cat].emoji} {categoriasMap[cat].nome}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="max-w-4xl mx-auto p-4">
        {erro && (
          <div className="bg-coral-100 text-coral-700 p-4 rounded-lg mb-4">
            {erro}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {produtosFiltrados.map((produto) => (
            <ProdutoCard key={produto._id} produto={produto} onAdicionar={adicionarItem} />
          ))}
        </div>

        {produtosFiltrados.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum produto disponível nesta categoria
          </div>
        )}
      </div>

      {/* Botão Flutuante do Carrinho */}
      {quantidadeTotal() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/carrinho')}
              className="w-full bg-mare-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-between hover:bg-mare-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart size={24} />
                {quantidadeTotal()} {quantidadeTotal() === 1 ? 'item' : 'itens'}
              </span>
              <span>R$ {calcularTotal().toFixed(2)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ProdutoCard = ({ produto, onAdicionar }) => {
  const [quantidade, setQuantidade] = useState(1);

  const handleAdicionar = () => {
    onAdicionar(produto, quantidade);
    setQuantidade(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{produto.nome}</h3>
        <p className="text-sm text-gray-600 mb-3">{produto.descricao}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-mare-600">
            R$ {produto.preco.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">
            ⏱️ {produto.tempoPreparoEstimado} min
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-areia-200 rounded-lg">
            <button
              onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
              className="p-2 hover:bg-areia-100 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="px-4 font-semibold">{quantidade}</span>
            <button
              onClick={() => setQuantidade(quantidade + 1)}
              className="p-2 hover:bg-areia-100 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={handleAdicionar}
            className="flex-1 bg-mare-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-mare-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cardapio;
