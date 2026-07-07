import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/useAuth';

/**
 * Envolve páginas do painel que exigem login. Enquanto confirma o token
 * salvo com o backend, mostra um loading; se não estiver autenticado,
 * manda pro login.
 */
const ProtectedRoute = ({ children }) => {
  const { autenticado, carregando } = useAuth();

  if (carregando) {
    return (
      <div className="min-h-screen bg-areia-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-mare-600" size={48} />
      </div>
    );
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
