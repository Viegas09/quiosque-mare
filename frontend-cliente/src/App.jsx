import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { CarrinhoProvider } from './context/CarrinhoContext';
import Entrada from './pages/Entrada';
import EntradaMesa from './pages/EntradaMesa';

// As demais telas só são baixadas quando o usuário efetivamente navega até
// elas, em vez de tudo entrar no mesmo bundle inicial.
const Cardapio = lazy(() => import('./pages/Cardapio'));
const Carrinho = lazy(() => import('./pages/Carrinho'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PagamentoPix = lazy(() => import('./pages/PagamentoPix'));
const Acompanhar = lazy(() => import('./pages/Acompanhar'));

const CarregandoTela = () => (
  <div className="min-h-screen bg-areia-50 flex items-center justify-center">
    <Loader2 className="animate-spin text-mare-600" size={48} />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <CarrinhoProvider>
        <Suspense fallback={<CarregandoTela />}>
          <Routes>
            {/* Sem quiosque identificado ainda — só permite escanear QR code */}
            <Route path="/" element={<Entrada />} />

            {/* Link/QR do quiosque específico */}
            <Route path="/:slug" element={<Entrada />} />
            <Route path="/:slug/mesa/:token" element={<EntradaMesa />} />

            <Route path="/cardapio" element={<Cardapio />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pagamento-pix/:pedidoId" element={<PagamentoPix />} />
            <Route path="/acompanhar/:pedidoId" element={<Acompanhar />} />
          </Routes>
        </Suspense>
      </CarrinhoProvider>
    </BrowserRouter>
  );
}

export default App;
