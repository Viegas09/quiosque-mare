import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { produtoService } from '../services/produtoService';
import Header from '../components/Header';

const Produtos = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await produtoService.listar();

        if (response.success) {
          setProdutos(response.produtos);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleToggleDisponibilidade = async (produtoId) => {
    try {
      const response = await produtoService.toggleDisponibilidade(produtoId);
      
      if (response.success) {
        setProdutos((prev) =>
          prev.map((p) =>
            p._id === produtoId ? { ...p, disponivel: !p.disponivel } : p
          )
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar disponibilidade:', error);
      alert('Erro ao atualizar produto');
    }
  };

  const produtosFiltrados = produtos.filter((produto) => {
    const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria =
      categoriaFiltro === 'todos' || produto.categoria === categoriaFiltro;
    return matchBusca && matchCategoria;
  });

  const categorias = [...new Set(produtos.map((p) => p.categoria))];

  if (loading) {
    return (
      <div className="min-h-screen bg-areia-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-mare-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-areia-100">
      {/* Header */}
      <Header title="Gerenciar Produtos" onBack={() => navigate('/')} size="lg" sticky={false} />

      {/* Barra de Busca e Filtros */}
      <div className="bg-white p-4 shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-800 border border-areia-200 focus:outline-none focus:ring-2 focus:ring-mare-300"
            />
          </div>

          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="px-4 py-2 rounded-lg text-gray-800 font-semibold border border-areia-200 focus:outline-none focus:ring-2 focus:ring-mare-300"
          >
            <option value="todos">Todas as Categorias</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-areia-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Produto
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Preço
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Tempo Preparo
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                    Disponível
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {produtosFiltrados.map((produto) => (
                  <tr
                    key={produto._id}
                    className={`hover:bg-areia-50 transition-colors ${
                      !produto.disponivel ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800">{produto.nome}</p>
                        <p className="text-sm text-gray-500">{produto.descricao}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-mare-100 text-mare-800">
                        {produto.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-800">
                        R$ {produto.preco.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">
                        {produto.tempoPreparoEstimado} min
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleDisponibilidade(produto._id)}
                        className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        {produto.disponivel ? (
                          <>
                            <ToggleRight size={32} className="text-green-500" />
                            <span className="text-sm font-semibold text-green-600">
                              Disponível
                            </span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={32} className="text-gray-400" />
                            <span className="text-sm font-semibold text-gray-500">
                              Indisponível
                            </span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {produtosFiltrados.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nenhum produto encontrado
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          {produtosFiltrados.length} produto(s) encontrado(s)
        </div>
      </div>
    </div>
  );
};

export default Produtos;
