import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Pencil, Trash2, QrCode, X } from 'lucide-react';
import { mesaService } from '../services/mesaService';
import Header from '../components/Header';

const Mesas = () => {
  const navigate = useNavigate();
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [mesaEditando, setMesaEditando] = useState(null); // null = criando nova
  const [numero, setNumero] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [qrcodeVisivel, setQrcodeVisivel] = useState(null); // { url, imagem } ou null

  const carregarMesas = async () => {
    try {
      setLoading(true);
      const response = await mesaService.listar();
      if (response.success) {
        setMesas(response.mesas);
      }
    } catch (error) {
      console.error('Erro ao carregar mesas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarMesas();
  }, []);

  const abrirModalNova = () => {
    setMesaEditando(null);
    setNumero('');
    setLocalizacao('');
    setErro('');
    setModalAberto(true);
  };

  const abrirModalEdicao = (mesa) => {
    setMesaEditando(mesa);
    setNumero(mesa.numero);
    setLocalizacao(mesa.localizacao);
    setErro('');
    setModalAberto(true);
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    try {
      if (mesaEditando) {
        const response = await mesaService.editar(mesaEditando._id, { numero, localizacao });
        if (response.success) {
          setMesas((prev) => prev.map((m) => (m._id === mesaEditando._id ? response.mesa : m)));
          setModalAberto(false);
        } else {
          setErro(response.message || 'Erro ao editar mesa');
        }
      } else {
        const response = await mesaService.criar(numero, localizacao);
        if (response.success) {
          setMesas((prev) => [...prev, response.mesa].sort((a, b) => a.numero.localeCompare(b.numero)));
          setModalAberto(false);
          setQrcodeVisivel(response.qrcode);
        } else {
          setErro(response.message || 'Erro ao criar mesa');
        }
      }
    } catch (error) {
      setErro(error.response?.data?.message || 'Erro ao salvar mesa');
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletar = async (mesa) => {
    if (!confirm(`Excluir a mesa "${mesa.numero}"? Essa ação não pode ser desfeita.`)) return;

    try {
      const response = await mesaService.deletar(mesa._id);
      if (response.success) {
        setMesas((prev) => prev.filter((m) => m._id !== mesa._id));
      } else {
        alert(response.message || 'Erro ao excluir mesa');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao excluir mesa');
    }
  };

  const handleGerarNovoQRCode = async (mesa) => {
    try {
      const response = await mesaService.gerarNovoQRCode(mesa._id);
      if (response.success) {
        setMesas((prev) => prev.map((m) => (m._id === mesa._id ? response.mesa : m)));
        setQrcodeVisivel(response.qrcode);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao gerar novo QR code');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-areia-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-mare-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-areia-100">
      <Header
        title="Gerenciar Mesas"
        onBack={() => navigate('/')}
        size="lg"
        sticky={false}
        rightSlot={
          <button
            onClick={abrirModalNova}
            className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 text-white"
          >
            <Plus size={18} />
            Nova Mesa
          </button>
        }
      />

      <div className="max-w-7xl mx-auto p-6">
        {mesas.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-md">
            Nenhuma mesa cadastrada ainda. Clique em "Nova Mesa" para começar.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mesas.map((mesa) => (
              <div key={mesa._id} className="bg-white rounded-xl shadow-md p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xl font-bold text-gray-800">Mesa {mesa.numero}</p>
                    <p className="text-sm text-gray-500">{mesa.localizacao}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      mesa.status === 'livre'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {mesa.status === 'livre' ? 'Livre' : 'Ocupada'}
                  </span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => abrirModalEdicao(mesa)}
                    className="flex-1 flex items-center justify-center gap-1 bg-areia-100 hover:bg-areia-200 text-gray-700 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Pencil size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleGerarNovoQRCode(mesa)}
                    className="flex-1 flex items-center justify-center gap-1 bg-mare-100 hover:bg-mare-200 text-mare-700 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <QrCode size={16} />
                    QR Code
                  </button>
                  <button
                    onClick={() => handleDeletar(mesa)}
                    disabled={mesa.status === 'ocupada'}
                    title={mesa.status === 'ocupada' ? 'Não é possível excluir uma mesa ocupada' : 'Excluir mesa'}
                    className="bg-coral-100 hover:bg-coral-200 text-coral-700 p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de criar/editar mesa */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {mesaEditando ? 'Editar Mesa' : 'Nova Mesa'}
              </h2>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Número</label>
                <input
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  required
                  autoFocus
                  className="w-full p-3 border-2 border-areia-200 rounded-xl focus:border-mare-600 focus:outline-none"
                  placeholder="Ex: 12"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Localização</label>
                <input
                  type="text"
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                  required
                  className="w-full p-3 border-2 border-areia-200 rounded-xl focus:border-mare-600 focus:outline-none"
                  placeholder="Ex: Guarda-sol 12"
                />
              </div>

              {erro && (
                <div className="p-3 bg-coral-100 text-coral-700 rounded-lg text-center text-sm">
                  {erro}
                </div>
              )}

              <button
                type="submit"
                disabled={salvando}
                className="w-full bg-mare-600 text-white py-3 rounded-xl font-semibold hover:bg-mare-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {salvando ? <Loader2 className="animate-spin" size={20} /> : 'Salvar'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal do QR Code */}
      {qrcodeVisivel?.imagem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">QR Code da Mesa</h2>
              <button onClick={() => setQrcodeVisivel(null)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>
            <img src={qrcodeVisivel.imagem} alt="QR Code" className="mx-auto rounded-lg border" />
            <p className="text-xs text-gray-500 mt-3 break-all">{qrcodeVisivel.url}</p>
            <p className="text-sm text-gray-600 mt-3">
              Imprima esta imagem e coloque na mesa. Escanear este código leva o cliente
              direto pro cardápio deste quiosque.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mesas;
