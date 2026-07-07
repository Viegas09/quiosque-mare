import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import Logo from '../components/Logo';

const Cadastro = () => {
  const navigate = useNavigate();
  const { registrar } = useAuth();
  const [nomeQuiosque, setNomeQuiosque] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const res = await registrar(nomeQuiosque, email, senha);
      if (res.success) {
        navigate('/');
      } else {
        setErro(res.message || 'Não foi possível criar a conta');
      }
    } catch (error) {
      setErro(error.response?.data?.message || 'Erro ao criar conta. Tente novamente.');
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
          <h1 className="text-3xl font-display font-semibold text-white mb-1">Cadastre seu quiosque</h1>
          <p className="text-aqua-100">Crie sua conta para começar a vender</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do quiosque</label>
            <input
              type="text"
              value={nomeQuiosque}
              onChange={(e) => setNomeQuiosque(e.target.value)}
              required
              autoFocus
              className="w-full p-3 border-2 border-areia-200 rounded-xl focus:border-mare-600 focus:outline-none"
              placeholder="Ex: Quiosque do Vini"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              minLength={6}
              className="w-full p-3 border-2 border-areia-200 rounded-xl focus:border-mare-600 focus:outline-none"
              placeholder="Mínimo 6 caracteres"
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
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Criar conta'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-mare-600 font-semibold hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
