import { Clock, MapPin } from 'lucide-react';

const PedidoCard = ({ pedido, onAtualizarStatus }) => {
  const tempoDecorrido = () => {
    const agora = new Date();
    const criado = new Date(pedido.createdAt);
    const minutos = Math.floor((agora - criado) / 60000);
    
    if (minutos < 1) return 'Agora';
    if (minutos === 1) return '1 minuto';
    return `${minutos} minutos`;
  };

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

  const buttonColors = {
    orange: 'bg-orange-500 hover:bg-orange-600',
    green: 'bg-green-500 hover:bg-green-600',
    blue: 'bg-mare-600 hover:bg-mare-700',
  };

  return (
    <div className={`rounded-xl border-2 ${statusColors[pedido.status]} p-4 shadow-md hover:shadow-lg transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Pedido #{pedido._id.slice(-6).toUpperCase()}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <Clock size={14} />
            <span>{tempoDecorrido()} atrás</span>
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

      {/* Tempo Estimado */}
      {pedido.status === 'em_preparacao' && pedido.tempoEstimadoPreparo && (
        <div className="mt-3 bg-orange-50 rounded-lg p-2 text-center">
          <p className="text-xs text-orange-700">
            ⏱️ Tempo estimado: {pedido.tempoEstimadoPreparo} min
          </p>
        </div>
      )}
    </div>
  );
};

export default PedidoCard;
