import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, ToggleLeft, ToggleRight, Pencil, X, Image as ImageIcon } from 'lucide-react';
import { produtoService } from '../services/produtoService';
import Header from '../components/Header';

const Produtos = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos');
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '', imagemUrl: '' });
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');

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

  const abrirEdicao = (produto) => {
    setProdutoEditando(produto);
    setForm({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      imagemUrl: produto.imagemUrl || '',
    });
    setErroForm('');
  };

  const fecharEdicao = () => {
    setProdutoEditando(null);
  };

  const handleSalvarEdicao = async (e) => {
    e.preventDefault();
    setErroForm('');

    const precoNumero = Number(form.preco);
    if (!form.nome.trim() || !form.descricao.trim() || Number.isNaN(precoNumero) || precoNumero < 0) {
      setErroForm('Preencha nome, descrição e um preço válido');
      return;
    }

    setSalvando(true);
    try {
      const response = await produtoService.atualizar(produtoEditando._id, {
        nome: form.nome,
        descricao: form.descricao,
        preco: precoNumero,
        imagemUrl: form.imagemUrl.trim() || null,
      });

      if (response.success) {
        setProdutos((prev) =>
          prev.map((p) => (p._id === produtoEditando._id ? response.produto : p))
        );
        setProdutoEditando(null);
      } else {
        setErroForm(response.message || 'Erro ao salvar produto');
      }
    } catch (error) {
      setErroForm(error.response?.data?.message || 'Erro ao salvar produto');
    } finally {
      setSalvando(false);
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
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                    Editar
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
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => abrirEdicao(produto)}
                        className="inline-flex items-center gap-1 text-mare-600 hover:text-mare-800 font-semibold text-sm"
                      >
                        <Pencil size={16} />
                        Editar
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

      {/* Modal de edição */}
      {produtoEditando && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Editar Produto</h2>
              <button onClick={fecharEdicao} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                  required
                  className="w-full p-3 border-2 border-areia-200 rounded-xl focus:border-mare-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={form.descricao}
                  onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                  required
                  rows={2}
                  className="w-full p-3 border-2 border-areia-200 rounded-xl focus:border-mare-600 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.preco}
                  onChange={(e) => setForm((f) => ({ ...f, preco: e.target.value }))}
                  required
                  className="w-full p-3 border-2 border-areia-200 rounded-xl focus:border-mare-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <ImageIcon size={16} />
                  URL da foto (opcional)
                </label>
                <input
                  type="url"
                  value={form.imagemUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imagemUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full p-3 border-2 border-areia-200 rounded-xl focus:border-mare-600 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Sem uma foto, o cardápio mostra um ícone da categoria no lugar. Cole aqui o
                  link de uma imagem quando tiver uma foto do produto.
                </p>
                {form.imagemUrl && (
                  <img
                    src={form.imagemUrl}
                    alt="Pré-visualização"
                    className="mt-2 w-full h-32 object-cover rounded-lg border"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
              </div>

              {erroForm && (
                <div className="p-3 bg-coral-100 text-coral-700 rounded-lg text-center text-sm">
                  {erroForm}
                </div>
              )}

              <button
                type="submit"
                disabled={salvando}
                className="w-full bg-mare-600 text-white py-3 rounded-xl font-semibold hover:bg-mare-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {salvando ? <Loader2 className="animate-spin" size={20} /> : 'Salvar alterações'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produtos;
