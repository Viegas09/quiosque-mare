import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Clock, CheckCircle } from 'lucide-react';
import { sessaoService } from '../services/sessaoService';
import Header from '../components/Header';

const Contas = () => {
  const navigate = useNavigate();
  const [sessoesAbertas, setSessoesAbertas] = useState([]);
  const [detalhes, setDetalhes] = useState({});
  const [loading, setLoading] = useState(true);

  const carregarDetalhesSessao = async (mesaId) => {
    try {
      const response = await sessaoService.buscarSessaoAtiva(mesaId);
      
      if (response.success) {
        setDetalhes((prev) => ({
          ...prev,
          [mesaId]: response,
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    }
  };

  const carregarSessoes = async () => {
    try {
      setLoading(true);
      const response = await sessaoService.listar({ status: 'aberta' });
      
      if (response.success) {
        setSessoesAbertas(response.sessoes);
        
        // Carregar detalhes de cada sessão
        for (const sessao of response.sessoes) {
          await carregarDetalhesSessao(sessao.mesa);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFecharConta = async (mesaId, numeroMesa) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja fechar a conta da Mesa ${numeroMesa}?`
    );
    
    if (!confirmar) return;

    try {
      const response = await sessaoService.fecharConta(mesaId);
      
      if (response.success) {
        alert(`Conta fechada com sucesso! Total: R$ ${response.totalFinal.toFixed(2)}`);
        carregarSessoes();
      }
    } catch (error) {
      console.error('Erro ao fechar conta:', error);
      alert(error.response?.data?.message || 'Erro ao fechar conta');
    }
  };

  useEffect(() => {
    (async () => {
      await carregarSessoes();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Header
        title="Gerenciar Contas"
        subtitle={`${sessoesAbertas.length} mesa(s) com conta aberta`}
        onBack={() => navigate('/')}
        size="lg"
        sticky={false}
      />

      {/* Lista de Contas */}
      <div className="max-w-7xl mx-auto p-6">
        {sessoesAbertas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <CheckCircle size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Nenhuma conta aberta
            </h2>
            <p className="text-gray-600">
              Todas as mesas estão livres no momento
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessoesAbertas.map((sessao) => {
              const detail = detalhes[sessao.mesa];
              
              return (
                <ContaCard
                  key={sessao._id}
                  sessao={sessao}
                  detalhes={detail}
                  onFecharConta={handleFecharConta}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const ContaCard = ({ sessao, detalhes, onFecharConta }) => {
  const [expandido, setExpandido] = useState(false);

  if (!detalhes) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <Loader2 className="animate-spin text-gray-400 mx-auto" size={32} />
      </div>
    );
  }

  const pedidosPendentes = detalhes.pedidos?.filter(
    (p) => p.status !== 'entregue' && p.status !== 'cancelado'
  ).length || 0;

  const tempoAberto = () => {
    const agora = new Date();
    const aberta = new Date(sessao.abertaEm);
    const minutos = Math.floor((agora - aberta) / 60000);
    
    if (minutos < 60) return `${minutos} min`;
    const horas = Math.floor(minutos / 60);
    return `${horas}h ${minutos % 60}min`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              Mesa {sessao.numeroMesa}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Clock size={14} />
              <span>Aberta há {tempoAberto()}</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Acumulado</p>
            <p className="text-3xl font-bold text-mare-700">
              R$ {detalhes.sessao.totalAcumulado.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-mare-50 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-600">Pedidos</p>
            <p className="text-2xl font-bold text-mare-700">
              {detalhes.pedidos?.length || 0}
            </p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-600">Pendentes</p>
            <p className="text-2xl font-bold text-orange-600">
              {pedidosPendentes}
            </p>
          </div>
        </div>

        {/* Expandir Detalhes */}
        {detalhes.pedidos && detalhes.pedidos.length > 0 && (
          <button
            onClick={() => setExpandido(!expandido)}
            className="w-full text-sm text-mare-700 hover:text-mare-800 font-semibold mb-4"
          >
            {expandido ? '▲ Ocultar Pedidos' : '▼ Ver Pedidos'}
          </button>
        )}

        {expandido && (
          <div className="mb-4 max-h-48 overflow-y-auto bg-areia-50 rounded-lg p-3">
            <div className="space-y-2">
              {detalhes.pedidos.map((pedido) => (
                <div
                  key={pedido._id}
                  className="flex justify-between text-sm border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-semibold">
                      #{pedido._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">{pedido.status}</p>
                  </div>
                  <span className="font-bold">
                    R$ {pedido.total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botão Fechar Conta */}
        <button
          onClick={() => onFecharConta(sessao.mesa, sessao.numeroMesa)}
          disabled={pedidosPendentes > 0}
          className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
            pedidosPendentes > 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-coral-600 hover:bg-coral-700'
          }`}
        >
          {pedidosPendentes > 0
            ? `${pedidosPendentes} pedido(s) pendente(s)`
            : 'Fechar Conta'}
        </button>
      </div>
    </div>
  );
};

export default Contas;
