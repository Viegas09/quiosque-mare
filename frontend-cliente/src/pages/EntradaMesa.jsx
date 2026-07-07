import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { mesaService } from '../services/mesaService';
import { useCarrinho } from '../context/useCarrinho';

/**
 * Rota /:slug/mesa/:token — é pra onde o QR code físico da mesa aponta.
 * Não tem UI própria: resolve a mesa pelo token e já manda pro cardápio.
 */
const EntradaMesa = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { definirMesa } = useCarrinho();
  const [erro, setErro] = useState('');

  useEffect(() => {
    mesaService.buscarPorQRCode(token)
      .then((res) => {
        if (res.success) {
          definirMesa(res.mesa);
          navigate('/cardapio', { replace: true });
        } else {
          setErro('Mesa não encontrada. Peça ajuda a alguém do quiosque.');
        }
      })
      .catch(() => {
        setErro('Não foi possível identificar a mesa. Tente escanear o QR code novamente.');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-mare-600 to-mare-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {erro ? (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <p className="text-coral-700">{erro}</p>
          </div>
        ) : (
          <Loader2 className="animate-spin text-white mx-auto" size={48} />
        )}
      </div>
    </div>
  );
};

export default EntradaMesa;
