import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChefHat, CheckCircle, Loader2, Home } from 'lucide-react';
import { pedidoService } from '../services/pedidoService';
import socketService from '../services/socket';
import Header from '../components/Header';

const statusMap = {
  aguardando_pagamento: {
    label: 'Aguardando Pagamento',
    icon: Clock,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    step: 0,
  },
  pago: {
    label: 'Pagamento Confirmado',
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-50',
    step: 1,
  },
  em_preparacao: {
    label: 'Em Preparação',
    icon: ChefHat,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    step: 2,
  },
  pronto: {
    label: 'Pronto para Retirada',
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-50',
    step: 3,
  },
  entregue: {
    label: 'Pedido Entregue',
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-100',
    step: 4,
  },
};

const Acompanhar = () => {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await pedidoService.buscarPorId(pedidoId);

        if (response.success) {
          setPedido(response.pedido);
        } else {
          setErro('Pedido não encontrado');
        }
      } catch (error) {
        console.error('Erro ao carregar pedido:', error);
        setErro('Erro ao carregar pedido');
      } finally {
        setLoading(false);
      }
    })();

    // Conectar socket para atualizações em tempo real
    socketService.connect();
    socketService.acompanharPedido(pedidoId);

    // Listener para mudanças de status
    const handleStatusAtualizado = (data) => {
      if (data.pedidoId === pedidoId) {
        setPedido((prev) => ({
          ...prev,
          status: data.status,
        }));

        // Notificação quando estiver pronto
        if (data.status === 'pronto') {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Pedido Pronto! 🎉', {
              body: 'Seu pedido está pronto para retirada!',
              icon: '/logo.png',
            });
          }
        }
      }
    };

    socketService.onStatusAtualizado(handleStatusAtualizado);

    // Listener específico para pedido pronto
    const handlePedidoPronto = (data) => {
      if (data.pedidoId === pedidoId) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Pedido Pronto! 🎉', {
            body: 'Seu pedido está pronto para retirada!',
            icon: '/logo.png',
          });
        }
      }
    };

    socketService.onPedidoPronto(handlePedidoPronto);

    // Solicitar permissão para notificações
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      socketService.off('pedido:status_atualizado', handleStatusAtualizado);
      socketService.off('pedido:pronto', handlePedidoPronto);
      socketService.pararAcompanhar(pedidoId);
    };
  }, [pedidoId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-areia-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-mare-600" size={48} />
      </div>
    );
  }

  if (erro || !pedido) {
    return (
      <div className="min-h-screen bg-areia-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Pedido não encontrado
          </h2>
          <button
            onClick={() => navigate('/')}
            className="bg-mare-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-mare-700 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  const statusAtual = statusMap[pedido.status];
  const Icon = statusAtual?.icon || Clock;

  return (
    <div className="min-h-screen bg-areia-50">
      {/* Header */}
      <Header
        title="Acompanhar Pedido"
        subtitle={`Pedido #${pedido._id.slice(-6).toUpperCase()}`}
        sticky={false}
      />

      <div className="max-w-4xl mx-auto p-4">
        {/* Status Atual */}
        <div className={`${statusAtual.bg} rounded-2xl p-6 mb-6 text-center shadow-md`}>
          <Icon size={64} className={`${statusAtual.color} mx-auto mb-4`} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {statusAtual.label}
          </h2>
          {pedido.status === 'pronto' && (
            <p className="text-gray-600">
              Retire seu pedido no balcão! 🎉
            </p>
          )}
          {pedido.status === 'em_preparacao' && pedido.tempoEstimadoPreparo && (
            <p className="text-gray-600">
              Tempo estimado: {pedido.tempoEstimadoPreparo} minutos
            </p>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Status do Pedido</h3>
          <div className="space-y-4">
            <StatusItem
              label="Pedido Realizado"
              completed={statusAtual.step >= 1}
              active={statusAtual.step === 1}
            />
            <StatusItem
              label="Em Preparação"
              completed={statusAtual.step >= 2}
              active={statusAtual.step === 2}
            />
            <StatusItem
              label="Pronto"
              completed={statusAtual.step >= 3}
              active={statusAtual.step === 3}
            />
            <StatusItem
              label="Entregue"
              completed={statusAtual.step >= 4}
              active={statusAtual.step === 4}
            />
          </div>
        </div>

        {/* Detalhes do Pedido */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Itens do Pedido</h3>
          <div className="space-y-3">
            {pedido.itens.map((item, index) => (
              <div key={index} className="flex justify-between items-start py-2 border-b last:border-0">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {item.quantidade}x {item.nomeProduto}
                  </p>
                  {item.observacoes && (
                    <p className="text-sm text-gray-500 italic">
                      Obs: {item.observacoes}
                    </p>
                  )}
                </div>
                <span className="font-semibold text-gray-800">
                  R$ {item.subtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-xl font-bold text-gray-800">
              <span>Total</span>
              <span>R$ {pedido.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Info da Mesa */}
        <div className="bg-mare-50 rounded-xl p-4 text-center mb-6">
          <p className="text-gray-700">
            <span className="font-semibold">Mesa:</span> {pedido.numeroMesa}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Local:</span> {pedido.localizacaoMesa}
          </p>
        </div>

        {/* Botão Novo Pedido */}
        <button
          onClick={() => navigate('/cardapio')}
          className="w-full bg-mare-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-mare-700 transition-colors flex items-center justify-center gap-2"
        >
          <Home size={20} />
          Fazer Novo Pedido
        </button>
      </div>
    </div>
  );
};

const StatusItem = ({ label, completed, active }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          completed
            ? 'bg-green-500'
            : active
            ? 'bg-mare-600 animate-pulse'
            : 'bg-gray-200'
        }`}
      >
        {completed ? (
          <CheckCircle size={20} className="text-white" />
        ) : active ? (
          <Loader2 size={20} className="text-white animate-spin" />
        ) : (
          <div className="w-3 h-3 rounded-full bg-gray-400" />
        )}
      </div>
      <span
        className={`font-medium ${
          completed || active ? 'text-gray-800' : 'text-gray-400'
        }`}
      >
        {label}
      </span>
    </div>
  );
};

export default Acompanhar;
