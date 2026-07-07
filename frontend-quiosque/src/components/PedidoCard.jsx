import { useState, useEffect } from 'react';
import { Clock, MapPin, AlertTriangle } from 'lucide-react';

// Limites usados pra decidir quando um pedido "chama atenção" no painel.
// Passaram de tanto tempo sem alguém agir, viram vermelho — é pra isso que
// serve o alerta: ninguém devia precisar ficar checando o relógio manualmente.
const LIMITE_ESPERA_NOVO_MIN = 3; // pedido pago, esperando começar o preparo
const LIMITE_ESPERA_ENTREGA_MIN = 5; // pedido pronto, esperando ser entregue

const PedidoCard = ({ pedido, onAtualizarStatus }) => {
  // Só existe pra forçar o card a recalcular o tempo decorrido a cada
  // intervalo, mesmo sem nenhum dado novo vir do servidor — sem isso, o
  // "5 minutos atrás" só mudaria quando o dashboard desse um refresh.
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 15000);
    return () => clearInterval(interval);
  }, []);

  const minutosDesde = (dataISO) => {
    if (!dataISO) return null;
    return Math.floor((new Date() - new Date(dataISO)) / 60000);
  };

  const tempoDecorridoTexto = (minutos) => {
    if (minutos < 1) return 'Agora';
    if (minutos === 1) return '1 minuto';
    return `${minutos} minutos`;
  };

  const minutosNovo = minutosDesde(pedido.createdAt);
  const minutosPreparando = minutosDesde(pedido.iniciadoPreparoEm);
  const minutosPronto = minutosDesde(pedido.prontoEm);

  // Decide o nível de urgência do card, de acordo com o status atual.
  const calcularUrgencia = () => {
    if (pedido.status === 'pago' && minutosNovo >= LIMITE_ESPERA_NOVO_MIN) {
      return { nivel: 'atrasado', mensagem: `Esperando início há ${minutosNovo} min` };
    }

    if (pedido.status === 'em_preparacao' && pedido.tempoEstimadoPreparo && minutosPreparando !== null) {
      const restante = pedido.tempoEstimadoPreparo - minutosPreparando;
      if (restante <= 0) {
        return { nivel: 'atrasado', mensagem: `Atrasado ${Math.abs(restante)} min` };
      }
      if (restante <= pedido.tempoEstimadoPreparo * 0.25) {
        return { nivel: 'atencao', mensagem: `Restam ${restante} min` };
      }
      return { nivel: 'normal', mensagem: `Restam ${restante} min` };
    }

    if (pedido.status === 'pronto' && minutosPronto >= LIMITE_ESPERA_ENTREGA_MIN) {
      return { nivel: 'atrasado', mensagem: `Pronto há ${minutosPronto} min, aguardando entrega` };
    }

    return { nivel: 'normal', mensagem: null };
  };

  const urgencia = calcularUrgencia();

  const getProximoStatus = () => {
    switch (pedido.status) {
      case 'pago':
        return { label: 'Iniciar Preparação', status: 'em_preparacao', cor: 'orange' };
      case 'em_preparacao':
        return { label: 'Marcar como Pronto', status: 'pronto', cor: 'green' };
      case 'pronto':
        return { label: 'Confirmar Entrega', status: 'entregue', cor: 'blue' };
      default:
        return null;
    }
  };

  const proximoStatus = getProximoStatus();

  const statusColors = {
    pago: 'bg-yellow-100 border-yellow-300',
    em_preparacao: 'bg-orange-100 border-orange-300',
    pronto: 'bg-green-100 border-green-300',
  };

  // Sobrepõe a cor normal do status quando o pedido está demorando —
  // isso é o que faz o card "gritar" visualmente sem precisar de som extra.
  const urgenciaClasses = {
    atrasado: 'border-red-500 ring-2 ring-red-300 animate-pulse',
    atencao: 'border-amber-400 ring-1 ring-amber-200',
    normal: '',
  };

  const buttonColors = {
    orange: 'bg-orange-500 hover:bg-orange-600',
    green: 'bg-green-500 hover:bg-green-600',
    blue: 'bg-mare-600 hover:bg-mare-700',
  };

  return (
    <div
      className={`rounded-xl border-2 ${statusColors[pedido.status]} ${urgenciaClasses[urgencia.nivel]} p-4 shadow-md hover:shadow-lg transition-shadow`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Pedido #{pedido._id.slice(-6).toUpperCase()}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <Clock size={14} />
            <span>{tempoDecorridoTexto(minutosNovo)} atrás</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
            <MapPin size={14} />
            Mesa {pedido.numeroMesa}
          </div>
          <p className="text-xs text-gray-500">{pedido.localizacaoMesa}</p>
        </div>
      </div>

      {/* Alerta de urgência */}
      {urgencia.nivel === 'atrasado' && (
        <div className="mb-3 bg-red-100 border border-red-300 rounded-lg p-2 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-600 shrink-0" />
          <span className="text-sm font-semibold text-red-700">{urgencia.mensagem}</span>
        </div>
      )}

      {/* Itens do Pedido */}
      <div className="bg-white rounded-lg p-3 mb-3 max-h-40 overflow-y-auto">
        <div className="space-y-2">
          {pedido.itens.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700">
                <span className="font-semibold">{item.quantidade}x</span> {item.nomeProduto}
                {item.observacoes && (
                  <span className="text-gray-500 text-xs italic block ml-4">
                    Obs: {item.observacoes}
                  </span>
                )}
              </span>
              <span className="font-semibold text-gray-800">
                R$ {item.subtotal.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total e Ações */}
      <div className="flex items-center justify-between pt-3 border-t border-areia-200">
        <div className="text-left">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-800">
            R$ {pedido.total.toFixed(2)}
          </p>
        </div>

        {proximoStatus && (
          <button
            onClick={() => onAtualizarStatus(pedido._id, proximoStatus.status)}
            className={`${buttonColors[proximoStatus.cor]} text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-md`}
          >
            {proximoStatus.label}
          </button>
        )}
      </div>

      {/* Tempo Estimado / Contagem regressiva */}
      {pedido.status === 'em_preparacao' && pedido.tempoEstimadoPreparo && urgencia.mensagem && (
        <div
          className={`mt-3 rounded-lg p-2 text-center ${
            urgencia.nivel === 'atrasado' ? 'bg-red-50' : 'bg-orange-50'
          }`}
        >
          <p className={`text-xs font-semibold ${urgencia.nivel === 'atrasado' ? 'text-red-700' : 'text-orange-700'}`}>
            ⏱️ {urgencia.mensagem} (estimativa: {pedido.tempoEstimadoPreparo} min)
          </p>
        </div>
      )}
    </div>
  );
};

export default PedidoCard;
