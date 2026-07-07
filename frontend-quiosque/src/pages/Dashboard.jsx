import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChefHat, CheckCircle, TrendingUp, Loader2, RefreshCw, LogOut } from 'lucide-react';
import { pedidoService } from '../services/pedidoService';
import socketService from '../services/socket';
import { useAuth } from '../context/useAuth';
import PedidoCard from '../components/PedidoCard';
import Logo from '../components/Logo';

const Dashboard = () => {
  const navigate = useNavigate();
  const { conta, logout } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('novos');
  const [audioEnabled] = useState(true);

  const carregarPedidos = async () => {
    try {
      const response = await pedidoService.listar({
        status: 'pago,em_preparacao,pronto',
      });
      
      if (response.success) {
        setPedidos(response.pedidos);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      const response = await pedidoService.buscarEstatisticas();
      
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const carregarDados = async () => {
    await Promise.all([carregarPedidos(), carregarEstatisticas()]);
    setLoading(false);
  };

  const playNotificationSound = () => {
    // Som de notificação simples
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjKI0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+mejyuWUhBjiR1/LMeSwF');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    (async () => {
      await carregarDados();
    })();

    // Conectar socket para novos pedidos — já identificado com a conta logada,
    // pra receber só os pedidos deste quiosque
    socketService.connect(conta?.id);

    // Listener para novos pedidos
    const handleNovoPedido = (data) => {
      console.log('🆕 Novo pedido recebido:', data);
      
      // Adicionar pedido na lista
      setPedidos((prev) => [data.pedido, ...prev]);
      
      // Tocar som
      if (audioEnabled) {
        playNotificationSound();
      }
      
      // Recarregar stats
      carregarEstatisticas();
    };

    // Listener para atualização de status
    const handleStatusAtualizado = (data) => {
      console.log('🔄 Status atualizado:', data);
      
      // Atualizar pedido na lista
      setPedidos((prev) =>
        prev.map((p) =>
          p._id === data.pedidoId ? { ...p, status: data.status } : p
        )
      );
      
      // Recarregar stats
      carregarEstatisticas();
    };

    socketService.onNovoPedido(handleNovoPedido);
    socketService.onStatusAtualizado(handleStatusAtualizado);

    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      carregarDados();
    }, 30000);

    return () => {
      socketService.off('pedido:novo', handleNovoPedido);
      socketService.off('pedido:status_atualizado', handleStatusAtualizado);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioEnabled, conta?.id]);

  const handleAtualizarStatus = async (pedidoId, novoStatus) => {
    try {
      await pedidoService.atualizarStatus(pedidoId, novoStatus);
      
      // Atualizar localmente
      setPedidos((prev) =>
        prev.map((p) => (p._id === pedidoId ? { ...p, status: novoStatus } : p))
      );
      
      carregarEstatisticas();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do pedido');
    }
  };

  const handleSair = () => {
    if (!confirm('Sair do painel?')) return;
    socketService.disconnect();
    logout();
    navigate('/login');
  };

  const pedidosNovos = pedidos.filter((p) => p.status === 'pago');
  const pedidosPreparando = pedidos.filter((p) => p.status === 'em_preparacao');
  const pedidosProntos = pedidos.filter((p) => p.status === 'pronto');

  const getPedidosPorAba = () => {
    switch (abaAtiva) {
      case 'novos':
        return pedidosNovos;
      case 'preparando':
        return pedidosPreparando;
      case 'prontos':
        return pedidosProntos;
      default:
        return pedidos;
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
      {/* Header */}
      <div className="bg-mare-700 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Logo variant="mark" size={32} light />
                <h1 className="text-3xl font-display font-semibold">Painel do Quiosque</h1>
              </div>
              <p className="text-aqua-100 mt-1">
                {conta?.nomeQuiosque ? `${conta.nomeQuiosque} · ` : ''}
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            
            <div className="flex gap-3 flex-wrap justify-end">
              <button
                onClick={carregarDados}
                className="bg-mare-600 hover:bg-mare-500 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Atualizar
              </button>
              
              <button
                onClick={() => navigate('/produtos')}
                className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Gerenciar Produtos
              </button>

              <button
                onClick={() => navigate('/mesas')}
                className="bg-aqua-500 hover:bg-aqua-400 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Mesas
              </button>
              
              <button
                onClick={() => navigate('/contas')}
                className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Contas
              </button>

              <button
                onClick={handleSair}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <LogOut size={18} />
                Sair
              </button>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                icon={Clock}
                label="Pedidos Novos"
                value={pedidosNovos.length}
                color="bg-yellow-500"
              />
              <StatCard
                icon={ChefHat}
                label="Em Preparação"
                value={pedidosPreparando.length}
                color="bg-orange-500"
              />
              <StatCard
                icon={CheckCircle}
                label="Prontos"
                value={pedidosProntos.length}
                color="bg-green-500"
              />
              <StatCard
                icon={TrendingUp}
                label="Receita Hoje"
                value={`R$ ${stats.receitaHoje.toFixed(2)}`}
                color="bg-mare-600"
              />
            </div>
          )}
        </div>
      </div>

      {/* Abas */}
      <div className="bg-white border-b sticky top-0 z-10 shadow">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            <AbaButton
              label={`Novos (${pedidosNovos.length})`}
              ativo={abaAtiva === 'novos'}
              onClick={() => setAbaAtiva('novos')}
              cor="yellow"
            />
            <AbaButton
              label={`Preparando (${pedidosPreparando.length})`}
              ativo={abaAtiva === 'preparando'}
              onClick={() => setAbaAtiva('preparando')}
              cor="orange"
            />
            <AbaButton
              label={`Prontos (${pedidosProntos.length})`}
              ativo={abaAtiva === 'prontos'}
              onClick={() => setAbaAtiva('prontos')}
              cor="green"
            />
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="max-w-7xl mx-auto p-6">
        {getPedidosPorAba().length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum pedido nesta categoria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getPedidosPorAba().map((pedido) => (
              <PedidoCard
                key={pedido._id}
                pedido={pedido}
                onAtualizarStatus={handleAtualizarStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`${color} text-white rounded-xl p-4 shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <Icon size={40} className="opacity-80" />
    </div>
  </div>
);

const AbaButton = ({ label, ativo, onClick, cor }) => {
  const cores = {
    yellow: ativo ? 'border-yellow-500 text-yellow-600' : 'text-gray-600 hover:text-gray-800',
    orange: ativo ? 'border-orange-500 text-orange-600' : 'text-gray-600 hover:text-gray-800',
    green: ativo ? 'border-green-500 text-green-600' : 'text-gray-600 hover:text-gray-800',
  };

  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-semibold border-b-4 transition-colors ${
        ativo ? cores[cor] : 'border-transparent text-gray-600 hover:text-gray-800'
      }`}
    >
      {label}
    </button>
  );
};

export default Dashboard;
