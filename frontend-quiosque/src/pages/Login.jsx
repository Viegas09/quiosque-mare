import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import Logo from '../components/Logo';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const res = await login(email, senha);
      if (res.success) {
        navigate('/');
      } else {
        setErro(res.message || 'Não foi possível entrar');
      }
    } catch (error) {
      setErro(error.response?.data?.message || 'Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-mare-700 to-mare-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Logo variant="mark" size={56} light />
          </div>
          <h1 className="text-3xl font-display font-semibold text-white mb-1">Painel do Quiosque</h1>
          <p className="text-aqua-100">Entre para gerenciar seu quiosque</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full p-3 border-2 border-areia-200 rounded-xl focus:border-mare-600 focus:outline-none"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full p-3 border-2 border-areia-200 rounded-xl focus:border-mare-600 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {erro && (
            <div className="p-3 bg-coral-100 text-coral-700 rounded-lg text-center text-sm">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-mare-600 text-white py-3 rounded-xl font-semibold hover:bg-mare-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Entrar'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Ainda não tem uma conta?{' '}
            <Link to="/cadastro" className="text-mare-600 font-semibold hover:underline">
              Cadastre seu quiosque
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
